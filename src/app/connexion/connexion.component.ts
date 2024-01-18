import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Utilisateur } from '../models/Utilisateur.model';
import { UtilisateurService } from '../services/utilisateur.service';
import { Emitters } from '../emitters/emitters';
import { LanguageService } from '../services/language.service';
import { ReloadService } from '../services/component-reload.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit, OnDestroy {
  private reloadSubscription: Subscription;
  connexionForm: FormGroup;

  // language terms
  connection: string;
  email: string;
  password: string;
  submitConnection: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private reloadService: ReloadService, private utilisateurService: UtilisateurService, private languageService: LanguageService) {}

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentConnexion");
    // Observable to reload from 'nav' component when there is a language change
    this.reloadSubscription = this.reloadService.getReloadObservable().subscribe((reload) => {
      if (reload) {
        this.setLanguageTerms();
      }
    });
    this.checkConnected();
    this.initForm();
    Emitters.connexionEmitter.emit(false);
    this.setLanguageTerms();
  }

  setLanguageTerms(){
    let french_lib = this.languageService.getFrenchLib();
    if (this.languageService.getSelectedLanguage() == 'fr'){
      this.connection = french_lib['connexion']['Connection'];
      this.email = french_lib['connexion']['Email address'];
      this.password = french_lib['connexion']['Password'];
      this.submitConnection = french_lib['connexion']['submitConnection'];
    }

    let english_lib = this.languageService.getEnglishLib();
    if (this.languageService.getSelectedLanguage() == 'en'){
      this.connection = english_lib['connexion']['Connection'];
      this.email = english_lib['connexion']['Email address'];
      this.password = english_lib['connexion']['Password'];
      this.submitConnection = english_lib['connexion']['submitConnection'];
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    // delete the observable to avoid component memory leak
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }

  checkConnected(){
    if(localStorage.getItem('sessionToken') != null){
      this.utilisateurService.checkToken(localStorage.getItem('sessionToken'))
        .then(() => {
          this.router.navigate(['/']);
        });
    }
  }

  initForm() {
    this.connexionForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      //email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onSubmitForm(){
    const formValue = this.connexionForm.value;

    //trouver l'utilisateur et voir si il existe, si oui, on change son flag 'connecte' à 1
    let utilisateur = new Utilisateur(
      formValue['email'],
      formValue['password'],
    );
       
    this.utilisateurService.getByEmail(utilisateur)
      .then((response) => {
        if(JSON.stringify(response) == "[]"){
          //console.log("Mauvais email/mdp");
          alert("Mauvais email/mdp");
        }
        else{
          this.utilisateurService.checkPasswd(utilisateur, formValue['password'])
            .then((resp) => {
              if(resp['status'] == "OK"){
                //mettre son flag connecté a 1 et récuperer un token
                utilisateur.id_utilisateur = response[0]['id_utilisateur'];
                this.utilisateurService.setConnecte(utilisateur, 1)
                  .then((token) => {
                    //localStorage.setItem('sessionToken', JSON.stringify(token['token']).substring(1, JSON.stringify(token['token']).length-1));
                    localStorage.setItem('sessionToken', token['token']);
                    //this.utilisateurService.getUtilisateursFromServer();
                    this.router.navigate(["/accueil"]);
                  });
              }
            }).catch(() => alert("Mauvais email/mdp"));
        }
      }
    );
  }
}
