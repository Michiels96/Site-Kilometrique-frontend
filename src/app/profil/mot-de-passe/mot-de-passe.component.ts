import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from '../../emitters/emitters';
import { Utilisateur } from '../../models/Utilisateur.model';
import { UtilisateurService } from '../../services/utilisateur.service';

@Component({
  selector: 'app-mot-de-passe',
  templateUrl: './mot-de-passe.component.html',
  styleUrls: ['./mot-de-passe.component.css']
})
export class MotDePasseComponent implements OnInit, OnDestroy {
  profilAModifier:any = null;
  modifierUtilisateur: boolean = false;
  private retourProfil: boolean = false;

  motDePasseForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private utilisateurService: UtilisateurService) {}

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentMotDePasse");
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
