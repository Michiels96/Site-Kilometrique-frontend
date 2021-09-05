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

  // informe tous les components abboné au service que un de ses attibuts à été maj.
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
    .set('id_utilisateur', id_utilisateur)
    .set('utilisateur', this.utilisateurService.getInfoUtilisateur().id_utilisateur);
    
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



  getByNomUnique(nomUnique: string){
    let query = this.IPBackend+"/vehicules/nomUnique/";

    const headers = {
        headers: new HttpHeaders({ 
          'Authorization': localStorage.getItem('sessionToken')
        })
      };

    let params = new HttpParams()
    .set('nom_unique', nomUnique)
    .set('id_utilisateur', this.utilisateurService.getInfoUtilisateur().id_utilisateur);

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
            'nom_unique': vehicule.nom_unique, 
            'id_utlisateur': id_utlisateur,
            'marque': vehicule.marque, 
            'type': vehicule.type
        };
    }
    else{
        body = {
            'utilisateur': this.utilisateurService.getInfoUtilisateur().id_utilisateur,
            'nom_unique': vehicule.nom_unique, 
            'id_utlisateur': id_utlisateur,
            'marque': vehicule.marque, 
            'type': vehicule.type,
            'detail': vehicule.detail
        };
    }
    return this.httpClient
        .post<any[]>(query, body)
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
    .set('id_utilisateur', this.utilisateurService.getInfoUtilisateur().id_utilisateur);
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
    let body = {'id_utilisateur': this.utilisateurService.getInfoUtilisateur().id_utilisateur, 'id_vehicule': vehicule.id_vehicule, 'nom_unique': vehicule.nom_unique, 'marque': vehicule.marque, 'type': vehicule.type, 'detail': vehicule.detail};
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
      .set('id_utilisateur', id_utilisateur)
      .set('utilisateur', this.utilisateurService.getInfoUtilisateur().id_utilisateur);
      //query += "ASC";
    }
    else{
      params = new HttpParams()
      .set('type', 'DESC')
      .set('id_utilisateur', id_utilisateur)
      .set('utilisateur', this.utilisateurService.getInfoUtilisateur().id_utilisateur);
      //query += "DESC";
    }
    

    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    this.httpClient
      .get<any[]>(query, {headers: headers.headers, params: params})
      //.get<any[]>(query, headers)
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
    let query = this.IPBackend+"/vehicules/utilisateur/tri/nom_unique/";

    let params;
    if(type == "ASC"){
      params = new HttpParams()
      .set('type', 'ASC')
      .set('id_utilisateur', id_utilisateur)
      .set('utilisateur', this.utilisateurService.getInfoUtilisateur().id_utilisateur);
    }
    else{
      params = new HttpParams()
      .set('type', 'DESC')
      .set('id_utilisateur', id_utilisateur)
      .set('utilisateur', this.utilisateurService.getInfoUtilisateur().id_utilisateur);
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
      .set('id_utilisateur', id_utilisateur)
      .set('utilisateur', this.utilisateurService.getInfoUtilisateur().id_utilisateur);
    }
    else{
      params = new HttpParams()
      .set('type', 'DESC')
      .set('id_utilisateur', id_utilisateur)
      .set('utilisateur', this.utilisateurService.getInfoUtilisateur().id_utilisateur);
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
      .set('id_utilisateur', id_utilisateur)
      .set('utilisateur', this.utilisateurService.getInfoUtilisateur().id_utilisateur);
    }
    else{
      params = new HttpParams()
      .set('type', 'DESC')
      .set('id_utilisateur', id_utilisateur)
      .set('utilisateur', this.utilisateurService.getInfoUtilisateur().id_utilisateur);
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
      .set('id_utilisateur', id_utilisateur)
      .set('utilisateur', this.utilisateurService.getInfoUtilisateur().id_utilisateur);
    }
    else{
      params = new HttpParams()
      .set('type', 'DESC')
      .set('id_utilisateur', id_utilisateur)
      .set('utilisateur', this.utilisateurService.getInfoUtilisateur().id_utilisateur);
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