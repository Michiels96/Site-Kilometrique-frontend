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
    const token = localStorage.getItem('sessionToken');
    if(token != null){
      // Vérifier le token ET estConnecte = 1 côté backend
      this.utilisateurService.checkToken(token)
        .then((resp: any) => {
          // Token valide ET estConnecte = 1, rediriger vers l'accueil
          console.log('Utilisateur déjà connecté (token valide + estConnecte=1), redirection...');
          if(resp && resp.newToken){
            localStorage.setItem('sessionToken', resp.newToken);
          }
          this.router.navigate(['/']);
        })
        .catch((error) => {
          // Token invalide OU estConnecte = 0, nettoyer et rester sur la page
          console.log('Token invalide ou utilisateur déconnecté, nettoyage...');
          localStorage.clear();
          sessionStorage.clear();
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
                    this.handleConnectionError(err);
                  });
              }
              else{
                this.translateService.get('connexion.wrongCredentials').subscribe((text: string) => {
                  alert(text);
                });
              }
            })
            .catch((err) => {
              console.error('Erreur getByEmailPublic:', err);
              this.handleConnectionError(err);
            });
        }
      }).catch((err) => {
        console.error('Erreur checkPasswd:', err);
        this.translateService.get('connexion.wrongCredentials').subscribe((text: string) => {
          alert(text);
        });
      });
  }

  handleConnectionError(err: any) {
    // Vérifier si c'est une erreur 429 (Too Many Requests)
    if (err && err.status === 429) {
      this.translateService.get('connexion.tooManyAttempts').subscribe((text: string) => {
        alert(text);
      });
    } else if (err && err.message) {
      this.translateService.get('connexion.connectionError').subscribe((text: string) => {
        alert(text + ": " + err.message);
      });
    } else {
      this.translateService.get('connexion.connectionError').subscribe((text: string) => {
        alert(text);
      });
    }
  }
}
