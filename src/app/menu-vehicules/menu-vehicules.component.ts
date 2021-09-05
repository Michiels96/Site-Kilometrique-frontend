import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Emitters } from '../emitters/emitters';
import { Utilisateur } from '../models/Utilisateur.model';
import { Vehicule } from '../models/Vehicule.model';
import { UtilisateurService } from '../services/utilisateur.service';
import { VehiculeService } from '../services/vehicule.service';

@Component({
  selector: 'app-menu-vehicules',
  templateUrl: './menu-vehicules.component.html',
  styleUrls: ['./menu-vehicules.component.css']
})
export class MenuVehiculesComponent implements OnInit, OnDestroy {

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

  constructor(private vehiculeService: VehiculeService, private router: Router, private utilisateurService: UtilisateurService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentMenuVehicules");
    
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
      }
    );
    //this.vehiculeService.emitListeVehiculesSubject();
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
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
