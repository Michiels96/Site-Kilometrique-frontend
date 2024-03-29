import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/emitters/emitters';
import { Subscription } from 'rxjs';
import { Statistique } from 'src/app/models/Statistique.model';
import { StatistiqueService } from 'src/app/services/statistique.service';
import { ReloadService } from 'src/app/services/component-reload.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-statistique',
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.css']
})
export class StatistiqueComponent implements OnInit, OnDestroy {
  private reloadSubscription: Subscription;

  // language terms
  stat_title: string;
  stat_description_legend: string;
  stat_description: string;
  stat_date: string;
  stat_modify: string;
  stat_create: string;
  stat_back_home: string;

  statistiqueAModifier:any = null;
  statistiqueModifiee: boolean = false;
  statistiqueForm: FormGroup;
  nouvelleStatistique: boolean = false;

  private idUtilisateurDesStatistiques: number;

  constructor(private router: Router, private formBuilder: FormBuilder, private statistiqueService: StatistiqueService, private reloadService: ReloadService, private languageService: LanguageService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentStatistique");
    // Observable to reload from 'nav' component when there is a language change
    this.reloadSubscription = this.reloadService.getReloadObservable().subscribe((reload) => {
      if (reload) {
        this.setLanguageTerms();
      }
    });
    // modifier une statistique
    if(sessionStorage.getItem('statistiqueAModifier') != null){
      this.statistiqueAModifier = JSON.parse(sessionStorage.getItem('statistiqueAModifier'));
      this.initFormModification();
    }
    //ajouter une statistique
    if(sessionStorage.getItem('statistiqueAAjouter') != null){
      // ligneAAjouter contient l'id de l'utilisateur
      this.idUtilisateurDesStatistiques = +sessionStorage.getItem('statistiqueAAjouter');
      // this.vehiculeService.getVehiculesFromServer(this.idUtilisateurDesVehicules);
      this.nouvelleStatistique = true;
      this.initFormCreation();
    }
    if(sessionStorage.getItem('statistiqueAModifier') == null && sessionStorage.getItem('statistiqueAAjouter') == null){
      this.router.navigate(['/statistiques']);
    }
    this.setLanguageTerms();
  }

  setLanguageTerms(){
    let french_lib = this.languageService.getFrenchLib();
    if (this.languageService.getSelectedLanguage() == 'fr'){
      this.stat_title = french_lib['statistique']['stat_title'];
      this.stat_description_legend = french_lib['statistique']['stat_description_legend'];
      this.stat_description = french_lib['statistique']['stat_description'];
      this.stat_date = french_lib['statistique']['stat_date'];
      this.stat_modify = french_lib['statistique']['stat_modify'];
      this.stat_create = french_lib['statistique']['stat_create'];
      this.stat_back_home = french_lib['statistique']['stat_back_home'];
    }

    let english_lib = this.languageService.getEnglishLib();
    if (this.languageService.getSelectedLanguage() == 'en'){
      this.stat_title = english_lib['statistique']['stat_title'];
      this.stat_description_legend = english_lib['statistique']['stat_description_legend'];
      this.stat_description = english_lib['statistique']['stat_description'];
      this.stat_date = english_lib['statistique']['stat_date'];
      this.stat_modify = english_lib['statistique']['stat_modify'];
      this.stat_create = english_lib['statistique']['stat_create'];
      this.stat_back_home = english_lib['statistique']['stat_back_home'];
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    // delete the observable to avoid component memory leak
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
    this.resetStatistiqueSessionMemory();
  }

  initFormModification() {
    let date = this.statistiqueAModifier['dateDAjout'];
    date = date.substring(0,(date.indexOf("T")));
    this.statistiqueForm = this.formBuilder.group({
      id: [this.statistiqueAModifier['id_statistique'], Validators.required],
      description: [this.statistiqueAModifier['description'], Validators.required],
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
    this.statistiqueForm = this.formBuilder.group({
      description: ['', Validators.required],
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

  onSubmitForm(){
    // le cas d'une modification
    if(!this.nouvelleStatistique){
      const formValue = this.statistiqueForm.value;
      if(formValue['description'] != this.statistiqueAModifier['description']){
        if(formValue['description'] == ''){
          alert('Le champ description ne peut être vide!');
          return;
        }
        this.statistiqueModifiee = true;
      }
      let date = this.statistiqueAModifier['dateDAjout'].substring(0,(this.statistiqueAModifier['dateDAjout'].indexOf("T")));
      if(formValue['date'] != date){
        this.statistiqueModifiee = true;
        //console.log("date "+date+" et "+formValue['date'])
      }

      if(this.statistiqueModifiee){
        let statistiqueModifiee = new Statistique(
          this.statistiqueAModifier['id_statistique'],
          this.statistiqueAModifier['utilisateur'],
          formValue['description'],
          //formValue['date']+"T00:00:00.000Z",
          formValue['date'],
          this.statistiqueAModifier['dateDeModification']
        );
        this.statistiqueService.modifierStatistique(statistiqueModifiee, this.idUtilisateurDesStatistiques)
          .then((resp) => {
            if(resp['status'] == "ok"){
              this.statistiqueService.getStatistiquesFromServer(this.statistiqueModifiee['utilisateur']);
              this.router.navigate(['/statistiques']);
            }
          });
      }
    }
    // le cas d'une création
    else{
      const formValue = this.statistiqueForm.value;
      let nouvelleStatistique = new Statistique(
        this.idUtilisateurDesStatistiques,
        formValue['description']
      );
      this.statistiqueService.ajouterStatistique(nouvelleStatistique, +nouvelleStatistique.utilisateur)
        .then((resp) => {
          this.statistiqueService.getStatistiquesFromServer(this.idUtilisateurDesStatistiques);
          this.router.navigate(['/statistiques']);
        });
    }
  }

  resetStatistiqueSessionMemory(){
    sessionStorage.removeItem('statistiqueAModifier');
    sessionStorage.removeItem('statistiqueAAjouter');
  }
}
