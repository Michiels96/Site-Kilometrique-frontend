import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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

  // Validateur personnalisé pour empêcher les dates dans le futur
  dateNotInFutureValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Pas d'erreur si le champ est vide
    }

    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour comparer uniquement les dates

    if (inputDate > today) {
      return { futureDate: true };
    }

    return null;
  }

  // Méthode pour obtenir la date d'aujourd'hui au format YYYY-MM-DD
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDateForInput(date_naissance: any): string | null {
    if (!date_naissance) {
      return null;
    }

    // Si déjà au bon format YYYY-MM-DD, retourner tel quel
    if (typeof date_naissance === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date_naissance)) {
      return date_naissance;
    }

    // Si timestamp ISO (avec T), extraire la partie date
    if (typeof date_naissance === "string" && date_naissance.includes("T")) {
      return date_naissance.split("T")[0];
    }

    // Si string avec espaces (format MySQL), extraire la partie date
    if (typeof date_naissance === "string") {
      return date_naissance.split(" ")[0];
    }

    // Dernier recours: convertir en string
    const dateStr = String(date_naissance);
    if (dateStr.includes("T")) {
      return dateStr.split("T")[0];
    }
    if (dateStr.includes("-") && dateStr.includes(" ")) {
      return dateStr.split(" ")[0];
    }

    return null;
  }


calculateAge(date_naissance: any): number | null {    if (!date_naissance) {      return null;    }        const dateStr = this.formatDateForInput(date_naissance);    if (!dateStr) {      return null;    }        const birthDate = new Date(dateStr);    const today = new Date();        let age = today.getFullYear() - birthDate.getFullYear();    const monthDiff = today.getMonth() - birthDate.getMonth();        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {      age--;    }        return age;  }  initForm() {    this.profilForm = this.formBuilder.group({      id: [this.profilAModifier["id_utilisateur"]],      email: [this.profilAModifier["email"], [Validators.required, Validators.email]],      nom: [this.profilAModifier["nom"], Validators.required],      prenom: [this.profilAModifier["prenom"], Validators.required],      age: [this.calculateAge(this.profilAModifier["date_naissance"])],      date_naissance: [this.formatDateForInput(this.profilAModifier["date_naissance"]), [this.dateNotInFutureValidator.bind(this)]],      nbKilometresCumules: [this.profilAModifier["nbKilometresCumules"]],      estConnecte: [this.profilAModifier["estConnecte"]],      estAdmin: [this.profilAModifier["estAdmin"]]    });  }

  resetProfilSelectionnee(){
    if(!this.modifierMDP){
      sessionStorage.removeItem('profilAModifier');
      sessionStorage.removeItem('profilAModifierStatus');
    }
  }

  modifierMdp(){

    this.modifierMDP = true;
    this.router.navigate(['/profil/motdepasse']);
  }

  onSubmitForm() {
    // Vérifier si la date est dans le futur
    if (this.profilForm.get('date_naissance')?.hasError('futureDate')) {
      alert("La date de naissance ne peut pas être dans le futur");
      return;
    }

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
    if(formValue['date_naissance'] != '' && this.formatDateForInput(formValue['date_naissance']) != this.formatDateForInput(this.profilAModifier['date_naissance'])){
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