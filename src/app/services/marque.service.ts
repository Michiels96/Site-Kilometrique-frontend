import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Marque } from "../models/Marque.model";
import { IPService } from "./ip.service";
import { UtilisateurService } from "./utilisateur.service";


@Injectable()
export class MarqueService{
  private headers = {
    headers: new HttpHeaders({ 
      'Authorization': localStorage.getItem('sessionToken')
    })
  };
  marqueSubject = new Subject<any[]>();
  private marques = [{}];
  private IPBackend: string;
      
  constructor(private httpClient: HttpClient, private ipService: IPService, private utilisateurService:UtilisateurService){ 
      this.IPBackend = ipService.getIPBackend();
      this.getMarquesFromServer(utilisateurService.getInfoUtilisateur().id_utilisateur);
  }

  // informe tous les components abboné au service que un de ses attibuts à été maj.
  emitListeMarquesSubject(){
    this.marqueSubject.next(this.marques.slice());
  }

  getMarquesFromServer(id_utilisateur:number){
    let query = this.IPBackend+"/marques/";
    let params = new HttpParams().set('id_utilisateur', id_utilisateur);
    this.httpClient
      .get<any[]>(query, {headers: this.headers.headers, params})
      .subscribe(
        (resp) => {
          this.marques = resp;
          this.emitListeMarquesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }

  getByNomUnique(nomUnique: string, id_utilisateur:number){
    let query = this.IPBackend+"/marques/nomUnique/";
    const headers = {
        headers: new HttpHeaders({ 
          'Authorization': localStorage.getItem('sessionToken')
        })
      };
    let params = new HttpParams()
    .set('nom_unique', nomUnique)
    .set('id_utilisateur', id_utilisateur);
    return this.httpClient
        .get<any[]>(query, {headers: headers.headers, params: params})
        .toPromise();
  }

  ajouterMarque(marque:Marque, id_utilisateur:number){
    let query = this.IPBackend+"/marques/";
    let body = {
        'id_utilisateur': id_utilisateur,
        'nom_unique': marque.nom_unique, 
    };
    return this.httpClient
        .post<any[]>(query, body)
        .toPromise();
  }

  supprimerMarque(vehiculesID:number[], id_utilisateur:number){
    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    let query = this.IPBackend+"/marques/";
    let params = new HttpParams()
    .set('ids', JSON.stringify(vehiculesID))
    .set('id_utilisateur', id_utilisateur);
    return this.httpClient
      .delete<any[]>(query, {headers: headers.headers, params})
      .toPromise();
  }

  modifierMarque(marque: Marque, id_utilisateur:number){
    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    let query = this.IPBackend+"/marques/";
    let body = {'id_utilisateur': id_utilisateur, 'id_marque': marque.id_marque, 'nom_unique': marque.nom_unique};
    return this.httpClient
      .put<any[]>(query, body, headers)
      .toPromise();
  }


  triParId(type: string, id_utilisateur:number){
    let query = this.IPBackend+"/marques/tri/id/";
    if(type == "ASC"){
      query += "ASC";
    }
    else{
      query += "DESC";
    }
    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    let params = new HttpParams().set('id_utilisateur', id_utilisateur);
    this.httpClient
      .get<any[]>(query, {headers: headers.headers, params})
      .subscribe(
        (resp) => {
          this.marques = resp;
          this.emitListeMarquesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }

  triParNomUnique(type: string, id_utilisateur:number){
    let query = this.IPBackend+"/marques/tri/nom_unique/";
    if(type == "ASC"){
      query += "ASC";
    }
    else{
      query += "DESC";
    }
    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    let params = new HttpParams().set('id_utilisateur', id_utilisateur);
    this.httpClient
      .get<any[]>(query, {headers: headers.headers, params})
      .subscribe(
        (resp) => {
          this.marques = resp;
          this.emitListeMarquesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }

  triNbVehicules(type: string, id_utilisateur:number){
    let query = this.IPBackend+"/marques/tri/nb_vehicules/";
    if(type == "ASC"){
      query += "ASC";
    }
    else{
      query += "DESC";
    }
    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    let params = new HttpParams().set('id_utilisateur', id_utilisateur);
    this.httpClient
      .get<any[]>(query, {headers: headers.headers, params})
      .subscribe(
        (resp) => {
          this.marques = resp;
          this.emitListeMarquesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }
}