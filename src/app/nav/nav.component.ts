import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
  language: string = "fr";

  constructor(
    private router: Router, 
    private utilisateurService: UtilisateurService, 
    private languageService: LanguageService,
    private translateService: TranslateService
  ) { }

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
  }

  changeLanguage(newLang: string){
    this.languageService.changeLanguage(newLang);
    this.language = newLang;
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
