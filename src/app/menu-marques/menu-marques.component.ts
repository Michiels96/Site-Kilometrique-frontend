import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Emitters } from '../emitters/emitters';
import { MarqueService } from '../services/marque.service';
import { UtilisateurService } from '../services/utilisateur.service';

@Component({
  selector: 'app-menu-marques',
  templateUrl: './menu-marques.component.html',
  styleUrls: ['./menu-marques.component.css']
})
export class MenuMarquesComponent implements OnInit, OnDestroy {

  marques:any = [{}];
  marquesSubscription: Subscription;
  nbMarques: number;

  // tri (ASC/DESC)
  triId: string = "";
  triNomUnique: string = "";
  triNbVehicules: string = "";

  marquesASupprimer = [];

  constructor(private router: Router, private marqueService: MarqueService, private utilisateurService: UtilisateurService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentMenuMarques");
    this.marquesSubscription = this.marqueService.marqueSubject.subscribe(
      (marques: any[]) => {
        this.marques = marques;
        this.nbMarques = this.marques.length;
      }
    );
    this.marqueService.emitListeMarquesSubject();
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
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
