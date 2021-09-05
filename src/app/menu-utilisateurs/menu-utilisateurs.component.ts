import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Emitters } from '../emitters/emitters';
import { UtilisateurService } from '../services/utilisateur.service';

@Component({
  selector: 'app-menu-utilisateurs',
  templateUrl: './menu-utilisateurs.component.html',
  styleUrls: ['./menu-utilisateurs.component.css']
})
export class MenuUtilisateursComponent implements OnInit, OnDestroy {

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
  
  constructor(private router: Router, private utilisateurService: UtilisateurService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentMenuUtilisateurs");
    
    this.utilisateurService.getUtilisateursFromServer();
    this.utilisateurSubscription = this.utilisateurService.utilisateursSubject.subscribe(
      (utilisateurs: any[]) => {
        this.utilisateurs = utilisateurs;
        this.nbUtilisateurs = utilisateurs.length;
      }
    );
    //this.utilisateurService.emitListeUtilisateursSubject();
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
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
