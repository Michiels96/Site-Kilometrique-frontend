import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Emitters } from '../emitters/emitters';
import { Utilisateur } from '../models/Utilisateur.model';
import { Vehicule } from '../models/Vehicule.model';
import { UtilisateurService } from '../services/utilisateur.service';
import { VehiculeService } from '../services/vehicule.service';
import { LanguageService } from '../services/language.service';
import { ReloadService } from '../services/component-reload.service';

@Component({
  selector: 'app-menu-vehicules',
  templateUrl: './menu-vehicules.component.html',
  styleUrls: ['./menu-vehicules.component.css']
})
export class MenuVehiculesComponent implements OnInit, OnDestroy {
  private reloadSubscription: Subscription;

  vehicules:any = [{}];
  vehiculeSubscription: Subscription;
  nbVehicules: number;

  vehiculesASupprimer = [];

  // Pour le select (uniquement dispo pour un administrateur)
  utilisateurs:any = [{}];
  utilisateurSubscription: Subscription;
  selectedOption: string;
  utilisateurSelectionne: Utilisateur = null;

  // tri (ASC/DESC)
  triId: string = "";
  triType: string = "";
  triNomUnique: string = "";
  triMarque: string = "";
  triDetail: string = "";

  // language terms
  vhs_title: string;
  vhs_user_menu: string;
  vhs_num_alt: string;
  vhs_name: string;
  vhs_name_alt: string;
  vhs_brand: string;
  vhs_brand_alt: string;
  vhs_type: string;
  vhs_type_alt: string;
  vhs_detail: string;
  vhs_detail_alt: string;
  vhs_del: string;
  vhs_total: string;
  vhs_empty_total: string;
  vhs_add_vh: string;
  vhs_back_home: string;

  constructor(private vehiculeService: VehiculeService, private router: Router, private utilisateurService: UtilisateurService, private reloadService: ReloadService, private languageService: LanguageService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentMenuVehicules");
    // Observable to reload from 'nav' component when there is a language change
    this.reloadSubscription = this.reloadService.getReloadObservable().subscribe((reload) => {
      if (reload) {
        this.setLanguageTerms();
      }
    });

    this.utilisateurService.getUtilisateursFromServer();
    this.utilisateurSubscription = this.utilisateurService.utilisateursSubject.subscribe(
      (utilisateurs: any[]) => {
        this.utilisateurs = utilisateurs;
        //this.chargerListVehiculesUtilisateur(this.utilisateurs[0]['id_utilisateur']);
        this.chargerListeVehiculesUtilisateur(this.utilisateurService.getInfoUtilisateur().id_utilisateur+"");
      }
    );
    //this.utilisateurService.emitListeUtilisateursSubject();

    this.vehiculeSubscription = this.vehiculeService.vehiculesSubject.subscribe(
      (vehicules: any[]) => {
        this.vehicules = vehicules;
        this.nbVehicules = this.vehicules.length;
        this.setLanguageTerms();
      }
    );
    //this.vehiculeService.emitListeVehiculesSubject();
    this.setLanguageTerms();
  }

  setLanguageTerms(){
    let french_lib = this.languageService.getFrenchLib();
    if (this.languageService.getSelectedLanguage() == 'fr'){
      this.vhs_title = french_lib['vehicule']['vhs_title'];
      this.vhs_user_menu = french_lib['vehicule']['vhs_user_menu'];
      this.vhs_num_alt = french_lib['vehicule']['vhs_num_alt'];
      this.vhs_name = french_lib['vehicule']['vhs_name'];
      this.vhs_name_alt = french_lib['vehicule']['vhs_name_alt'];
      this.vhs_brand = french_lib['vehicule']['vhs_brand'];
      this.vhs_brand_alt = french_lib['vehicule']['vhs_brand_alt'];
      this.vhs_type = french_lib['vehicule']['vhs_type'];
      this.vhs_type_alt = french_lib['vehicule']['vhs_type_alt'];
      this.vhs_detail = french_lib['vehicule']['vhs_detail'];
      this.vhs_detail_alt = french_lib['vehicule']['vhs_detail_alt'];
      this.vhs_del = french_lib['vehicule']['vhs_del'];
      this.vhs_total = "Total : "+this.nbVehicules+" véhicule";
      this.vhs_empty_total = french_lib['vehicule']['vhs_empty_total'];
      this.vhs_add_vh = french_lib['vehicule']['vhs_add_vh'];
      this.vhs_back_home = french_lib['vehicule']['vhs_back_home'];
    }

    let english_lib = this.languageService.getEnglishLib();
    if (this.languageService.getSelectedLanguage() == 'en'){
      this.vhs_title = english_lib['vehicule']['vhs_title'];
      this.vhs_user_menu = english_lib['vehicule']['vhs_user_menu'];
      this.vhs_num_alt = english_lib['vehicule']['vhs_num_alt'];
      this.vhs_name = english_lib['vehicule']['vhs_name'];
      this.vhs_name_alt = english_lib['vehicule']['vhs_name_alt'];
      this.vhs_brand = english_lib['vehicule']['vhs_brand'];
      this.vhs_brand_alt = english_lib['vehicule']['vhs_brand_alt'];
      this.vhs_type = english_lib['vehicule']['vhs_type'];
      this.vhs_type_alt = english_lib['vehicule']['vhs_type_alt'];
      this.vhs_detail = english_lib['vehicule']['vhs_detail'];
      this.vhs_detail_alt = english_lib['vehicule']['vhs_detail_alt'];
      this.vhs_del = english_lib['vehicule']['vhs_del'];
      this.vhs_total = "Total : "+this.nbVehicules+" vehicle";
      this.vhs_empty_total = english_lib['vehicule']['vhs_empty_total'];
      this.vhs_add_vh = english_lib['vehicule']['vhs_add_vh'];
      this.vhs_back_home = english_lib['vehicule']['vhs_back_home'];
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    // delete the observable to avoid component memory leak
    if(this.reloadSubscription){
      this.reloadSubscription.unsubscribe();
    }
  }

  onEvent(event) {
    event.stopPropagation();
  }

  checkAdminStatus(){
    if(this.utilisateurService.getInfoUtilisateur().estAdmin){
      return true;
    }
    return false;
  }

  auMoinsUnASupprimer(){
    if(confirm("Etes vous sur de vouloir supprimer ces véhicules?")){
      this.vehiculeService.supprimerVehicule(this.vehiculesASupprimer)
        .then((response) => {
          if(response['status'] == "ok"){
            this.vehiculeService.triParId("ASC", this.utilisateurSelectionne.id_utilisateur);
          }
          else{
            console.log("erreur de suppression véhicule: "+JSON.stringify(response));
          }
        }).catch((err) => {console.log("Erreur : "+err)});
    }
  }

  aSupprimer(id_vehicule:number){
    if(this.vehiculesASupprimer.includes(id_vehicule)){
      const index = this.vehiculesASupprimer.indexOf(id_vehicule, 0);
      if(index > -1){
        this.vehiculesASupprimer.splice(index, 1);
      }
    }
    else{
      this.vehiculesASupprimer.push(id_vehicule);
    }
  }

  chargerListeVehiculesUtilisateur(id_utilisateur: string){
    this.triId = "";
    this.triNomUnique = "";
    this.triMarque = "";
    this.triType = "";
    this.triDetail = "";

    this.utilisateurService.getById(new Utilisateur(+id_utilisateur))
    .then((resp) => {
      this.utilisateurSelectionne = new Utilisateur(
        resp[0]['id_utilisateur'],
        resp[0]['email'],
        resp[0]['password'],
        resp[0]['nom'],
        resp[0]['prenom'],
        resp[0]['age'],
        resp[0]['nbKilometresCumule'],
        resp[0]['connecte'],
        resp[0]['estAdmin']
      );
      this.vehiculeService.getVehiculesFromServer(this.utilisateurSelectionne.id_utilisateur);
    });
  }

  modifierVehicule(vehicule:any){
    sessionStorage.setItem('vehiculeAModifier', JSON.stringify(vehicule));
    this.router.navigate(['/vehicules/vehicule']);
  }

  nouveauVehicule(){
    sessionStorage.setItem('vehiculeAAjouter', JSON.stringify(this.utilisateurSelectionne.id_utilisateur));
    this.router.navigate(['/vehicules/vehicule']);
  }

  rafraichir(){
    this.vehiculeService.triParId("ASC", this.utilisateurSelectionne.id_utilisateur);
  }
  
  demandeDeTriId(){
    this.triNomUnique = "";
    this.triMarque = "";
    this.triType = "";
    this.triDetail = "";
    //descending
    if(this.triId == ""){
      this.triId = "DESC";
      this.vehiculeService.triParId("DESC", this.utilisateurSelectionne.id_utilisateur);
    }
    //ascending
    else if(this.triId == "DESC"){
      this.triId = "ASC";
      this.vehiculeService.triParId("ASC", this.utilisateurSelectionne.id_utilisateur);
    }
    //descending
    else{
      this.triId = "DESC";
      this.vehiculeService.triParId("DESC", this.utilisateurSelectionne.id_utilisateur);
    }
  }

  demandeDeTriNomUnique(){
    this.triId = "";
    this.triMarque = "";
    this.triType = "";
    this.triDetail = "";
    if(this.triNomUnique == ""){
      this.triNomUnique = "DESC";
      this.vehiculeService.triParNomUnique("DESC", this.utilisateurSelectionne.id_utilisateur);
    }
    else if(this.triNomUnique == "DESC"){
      this.triNomUnique = "ASC";
      this.vehiculeService.triParNomUnique("ASC", this.utilisateurSelectionne.id_utilisateur);
    }
    else{
      this.triNomUnique = "DESC";
      this.vehiculeService.triParNomUnique("DESC", this.utilisateurSelectionne.id_utilisateur);
    }
  }

  demandeDeTriMarque(){
    this.triId = "";
    this.triNomUnique = "";
    this.triType = "";
    this.triDetail = "";
    if(this.triMarque == ""){
      this.triMarque = "DESC";
      this.vehiculeService.triParMarque("DESC", this.utilisateurSelectionne.id_utilisateur);
    }
    else if(this.triMarque == "DESC"){
      this.triMarque = "ASC";
      this.vehiculeService.triParMarque("ASC", this.utilisateurSelectionne.id_utilisateur);
    }
    else{
      this.triMarque = "DESC";
      this.vehiculeService.triParMarque("DESC", this.utilisateurSelectionne.id_utilisateur);
    }
  }

  demandeDeTriType(){
    this.triId = "";
    this.triNomUnique = "";
    this.triMarque = "";
    this.triDetail = "";
    if(this.triType == ""){
      this.triType = "DESC";
      this.vehiculeService.triParType("DESC", this.utilisateurSelectionne.id_utilisateur);
    }
    else if(this.triType == "DESC"){
      this.triType = "ASC";
      this.vehiculeService.triParType("ASC", this.utilisateurSelectionne.id_utilisateur);
    }
    else{
      this.triType = "DESC";
      this.vehiculeService.triParType("DESC", this.utilisateurSelectionne.id_utilisateur);
    }
  }

  demandeDeTriDetail(){
    this.triId = "";
    this.triNomUnique = "";
    this.triType = "";
    this.triMarque = "";
    if(this.triDetail == ""){
      this.triDetail = "DESC";
      this.vehiculeService.triParDetail("DESC", this.utilisateurSelectionne.id_utilisateur);
    }
    else if(this.triDetail == "DESC"){
      this.triDetail = "ASC";
      this.vehiculeService.triParDetail("ASC", this.utilisateurSelectionne.id_utilisateur);
    }
    else{
      this.triDetail = "DESC";
      this.vehiculeService.triParDetail("DESC", this.utilisateurSelectionne.id_utilisateur);
    }
  }
}
