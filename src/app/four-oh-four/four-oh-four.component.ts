import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitters';
import { Utilisateur } from '../models/Utilisateur.model';
import { UtilisateurService } from '../services/utilisateur.service';
import { LanguageService } from '../services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ReloadService } from '../services/component-reload.service';

@Component({
  selector: 'app-four-oh-four',
  templateUrl: './four-oh-four.component.html',
  styleUrls: ['./four-oh-four.component.css']
})
export class FourOhFourComponent implements OnInit, OnDestroy {
  private reloadSubscription: Subscription;


  t404_title: string;
  t404_legend: string;

  constructor(private utilisateurService: UtilisateurService, private router: Router, private reloadService: ReloadService, private languageService: LanguageService, private translateService: TranslateService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("component404");

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
    this.translateService.get('404.t404_title').subscribe((res: string) => {
      this.t404_title = res;
    });

    this.translateService.get('404.t404_legend').subscribe((res: string) => {
      this.t404_legend = res;
    });

    if (this.languageService.getSelectedLanguage() == 'fr'){
    }

    if (this.languageService.getSelectedLanguage() == 'en'){
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");

    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }


  deconnexion(utilisateur:Utilisateur){
    this.utilisateurService.setConnecte(utilisateur, 0)
    .then((resp) => {
      if(resp['status'] == "OK"){
        console.log('Déconnexion réussie');
      }
    })
    .catch((error) => {
      console.log('Erreur déconnexion (ignorée):', error);
    })
    .finally(() => {
      // Dans tous les cas, nettoyer le localStorage
      localStorage.clear();
      sessionStorage.clear();
      this.utilisateurService.setInfoUtilisateur(null);
      Emitters.connexionEmitter.emit(false);
    });
  }
}
