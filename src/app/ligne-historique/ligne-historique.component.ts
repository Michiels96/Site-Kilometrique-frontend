import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Emitters } from '../emitters/emitters';
import { Ligne } from '../models/Ligne.model';
import { LigneService } from '../services/ligne.service';
import { StatistiqueService } from '../services/statistique.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { VehiculeService } from '../services/vehicule.service';
import { LanguageService } from '../services/language.service';
import { ReloadService } from '../services/component-reload.service';

@Component({
  selector: 'app-ligne-historique',
  templateUrl: './ligne-historique.component.html',
  styleUrls: ['./ligne-historique.component.css']
})
export class LigneHistoriqueComponent implements OnInit, OnDestroy {
  private reloadSubscription: Subscription;

  ligneAModifier:any = null;
  ligneModifiee: boolean = false;
  ligneForm: FormGroup;
  nouvelleLigne: boolean = false;

  vehicules:any = [];
  vehiculeSubscription: Subscription;
  idUtilisateurDesVehicules:number;

  numberOrRange: boolean = false;

  // language terms
  log_title: string;
  log_vhs: string;
  log_vhs_legend: string;
  log_kms: string;
  log_start_kms: string;
  log_end_kms: string;
  log_range_kms_legend: string;
  log_range_kms_legend_supp: string;
  log_desc_comm: string;
  log_desc: string;
  log_date: string;
  log_modify: string;
  log_create: string;
  log_back_home: string;

  constructor(private router: Router, private formBuilder: FormBuilder, private ligneService: LigneService, private vehiculeService: VehiculeService, private utilisateurService: UtilisateurService, private statistiqueService: StatistiqueService, private reloadService: ReloadService, private languageService: LanguageService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentLigneHistorique");
    // Observable to reload from 'nav' component when there is a language change
    this.reloadSubscription = this.reloadService.getReloadObservable().subscribe((reload) => {
      if (reload) {
        this.setLanguageTerms();
      }
    });
    this.vehiculeSubscription = this.vehiculeService.vehiculesSubject.subscribe(
      (vehicules: any[]) => {
        this.vehicules = vehicules;
      }
    );
    // modifier une ligne d'historique
    if(sessionStorage.getItem('ligneAModifier') != null){
      this.ligneAModifier = JSON.parse(sessionStorage.getItem('ligneAModifier'));

      this.vehiculeService.getByNomUnique(this.ligneAModifier['vehicule'])
        .then((resp) => {
          this.idUtilisateurDesVehicules = resp[0]['utilisateur'];
          this.vehiculeService.getVehiculesFromServer(this.idUtilisateurDesVehicules);
        });
      
      this.initFormModification();
    }
    //ajouter une ligne d'historique
    if(sessionStorage.getItem('ligneAAjouter') != null){
      // ligneAAjouter contient l'id de l'utilisateur
      this.idUtilisateurDesVehicules = +sessionStorage.getItem('ligneAAjouter');
      this.vehiculeService.getVehiculesFromServer(this.idUtilisateurDesVehicules);
      this.nouvelleLigne = true;
      this.initFormCreation();
    }
    if(sessionStorage.getItem('ligneAModifier') == null && sessionStorage.getItem('ligneAAjouter') == null){
      this.router.navigate(['/lignes']);
    }
    this.setLanguageTerms();
  }

  setLanguageTerms(){
    let french_lib = this.languageService.getFrenchLib();
    if (this.languageService.getSelectedLanguage() == 'fr'){
      this.log_title = french_lib['ligne-historique']['log_title'];
      this.log_vhs = french_lib['ligne-historique']['log_vhs'];
      this.log_vhs_legend = french_lib['ligne-historique']['log_vhs_legend'];
      this.log_kms = french_lib['ligne-historique']['log_kms'];
      this.log_start_kms = french_lib['ligne-historique']['log_start_kms'];
      this.log_end_kms = french_lib['ligne-historique']['log_end_kms'];
      this.log_range_kms_legend = french_lib['ligne-historique']['log_range_kms_legend'];
      this.log_range_kms_legend_supp = french_lib['ligne-historique']['log_range_kms_legend_supp'];
      this.log_desc_comm = french_lib['ligne-historique']['log_desc_comm'];
      this.log_desc = french_lib['ligne-historique']['log_desc'];
      this.log_date = french_lib['ligne-historique']['log_date'];
      this.log_modify = french_lib['ligne-historique']['log_modify'];
      this.log_create = french_lib['ligne-historique']['log_create'];
      this.log_back_home = french_lib['ligne-historique']['log_back_home'];
    }

    let english_lib = this.languageService.getEnglishLib();
    if (this.languageService.getSelectedLanguage() == 'en'){
      this.log_title = english_lib['ligne-historique']['log_title'];
      this.log_vhs = english_lib['ligne-historique']['log_vhs'];
      this.log_vhs_legend = english_lib['ligne-historique']['log_vhs_legend'];
      this.log_kms = english_lib['ligne-historique']['log_kms'];
      this.log_start_kms = english_lib['ligne-historique']['log_start_kms'];
      this.log_end_kms = english_lib['ligne-historique']['log_end_kms'];
      this.log_range_kms_legend = english_lib['ligne-historique']['log_range_kms_legend'];
      this.log_range_kms_legend_supp = english_lib['ligne-historique']['log_range_kms_legend_supp'];
      this.log_desc_comm = english_lib['ligne-historique']['log_desc_comm'];
      this.log_desc = english_lib['ligne-historique']['log_desc'];
      this.log_date = english_lib['ligne-historique']['log_date'];
      this.log_modify = english_lib['ligne-historique']['log_modify'];
      this.log_create = english_lib['ligne-historique']['log_create'];
      this.log_back_home = english_lib['ligne-historique']['log_back_home'];
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    this.resetLigneSessionMemory();
    // delete the observable to avoid component memory leak
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }

  initFormModification() {
    let date = this.ligneAModifier['date'];
    date = date.substring(0,(date.indexOf("T")));
    this.ligneForm = this.formBuilder.group({
      id: [this.ligneAModifier['id_ligne'], Validators.required],
      vehicule: [this.ligneAModifier['vehicule'], Validators.required],
      nbKilometres: [this.ligneAModifier['nbKilometres'], Validators.required],
      nbKilometresDepart: [this.ligneAModifier['nbKilometresDepart']],
      nbKilometresDArivee: [''],
      description: [this.ligneAModifier['description']],
      date: [date, Validators.required]
    });
  }

  initFormCreation() {
    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth()+1)+"";
    let day = (date.getDate())+"";
    if(month.length == 1){
      month = "0"+month;
    }
    if(day.length == 1){
      day = "0"+day;
    }
    let actualDate = year+"-"+month+"-"+day;
    this.ligneForm = this.formBuilder.group({
      vehicule: ['', Validators.required],
      nbKilometres: ['', Validators.required],
      nbKilometresDepart: [''],
      nbKilometresDArivee: [''],
      description: [''],
      date: [actualDate, Validators.required]
    });
  }

  dateToString(dateToConvert:string){
    var convert = Date.parse(dateToConvert)/1000;
    var date = new Date(convert * 1000);
    let year = date.getFullYear();
    let month = (date.getMonth()+1)+"";
    let day = (date.getDate()-1)+"";
    if(month.length == 1){
      month = "0"+month;
    }
    if(day.length == 1){
      day = "0"+day;
    }
    return day+"/"+month+"/"+year;
  }

  numberOrRangeFct(status:number){
    if(status == 2){
      this.numberOrRange = true;  
      if(this.ligneAModifier == null){
        this.ligneForm.get('nbKilometres').setValue('');
      }
      this.ligneForm.controls['nbKilometresDepart'].setValidators([Validators.required]);
      //this.ligneForm.controls['nbKilometresDArivee'].setValidators([Validators.required]);
      this.ligneForm.controls['nbKilometres'].clearValidators();
      this.ligneForm.controls['nbKilometresDepart'].updateValueAndValidity();
      this.ligneForm.controls['nbKilometresDArivee'].updateValueAndValidity();
    }
    else{
      this.numberOrRange = false;
      if(this.ligneAModifier == null){
        this.ligneForm.get('nbKilometresDepart').setValue('');
      }
      this.ligneForm.controls['nbKilometresDepart'].clearValidators();
      this.ligneForm.get('nbKilometresDArivee').setValue('');
      this.ligneForm.controls['nbKilometresDArivee'].clearValidators();
      this.ligneForm.controls['nbKilometres'].setValidators([Validators.required]);
      this.ligneForm.controls['nbKilometres'].updateValueAndValidity();
    }
  }

  onSubmitForm(){
    // le cas d'une modification
    if(!this.nouvelleLigne){
      const formValue = this.ligneForm.value;
      let nbKilometres = formValue['nbKilometres'];
      if(formValue['vehicule'] != this.ligneAModifier['vehicule']){
        this.ligneModifiee = true;
      }
      if(formValue['nbKilometres'] != this.ligneAModifier['nbKilometres'] && formValue['nbKilometres'] != ''){
        this.ligneModifiee = true;
        //nbKilometres = formValue['nbKilometres'];
      }
      if(formValue['nbKilometresDArivee'] != ''){
        this.ligneModifiee = true;
        if(formValue['nbKilometresDepart'] > formValue['nbKilometresDArivee']){
          alert("Erreur, le nombre de km au départ ne peut être supérieur au nombre de km d'arrivée");
          return;
        }
        nbKilometres = formValue['nbKilometresDArivee'] - formValue['nbKilometresDepart'];
      }
      if(formValue['description'] != this.ligneAModifier['description']){
        this.ligneModifiee = true;
      }
      let date = this.ligneAModifier['date'].substring(0,(this.ligneAModifier['date'].indexOf("T")));
      if(formValue['date'] != date){
        this.ligneModifiee = true;
        //console.log("date "+date+" et "+formValue['date'])
      }
      if(this.ligneModifiee){
        let ligneModifiee = new Ligne(
          this.ligneAModifier['id_ligne'],
          formValue['vehicule'],
          nbKilometres,
          formValue['nbKilometresDepart'],
          formValue['description'],
          formValue['date']
        );
        this.ligneService.modifierLigne(ligneModifiee, this.idUtilisateurDesVehicules)
          .then((resp) => {
            //recalculer les kilomètres cumulés
            this.ligneService.majKilometresCumules(this.idUtilisateurDesVehicules)
              .then((resp) => {
                if(resp['status'] == "ok"){
                  this.utilisateurService.majKilometresCumules(this.idUtilisateurDesVehicules)
                    .then((resp) => {
                      this.statistiqueService.majKilometresCumules(this.idUtilisateurDesVehicules)
                        .then((resp) => {
                          if(resp['status'] == "ok"){
                            this.ligneService.getLignesFromServer(this.idUtilisateurDesVehicules);
                            this.router.navigate(['/lignes']);
                          }
                        });
                    });
                }
              });
          });
      }
    }
    // le cas d'une création
    else{
      const formValue = this.ligneForm.value;
      let nouvelleLigne;
      let nbKilometres;
      let nbKilometresDepart = 0;
      if(this.numberOrRange){
        // permet d'enregistrer le kilometrage au début et de pouvoir le ré-éditer par après
        if(formValue['nbKilometresDArivee'] == ''){
          nbKilometres = 0;
          nbKilometresDepart = formValue['nbKilometresDepart'];
        }
        else{
          if(formValue['nbKilometresDepart'] > formValue['nbKilometresDArivee']){
            alert("Erreur, le nombre de km au départ ne peut être supérieur au nombre de km d'arrivée");
            return;
          }
          nbKilometres = formValue['nbKilometresDArivee'] - formValue['nbKilometresDepart'];
        }
      }
      else{
        nbKilometres = formValue['nbKilometres'];
      }
      if(formValue['description'] == ''){
        nouvelleLigne = new Ligne(
          formValue['vehicule'],
          nbKilometres,
          nbKilometresDepart,
          formValue['date']
        );
      }
      else{
        nouvelleLigne = new Ligne(
          formValue['vehicule'],
          nbKilometres,
          nbKilometresDepart,
          formValue['description'],
          formValue['date']
        );
      }
      this.ligneService.ajouterLigne(nouvelleLigne, this.idUtilisateurDesVehicules)
        .then((resp) => {
          //recalculer les kilomètres cumulés
          this.ligneService.majKilometresCumules(this.idUtilisateurDesVehicules)
            .then((resp) => {
              if(resp['status'] == "ok"){
                this.utilisateurService.majKilometresCumules(this.idUtilisateurDesVehicules)
                  .then((resp) => {
                    this.statistiqueService.majKilometresCumules(this.idUtilisateurDesVehicules)
                      .then((resp) => {
                        if(resp['status'] == "ok"){
                          //sessionStorage.removeItem('ligneAAjouter');
                          this.ligneService.getLignesFromServer(this.idUtilisateurDesVehicules);
                          this.router.navigate(['/lignes']);
                        }
                      });
                  });
              }
            });
        });
    }
  }
  resetLigneSessionMemory(){
    sessionStorage.removeItem('ligneAModifier');
    sessionStorage.removeItem('ligneAAjouter');
  }
}
