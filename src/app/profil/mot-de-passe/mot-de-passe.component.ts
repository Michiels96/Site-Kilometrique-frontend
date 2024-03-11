import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from '../../emitters/emitters';
import { Utilisateur } from '../../models/Utilisateur.model';
import { UtilisateurService } from '../../services/utilisateur.service';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';
import { ReloadService } from '../../services/component-reload.service';

@Component({
  selector: 'app-mot-de-passe',
  templateUrl: './mot-de-passe.component.html',
  styleUrls: ['./mot-de-passe.component.css']
})
export class MotDePasseComponent implements OnInit, OnDestroy {
  private reloadSubscription: Subscription;

  profilAModifier:any = null;
  modifierUtilisateur: boolean = false;
  private retourProfil: boolean = false;

  motDePasseForm: FormGroup;

  // language terms
  passwd_title: string;
  passwd_legend: string;
  passwd_placeholder: string;
  passwd_confirm: string;
  passwd_back_profile: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private utilisateurService: UtilisateurService, private reloadService: ReloadService, private languageService: LanguageService) {}

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentMotDePasse");
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
    this.setLanguageTerms();
  }

  setLanguageTerms(){
    let french_lib = this.languageService.getFrenchLib();
    if (this.languageService.getSelectedLanguage() == 'fr'){
      this.passwd_title = french_lib['mot-de-passe']['passwd_title'];
      this.passwd_legend = french_lib['mot-de-passe']['passwd_legend'];
      this.passwd_placeholder = french_lib['mot-de-passe']['passwd_placeholder'];
      this.passwd_confirm = french_lib['mot-de-passe']['passwd_confirm'];
      this.passwd_back_profile = french_lib['mot-de-passe']['passwd_back_profile'];
    }

    let english_lib = this.languageService.getEnglishLib();
    if (this.languageService.getSelectedLanguage() == 'en'){
      this.passwd_title = english_lib['mot-de-passe']['passwd_title'];
      this.passwd_legend = english_lib['mot-de-passe']['passwd_legend'];
      this.passwd_placeholder = english_lib['mot-de-passe']['passwd_placeholder'];
      this.passwd_confirm = english_lib['mot-de-passe']['passwd_confirm'];
      this.passwd_back_profile = english_lib['mot-de-passe']['passwd_back_profile'];
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
    this.motDePasseForm = this.formBuilder.group({
      mdp: ['']
    });
  }

  resetProfilSelectionnee(){
    if(!this.retourProfil){
      sessionStorage.removeItem('profilAModifier');
      sessionStorage.removeItem('profilAModifierStatus');
    }
  }

  retourProfilFct(){
    this.retourProfil = true;
    this.router.navigate(['/profil']);
  }

  onSubmitForm(){
    const formValue = this.motDePasseForm.value;
    if(formValue['mdp'] != ''){
      let utilisateurModifie = new Utilisateur(
        this.profilAModifier['id_utilisateur'],
        this.profilAModifier['email'],
        formValue['mdp'],
        this.profilAModifier['nom'],
        this.profilAModifier['prenom'],
        this.profilAModifier['age'],
        this.profilAModifier['nbKilometresCumules'],
        this.profilAModifier['estConnecte'],
        this.profilAModifier['estAdmin']
      );

      this.utilisateurService.modifierUtilisateur(utilisateurModifie, false, true)
        .then((resp) => {
            //alert("profil modifié!");
            if(this.modifierUtilisateur){
              this.router.navigate(['/utilisateurs']);
            }
            else{
              this.router.navigate(['/']);
            }
        });
    }
  }

}
