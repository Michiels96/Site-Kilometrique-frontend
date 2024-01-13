import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitters';
import { UtilisateurService } from '../services/utilisateur.service';
import { LanguageService } from '../services/language.service';
import { ReloadService } from '../services/component-reload.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  connecte: boolean = false;
  componentAffiche: string = "";
  language:string = "";
  french_lib: object;
  english_lib: object;

  // language terms
  connection_page: string;
  connection: string;
  register: string;

  constructor(private router: Router, private reloadService: ReloadService, private utilisateurService: UtilisateurService, private languageService: LanguageService) { }

  ngOnInit(): void {
    Emitters.connexionEmitter
    .subscribe((connecteStatus:boolean) => {
      this.connecte = connecteStatus;
    });

    Emitters.componentAffiche
    .subscribe((pageStatus:string) => {
      this.componentAffiche = pageStatus;
    });
    this.language = this.languageService.getSelectedLanguage();
    this.french_lib = this.languageService.getFrenchLib();
    this.english_lib = this.languageService.getEnglishLib();
    this.setLanguageTerms();
  }

  setLanguageTerms(){
    if (this.language == 'fr'){
      if(this.componentAffiche == "componentConnexion"){
        this.connection_page = this.french_lib['nav']['Connection page'];
      }
      else{
        this.connection_page = this.french_lib['nav']['register page'];
      }
      this.connection = this.french_lib['nav']['Connection'];
      this.register = this.french_lib['nav']['Register'];
    }

    if (this.language == 'en'){
      if(this.componentAffiche == "componentConnexion"){
        this.connection_page = this.english_lib['nav']['Connection page'];
      }
      else{
        this.connection_page = this.english_lib['nav']['register page'];
      }
      this.connection = this.english_lib['nav']['Connection'];
      this.register = this.english_lib['nav']['Register'];
    }
  }

  changeLanguage(){
    this.languageService.changeSelectedLanguage();
    this.language = this.languageService.getSelectedLanguage();
    this.setLanguageTerms();
    // changer aussi les termes des autres components
    this.reloadService.reloadComponent();
  }

  modifierProfil(){
    if (this.language == 'fr'){
      this.connection_page = this.french_lib['nav']['register page'];
    }
    else if (this.language == 'en'){
      this.connection_page = this.english_lib['nav']['register page'];
    }
    sessionStorage.setItem('profilAModifier', JSON.stringify(this.utilisateurService.getInfoUtilisateur()));
    this.router.navigate(['/profil']);
  }

  deconnexion(){
    this.utilisateurService.setConnecte(this.utilisateurService.getInfoUtilisateur(), 0)
    .then((resp) => {
      if(resp['status'] == "OK"){
        localStorage.clear();
        sessionStorage.clear();
        this.connecte = false;
        this.utilisateurService.setInfoUtilisateur(null);
        Emitters.connexionEmitter.emit(false);
        //window.location.reload();
        this.router.navigate(['/connexion']);
      }
    });
  }
}

