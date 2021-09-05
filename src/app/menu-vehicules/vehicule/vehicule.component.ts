import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { Emitters } from '../../emitters/emitters';
import { Vehicule } from '../../models/Vehicule.model';
import { MarqueService } from '../../services/marque.service';
import { TypeVehiculeService } from '../../services/type.service';
import { VehiculeService } from '../../services/vehicule.service';

@Component({
  selector: 'app-vehicule',
  templateUrl: './vehicule.component.html',
  styleUrls: ['./vehicule.component.css']
})
export class VehiculeComponent implements OnInit, OnDestroy {

  vehiculeAModifier:any = null;
  vehiculeModifiee:boolean = false;

  marques:any = [{}];
  marqueSubscription: Subscription;

  types:any = [];
  typeSubscription: Subscription;

  vehiculeForm: FormGroup;

  idUtilisateurNouveauVehicule: number = -1;


  constructor(private router: Router, private formBuilder: FormBuilder, private vehiculeService: VehiculeService, private marqueService: MarqueService, private typeVehiculeService: TypeVehiculeService, private utilisateurService:UtilisateurService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentVehicule");
    
    this.marqueSubscription = this.marqueService.marqueSubject.subscribe(
      (marques: any[]) => {
        this.marques = marques;
      }
    );
    this.marqueService.getMarquesFromServer(this.utilisateurService.getInfoUtilisateur().id_utilisateur);

    this.typeSubscription = this.typeVehiculeService.typeVehiculeSubject.subscribe(
      (types: any[]) => {
        this.types = types;
      }
    );
    this.typeVehiculeService.getTypesFromServer();
    //this.typeVehiculeService.emitListeTypesSubject();
    // modifier un vehicule
    if(sessionStorage.getItem('vehiculeAModifier') != null){
      this.vehiculeAModifier = JSON.parse(sessionStorage.getItem('vehiculeAModifier'));
      this.initFormModification();
    }
    //ajouter un vehicule
    if(sessionStorage.getItem('vehiculeAAjouter') != null){
      this.idUtilisateurNouveauVehicule = JSON.parse(sessionStorage.getItem('vehiculeAAjouter'));
      this.initFormCreation();
    }
    if(sessionStorage.getItem('vehiculeAModifier') == null && sessionStorage.getItem('vehiculeAAjouter') == null){
      this.router.navigate(['/vehicules']);
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    this.resetVehiculeSelectionnee();
  }

  initFormModification() {
    this.vehiculeForm = this.formBuilder.group({
      id: [this.vehiculeAModifier['id_vehicule'], Validators.required],
      nom: [this.vehiculeAModifier['nom_unique'], Validators.required],
      marque: [this.vehiculeAModifier['marque'], Validators.required],
      type: [this.vehiculeAModifier['type'], Validators.required],
      detail: [this.vehiculeAModifier['detail']]
    });
  }

  initFormCreation() {
    this.vehiculeForm = this.formBuilder.group({
      nom: ['', Validators.required],
      marque: ['', Validators.required],
      type: ['', Validators.required],
      detail: ['']
    });
  }

  onSubmitForm(){
    // le cas d'une modification
    if(this.idUtilisateurNouveauVehicule == -1){
      const formValue = this.vehiculeForm.value;

      if(formValue['nom'] != this.vehiculeAModifier['nom_unique']){
        this.vehiculeModifiee = true;
      }
      if(formValue['marque'] != this.vehiculeAModifier['marque']){
        this.vehiculeModifiee = true;
      }
      if(formValue['type'] != this.vehiculeAModifier['type']){
        this.vehiculeModifiee = true;
      }
      if(formValue['detail'] != this.vehiculeAModifier['detail']){
        this.vehiculeModifiee = true;
      }
      if(this.vehiculeModifiee){
        let vehiculeModifiee = new Vehicule(
          this.vehiculeAModifier['id_vehicule'],
          formValue['nom'],
          formValue['marque'],
          formValue['type'],
          formValue['detail']
        );
        if(vehiculeModifiee.nom_unique != this.vehiculeAModifier['nom_unique']){
          this.vehiculeService.getByNomUnique(vehiculeModifiee.nom_unique)
            .then((response) => {
              if(response.length > 0){
                alert("Ce nom n'est plus disponible");
              }
              else{
                this.vehiculeService.modifierVehicule(vehiculeModifiee)
                  .then((resp) => {
                    sessionStorage.removeItem('vehiculeAModifier');
                    this.marqueService.getMarquesFromServer(this.utilisateurService.getInfoUtilisateur().id_utilisateur);
                    this.router.navigate(['/vehicules']);
                  });
              }
            });
        }
        else{
          this.vehiculeService.modifierVehicule(vehiculeModifiee)
            .then((resp) => {
              sessionStorage.removeItem('vehiculeAModifier');
              this.marqueService.getMarquesFromServer(this.utilisateurService.getInfoUtilisateur().id_utilisateur);
              this.router.navigate(['/vehicules']);
            });
        }
      }
    }
    // le cas d'une création
    else{
      const formValue = this.vehiculeForm.value;
      let nouveauVehicule = new Vehicule(
        formValue['nom'],
        formValue['marque'],
        formValue['type'],
        formValue['detail']
      );
      this.vehiculeService.getByNomUnique(nouveauVehicule.nom_unique)
        .then((response) => {
          if(response.length > 0){
            alert("Ce nom n'est plus disponible");
          }
          else{
            if(formValue['detail'] == ''){
              nouveauVehicule.detail = null;
            }
            this.vehiculeService.ajouterVehicule(nouveauVehicule, this.idUtilisateurNouveauVehicule)
              .then((response) => {
                if(response['status'] == "OK"){
                  //console.log("inscrit")
                  //alert("Inscrit!");
                  this.marqueService.getMarquesFromServer(this.utilisateurService.getInfoUtilisateur().id_utilisateur);
                  this.router.navigate(["/vehicules"]);
                }
                else{
                  console.log("erreur d'inscription véhicule: "+JSON.stringify(response));
                }
              }).catch((err) => {console.log("Erreur : "+err)});
          }
        });
    }
  }

  resetVehiculeSelectionnee(){
    sessionStorage.removeItem('vehiculeAModifier');
    sessionStorage.removeItem('vehiculeAAjouter');
  }

}
