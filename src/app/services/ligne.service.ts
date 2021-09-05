import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ligne } from "../models/Ligne.model";
import { Vehicule } from "../models/Vehicule.model";
import { IPService } from "./ip.service";
import { UtilisateurService } from "./utilisateur.service";


@Injectable()
export class LigneService{

  lignesSubject = new Subject<any[]>();
  private lignes = [{}];
  private nbLignesTotales: number;

  private IPBackend: string;
      
  constructor(private httpClient: HttpClient, private ipService: IPService, private utilisateurService: UtilisateurService){ 
      this.IPBackend = ipService.getIPBackend();
  }

  // informe tous les components abboné au service que un de ses attibuts à été maj.
  emitListeLignesSubject(){
    this.lignesSubject.next(this.lignes.slice());
  }

  getNbLignesFromServer(id_utilisateur: number){
    let query = this.IPBackend+"/lignes/utilisateur/nbLignes";

    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };

    let params = new HttpParams().set('id_utilisateur', id_utilisateur);
    this.httpClient
      .get<any[]>(query, {headers: headers.headers, params: params})
      .subscribe(
        (resp) => {
          this.nbLignesTotales = resp[0]['number'];
          this.getLignesFromServer(id_utilisateur);
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }

  getNbLignesTotales(){
    return this.nbLignesTotales;
  }

  getLignesFromServer(id_utilisateur: number){
    let query = this.IPBackend+"/lignes/utilisateur/";

    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };

    let params = new HttpParams().set('id_utilisateur', id_utilisateur);
    this.httpClient
      .get<any[]>(query, {headers: headers.headers, params: params})
      .subscribe(
        (resp) => {
          this.lignes = resp;
          this.emitListeLignesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }

  ajouterLigne(ligne:Ligne, id_utilisateur:number){
    let query = this.IPBackend+"/lignes/";
    let body;
    if(ligne.description == null){
      body = {
        'id_utilisateur': id_utilisateur, 
        'vehicule': ligne.vehicule,
        'nbKilometres': ligne.nbKilometres,
        'nbKilometresDepart': ligne.nbKilometresDepart,
        'date': ligne.date
      };
    }
    else{
      body = {
        'id_utilisateur': id_utilisateur, 
        'vehicule': ligne.vehicule,
        'nbKilometres': ligne.nbKilometres,
        'nbKilometresDepart': ligne.nbKilometresDepart,
        'description': ligne.description,
        'date': ligne.date
      };
    }
    return this.httpClient
        .post<any[]>(query, body)
        .toPromise();
  }

  modifierLigne(ligne: Ligne, id_utilisateur:number){
    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    let query = this.IPBackend+"/lignes/";
    let body = {'id_utilisateur': id_utilisateur, 'id_ligne': ligne.id_ligne, 'vehicule': ligne.vehicule, 'nbKilometres': ligne.nbKilometres, 'description': ligne.description, 'date': ligne.date};
    return this.httpClient
      .put<any[]>(query, body, headers)
      .toPromise();
  }

  supprimerLignes(ids_lignes:number[], id_utilisateur:number){
    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    let query = this.IPBackend+"/lignes/";
    let params = new HttpParams()
    .set('ids', JSON.stringify(ids_lignes))
    .set('id_utilisateur', id_utilisateur);
    return this.httpClient
      .delete<any[]>(query, {headers: headers.headers, params})
      .toPromise();
  }

  majKilometresCumules(id_utilisateur:number){
    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    let query = this.IPBackend+"/lignes/majKM";
    let body = {'id_utilisateur': id_utilisateur};
    return this.httpClient
      .put<any[]>(query, body, headers)
      .toPromise();
  }

  triParId(type: string, id_utilisateur: number){
    let query = this.IPBackend+"/lignes/utilisateur/tri/id/";

    let params;
    if(type == "ASC"){
      params = new HttpParams().set('type', 'ASC').set('id_utilisateur', id_utilisateur);
      //query += "ASC";
    }
    else{
      params = new HttpParams()
      .set('type', 'DESC').set('id_utilisateur', id_utilisateur);
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
          this.lignes = resp;
          this.emitListeLignesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }

  triParVehicule(type: string, id_utilisateur: number){
    let query = this.IPBackend+"/lignes/utilisateur/tri/vehicule/";

    let params;
    if(type == "ASC"){
      params = new HttpParams().set('type', 'ASC').set('id_utilisateur', id_utilisateur);
      //query += "ASC";
    }
    else{
      params = new HttpParams()
      .set('type', 'DESC').set('id_utilisateur', id_utilisateur);
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
          this.lignes = resp;
          this.emitListeLignesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }

  triParKilometres(type: string, id_utilisateur: number){
    let query = this.IPBackend+"/lignes/utilisateur/tri/kilometres/";

    let params;
    if(type == "ASC"){
      params = new HttpParams().set('type', 'ASC').set('id_utilisateur', id_utilisateur);
      //query += "ASC";
    }
    else{
      params = new HttpParams()
      .set('type', 'DESC').set('id_utilisateur', id_utilisateur);
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
          this.lignes = resp;
          this.emitListeLignesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }

  triParKilometresCumules(type: string, id_utilisateur: number){
    let query = this.IPBackend+"/lignes/utilisateur/tri/kilometresCumules/";

    let params;
    if(type == "ASC"){
      params = new HttpParams().set('type', 'ASC').set('id_utilisateur', id_utilisateur);
      //query += "ASC";
    }
    else{
      params = new HttpParams()
      .set('type', 'DESC').set('id_utilisateur', id_utilisateur);
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
          this.lignes = resp;
          this.emitListeLignesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }

  triParDescription(type: string, id_utilisateur: number){
    let query = this.IPBackend+"/lignes/utilisateur/tri/description/";

    let params;
    if(type == "ASC"){
      params = new HttpParams().set('type', 'ASC').set('id_utilisateur', id_utilisateur);
      //query += "ASC";
    }
    else{
      params = new HttpParams()
      .set('type', 'DESC').set('id_utilisateur', id_utilisateur);
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
          this.lignes = resp;
          this.emitListeLignesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }

  triParDate(type: string, id_utilisateur: number){
    let query = this.IPBackend+"/lignes/utilisateur/tri/date/";

    let params;
    if(type == "ASC"){
      params = new HttpParams().set('type', 'ASC').set('id_utilisateur', id_utilisateur);
      //query += "ASC";
    }
    else{
      params = new HttpParams()
      .set('type', 'DESC').set('id_utilisateur', id_utilisateur);
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
          this.lignes = resp;
          this.emitListeLignesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }

}