import { Component, OnInit } from '@angular/core';
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
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  private reloadSubscription: Subscription;
  profilAModifier:any = null;

  profilForm: FormGroup;
  private profilModifie: boolean = false;
  modifierUtilisateur: boolean = false;
  modifierMDP: boolean = false;

  // language terms
  user_title: string;
  user_email: string;
  user_password: string;
  user_name: string;
  user_lastname: string;
  user_age: string;
  user_total_kms: string;
  user_connection_status: string;
  user_admin_status: string;
  user_modify: string;
  user_back_home: string;
  user_back_users: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private reloadService: ReloadService, private languageService: LanguageService, private utilisateurService: UtilisateurService, private statistiqueService: StatistiqueService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentProfil");
    // Observable to reload from 'nav' component when there is a language change
    this.reloadSubscription = this.reloadService.getReloadObservable().subscribe((reload) => {
      if (reload) {
        this.setLanguageTerms();
      }
    });
    if(sessionStorage.getItem('profilAModifierStatus') != null && sessionStorage.getItem('profilAModifierStatus') == "oui"){
      this.modifierUtilisateur = true;
    }
    this.profilAModifier = JSON.parse(sessionStorage.getItem('profilAModifier'));
    this.initForm();
  }

  setLanguageTerms(){
    let french_lib = this.languageService.getFrenchLib();
    if (this.languageService.getSelectedLanguage() == 'fr'){
      this.user_title = french_lib['profil']['user_title'];
      this.user_email = french_lib['profil']['user_email'];
      this.user_password = french_lib['profil']['user_password'];
      this.user_name = french_lib['profil']['user_name'];
      this.user_lastname = french_lib['profil']['user_lastname'];
      this.user_age = french_lib['profil']['user_age'];
      this.user_total_kms = french_lib['profil']['user_total_kms'];
      this.user_connection_status = french_lib['profil']['user_connection_status'];
      this.user_admin_status = french_lib['profil']['user_admin_status'];
      this.user_modify = french_lib['profil']['user_modify'];
      this.user_back_home = french_lib['profil']['user_back_home'];
      this.user_back_users = french_lib['profil']['user_back_users'];
    }

    let english_lib = this.languageService.getEnglishLib();
    if (this.languageService.getSelectedLanguage() == 'en'){
      this.user_title = english_lib['profil']['user_title'];
      this.user_email = english_lib['profil']['user_email'];
      this.user_password = english_lib['profil']['user_password'];
      this.user_name = english_lib['profil']['user_name'];
      this.user_lastname = english_lib['profil']['user_lastname'];
      this.user_age = english_lib['profil']['user_age'];
      this.user_total_kms = english_lib['profil']['user_total_kms'];
      this.user_connection_status = english_lib['profil']['user_connection_status'];
      this.user_admin_status = english_lib['profil']['user_admin_status'];
      this.user_modify = english_lib['profil']['user_modify'];
      this.user_back_home = english_lib['profil']['user_back_home'];
      this.user_back_users = english_lib['profil']['user_back_users'];
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    // delete the observable to avoid component memory leak
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
    this.resetProfilSelectionnee();
  }

  initForm() {
    this.profilForm = this.formBuilder.group({
      id: [this.profilAModifier['id_utilisateur']],
      email: [this.profilAModifier['email'], [Validators.required, Validators.email]],
      //email: [this.profilAModifier['email'], Validators.required],
      nom: [this.profilAModifier['nom'], Validators.required],
      prenom: [this.profilAModifier['prenom'], Validators.required],
      age: [this.profilAModifier['age']],
      nbKilometresCumules: [this.profilAModifier['nbKilometresCumules']],
      estConnecte: [this.profilAModifier['estConnecte']],
      estAdmin: [this.profilAModifier['estAdmin']]
    });
  }

  resetProfilSelectionnee(){
    if(!this.modifierMDP){
      sessionStorage.removeItem('profilAModifier');
      sessionStorage.removeItem('profilAModifierStatus');
    }
  }

  modifierMdp(){
    //sessionStorage.setItem('profilAModifier', JSON.stringify(this.profilAModifier));
    this.modifierMDP = true;
    this.router.navigate(['/profil/motdepasse']);
  }

  onSubmitForm() {
    const formValue = this.profilForm.value;
    let avecAge = false;
    

    if(formValue['email'] != this.profilAModifier['email']){
      this.profilModifie = true;
    }
    if(formValue['nom'] != this.profilAModifier['nom']){
      this.profilModifie = true;
    }
    if(formValue['prenom'] != this.profilAModifier['prenom']){
      this.profilModifie = true;
    }
    if(formValue['age'] != '' && formValue['age'] != this.profilAModifier['age']){
      this.profilModifie = true;
      avecAge = true;
    }
    if(this.profilAModifier['age'] != null && formValue['age'] == ''){
      this.profilModifie = true;
      avecAge = true;
    }
    if(this.modifierUtilisateur){
      if(formValue['nbKilometresCumules'] != this.profilAModifier['nbKilometresCumules']){
        this.profilModifie = true;
        if(formValue['nbKilometresCumules'] == null){
          formValue['nbKilometresCumules'] = 0;
        }
      }
      if(formValue['estConnecte'] != this.profilAModifier['estConnecte']){
        this.profilModifie = true;
      }
      if(formValue['estAdmin'] != this.profilAModifier['estAdmin']){
        this.profilModifie = true;
      }
    }

    if(this.profilModifie){
      let utilisateurModifie:Utilisateur;
      if(this.modifierUtilisateur){
        utilisateurModifie = new Utilisateur(
          this.profilAModifier['id_utilisateur'],
          formValue['email'],
          this.profilAModifier['password'],
          formValue['nom'],
          formValue['prenom'],
          formValue['age'],
          formValue['nbKilometresCumules'],
          formValue['estConnecte'],
          formValue['estAdmin']
        );
      }
      else{
        utilisateurModifie = new Utilisateur(
          this.profilAModifier['id_utilisateur'],
          formValue['email'],
          this.profilAModifier['password'],
          formValue['nom'],
          formValue['prenom'],
          formValue['age'],
          this.profilAModifier['nbKilometresCumules'],
          this.profilAModifier['estConnecte'],
          this.profilAModifier['estAdmin']
        );
      }
      
      if(formValue['email'] != this.profilAModifier['email']){
        this.utilisateurService.getByEmail(utilisateurModifie)
        .then((response) => {
          if(response.length > 0){
            alert("Cet email n'est plus disponible");
          }
          else{
            if(avecAge){
              this.utilisateurService.modifierUtilisateur(utilisateurModifie, true, false)
                .then((resp) => {
                  this.statistiqueService.majKilometresCumules(utilisateurModifie.id_utilisateur)
                  .then(()=>{
                    //alert("profil modifié!");
                    if(this.modifierUtilisateur){
                      this.router.navigate(['/utilisateurs']);
                    }
                    else{
                      this.router.navigate(['/']);
                    }
                  });
                });
            }
            else{
              this.utilisateurService.modifierUtilisateur(utilisateurModifie, false, false)
                .then((resp) => {
                  this.statistiqueService.majKilometresCumules(utilisateurModifie.id_utilisateur)
                    .then(()=>{
                      //alert("profil modifié!");
                      if(this.modifierUtilisateur){
                        this.router.navigate(['/utilisateurs']);
                      }
                      else{
                        this.router.navigate(['/']);
                      }
                    });
                });
            }
          }
        });
      }
      else{
        if(avecAge){
          this.utilisateurService.modifierUtilisateur(utilisateurModifie, true, false)
            .then((resp) => {
              this.statistiqueService.majKilometresCumules(utilisateurModifie.id_utilisateur)
                .then(()=>{
                  //alert("profil modifié!");
                  if(this.modifierUtilisateur){
                    this.router.navigate(['/utilisateurs']);
                  }
                  else{
                    this.router.navigate(['/']);
                  }
                });
            });
        }
        else{
          this.utilisateurService.modifierUtilisateur(utilisateurModifie, false, false)
            .then((resp) => {
              this.statistiqueService.majKilometresCumules(utilisateurModifie.id_utilisateur)
                .then(()=>{
                  //alert("profil modifié!");
                  if(this.modifierUtilisateur){
                    this.router.navigate(['/utilisateurs']);
                  }
                  else{
                    this.router.navigate(['/']);
                  }
                });
            });
        }
      }
    }
  }
}
