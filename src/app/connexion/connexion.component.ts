import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Utilisateur } from '../models/Utilisateur.model';
import { UtilisateurService } from '../services/utilisateur.service';
import { Emitters } from '../emitters/emitters';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit, OnDestroy {
  connexionForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private utilisateurService: UtilisateurService, 
    private languageService: LanguageService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentConnexion");
    this.checkConnected();
    this.initForm();
    Emitters.connexionEmitter.emit(false);
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit();
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

      password: ['', Validators.required]
    });
  }

  onSubmitForm(){
    const formValue = this.connexionForm.value;


    let utilisateur = new Utilisateur(
      formValue['email'],
      formValue['password'],
    );
       
    this.utilisateurService.checkPasswd(utilisateur, formValue['password'])
      .then((resp) => {
        if(resp['status'] == 'OK'){

          this.utilisateurService.getByEmailPublic(utilisateur.email)
            .then((userData) => {
              if(userData && userData.length > 0){

                utilisateur.id_utilisateur = userData[0]['id_utilisateur'];
                this.utilisateurService.setConnecte(utilisateur, 1)
                  .then((token) => {
                    console.log('Token reçu:', token);
                    localStorage.setItem('sessionToken', token['token']);
                    this.router.navigate(["/accueil"]);
                  })
                  .catch((err) => {
                    console.error('Erreur setConnecte:', err);
                    alert("Erreur lors de la connexion: " + err.message);
                  });
              }
              else{
                alert("Mauvais email/mdp");
              }
            })
            .catch((err) => {
              console.error('Erreur getByEmailPublic:', err);
              alert("Erreur lors de la récupération des données: " + err.message);
            });
        }
      }).catch((err) => {
        console.error('Erreur checkPasswd:', err);
        alert("Mauvais email/mdp");
      });
  }
}
