import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { Emitters } from '../../emitters/emitters';
import { Marque } from '../../models/Marque.model';
import { MarqueService } from '../../services/marque.service';
import { ReloadService } from '../../services/component-reload.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-marque',
  templateUrl: './marque.component.html',
  styleUrls: ['./marque.component.css']
})
export class MarqueComponent implements OnInit, OnDestroy {
  private reloadSubscription: Subscription;

  // language terms
  brand_modify: string;
  brand_unique_name: string;
  brand_name: string;
  brand_create: string;
  brand_back_home: string;

  marqueAModifier:any = null;
  marqueForm: FormGroup;
  nouvelleMarque: boolean = false;

  constructor(private router: Router, private formBuilder: FormBuilder, private marqueService: MarqueService, private utilisateurService:UtilisateurService, private reloadService: ReloadService, private languageService: LanguageService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentMarque");
    // Observable to reload from 'nav' component when there is a language change
    this.reloadSubscription = this.reloadService.getReloadObservable().subscribe((reload) => {
      if (reload) {
        this.setLanguageTerms();
      }
    });
    // modifier une marque
    if(sessionStorage.getItem('marqueAModifier') != null){
      this.marqueAModifier = JSON.parse(sessionStorage.getItem('marqueAModifier'));
      this.initFormModification();
    }
    //ajouter une nouvelle marque
    if(sessionStorage.getItem('marqueAAjouter') != null){
      this.nouvelleMarque = true;
      this.initFormCreation();
    }
    if(sessionStorage.getItem('marqueAModifier') == null && sessionStorage.getItem('marqueAAjouter') == null){
      this.router.navigate(['/marques']);
    }
    this.setLanguageTerms();
  }

  setLanguageTerms(){
    let french_lib = this.languageService.getFrenchLib();
    if (this.languageService.getSelectedLanguage() == 'fr'){
      this.brand_modify = french_lib['marque']['brand_modify'];
      this.brand_unique_name = french_lib['marque']['brand_unique_name'];
      this.brand_name = french_lib['marque']['brand_name'];
      this.brand_create = french_lib['marque']['brand_create'];
      this.brand_back_home = french_lib['marque']['brand_back_home'];
    }

    let english_lib = this.languageService.getEnglishLib();
    if (this.languageService.getSelectedLanguage() == 'en'){
      this.brand_modify = english_lib['marque']['brand_modify'];
      this.brand_unique_name = english_lib['marque']['brand_unique_name'];
      this.brand_name = english_lib['marque']['brand_name'];
      this.brand_create = english_lib['marque']['brand_create'];
      this.brand_back_home = english_lib['marque']['brand_back_home'];
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    // delete the observable to avoid component memory leak
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
    this.resetMarqueSessionMemory();
  }

  initFormModification() {
    this.marqueForm = this.formBuilder.group({
      id: [this.marqueAModifier['id_marque'], Validators.required],
      nom: [this.marqueAModifier['nom_unique'], Validators.required]
    });
  }

  initFormCreation() {
    this.marqueForm = this.formBuilder.group({
      nom: ['', Validators.required]
    });
  }

  onSubmitForm(){
    // le cas d'une modification
    if(!this.nouvelleMarque){
      const formValue = this.marqueForm.value;
      if(formValue['nom'] != this.marqueAModifier['nom_unique']){
        let marqueModifiee = new Marque(
          this.marqueAModifier['id_marque'],
          formValue['nom']
        );
        this.marqueService.getByNomUnique(marqueModifiee.nom_unique, this.utilisateurService.getInfoUtilisateur().id_utilisateur)
          .then((response) => {
            if(response.length > 0){
              alert("Ce nom n'est plus disponible");
            }
            else{
              this.marqueService.modifierMarque(marqueModifiee, this.utilisateurService.getInfoUtilisateur().id_utilisateur)
              .then((resp) => {
                sessionStorage.removeItem('marqueAModifier');
                this.marqueService.getMarquesFromServer(this.utilisateurService.getInfoUtilisateur().id_utilisateur);
                this.router.navigate(['/marques']);
              });
            }
          });
      }
    }
    // le cas d'une création
    else{
      const formValue = this.marqueForm.value;
      let nouvelleMarque = new Marque(
        formValue['nom']
      );
      this.marqueService.getByNomUnique(nouvelleMarque.nom_unique, this.utilisateurService.getInfoUtilisateur().id_utilisateur)
        .then((response) => {
          if(response.length > 0){
            alert("Ce nom n'est plus disponible");
          }
          else{
            this.marqueService.ajouterMarque(nouvelleMarque, this.utilisateurService.getInfoUtilisateur().id_utilisateur)
            .then((resp) => {
              this.marqueService.getMarquesFromServer(this.utilisateurService.getInfoUtilisateur().id_utilisateur);
              this.router.navigate(['/marques']);
            });
          }
        });
    }
  }

  resetMarqueSessionMemory(){
    sessionStorage.removeItem('marqueAModifier');
    sessionStorage.removeItem('marqueAAjouter');
  }

}
