import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Emitters } from '../emitters/emitters';
import { Utilisateur } from '../models/Utilisateur.model';
import { LigneService } from '../services/ligne.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { LanguageService } from '../services/language.service';
import { ReloadService } from '../services/component-reload.service';

@Component({
  selector: 'app-historique-de-navigation',
  templateUrl: './historique-de-navigation.component.html',
  styleUrls: ['./historique-de-navigation.component.css']
})
export class HistoriqueDeNavigationComponent implements OnInit, OnDestroy {
  private reloadSubscription: Subscription;

  lignesTriees:any = [{}];
  lignes:any = [{}];
  ligneSubscription: Subscription;
  nbLignes: number;

  // Pour le select (uniquement dispo pour un administrateur)
  utilisateurs:any = [{}];
  utilisateurSubscription: Subscription;
  selectedOption: string;
  utilisateurSelectionne: Utilisateur = null;

  // tri (ASC/DESC)
  triId: string = "";
  triVehicule: string = "";
  triNbKilometres: string = "";
  triNbKilometresCumules: string = "";
  triDescription: string = "";
  triDate: string = "";

  lignesASupprimer = [];

  limit: number = 0;

  // language terms
  logs_page_title: string;
  logs_user: string;
  logs_add_line: string;
  logs_back_page: string;
  logs_next_page: string;
  logs_tab_date: string;
  logs_tab_date_alt: string;
  logs_tab_kms: string;
  logs_tab_kms_alt: string;
  logs_tab_total_kms: string;
  logs_tab_total_kms_alt: string;
  logs_tab_desc: string;
  logs_tab_desc_alt: string;
  logs_tab_vhs: string;
  logs_tab_vhs_alt: string;
  logs_tab_del: string;
  total_logs: string;
  total_kms: string;
  empty_logs_msg: string;
  logs_back_to_main: string;


  constructor(private ligneService: LigneService, private router: Router, private utilisateurService: UtilisateurService, private languageService: LanguageService, private reloadService: ReloadService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentHistoriqueDeNavigation");
    // Observable to reload from 'nav' component when there is a language change
    this.reloadSubscription = this.reloadService.getReloadObservable().subscribe((reload) => {
      if (reload) {
        this.setLanguageTerms();
      }
    });
    this.utilisateurService.getUtilisateursFromServer();
    this.utilisateurSubscription = this.utilisateurService.utilisateursSubject.subscribe(
      (utilisateurs: any[]) => {
        this.utilisateurs = utilisateurs;
        //this.chargerListVehiculesUtilisateur(this.utilisateurs[0]['id_utilisateur']);
        //console.log(this.utilisateurs)
        this.chargerListeLignesUtilisateur(this.utilisateurService.getInfoUtilisateur().id_utilisateur+"");
      }
    );
    //this.utilisateurService.emitListeUtilisateursSubject();
    
    this.ligneSubscription = this.ligneService.lignesSubject.subscribe(
      (lignes: any[]) => {
        this.lignes = lignes;
        this.lignesTriees = this.lignes.slice(this.limit, this.limit+50);
        //this.nbLignes = this.lignes.length;
        this.nbLignes = this.ligneService.getNbLignesTotales();
        this.setLanguageTerms();
      }
    );
  }

  setLanguageTerms(){
    let french_lib = this.languageService.getFrenchLib();
    if (this.languageService.getSelectedLanguage() == 'fr'){
      this.logs_page_title = french_lib['historique-de-navigation']['logs_page_title'];
      this.logs_user = french_lib['historique-de-navigation']['logs_user'];
      this.logs_add_line = french_lib['historique-de-navigation']['logs_add_line'];
      this.logs_back_page = french_lib['historique-de-navigation']['logs_back_page'];
      this.logs_next_page = french_lib['historique-de-navigation']['logs_next_page'];
      this.logs_tab_date = french_lib['historique-de-navigation']['logs_tab_date'];
      this.logs_tab_date_alt = french_lib['historique-de-navigation']['logs_tab_date_alt'];
      this.logs_tab_kms = french_lib['historique-de-navigation']['logs_tab_kms'];
      this.logs_tab_kms_alt = french_lib['historique-de-navigation']['logs_tab_kms_alt'];
      this.logs_tab_total_kms = french_lib['historique-de-navigation']['logs_tab_total_kms'];
      this.logs_tab_total_kms_alt = french_lib['historique-de-navigation']['logs_tab_total_kms_alt'];
      this.logs_tab_desc = french_lib['historique-de-navigation']['logs_tab_desc'];
      this.logs_tab_desc_alt = french_lib['historique-de-navigation']['logs_tab_desc_alt'];
      this.logs_tab_vhs = french_lib['historique-de-navigation']['logs_tab_vhs'];
      this.logs_tab_vhs_alt = french_lib['historique-de-navigation']['logs_tab_vhs_alt'];
      this.logs_tab_del = french_lib['historique-de-navigation']['logs_tab_del'];
      this.total_logs = "Total : "+this.nbLignes+" enregistrement";
      this.total_kms = "Total des kilomètres cumulés : "+this.utilisateurSelectionne['nbKilometresCumules']+" km";
      this.empty_logs_msg = french_lib['historique-de-navigation']['empty_logs_msg'];
      this.logs_back_to_main = french_lib['historique-de-navigation']['logs_back_to_main'];
    }

    let english_lib = this.languageService.getEnglishLib();
    if (this.languageService.getSelectedLanguage() == 'en'){
      this.logs_page_title = english_lib['historique-de-navigation']['logs_page_title'];
      this.logs_user = english_lib['historique-de-navigation']['logs_user'];
      this.logs_add_line = english_lib['historique-de-navigation']['logs_add_line'];
      this.logs_back_page = english_lib['historique-de-navigation']['logs_back_page'];
      this.logs_next_page = english_lib['historique-de-navigation']['logs_next_page'];
      this.logs_tab_date = english_lib['historique-de-navigation']['logs_tab_date'];
      this.logs_tab_date_alt = english_lib['historique-de-navigation']['logs_tab_date_alt'];
      this.logs_tab_kms = english_lib['historique-de-navigation']['logs_tab_kms'];
      this.logs_tab_kms_alt = english_lib['historique-de-navigation']['logs_tab_kms_alt'];
      this.logs_tab_total_kms = english_lib['historique-de-navigation']['logs_tab_total_kms'];
      this.logs_tab_total_kms_alt = english_lib['historique-de-navigation']['logs_tab_total_kms_alt'];
      this.logs_tab_desc = english_lib['historique-de-navigation']['logs_tab_desc'];
      this.logs_tab_desc_alt = english_lib['historique-de-navigation']['logs_tab_desc_alt'];
      this.logs_tab_vhs = english_lib['historique-de-navigation']['logs_tab_vhs'];
      this.logs_tab_vhs_alt = english_lib['historique-de-navigation']['logs_tab_vhs_alt'];
      this.logs_tab_del = english_lib['historique-de-navigation']['logs_tab_del'];
      this.total_logs = "Total : "+this.nbLignes+" log";
    
      this.total_kms = "Total accumulated kilometers : "+this.utilisateurSelectionne['nbKilometresCumules']+" km";
      this.empty_logs_msg = english_lib['historique-de-navigation']['empty_logs_msg'];
      this.logs_back_to_main = english_lib['historique-de-navigation']['logs_back_to_main'];
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    // delete the observable to avoid component memory leak
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }

  pageSuivante(){
    this.limit += 50;
    this.lignesTriees = this.lignes.slice(this.limit, this.limit+50);
  }

  pagePrecedente(){
    this.limit -= 50;
    this.lignesTriees = this.lignes.slice(this.limit, this.limit+50);
  }

  chargerListeLignesUtilisateur(id_utilisateur: string){
    this.triId = "";
    this.triVehicule = "";
    this.triNbKilometres = "";
    this.triNbKilometresCumules = "";
    this.triDescription = "";
    this.triDate = "";

    this.utilisateurService.getById(new Utilisateur(+id_utilisateur))
    .then((resp) => {
      this.utilisateurSelectionne = new Utilisateur(
        resp[0]['id_utilisateur'],
        resp[0]['email'],
        resp[0]['password'],
        resp[0]['nom'],
        resp[0]['prenom'],
        resp[0]['age'],
        resp[0]['nbKilometresCumules'],
        resp[0]['estConnecte'],
        resp[0]['estAdmin']
      );
      this.ligneService.getNbLignesFromServer(this.utilisateurSelectionne.id_utilisateur);
      //this.ligneService.getLignesFromServer(this.utilisateurSelectionne.id_utilisateur);
    });
  }

  onEvent(event){
    event.stopPropagation();
  }

  auMoinsUnASupprimer(){
    if(confirm("Etes-vous sur de vouloir supprimer ces lignes?")){
      this.ligneService.supprimerLignes(this.lignesASupprimer, this.utilisateurSelectionne.id_utilisateur)
        .then((response) => {
          if(response['status'] == "ok"){
            this.ligneService.majKilometresCumules(this.utilisateurSelectionne.id_utilisateur)
              .then((resp) => {
                if(resp['status'] == "ok"){
                  this.utilisateurService.majKilometresCumules(this.utilisateurSelectionne.id_utilisateur)
                  .then(() => {
                    this.utilisateurService.getById(new Utilisateur(this.utilisateurSelectionne.id_utilisateur))
                      .then((resp) => {
                        this.utilisateurSelectionne.nbKilometresCumules = resp[0]['nbKilometresCumules'];
                        this.ligneService.triParId("ASC", this.utilisateurSelectionne.id_utilisateur);
                      });
                  });
                }
              }).catch((err) => {console.log("Erreur : "+err)});
          }
          else{
            console.log("erreur de suppression lignes: "+JSON.stringify(response));
          }
        }).catch((err) => {console.log("Erreur : "+err)});
    }
  }

  aSupprimer(id_ligne:number){
    if(this.lignesASupprimer.includes(id_ligne)){
      const index = this.lignesASupprimer.indexOf(id_ligne, 0);
      if(index > -1){
        this.lignesASupprimer.splice(index, 1);
      }
    }
    else{
      this.lignesASupprimer.push(id_ligne);
    }
  }

  nouvelleLigne(){
    sessionStorage.setItem('ligneAAjouter', this.utilisateurSelectionne.id_utilisateur+"");
    this.router.navigate(['/lignes/ligne']);
  }

  modifierLigne(ligne:any){
    let timeOfdate = ligne['date'].substring((ligne['date'].indexOf("T")),ligne['date'].length);
    var convert = Date.parse(ligne['date'])/1000;
    var date = new Date(convert * 1000);
    let year = date.getFullYear();
    let month = (date.getMonth()+1)+"";
    let day = (date.getDate())+"";
    if(month.length == 1){
      month = "0"+month;
    }
    if(day.length == 1){
      day = "0"+day;
    }
    ligne['date'] = year+"-"+month+"-"+day+timeOfdate;
    sessionStorage.setItem('ligneAModifier', JSON.stringify(ligne));
    this.router.navigate(['/lignes/ligne']);
  }

  dateToString(timestamp:any){
    if(timestamp == undefined){
      return "";
    }
    var convert = Date.parse(timestamp)/1000;
    var date = new Date(convert * 1000);
    let year = date.getFullYear();
    let month = (date.getMonth()+1)+"";
    let day = (date.getDate())+"";
    if(month.length == 1){
      month = "0"+month;
    }
    if(day.length == 1){
      day = "0"+day;
    }
    return day+"/"+month+"/"+year;
  }

  rafraichir(){
    this.ligneService.triParKilometresCumules("DESC", this.utilisateurSelectionne.id_utilisateur);
  }

  checkAdminStatus(){
    if(this.utilisateurService.getInfoUtilisateur().estAdmin){
      return true;
    }
    return false;
  }

  demandeDeTriId(){
    this.triVehicule = "";
    this.triNbKilometres = "";
    this.triNbKilometresCumules = "";
    this.triDescription = "";
    this.triDate = "";
    //descending
    if(this.triId == ""){
      this.triId = "ASC";
      //this.ligneService.triParId("ASC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        return ligne1['id_ligne']-ligne2['id_ligne'];
      });
    }
    //ascending
    else if(this.triId == "ASC"){
      this.triId = "DESC";
      //this.ligneService.triParId("DESC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        return ligne2['id_ligne']-ligne1['id_ligne'];
    });
    }
    //descending
    else{
      this.triId = "ASC";
      //this.ligneService.triParId("ASC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        return ligne1['id_ligne']-ligne2['id_ligne'];
      });
    }
  }

  demandeDeTriVehicule(){
    this.triId = "";
    this.triNbKilometres = "";
    this.triNbKilometresCumules = "";
    this.triDescription = "";
    this.triDate = "";
    if(this.triVehicule == ""){
      this.triVehicule = "ASC";
      //this.ligneService.triParVehicule("ASC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        if(ligne1['vehicule'].localeCompare(ligne2['vehicule']) == 0){
          if(ligne1['date'].localeCompare(ligne2['date']) == 0){
            return ligne1['id_ligne'] - ligne2['id_ligne'];
          }
          else{
            return ligne1['date'].localeCompare(ligne2['date']);
          }
        }
        else{
          return ligne1['vehicule'].localeCompare(ligne2['vehicule']);
        }
      });
    }
    else if(this.triVehicule == "ASC"){
      this.triVehicule = "DESC";
      //this.ligneService.triParVehicule("DESC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        if(ligne2['vehicule'].localeCompare(ligne1['vehicule']) == 0){
          if(ligne2['date'].localeCompare(ligne1['date']) == 0){
            return ligne2['id_ligne'] - ligne1['id_ligne'];
          }
          else{
            return ligne2['date'].localeCompare(ligne1['date']);
          }
        }
        else{
          return ligne2['vehicule'].localeCompare(ligne1['vehicule']);
        }
      });
    }
    else{
      this.triVehicule = "ASC";
      //this.ligneService.triParVehicule("ASC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        if(ligne1['vehicule'].localeCompare(ligne2['vehicule']) == 0){
          if(ligne1['date'].localeCompare(ligne2['date']) == 0){
            return ligne1['id_ligne'] - ligne2['id_ligne'];
          }
          else{
            return ligne1['date'].localeCompare(ligne2['date']);
          }
        }
        else{
          return ligne1['vehicule'].localeCompare(ligne2['vehicule']);
        }
      });
    }
  }

  demandeDeTriKilometres(){
    this.triId = "";
    this.triVehicule = "";
    this.triNbKilometresCumules = "";
    this.triDescription = "";
    this.triDate = "";
    if(this.triNbKilometres == ""){
      this.triNbKilometres = "ASC";
      //this.ligneService.triParKilometres("ASC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        if(ligne1['nbKilometres'] == ligne2['nbKilometres']){
          if(ligne1['date'].localeCompare(ligne2['date']) == 0){
            return ligne1['id_ligne'] - ligne2['id_ligne'];
          }
          else{
            return ligne1['date'].localeCompare(ligne2['date']);
          }
        }
        else{
          return ligne1['nbKilometres'] - ligne2['nbKilometres'];
        }
      });
    }
    else if(this.triNbKilometres == "ASC"){
      this.triNbKilometres = "DESC";
      //this.ligneService.triParKilometres("DESC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        if(ligne2['nbKilometres'] == ligne1['nbKilometres']){
          if(ligne2['date'].localeCompare(ligne1['date']) == 0){
            return ligne2['id_ligne'] - ligne1['id_ligne'];
          }
          else{
            return ligne2['date'].localeCompare(ligne1['date']);
          }
        }
        else{
          return ligne2['nbKilometres'] - ligne1['nbKilometres'];
        }
      });
    }
    else{
      this.triNbKilometres = "ASC";
      //this.ligneService.triParKilometres("ASC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        if(ligne1['nbKilometres'] == ligne2['nbKilometres']){
          if(ligne1['date'].localeCompare(ligne2['date']) == 0){
            return ligne1['id_ligne'] - ligne2['id_ligne'];
          }
          else{
            return ligne1['date'].localeCompare(ligne2['date']);
          }
        }
        else{
          return ligne1['nbKilometres'] - ligne2['nbKilometres'];
        }
      });
    }
  }

  demandeDeTriKilometresCumules(){
    this.triId = "";
    this.triVehicule = "";
    this.triNbKilometres = "";
    this.triDescription = "";
    this.triDate = "";
    if(this.triNbKilometresCumules == ""){
      this.triNbKilometresCumules = "ASC";
      //this.ligneService.triParKilometresCumules("ASC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        return ligne1['nbKilometresCumules']-ligne2['nbKilometresCumules'];
      });
    }
    else if(this.triNbKilometresCumules == "ASC"){
      this.triNbKilometresCumules = "DESC";
      //this.ligneService.triParKilometresCumules("DESC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        return ligne2['nbKilometresCumules']-ligne1['nbKilometresCumules'];
      });
    }
    else{
      this.triNbKilometresCumules = "ASC";
      //this.ligneService.triParKilometresCumules("ASC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        return ligne1['nbKilometresCumules']-ligne2['nbKilometresCumules'];
      });
    }
  }

  demandeDeTriDescription(){
    this.triId = "";
    this.triVehicule = "";
    this.triNbKilometres = "";
    this.triNbKilometresCumules = "";
    this.triDate = "";
    if(this.triDescription == ""){
      this.triDescription = "ASC";
      //this.ligneService.triParDescription("ASC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        if(ligne1['description'].localeCompare(ligne2['description']) == 0){
          if(ligne1['date'].localeCompare(ligne2['date']) == 0){
            return ligne1['id_ligne'] - ligne2['id_ligne'];
          }
          else{
            return ligne1['date'].localeCompare(ligne2['date']);
          }
        }
        else{
          return ligne1['description'].localeCompare(ligne2['description']);
        }
      });
    }
    else if(this.triDescription == "ASC"){
      this.triDescription = "DESC";
      //this.ligneService.triParDescription("DESC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        if(ligne2['description'].localeCompare(ligne1['description']) == 0){
          if(ligne2['date'].localeCompare(ligne1['date']) == 0){
            return ligne2['id_ligne'] - ligne1['id_ligne'];
          }
          else{
            return ligne2['date'].localeCompare(ligne1['date']);
          }
        }
        else{
          return ligne2['description'].localeCompare(ligne1['description']);
        }
      });
    }
    else{
      this.triDescription = "ASC";
      //this.ligneService.triParDescription("ASC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        if(ligne1['description'].localeCompare(ligne2['description']) == 0){
          if(ligne1['date'].localeCompare(ligne2['date']) == 0){
            return ligne1['id_ligne'] - ligne2['id_ligne'];
          }
          else{
            return ligne1['date'].localeCompare(ligne2['date']);
          }
        }
        else{
          return ligne1['description'].localeCompare(ligne2['description']);
        }
      });
    }
  }

  demandeDeTriDate(){
    this.triId = "";
    this.triVehicule = "";
    this.triNbKilometres = "";
    this.triNbKilometresCumules = "";
    this.triDescription = "";
    if(this.triDate == ""){
      this.triDate = "ASC";
      //this.ligneService.triParDate("ASC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        if(ligne1['date'].localeCompare(ligne2['date']) == 0){
          return ligne1['id_ligne'] - ligne2['id_ligne'];
        }
        else{
          return ligne1['date'].localeCompare(ligne2['date']);
        }
      });
    }
    else if(this.triDate == "ASC"){
      this.triDate = "DESC";
      //this.ligneService.triParDate("DESC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        if(ligne2['date'].localeCompare(ligne1['date']) == 0){
          return ligne2['id_ligne'] - ligne1['id_ligne'];
        }
        else{
          return ligne2['date'].localeCompare(ligne1['date']);
        }
      });
    }
    else{
      this.triDate = "ASC";
      //this.ligneService.triParDate("ASC", this.utilisateurSelectionne.id_utilisateur);
      this.lignesTriees.sort(function(ligne1, ligne2){
        if(ligne1['date'].localeCompare(ligne2['date']) == 0){
          return ligne1['id_ligne'] - ligne2['id_ligne'];
        }
        else{
          return ligne1['date'].localeCompare(ligne2['date']);
        }
      });
    }
  }

}
