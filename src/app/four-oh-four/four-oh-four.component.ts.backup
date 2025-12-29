import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitters';
import { Utilisateur } from '../models/Utilisateur.model';
import { UtilisateurService } from '../services/utilisateur.service';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';
import { ReloadService } from '../services/component-reload.service';

@Component({
  selector: 'app-four-oh-four',
  templateUrl: './four-oh-four.component.html',
  styleUrls: ['./four-oh-four.component.css']
})
export class FourOhFourComponent implements OnInit, OnDestroy {
  private reloadSubscription: Subscription;

  // language terms
  t404_title: string;
  t404_legend: string;

  constructor(private utilisateurService: UtilisateurService, private router: Router, private reloadService: ReloadService, private languageService: LanguageService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("component404");
    // Observable to reload from 'nav' component when there is a language change
    this.reloadSubscription = this.reloadService.getReloadObservable().subscribe((reload) => {
      if (reload) {
        this.setLanguageTerms();
      }
    });
    if(localStorage.getItem('sessionToken') != null){
      this.utilisateurService.checkToken(localStorage.getItem('sessionToken'))
        .then((resp) => {
          let user = new Utilisateur(
            resp['user'][0]['id_utilisateur'],
            resp['user'][0]['email'],
            //resp['user'][0]['password'],
            null,
            resp['user'][0]['nom'],
            resp['user'][0]['prenom'],
            resp['user'][0]['age'],
            resp['user'][0]['nbKilometresCumules'],
            resp['user'][0]['estConnecte'],
            resp['user'][0]['estAdmin']
          );
          localStorage.setItem('sessionToken', resp['newToken']);
          Emitters.connexionEmitter.emit(true);
          this.deconnexion(user);
        });
    }
    this.setLanguageTerms();
  }

  setLanguageTerms(){
    let french_lib = this.languageService.getFrenchLib();
    if (this.languageService.getSelectedLanguage() == 'fr'){
      this.t404_title = french_lib['404']['t404_title'];
      this.t404_legend = french_lib['404']['t404_legend'];
    }

    let english_lib = this.languageService.getEnglishLib();
    if (this.languageService.getSelectedLanguage() == 'en'){
      this.t404_title = english_lib['404']['t404_title'];
      this.t404_legend = english_lib['404']['t404_legend'];
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    // delete the observable to avoid component memory leak
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }


  deconnexion(utilisateur:Utilisateur){
    this.utilisateurService.setConnecte(utilisateur, 0)
    .then((resp) => {
      if(resp['status'] == "OK"){
        localStorage.clear();
        sessionStorage.clear();
        this.utilisateurService.setInfoUtilisateur(null);
        Emitters.connexionEmitter.emit(false);
        //window.location.reload();
        //this.router.navigate(['/connexion']);
      }
    });
  }
}
