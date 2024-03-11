import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitters';
import { Utilisateur } from '../models/Utilisateur.model';
import { StatistiqueService } from '../services/statistique.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';
import { ReloadService } from '../services/component-reload.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit, OnDestroy {
  private reloadSubscription: Subscription;
  inscriptionForm: FormGroup;
  nouvelUtilisateur: boolean = false;

  // language terms
  register: string;
  email: string;
  password: string;
  name: string;
  lastname: string;
  age: string;
  submitRegister: string;
  createUser: string;
  backToUsers: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private reloadService: ReloadService, private utilisateurService: UtilisateurService, private statistiqueService: StatistiqueService, private languageService: LanguageService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentInscription");
    // Observable to reload from 'nav' component when there is a language change
    this.reloadSubscription = this.reloadService.getReloadObservable().subscribe((reload) => {
      if (reload) {
        this.setLanguageTerms();
      }
    });
    //ajouter une nouvelle marque
    if(sessionStorage.getItem('utilisateurAAjouter') != null){
      this.nouvelUtilisateur = true;
    }
    this.initForm();
  }

  setLanguageTerms(){
    let french_lib = this.languageService.getFrenchLib();
    if (this.languageService.getSelectedLanguage() == 'fr'){
      this.register = french_lib['inscription']['register'];
      this.email = french_lib['inscription']['emailAddress'];
      this.password = french_lib['inscription']['password'];
      this.name = french_lib['inscription']['name'];
      this.lastname = french_lib['inscription']['lastname'];
      this.age = french_lib['inscription']['age'];
      this.submitRegister = french_lib['inscription']['submitRegister'];
      this.createUser = french_lib['inscription']['createUser'];
      this.backToUsers = french_lib['inscription']['backToUsers'];
    }

    let english_lib = this.languageService.getEnglishLib();
    if (this.languageService.getSelectedLanguage() == 'en'){
      this.register = english_lib['inscription']['register'];
      this.email = english_lib['inscription']['emailAddress'];
      this.password = english_lib['inscription']['password'];
      this.name = english_lib['inscription']['name'];
      this.lastname = english_lib['inscription']['lastname'];
      this.age = english_lib['inscription']['age'];
      this.submitRegister = english_lib['inscription']['submitRegister'];
      this.createUser = english_lib['inscription']['createUser'];
      this.backToUsers = english_lib['inscription']['backToUsers'];
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    sessionStorage.removeItem('utilisateurAAjouter');
    // delete the observable to avoid component memory leak
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }

  initForm() {
    this.inscriptionForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
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
