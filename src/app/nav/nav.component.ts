import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitters';
import { UtilisateurService } from '../services/utilisateur.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  connecte: boolean = false;
  componentAffiche: string = "";
  language:string = "";

  // language terms
  connection_page: string;
  connection: string;
  register: string;

  constructor(private router: Router, private utilisateurService: UtilisateurService, private languageService: LanguageService) { }

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
    this.setLanguageTerms();
  }

  setLanguageTerms(){
    let french_lib = this.languageService.getFrenchLib();
    if (this.language == 'fr'){
      this.connection_page = french_lib['nav']['Connection page'];
      this.connection = french_lib['nav']['Connection'];
      this.register = french_lib['nav']['Register'];
    }

    let english_lib = this.languageService.getEnglishLib();
    if (this.language == 'en'){
      this.connection_page = english_lib['nav']['Connection page'];
      this.connection = english_lib['nav']['Connection'];
      this.register = english_lib['nav']['Register'];
    }
  }

  changeLanguage(){
    this.languageService.changeSelectedLanguage();
    this.language = this.languageService.getSelectedLanguage();
    this.setLanguageTerms();
    // changer aussi les termes des autres components
  }

  modifierProfil(){
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

