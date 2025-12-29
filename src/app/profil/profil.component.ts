import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitters';
import { Utilisateur } from '../models/Utilisateur.model';
import { StatistiqueService } from '../services/statistique.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  profilAModifier:any = null;

  profilForm: FormGroup;
  private profilModifie: boolean = false;
  modifierUtilisateur: boolean = false;
  modifierMDP: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private languageService: LanguageService, private utilisateurService: UtilisateurService, private statistiqueService: StatistiqueService, private translateService: TranslateService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentProfil");
    if(sessionStorage.getItem('profilAModifierStatus') != null && sessionStorage.getItem('profilAModifierStatus') == "oui"){
      this.modifierUtilisateur = true;
    }
    this.profilAModifier = JSON.parse(sessionStorage.getItem('profilAModifier'));
    this.initForm();
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    this.resetProfilSelectionnee();
  }

  initForm() {
    this.profilForm = this.formBuilder.group({
      id: [this.profilAModifier['id_utilisateur']],
      email: [this.profilAModifier['email'], [Validators.required, Validators.email]],
      nom: [this.profilAModifier['nom'], Validators.required],
      prenom: [this.profilAModifier['prenom'], Validators.required],
      date_naissance: [this.profilAModifier['date_naissance']],
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
    let avecDateNaissance = false;
    

    if(formValue['email'] != this.profilAModifier['email']){
      this.profilModifie = true;
    }
    if(formValue['nom'] != this.profilAModifier['nom']){
      this.profilModifie = true;
    }
    if(formValue['prenom'] != this.profilAModifier['prenom']){
      this.profilModifie = true;
    }
    if(formValue['date_naissance'] != '' && formValue['date_naissance'] != this.profilAModifier['date_naissance']){
      this.profilModifie = true;
      avecDateNaissance = true;
    }
    if(this.profilAModifier['date_naissance'] != null && formValue['date_naissance'] == ''){
      this.profilModifie = true;
      avecDateNaissance = true;
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
          formValue['date_naissance'],
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
          formValue['date_naissance'],
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
            if(avecDateNaissance){
              this.utilisateurService.modifierUtilisateur(utilisateurModifie, avecDateNaissance, false)
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
              this.utilisateurService.modifierUtilisateur(utilisateurModifie, avecDateNaissance, false)
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
        if(avecDateNaissance){
          this.utilisateurService.modifierUtilisateur(utilisateurModifie, avecDateNaissance, false)
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
          this.utilisateurService.modifierUtilisateur(utilisateurModifie, avecDateNaissance, false)
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
