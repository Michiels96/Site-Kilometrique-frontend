import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Vehicule } from "../models/Vehicule.model";
import { IPService } from "./ip.service";
import { UtilisateurService } from "./utilisateur.service";


@Injectable()
export class VehiculeService{

  vehiculesSubject = new Subject<any[]>();
  private vehicules = [{}];

  private IPBackend: string;
      
  constructor(private httpClient: HttpClient, private ipService: IPService, private utilisateurService: UtilisateurService){ 
      this.IPBackend = ipService.getIPBackend();
      this.getVehiculesFromServer(this.utilisateurService.getInfoUtilisateur().id_utilisateur);
  }

  emitListeVehiculesSubject(){
    this.vehiculesSubject.next(this.vehicules.slice());
  }

  getVehiculesFromServer(id_utilisateur: number){
    let query = this.IPBackend+"/vehicules/utilisateur/";

    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };

    let params = new HttpParams()
    
    this.httpClient
      .get<any[]>(query, {headers: headers.headers, params: params})
      .subscribe(
        (resp) => {
          this.vehicules = resp;
          this.emitListeVehiculesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }



  getByNom(nomUnique: string){
    let query = this.IPBackend+"/vehicules/nomUnique/";

    const headers = {
        headers: new HttpHeaders({ 
          'Authorization': localStorage.getItem('sessionToken')
        })
      };

    let params = new HttpParams()
    .set('nom', nomUnique)
    ;

    return this.httpClient
        .get<any[]>(query, {headers: headers.headers, params: params})
        .toPromise();
  }

  ajouterVehicule(vehicule:Vehicule, id_utlisateur:number){
    let query = this.IPBackend+"/vehicules/";
    let body;
    if(vehicule.detail == null){
        body = {
            'utilisateur': this.utilisateurService.getInfoUtilisateur().id_utilisateur,
            'nom': vehicule.nom, 
            'id_utlisateur': id_utlisateur,
            'marque': vehicule.marque, 
            'type': vehicule.type
        };
    }
    else{
        body = {
            'utilisateur': this.utilisateurService.getInfoUtilisateur().id_utilisateur,
            'nom': vehicule.nom, 
            'id_utlisateur': id_utlisateur,
            'marque': vehicule.marque, 
            'type': vehicule.type,
            'detail': vehicule.detail
        };
    }
    const authorizationHeader = {
      headers: new HttpHeaders({
        "Authorization": localStorage.getItem("sessionToken")
      })
    };

    return this.httpClient
        .post<any[]>(query, body, authorizationHeader)
        .toPromise();
  }

  supprimerVehicule(vehiculesID:number[]){
    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    let query = this.IPBackend+"/vehicules/";
    let params = new HttpParams()
    .set('ids', JSON.stringify(vehiculesID))
    ;
    return this.httpClient
      .delete<any[]>(query, {headers: headers.headers, params})
      .toPromise();
  }

  modifierVehicule(vehicule: Vehicule){
    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    let query = this.IPBackend+"/vehicules/";
    let body = {'id_utilisateur': this.utilisateurService.getInfoUtilisateur().id_utilisateur, 'id_vehicule': vehicule.id_vehicule, 'nom': vehicule.nom, 'marque': vehicule.marque, 'type': vehicule.type, 'detail': vehicule.detail};
    return this.httpClient
      .put<any[]>(query, body, headers)
      .toPromise();
  }

  triParId(type: string, id_utilisateur: number){
    let query = this.IPBackend+"/vehicules/utilisateur/tri/id/";

    let params;
    if(type == "ASC"){
      params = new HttpParams()
      .set('type', 'ASC')

    }
    else{
      params = new HttpParams()
      .set('type', 'DESC')

    }
    

    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    this.httpClient
      .get<any[]>(query, {headers: headers.headers, params: params})
      .subscribe(
        (resp) => {
          this.vehicules = resp;
          this.emitListeVehiculesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }

  triParNomUnique(type: string, id_utilisateur: number){
    let query = this.IPBackend+"/vehicules/utilisateur/tri/nom/";

    let params;
    if(type == "ASC"){
      params = new HttpParams()
      .set('type', 'ASC')
    }
    else{
      params = new HttpParams()
      .set('type', 'DESC')
    }

    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    this.httpClient
    .get<any[]>(query, {headers: headers.headers, params: params})
      .subscribe(
        (resp) => {
          this.vehicules = resp;
          this.emitListeVehiculesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }

  triParMarque(type: string, id_utilisateur: number){
    let query = this.IPBackend+"/vehicules/utilisateur/tri/marque/";

    let params;
    if(type == "ASC"){
      params = new HttpParams()
      .set('type', 'ASC')
    }
    else{
      params = new HttpParams()
      .set('type', 'DESC')
    }

    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    this.httpClient
      .get<any[]>(query, {headers: headers.headers, params: params})
      .subscribe(
        (resp) => {
          this.vehicules = resp;
          this.emitListeVehiculesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }

  triParType(type: string, id_utilisateur: number){
    let query = this.IPBackend+"/vehicules/utilisateur/tri/type/";

    let params;
    if(type == "ASC"){
      params = new HttpParams()
      .set('type', 'ASC')
    }
    else{
      params = new HttpParams()
      .set('type', 'DESC')
    }

    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    this.httpClient
      .get<any[]>(query, {headers: headers.headers, params: params})
      .subscribe(
        (resp) => {
          this.vehicules = resp;
          this.emitListeVehiculesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }

  triParDetail(type: string, id_utilisateur: number){
    let query = this.IPBackend+"/vehicules/utilisateur/tri/detail/";

    let params;
    if(type == "ASC"){
      params = new HttpParams()
      .set('type', 'ASC')
    }
    else{
      params = new HttpParams()
      .set('type', 'DESC')
    }

    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    this.httpClient
      .get<any[]>(query, {headers: headers.headers, params: params})
      .subscribe(
        (resp) => {
          this.vehicules = resp;
          this.emitListeVehiculesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }

}