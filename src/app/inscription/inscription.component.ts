import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitters';
import { Utilisateur } from '../models/Utilisateur.model';
import { StatistiqueService } from '../services/statistique.service';
import { UtilisateurService } from '../services/utilisateur.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit, OnDestroy {

  inscriptionForm: FormGroup;

  nouvelUtilisateur: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private utilisateurService: UtilisateurService, private statistiqueService: StatistiqueService) { }

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
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      age: ['']
    });
  }

  onSubmitForm() {
    const formValue = this.inscriptionForm.value;

    //trouver l'utilisateur et voir si il existe, si oui, on change son flag 'connecte' à 1
    let utilisateur: Utilisateur;
    if(formValue['age'] == ''){
      utilisateur = new Utilisateur(
        formValue['email'],
        formValue['password'],
        formValue['nom'],
        formValue['prenom']
      );
    }
    else{
      utilisateur = new Utilisateur(
        formValue['email'],
        formValue['password'],
        formValue['nom'],
        formValue['prenom'],
        formValue['age']
      );
    }


    this.utilisateurService.getByEmail(utilisateur)
      .then((response) => {
        if(response.length > 0){
          alert("cet email n'est plus disponible");
        }
        else{
          if(formValue['age'] == ''){
            this.utilisateurService.inscription(utilisateur, false)
            .then((response) => {
                if(response['status'] == "OK"){
                  this.statistiqueService.creerStatistiques(utilisateur.email, -1)
                  .then(()=>{
                    //console.log("inscrit")
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
                    //console.log("inscrit")
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
