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

  async onSubmitForm(){
    const formValue = this.inscriptionForm.value;
    let utilisateur: Utilisateur;
    let avecAge = false;

    if(formValue['date_naissance'] == ''){
      utilisateur = new Utilisateur(
        formValue['email'],
        formValue['password'],
        formValue['name'],
        formValue['lastname'],
        null
      );
      avecAge = false;
    }
    else{
      utilisateur = new Utilisateur(
        formValue['email'],
        formValue['password'],
        formValue['name'],
        formValue['lastname'],
        formValue['date_naissance']
      );
      avecAge = true;
    }

    try {

      const response = await this.utilisateurService.checkEmailAvailability(utilisateur.email);
      if(!response.available){
        alert("Cet email est déjà utilisé");
        return;
      }


      const inscriptionResponse = await this.utilisateurService.inscription(utilisateur, avecAge);

      if(inscriptionResponse['status'] == "OK"){

        await this.statistiqueService.creerStatistiques(utilisateur.email, -1);

        if(this.nouvelUtilisateur){
          this.utilisateurService.getUtilisateursFromServer();
          this.router.navigate(["/utilisateurs"]);
        }
        else{
          alert("Inscription réussie!");
          this.router.navigate(["/connexion"]);
        }
      }
      else{
        console.log("Erreur inscription: "+JSON.stringify(inscriptionResponse));
        alert("Erreur lors de l'inscription");
      }
    }
    catch(error: any) {
      console.error('Erreur lors de l\'inscription:', error);

      if(error.status === 409){
        alert("Cet email est déjà utilisé");
      }
      else if(error.status === 500){
        alert("Erreur serveur, veuillez réessayer plus tard");
      }
      else if(error.status === 0){
        alert("Impossible de contacter le serveur");
      }
      else{
        alert("Erreur lors de l'inscription: " + (error.error?.error || error.message || "Erreur inconnue"));
      }
    }
  }
}
