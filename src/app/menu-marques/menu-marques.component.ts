import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Emitters } from '../emitters/emitters';
import { MarqueService } from '../services/marque.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { LanguageService } from '../services/language.service';
import { ReloadService } from '../services/component-reload.service';

@Component({
  selector: 'app-menu-marques',
  templateUrl: './menu-marques.component.html',
  styleUrls: ['./menu-marques.component.css']
})
export class MenuMarquesComponent implements OnInit, OnDestroy {
  private reloadSubscription: Subscription;
  marques:any = [{}];
  marquesSubscription: Subscription;
  nbMarques: number;

  // tri (ASC/DESC)
  triId: string = "";
  triNomUnique: string = "";
  triNbVehicules: string = "";

  marquesASupprimer = [];

  // language terms
  brands_title: string;
  brands_num_alt: string;
  brands_name: string;
  brands_name_alt: string;
  brands_num_vhs: string;
  brands_num_vhs_alt: string;
  brands_del: string;
  brands_total: string;
  brands_empty: string;
  brands_add: string;
  brands_back_home: string;

  constructor(private router: Router, private marqueService: MarqueService, private utilisateurService: UtilisateurService, private reloadService: ReloadService, private languageService: LanguageService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentMenuMarques");
    // Observable to reload from 'nav' component when there is a language change
    this.reloadSubscription = this.reloadService.getReloadObservable().subscribe((reload) => {
      if (reload) {
        this.setLanguageTerms();
      }
    });
    this.marquesSubscription = this.marqueService.marqueSubject.subscribe(
      (marques: any[]) => {
        this.marques = marques;
        this.nbMarques = this.marques.length+1;
        this.setLanguageTerms();
      }
    );
    this.marqueService.emitListeMarquesSubject();
  }

  setLanguageTerms(){
    let french_lib = this.languageService.getFrenchLib();
    if (this.languageService.getSelectedLanguage() == 'fr'){
      this.brands_title = french_lib['marques']['brands_title'];
      this.brands_num_alt = french_lib['marques']['brands_num_alt'];
      this.brands_name = french_lib['marques']['brands_name'];
      this.brands_name_alt = french_lib['marques']['brands_name_alt'];
      this.brands_num_vhs = french_lib['marques']['brands_num_vhs'];
      this.brands_num_vhs_alt = french_lib['marques']['brands_num_vhs_alt'];
      this.brands_del = french_lib['marques']['brands_del'];
      this.brands_total = "Total : "+this.nbMarques+" marque";
      this.brands_empty = french_lib['marques']['brands_empty'];
      this.brands_add = french_lib['marques']['brands_add'];
      this.brands_back_home = french_lib['marques']['brands_back_home'];
    }

    let english_lib = this.languageService.getEnglishLib();
    if (this.languageService.getSelectedLanguage() == 'en'){
      this.brands_title = english_lib['marques']['brands_title'];
      this.brands_num_alt = english_lib['marques']['brands_num_alt'];
      this.brands_name = english_lib['marques']['brands_name'];
      this.brands_name_alt = english_lib['marques']['brands_name_alt'];
      this.brands_num_vhs = english_lib['marques']['brands_num_vhs'];
      this.brands_num_vhs_alt = english_lib['marques']['brands_num_vhs_alt'];
      this.brands_del = english_lib['marques']['brands_del'];
      this.brands_total = "Total : "+this.nbMarques+" brand";
      this.brands_empty = english_lib['marques']['brands_empty'];
      this.brands_add = english_lib['marques']['brands_add'];
      this.brands_back_home = english_lib['marques']['brands_back_home'];
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    // delete the observable to avoid component memory leak
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }

  onEvent(event) {
    event.stopPropagation();
  }

  auMoinsUnASupprimer(){
    if(confirm("Etes vous sur de vouloir supprimer ces marques?\n(Les véhicules possédant ces marques seront aussi supprimées)")){
      this.marqueService.supprimerMarque(this.marquesASupprimer, this.utilisateurService.getInfoUtilisateur().id_utilisateur)
        .then((response) => {
          if(response['status'] == "ok"){
            this.marqueService.triParId("ASC", this.utilisateurService.getInfoUtilisateur().id_utilisateur);
          }
          else{
            console.log("erreur de suppression marque: "+JSON.stringify(response));
          }
        }).catch((err) => {console.log("Erreur : "+err)});
    }
  }

  checkAdminStatus(){
    if(this.utilisateurService.getInfoUtilisateur().estAdmin){
      return true;
    }
    return false;
  }

  aSupprimer(id_marque:number){
    if(this.marquesASupprimer.includes(id_marque)){
      const index = this.marquesASupprimer.indexOf(id_marque, 0);
      if(index > -1){
        this.marquesASupprimer.splice(index, 1);
      }
    }
    else{
      this.marquesASupprimer.push(id_marque);
    }
  }

  nouvelleMarque(){
    sessionStorage.setItem('marqueAAjouter', "oui");
    this.router.navigate(['/marques/marque']);
  }

  modifierMarque(marque: any){
    sessionStorage.setItem('marqueAModifier', JSON.stringify(marque));
    this.router.navigate(['/marques/marque']);
  }

  rafraichir(){
    this.marqueService.triParId("ASC", this.utilisateurService.getInfoUtilisateur().id_utilisateur);
  }

  demandeDeTriId(){
    this.triNomUnique = "";
    this.triNbVehicules = "";
    //descending
    if(this.triId == ""){
      this.triId = "DESC";
      this.marqueService.triParId("DESC", this.utilisateurService.getInfoUtilisateur().id_utilisateur);
    }
    //ascending
    else if(this.triId == "DESC"){
      this.triId = "ASC";
      this.marqueService.triParId("ASC", this.utilisateurService.getInfoUtilisateur().id_utilisateur);
    }
    //descending
    else{
      this.triId = "DESC";
      this.marqueService.triParId("DESC", this.utilisateurService.getInfoUtilisateur().id_utilisateur);
    }
  }

  demandeDeTriNomUnique(){
    this.triId = "";
    this.triNbVehicules = "";
    if(this.triNomUnique == ""){
      this.triNomUnique = "DESC";
      this.marqueService.triParNomUnique("DESC", this.utilisateurService.getInfoUtilisateur().id_utilisateur);
    }
    else if(this.triNomUnique == "DESC"){
      this.triNomUnique = "ASC";
      this.marqueService.triParNomUnique("ASC", this.utilisateurService.getInfoUtilisateur().id_utilisateur);
    }
    else{
      this.triNomUnique = "DESC";
      this.marqueService.triParNomUnique("DESC", this.utilisateurService.getInfoUtilisateur().id_utilisateur);
    }
  }

  demandeDeTriNbVehicules(){
    this.triId = "";
    this.triNomUnique = "";
    if(this.triNbVehicules == ""){
      this.triNbVehicules = "DESC";
      this.marqueService.triNbVehicules("DESC", this.utilisateurService.getInfoUtilisateur().id_utilisateur);
    }
    else if(this.triNbVehicules == "DESC"){
      this.triNbVehicules = "ASC";
      this.marqueService.triNbVehicules("ASC", this.utilisateurService.getInfoUtilisateur().id_utilisateur);
    }
    else{
      this.triNbVehicules = "DESC";
      this.marqueService.triNbVehicules("DESC", this.utilisateurService.getInfoUtilisateur().id_utilisateur);
    }
  }
}
