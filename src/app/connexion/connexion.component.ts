import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Utilisateur } from '../models/Utilisateur.model';
import { UtilisateurService } from '../services/utilisateur.service';
import { Emitters } from '../emitters/emitters';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit, OnDestroy {

  connexionForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private utilisateurService: UtilisateurService) {}

  ngOnInit(): void {
    this.clearCache();
    Emitters.componentAffiche.emit("componentConnexion");
    this.checkConnected();
    this.initForm();
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
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

  clearCache(){
    sessionStorage.clear();
    localStorage.clear();
  }
}
