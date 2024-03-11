import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Emitters } from '../emitters/emitters';
import { Utilisateur } from '../models/Utilisateur.model';
import { StatistiqueService } from '../services/statistique.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { ReloadService } from '../services/component-reload.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-menu-statistiques',
  templateUrl: './menu-statistiques.component.html',
  styleUrls: ['./menu-statistiques.component.css']
})
export class MenuStatistiquesComponent implements OnInit, OnDestroy {
  private reloadSubscription: Subscription;

  // language terms
  stats_title: string;
  stats_user: string;
  stats_add_stat: string;
  stats_add_date_sort: string;
  stats_add_date_sort_legend: string;
  stats_modify_date_sort: string;
  stats_delete: string;
  stats_add_date: string;
  stats_modify_date: string;
  stats_empty_msg: string;
  stats_back_home: string;
  thereIs: string;
  year: string;
  monthPlus: string;
  month: string;
  day: string;
  days: string;
  today: string;
  delStats: string;
  errDelStats: string;


  // Administrator 'select' input
  utilisateurs:any = [{}];
  utilisateurSubscription: Subscription;
  selectedOption: string;
  utilisateurSelectionne: Utilisateur = null;

  statistiques:any = [{}];
  statistiquesTriees:any = [{}];
  statistiqueSubscription: Subscription;
  nbStatistiques: number;

  // tri (ASC/DESC)
  triDate: string = "";
  boutonChange: boolean;

  statistiquesASupprimer = [];


  constructor(private statistiqueService: StatistiqueService, private utilisateurService: UtilisateurService, private router: Router, private reloadService: ReloadService, private languageService: LanguageService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentStatistiques");
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
        this.chargerListeStatistiquesUtilisateur(this.utilisateurService.getInfoUtilisateur().id_utilisateur+"");
      }
    );

    this.statistiqueSubscription = this.statistiqueService.statistiquesSubject.subscribe(
      (statistiques: any[]) => {
        //this.statistiques = statistiques;
        this.statistiquesTriees = statistiques;
        this.nbStatistiques = this.statistiquesTriees.length;
        this.setLanguageTerms();
      }
    );
  }

  setLanguageTerms(){
    let french_lib = this.languageService.getFrenchLib();
    if (this.languageService.getSelectedLanguage() == 'fr'){
      this.stats_title = french_lib['statistiques']['stats_title'];
      this.stats_user = french_lib['statistiques']['stats_user'];
      this.stats_add_stat = french_lib['statistiques']['stats_add_stat'];
      this.stats_add_date_sort = french_lib['statistiques']['stats_add_date_sort'];
      this.stats_add_date_sort_legend = french_lib['statistiques']['stats_add_date_sort_legend'];
      this.stats_modify_date_sort = french_lib['statistiques']['stats_modify_date_sort'];
      this.stats_delete = french_lib['statistiques']['stats_delete'];
      this.stats_add_date = french_lib['statistiques']['stats_add_date'];
      this.stats_modify_date = french_lib['statistiques']['stats_modify_date'];
      this.stats_empty_msg = french_lib['statistiques']['stats_empty_msg'];
      this.stats_back_home = french_lib['statistiques']['stats_back_home'];
      this.thereIs = french_lib['statistiques']['thereIs'];
      this.year = french_lib['statistiques']['year'];
      this.monthPlus = french_lib['statistiques']['monthPlus'];
      this.month = french_lib['statistiques']['month'];
      this.day = french_lib['statistiques']['day'];
      this.days = french_lib['statistiques']['days'];
      this.today = french_lib['statistiques']['today'];
      this.delStats = french_lib['statistiques']['delStats'];
      this.errDelStats = french_lib['statistiques']['errDelStats'];
    }

    let english_lib = this.languageService.getEnglishLib();
    if (this.languageService.getSelectedLanguage() == 'en'){
      this.stats_title = english_lib['statistiques']['stats_title'];
      this.stats_user = english_lib['statistiques']['stats_user'];
      this.stats_add_stat = english_lib['statistiques']['stats_add_stat'];
      this.stats_add_date_sort = english_lib['statistiques']['stats_add_date_sort'];
      this.stats_add_date_sort_legend = english_lib['statistiques']['stats_add_date_sort_legend'];
      this.stats_modify_date_sort = english_lib['statistiques']['stats_modify_date_sort'];
      this.stats_delete = english_lib['statistiques']['stats_delete'];
      this.stats_add_date = english_lib['statistiques']['stats_add_date'];
      this.stats_modify_date = english_lib['statistiques']['stats_modify_date'];
      this.stats_empty_msg = english_lib['statistiques']['stats_empty_msg'];
      this.stats_back_home = english_lib['statistiques']['stats_back_home'];
      this.thereIs = english_lib['statistiques']['thereIs'];
      this.year = english_lib['statistiques']['year'];
      this.monthPlus = english_lib['statistiques']['monthPlus'];
      this.month = english_lib['statistiques']['month'];
      this.day = english_lib['statistiques']['day'];
      this.days = english_lib['statistiques']['days'];
      this.today = english_lib['statistiques']['today'];
      this.delStats = english_lib['statistiques']['delStats'];
      this.errDelStats = english_lib['statistiques']['errDelStats'];
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    // delete the observable to avoid component memory leak
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }

  rafraichir(){
    this.statistiqueService.triParDateDAjout("DESC", this.utilisateurSelectionne.id_utilisateur);
    this.triDate = "DESC";
  }

  checkAdminStatus(){
    if(this.utilisateurService.getInfoUtilisateur() != null){
      if(this.utilisateurService.getInfoUtilisateur().estAdmin){
        return true;
      }
      return false;
    }
    return false;
  }

  chargerListeStatistiquesUtilisateur(id_utilisateur: string){
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
      this.statistiqueService.getStatistiquesFromServer(this.utilisateurSelectionne.id_utilisateur);
    });
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

  calculerTempsPasse(timestamp:any){
    if(timestamp == undefined){
      return "";
    }
    var convert = Date.parse(timestamp)/1000;
    var date = new Date(convert * 1000);

    let returnDate = this.thereIs;
    let dateString = this.dateDiff(new Date(), date);
    let dateArray = dateString.split(";");
    if(dateArray[0] != '0'){
      returnDate += dateArray[0]+this.year;
    }
    if(dateArray[1] != '0'){
      if(dateArray[2] != '0'){
        returnDate += dateArray[1]+this.monthPlus;
      }
      else{
        returnDate += dateArray[1]+this.month;
      }
    }
    if(dateArray[2] != '0'){
      if(+dateArray[2] == 1){
        returnDate += dateArray[2]+this.day;
      }
      else{
        returnDate += dateArray[2]+this.days;
      }
    }
    if(returnDate == this.thereIs){
      returnDate = this.today;
    }
    return returnDate;
  }

  dateDiff(startingDate, endingDate) {
    var startDate = new Date(new Date(startingDate).toISOString().substr(0, 10));
    if (!endingDate) {
        endingDate = new Date().toISOString().substr(0, 10);    // need date in YYYY-MM-DD format
    }
    var endDate = new Date(endingDate);
    if (startDate > endDate) {
        var swap = startDate;
        startDate = endDate;
        endDate = swap;
    }
    var startYear = startDate.getFullYear();
    var february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
    var daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var yearDiff = endDate.getFullYear() - startYear;
    var monthDiff = endDate.getMonth() - startDate.getMonth();
    if (monthDiff < 0) {
        yearDiff--;
        monthDiff += 12;
    }
    var dayDiff = endDate.getDate() - startDate.getDate();
    if (dayDiff < 0) {
        if (monthDiff > 0) {
            monthDiff--;
        } else {
            yearDiff--;
            monthDiff = 11;
        }
        dayDiff += daysInMonth[startDate.getMonth()];
    }

    return yearDiff+';'+monthDiff+';'+dayDiff;
  }

  onEvent(event){
    event.stopPropagation();
  }

  auMoinsUnASupprimer(){
    if(confirm(this.delStats)){
      this.statistiqueService.supprimerStatistiques(this.statistiquesASupprimer, this.utilisateurSelectionne.id_utilisateur)
        .then((response) => {
          if(response['status'] == "ok"){
            this.rafraichir();
          }
          else{
            console.log(this.errDelStats+" : "+JSON.stringify(response));
          }
        }).catch((err) => {console.log("Erreur : "+err)});
    }
  }

  aSupprimer(id_statistique:number){
    if(this.statistiquesASupprimer.includes(id_statistique)){
      const index = this.statistiquesASupprimer.indexOf(id_statistique, 0);
      if(index > -1){
        this.statistiquesASupprimer.splice(index, 1);
      }
    }
    else{
      this.statistiquesASupprimer.push(id_statistique);
    }
  }

  nouvelleStatistique(){
    sessionStorage.setItem('statistiqueAAjouter', this.utilisateurSelectionne.id_utilisateur+"");
    this.router.navigate(['/statistiques/statistique']);
  }

  modifierStatistique(statistique:any){
    let timeOfdate = statistique['dateDAjout'].substring((statistique['dateDAjout'].indexOf("T")),statistique['dateDAjout'].length);
    var convert = Date.parse(statistique['dateDAjout'])/1000;
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
    statistique['dateDAjout'] = year+"-"+month+"-"+day+timeOfdate;
    sessionStorage.setItem('statistiqueAModifier', JSON.stringify(statistique));
    this.router.navigate(['/statistiques/statistique']);
  }

  demandeDeTriDateDAjout(){
    if(this.boutonChange){
      this.boutonChange = false;
      this.triDate = "DESC";
      this.statistiquesTriees.sort(function(ligne1, ligne2){
        if(ligne2['dateDAjout'].localeCompare(ligne1['dateDAjout']) == 0){
          return ligne2['id_statistique'] - ligne1['id_statistique'];
        }
        else{
          return ligne2['dateDAjout'].localeCompare(ligne1['dateDAjout']);
        }
      });
    }
    else{
      if(this.triDate == ""){
        this.triDate = "DESC";
        this.statistiquesTriees.sort(function(ligne1, ligne2){
          if(ligne2['dateDAjout'].localeCompare(ligne1['dateDAjout']) == 0){
            return ligne2['id_statistique'] - ligne1['id_statistique'];
          }
          else{
            return ligne2['dateDAjout'].localeCompare(ligne1['dateDAjout']);
          }
        });
      }
      else if(this.triDate == "DESC"){
        this.triDate = "ASC";
        this.statistiquesTriees.sort(function(ligne1, ligne2){
          if(ligne1['dateDAjout'].localeCompare(ligne2['dateDAjout']) == 0){
            return ligne1['id_ligne'] - ligne2['id_ligne'];
          }
          else{
            return ligne1['dateDAjout'].localeCompare(ligne2['dateDAjout']);
          }
        });
      }
      else{
        this.triDate = "DESC";
        this.statistiquesTriees.sort(function(ligne1, ligne2){
          if(ligne2['dateDAjout'].localeCompare(ligne1['dateDAjout']) == 0){
            return ligne2['id_statistique'] - ligne1['id_statistique'];
          }
          else{
            return ligne2['dateDAjout'].localeCompare(ligne1['dateDAjout']);
          }
        });
      }
    }
  }

  demandeDeTriDateDeModification(){
    if(this.boutonChange){
      this.boutonChange = false;
      this.triDate = "DESC";
      this.statistiquesTriees.sort(function(ligne1, ligne2){
        if(ligne2['dateDeModification'].localeCompare(ligne1['dateDeModification']) == 0){
          return ligne2['id_statistique'] - ligne1['id_statistique'];
        }
        else{
          return ligne2['dateDeModification'].localeCompare(ligne1['dateDeModification']);
        }
      });
    }
    else{
      if(this.triDate == ""){
        this.triDate = "DESC";
        this.statistiquesTriees.sort(function(ligne1, ligne2){
          if(ligne2['dateDeModification'].localeCompare(ligne1['dateDeModification']) == 0){
            return ligne2['id_statistique'] - ligne1['id_statistique'];
          }
          else{
            return ligne2['dateDeModification'].localeCompare(ligne1['dateDeModification']);
          }
        });
      }
      else if(this.triDate == "DESC"){
        this.triDate = "ASC";
        this.statistiquesTriees.sort(function(ligne1, ligne2){
          if(ligne1['dateDeModification'].localeCompare(ligne2['dateDeModification']) == 0){
            return ligne1['id_ligne'] - ligne2['id_ligne'];
          }
          else{
            return ligne1['dateDeModification'].localeCompare(ligne2['dateDeModification']);
          }
        });
      }
      else{
        this.triDate = "DESC";
        this.statistiquesTriees.sort(function(ligne1, ligne2){
          if(ligne2['dateDeModification'].localeCompare(ligne1['dateDeModification']) == 0){
            return ligne2['id_statistique'] - ligne1['id_statistique'];
          }
          else{
            return ligne2['dateDeModification'].localeCompare(ligne1['dateDeModification']);
          }
        });
      }
    }
  }
}
