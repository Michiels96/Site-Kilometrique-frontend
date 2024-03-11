import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Emitters } from '../emitters/emitters';
import { Subscription } from 'rxjs';
import { UtilisateurService } from '../services/utilisateur.service';
import { LanguageService } from '../services/language.service';
import { ReloadService } from '../services/component-reload.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit, OnDestroy {
  private reloadSubscription: Subscription;

  // language terms
  admin_status: string;
  message: string;
  nav_history_menu_title: string;
  nav_history_menu_legend: string;
  nav_history_menu_button: string;
  vehicles_menu_title: string;
  vehicles_menu_legend: string;
  vehicles_menu_button: string;
  brands_menu_title: string;
  brands_menu_legend: string;
  brands_menu_button: string;
  users_menu_title: string;
  users_menu_legend: string;
  users_menu_button: string;
  stats_menu_title: string;
  stats_menu_legend: string;
  stats_menu_button: string;
  down_menu_title: string;
  down_menu_legend: string;
  down_menu_button: string;
  footer: string;

  constructor(private httpClient: HttpClient, private utilisateurService: UtilisateurService, private reloadService: ReloadService, private languageService: LanguageService){}

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentAccueil");
    // Observable to reload from 'nav' component when there is a language change
    this.reloadSubscription = this.reloadService.getReloadObservable().subscribe((reload) => {
      if (reload) {
        this.setLanguageTerms();
      }
    });
    this.setLanguageTerms();
  }

  setLanguageTerms(){
    let french_lib = this.languageService.getFrenchLib();
    if (this.languageService.getSelectedLanguage() == 'fr'){
      this.admin_status = french_lib['accueil']['admin_status'];
      this.message = "Bienvenue "+this.utilisateurService.getInfoUtilisateur().prenom+" "+this.utilisateurService.getInfoUtilisateur().nom;
      this.nav_history_menu_title = french_lib['accueil']['nav_history_menu_title'];
      this.nav_history_menu_legend = french_lib['accueil']['nav_history_menu_legend'];
      this.nav_history_menu_button = french_lib['accueil']['nav_history_menu_button'];
      this.vehicles_menu_title = french_lib['accueil']['vehicles_menu_title'];
      this.vehicles_menu_legend = french_lib['accueil']['vehicles_menu_legend'];
      this.vehicles_menu_button = french_lib['accueil']['vehicles_menu_button'];
      this.brands_menu_title = french_lib['accueil']['brands_menu_title'];
      this.brands_menu_legend = french_lib['accueil']['brands_menu_legend'];
      this.brands_menu_button = french_lib['accueil']['brands_menu_button'];
      this.users_menu_title = french_lib['accueil']['users_menu_title'];
      this.users_menu_legend = french_lib['accueil']['users_menu_legend'];
      this.users_menu_button = french_lib['accueil']['users_menu_button'];
      this.stats_menu_title = french_lib['accueil']['stats_menu_title'];
      this.stats_menu_legend = french_lib['accueil']['stats_menu_legend'];
      this.stats_menu_button = french_lib['accueil']['stats_menu_button'];
      this.down_menu_title = french_lib['accueil']['down_menu_title'];
      this.down_menu_legend = french_lib['accueil']['down_menu_legend'];
      this.down_menu_button = french_lib['accueil']['down_menu_button'];
      this.footer = french_lib['accueil']['footer'];
    }

    let english_lib = this.languageService.getEnglishLib();
    if (this.languageService.getSelectedLanguage() == 'en'){
      this.admin_status = english_lib['accueil']['admin_status'];
      this.message = "Welcome "+this.utilisateurService.getInfoUtilisateur().prenom+" "+this.utilisateurService.getInfoUtilisateur().nom;
      this.nav_history_menu_title = english_lib['accueil']['nav_history_menu_title'];
      this.nav_history_menu_legend = english_lib['accueil']['nav_history_menu_legend'];
      this.nav_history_menu_button = english_lib['accueil']['nav_history_menu_button'];
      this.vehicles_menu_title = english_lib['accueil']['vehicles_menu_title'];
      this.vehicles_menu_legend = english_lib['accueil']['vehicles_menu_legend'];
      this.vehicles_menu_button = english_lib['accueil']['vehicles_menu_button'];
      this.brands_menu_title = english_lib['accueil']['brands_menu_title'];
      this.brands_menu_legend = english_lib['accueil']['brands_menu_legend'];
      this.brands_menu_button = english_lib['accueil']['brands_menu_button'];
      this.users_menu_title = english_lib['accueil']['users_menu_title'];
      this.users_menu_legend = english_lib['accueil']['users_menu_legend'];
      this.users_menu_button = english_lib['accueil']['users_menu_button'];
      this.stats_menu_title = english_lib['accueil']['stats_menu_title'];
      this.stats_menu_legend = english_lib['accueil']['stats_menu_legend'];
      this.stats_menu_button = english_lib['accueil']['stats_menu_button'];
      this.down_menu_title = english_lib['accueil']['down_menu_title'];
      this.down_menu_legend = english_lib['accueil']['down_menu_legend'];
      this.down_menu_button = english_lib['accueil']['down_menu_button'];
      this.footer = english_lib['accueil']['footer'];
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    // delete the observable to avoid component memory leak
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }

  checkAdminStatus(){
    if(this.utilisateurService.getInfoUtilisateur().estAdmin){
      return true;
    }
    return false;
  }
}
