import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Emitters } from '../emitters/emitters';
import { UtilisateurService } from '../services/utilisateur.service';
import { LanguageService } from '../services/language.service';
import { ReloadService } from '../services/component-reload.service';

@Component({
  selector: 'app-menu-utilisateurs',
  templateUrl: './menu-utilisateurs.component.html',
  styleUrls: ['./menu-utilisateurs.component.css']
})
export class MenuUtilisateursComponent implements OnInit, OnDestroy {
  private reloadSubscription: Subscription;

  // language terms
  users_title: string;
  nbr_sort: string;
  users_email: string;
  users_email_sort: string;
  users_lastname: string;
  users_lastname_sort: string;
  users_firstname: string;
  users_firstname_sort: string;
  users_age: string;
  users_age_sort: string;
  users_cumulatedkms: string;
  users_cumulatedkms_sort: string;
  users_loggedin_status: string;
  users_loggedin_status_sort: string;
  users_is_admin: string;
  users_is_admin_sort: string;
  users_delete: string;
  users_nb_users: string;
  users_no_users: string;
  users_add_user: string;
  users_back_home: string;

  utilisateurs:any = [{}];
  utilisateurSubscription: Subscription;
  nbUtilisateurs: number = 0;

  // tri (ASC/DESC)
  triId: string = "";
  triEmail: string = "";
  triNom: string = "";
  triPrenom: string = "";
  triAge: string = "";
  triNbKilometresCumules: string = "";
  triEstConnecte: string = "";
  triEstAdmin: string = "";

  triPrecedentExistant: boolean = false;

  utilisateursASupprimer = [];
  
  constructor(private router: Router, private utilisateurService: UtilisateurService, private reloadService: ReloadService, private languageService: LanguageService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentMenuUtilisateurs");
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
        this.nbUtilisateurs = utilisateurs.length;
        this.setLanguageTerms();
      }
    );
    //this.utilisateurService.emitListeUtilisateursSubject();
  }

  setLanguageTerms(){
    let french_lib = this.languageService.getFrenchLib();
    if (this.languageService.getSelectedLanguage() == 'fr'){
      this.users_title = french_lib['menu-utilisateurs']['users_title'];
      this.nbr_sort = french_lib['menu-utilisateurs']['nbr_sort'];
      this.users_email = french_lib['menu-utilisateurs']['users_email'];
      this.users_email_sort = french_lib['menu-utilisateurs']['users_email_sort'];
      this.users_lastname = french_lib['menu-utilisateurs']['users_lastname'];
      this.users_lastname_sort = french_lib['menu-utilisateurs']['users_lastname_sort'];
      this.users_firstname = french_lib['menu-utilisateurs']['users_firstname'];
      this.users_firstname_sort = french_lib['menu-utilisateurs']['users_firstname_sort'];
      this.users_age = french_lib['menu-utilisateurs']['users_age'];
      this.users_age_sort = french_lib['menu-utilisateurs']['users_age_sort'];
      this.users_cumulatedkms = french_lib['menu-utilisateurs']['users_cumulatedkms'];
      this.users_cumulatedkms_sort = french_lib['menu-utilisateurs']['users_cumulatedkms_sort'];
      this.users_loggedin_status = french_lib['menu-utilisateurs']['users_loggedin_status'];
      this.users_loggedin_status_sort = french_lib['menu-utilisateurs']['users_loggedin_status_sort'];
      this.users_is_admin = french_lib['menu-utilisateurs']['users_is_admin'];
      this.users_is_admin_sort = french_lib['menu-utilisateurs']['users_is_admin_sort'];
      this.users_delete = french_lib['menu-utilisateurs']['users_delete'];
      if(this.nbUtilisateurs>1){
        this.users_nb_users = "Total: "+this.nbUtilisateurs+" utilisateurs inscrits dans le système"
      }else{
        this.users_nb_users = "Total: "+this.nbUtilisateurs+" utilisateur inscrit dans le système"
      }
      this.users_no_users = french_lib['menu-utilisateurs']['users_no_users'];
      this.users_add_user = french_lib['menu-utilisateurs']['users_add_user'];
      this.users_back_home = french_lib['menu-utilisateurs']['users_back_home'];
    }

    let english_lib = this.languageService.getEnglishLib();
    if (this.languageService.getSelectedLanguage() == 'en'){
      this.users_title = english_lib['menu-utilisateurs']['users_title'];
      this.nbr_sort = english_lib['menu-utilisateurs']['nbr_sort'];
      this.users_email = english_lib['menu-utilisateurs']['users_email'];
      this.users_email_sort = english_lib['menu-utilisateurs']['users_email_sort'];
      this.users_lastname = english_lib['menu-utilisateurs']['users_lastname'];
      this.users_lastname_sort = english_lib['menu-utilisateurs']['users_lastname_sort'];
      this.users_firstname = english_lib['menu-utilisateurs']['users_firstname'];
      this.users_firstname_sort = english_lib['menu-utilisateurs']['users_firstname_sort'];
      this.users_age = english_lib['menu-utilisateurs']['users_age'];
      this.users_age_sort = english_lib['menu-utilisateurs']['users_age_sort'];
      this.users_cumulatedkms = english_lib['menu-utilisateurs']['users_cumulatedkms'];
      this.users_cumulatedkms_sort = english_lib['menu-utilisateurs']['users_cumulatedkms_sort'];
      this.users_loggedin_status = english_lib['menu-utilisateurs']['users_loggedin_status'];
      this.users_loggedin_status_sort = english_lib['menu-utilisateurs']['users_loggedin_status_sort'];
      this.users_is_admin = english_lib['menu-utilisateurs']['users_is_admin'];
      this.users_is_admin_sort = english_lib['menu-utilisateurs']['users_is_admin_sort'];
      this.users_delete = english_lib['menu-utilisateurs']['users_delete'];
      if(this.nbUtilisateurs>1){
        this.users_nb_users = "Total: "+this.nbUtilisateurs+" users signed in"
      }else{
        this.users_nb_users = "Total: "+this.nbUtilisateurs+" user signed in"
      }
      this.users_no_users = english_lib['menu-utilisateurs']['users_no_users'];
      this.users_add_user = english_lib['menu-utilisateurs']['users_add_user'];
      this.users_back_home = english_lib['menu-utilisateurs']['users_back_home'];
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    // delete the observable to avoid component memory leak
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }

  onEvent(event){
    event.stopPropagation();
  }

  auMoinsUnASupprimer(){
    if(confirm("Etes-vous sur de vouloir supprimer ces utilisateurs?\n(Les véhicules possédés par ces utilisateurs ainsi que leur historique de navigation seront aussi supprimées)")){
      this.utilisateurService.supprimerUtilisateur(this.utilisateursASupprimer)
        .then((response) => {
          if(response['status'] == "ok"){
            this.utilisateurService.triParId("ASC");
          }
          else{
            console.log("erreur de suppression utilisateur: "+JSON.stringify(response));
          }
        }).catch((err) => {console.log("Erreur : "+err)});
    }
  }

  aSupprimer(id_utilisateur:number){
    if(this.utilisateursASupprimer.includes(id_utilisateur)){
      const index = this.utilisateursASupprimer.indexOf(id_utilisateur, 0);
      if(index > -1){
        this.utilisateursASupprimer.splice(index, 1);
      }
    }
    else{
      this.utilisateursASupprimer.push(id_utilisateur);
    }
  }

  nouvelUtilisateur(){
    sessionStorage.setItem('utilisateurAAjouter', "oui");
    this.router.navigate(['/inscription']);
  }

  modifierUtilisateur(utilisateur:any){
    sessionStorage.setItem('profilAModifier', JSON.stringify(utilisateur));
    sessionStorage.setItem('profilAModifierStatus', "oui");
    this.router.navigate(['/profil']);
  }

  rafraichir(){
    this.utilisateurService.triParId("ASC");
  }

  demandeDeTriId(){
    this.triEmail = "";
    this.triNom = "";
    this.triPrenom = "";
    this.triAge = "";
    this.triNbKilometresCumules = "";
    this.triEstConnecte = "";
    this.triEstAdmin = "";
    //descending
    if(this.triId == ""){
      this.triId = "DESC";
      this.utilisateurService.triParId("DESC");
    }
    //ascending
    else if(this.triId == "DESC"){
      this.triId = "ASC";
      this.utilisateurService.triParId("ASC");
    }
    //descending
    else{
      this.triId = "DESC";
      this.utilisateurService.triParId("DESC");
    }
  }

  demandeDeTriEmail(){
    this.triId = "";
    this.triNom = "";
    this.triPrenom = "";
    this.triAge = "";
    this.triNbKilometresCumules = "";
    this.triEstConnecte = "";
    this.triEstAdmin = "";
    if(this.triEmail == ""){
      this.triEmail = "DESC";
      this.utilisateurService.triParEmail("DESC");
    }
    else if(this.triEmail == "DESC"){
      this.triEmail = "ASC";
      this.utilisateurService.triParEmail("ASC");
    }
    else{
      this.triEmail = "DESC";
      this.utilisateurService.triParEmail("DESC");
    }
  }

  demandeDeTriNom(){
    this.triId = "";
    this.triEmail = "";
    this.triPrenom = "";
    this.triAge = "";
    this.triNbKilometresCumules = "";
    this.triEstConnecte = "";
    this.triEstAdmin = "";
    if(this.triNom == ""){
      this.triNom = "DESC";
      this.utilisateurService.triParNom("DESC");
    }
    else if(this.triNom == "DESC"){
      this.triNom = "ASC";
      this.utilisateurService.triParNom("ASC");
    }
    else{
      this.triNom = "DESC";
      this.utilisateurService.triParNom("DESC");
    }
  }

  demandeDeTriPrenom(){
    this.triId = "";
    this.triEmail = "";
    this.triNom = "";
    this.triAge = "";
    this.triNbKilometresCumules = "";
    this.triEstConnecte = "";
    this.triEstAdmin = "";
    if(this.triPrenom == ""){
      this.triPrenom = "DESC";
      this.utilisateurService.triParPrenom("DESC");
    }
    else if(this.triPrenom == "DESC"){
      this.triPrenom = "ASC";
      this.utilisateurService.triParPrenom("ASC");
    }
    else{
      this.triPrenom = "DESC";
      this.utilisateurService.triParPrenom("DESC");
    }
  }

  demandeDeTriAge(){
    this.triId = "";
    this.triEmail = "";
    this.triNom = "";
    this.triPrenom = "";
    this.triNbKilometresCumules = "";
    this.triEstConnecte = "";
    this.triEstAdmin = "";
    if(this.triAge == ""){
      this.triAge = "DESC";
      this.utilisateurService.triParAge("DESC");
    }
    else if(this.triAge == "DESC"){
      this.triAge = "ASC";
      this.utilisateurService.triParAge("ASC");
    }
    else{
      this.triAge = "DESC";
      this.utilisateurService.triParAge("DESC");
    }
  }

  demandeDeTriNbKilometresCumules(){
    this.triId = "";
    this.triEmail = "";
    this.triNom = "";
    this.triPrenom = "";
    this.triAge = "";
    this.triEstConnecte = "";
    this.triEstAdmin = "";
    if(this.triNbKilometresCumules == ""){
      this.triNbKilometresCumules = "DESC";
      this.utilisateurService.triParNbKilometresCumules("DESC");
    }
    else if(this.triNbKilometresCumules == "DESC"){
      this.triNbKilometresCumules = "ASC";
      this.utilisateurService.triParNbKilometresCumules("ASC");
    }
    else{
      this.triNbKilometresCumules = "DESC";
      this.utilisateurService.triParNbKilometresCumules("DESC");
    }
  }

  demandeDeTriEstConnecte(){
    this.triId = "";
    this.triEmail = "";
    this.triNom = "";
    this.triPrenom = "";
    this.triAge = "";
    this.triNbKilometresCumules = "";
    this.triEstAdmin = "";
    if(this.triEstConnecte == ""){
      this.triEstConnecte = "DESC";
      this.utilisateurService.triParEstConnecte("DESC");
    }
    else if(this.triEstConnecte == "DESC"){
      this.triEstConnecte = "ASC";
      this.utilisateurService.triParEstConnecte("ASC");
    }
    else{
      this.triEstConnecte = "DESC";
      this.utilisateurService.triParEstConnecte("DESC");
    }
  }

  demandeDeTriEstAdmin(){
    this.triId = "";
    this.triEmail = "";
    this.triNom = "";
    this.triPrenom = "";
    this.triAge = "";
    this.triNbKilometresCumules = "";
    this.triEstConnecte = "";
    if(this.triEstAdmin == ""){
      this.triEstAdmin = "DESC";
      this.utilisateurService.triParEstAdmin("DESC");
    }
    else if(this.triEstAdmin == "DESC"){
      this.triEstAdmin = "ASC";
      this.utilisateurService.triParEstAdmin("ASC");
    }
    else{
      this.triEstAdmin = "DESC";
      this.utilisateurService.triParEstAdmin("DESC");
    }
  }

}
