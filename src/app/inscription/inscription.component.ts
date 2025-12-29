import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitters';
import { Utilisateur } from '../models/Utilisateur.model';
import { StatistiqueService } from '../services/statistique.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { LanguageService } from '../services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit, OnDestroy {
  inscriptionForm: FormGroup;
  nouvelUtilisateur: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private utilisateurService: UtilisateurService, private statistiqueService: StatistiqueService, private languageService: LanguageService, private translateService: TranslateService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentInscription");
    //ajouter une nouvelle marque
    if(sessionStorage.getItem('utilisateurAAjouter') != null){
      this.nouvelUtilisateur = true;
    }
    this.initForm();
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    sessionStorage.removeItem('utilisateurAAjouter');
  }

  initForm() {
    this.inscriptionForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      date_naissance: ['']
    });
  }

  onSubmitForm() {
    const formValue = this.inscriptionForm.value;
    //trouver l'utilisateur et voir si il existe, si oui, on change son flag 'connecte' à 1
    let utilisateur: Utilisateur;
    if(formValue['date_naissance'] == ''){
      utilisateur = new Utilisateur(
        formValue['email'],
        formValue['password'],
        formValue['name'],
        formValue['lastname']
      );
    }
    else{
      utilisateur = new Utilisateur(
        formValue['email'],
        formValue['password'],
        formValue['name'],
        formValue['lastname'],
        formValue['date_naissance']
      );
    }

    this.utilisateurService.getByEmail(utilisateur)
      .then((response) => {
        if(response.length > 0){
          alert("cet email n'est plus disponible");
        }
        else{
          if(formValue['date_naissance'] == ''){
            this.utilisateurService.inscription(utilisateur, false)
            .then((response) => {
                if(response['status'] == "OK"){
                  this.statistiqueService.creerStatistiques(utilisateur.email, -1)
                  .then(()=>{
                    if(this.nouvelUtilisateur){
                      this.utilisateurService.getUtilisateursFromServer();
                      this.router.navigate(["/utilisateurs"]);
                    }
                    else{
                      alert("Inscrit!");
                      this.router.navigate(["/connexion"]);
                    }
                  });
                }
                else{
                  console.log("erreur inscription: "+JSON.stringify(response));
                }
            }).catch((err) => {console.log("Erreur : "+err)});
          }
          else{
            this.utilisateurService.inscription(utilisateur, true)
            .then((response) => {
              if(response['status'] == "OK"){
                this.statistiqueService.creerStatistiques(utilisateur.email, -1)
                  .then(()=>{
                    if(this.nouvelUtilisateur){
                      this.utilisateurService.getUtilisateursFromServer();
                      this.router.navigate(["/utilisateurs"]);
                    }
                    else{
                      alert("Inscrit!");
                      this.router.navigate(["/connexion"]);
                    }
                  });
              }
              else{
                console.log("erreur inscription: "+JSON.stringify(response));
              }
            }).catch((err) => {console.log("Erreur : "+err)});
          }
        }
      });
    }
}
