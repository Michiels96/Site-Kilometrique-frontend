import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Statistique } from "../models/Statistique.model";
import { IPService } from "./ip.service";
import { UtilisateurService } from "./utilisateur.service";


@Injectable()
export class StatistiqueService{

  statistiquesSubject = new Subject<any[]>();
  private statistiques = [{}];

  private IPBackend: string;
      
  constructor(private httpClient: HttpClient, private ipService: IPService, private utilisateurService: UtilisateurService){ 
      this.IPBackend = ipService.getIPBackend();
  }

  // informe tous les components abboné au service que un de ses attibuts à été maj.
  emitListeStatistiquesSubject(){
    this.statistiquesSubject.next(this.statistiques.slice());
  }

  getStatistiquesFromServer(id_utilisateur: number){
    let query = this.IPBackend+"/statistiques/utilisateur/";

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
          this.statistiques = resp;
          this.emitListeStatistiquesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }



  // getByNomUnique(nomUnique: string){
  //   let query = this.IPBackend+"/stati/nomUnique/";

  //   const headers = {
  //       headers: new HttpHeaders({ 
  //         'Authorization': localStorage.getItem('sessionToken')
  //       })
  //     };

  //   let params = new HttpParams().set('nom_unique', nomUnique);

  //   return this.httpClient
  //       .get<any[]>(query, {headers: headers.headers, params: params})
  //       .toPromise();
  // }

  ajouterStatistique(statistique:Statistique, id_utlisateur:number){
    let query = this.IPBackend+"/statistiques/";
    let body = {'description': statistique.description, 'utilisateur': id_utlisateur};

    return this.httpClient
        .post<any[]>(query, body)
        .toPromise();
  }

  supprimerStatistiques(statistiquesID:number[], id_utilisateur: number){
    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    let query = this.IPBackend+"/statistiques/";
    let params = new HttpParams()
    .set('ids', JSON.stringify(statistiquesID))
    .set('id_utilisateur', id_utilisateur);
    return this.httpClient
      .delete<any[]>(query, {headers: headers.headers, params})
      .toPromise();
  }

  modifierStatistique(statistique: Statistique, id_utilisateur: number){
    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    let query = this.IPBackend+"/statistiques/";
    let body = {'id_utilisateur': id_utilisateur, 'id_statistique': statistique.id_statistique, 'description': statistique.description, 'date': statistique.dateDAjout};
    //console.log(body)
    return this.httpClient
      .put<any[]>(query, body, headers)
      .toPromise();
  }

  majKilometresCumules(id_utilisateur:number){
    const headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };
    
    let query = this.IPBackend+"/statistiques/majKM";
    let body = {'id_utilisateur': +id_utilisateur};

    return this.httpClient
      .put<any[]>(query, body, headers)
      .toPromise();
  }

  creerStatistiques(emailUtilisateur:string, id_utilisateur:number){
    let headers = {
      headers: new HttpHeaders({ 
          'Access-Control-Allow-Origin':'*'
      })
    };
    let query = this.IPBackend+"/statistiques/utilisateur";
    let body = {'id_utilisateur': id_utilisateur, 'email': emailUtilisateur};
    return this.httpClient
        .post<any[]>(query, body, headers)
        .toPromise();
  }
  

  triParDateDAjout(type: string, id_utilisateur: number){
    let query = this.IPBackend+"/statistiques/utilisateur/tri/dateDAjout/";

    let params;
    if(type == "ASC"){
      params = new HttpParams()
      .set('type', 'ASC')
      .set('id_utilisateur', id_utilisateur);
      //query += "ASC";
    }
    else{
      params = new HttpParams()
      .set('type', 'DESC')
      .set('id_utilisateur', id_utilisateur);
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
          this.statistiques = resp;
          this.emitListeStatistiquesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }

  triParDateDeModification(type: string, id_utilisateur: number){
    let query = this.IPBackend+"/statistiques/utilisateur/tri/dateDeModification/";

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
          this.statistiques = resp;
          this.emitListeStatistiquesSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + JSON.stringify(error));
        }
      );
  }
  
  
  // triParId(type: string, id_utilisateur: number){
  //   let query = this.IPBackend+"/vehicules/utilisateur/tri/id/";

  //   let params;
  //   if(type == "ASC"){
  //     params = new HttpParams().set('type', 'ASC').set('id_utilisateur', id_utilisateur);
  //     //query += "ASC";
  //   }
  //   else{
  //     params = new HttpParams()
  //     .set('type', 'DESC').set('id_utilisateur', id_utilisateur);
  //     //query += "DESC";
  //   }
    

  //   const headers = {
  //     headers: new HttpHeaders({ 
  //       'Authorization': localStorage.getItem('sessionToken')
  //     })
  //   };
  //   this.httpClient
  //     .get<any[]>(query, {headers: headers.headers, params: params})
  //     //.get<any[]>(query, headers)
  //     .subscribe(
  //       (resp) => {
  //         this.vehicules = resp;
  //         this.emitListeVehiculesSubject();
  //       },
  //       (error) => {
  //         console.log('Erreur ! : ' + JSON.stringify(error));
  //       }
  //     );
  // }

  // triParNomUnique(type: string, id_utilisateur: number){
  //   let query = this.IPBackend+"/vehicules/utilisateur/tri/nom_unique/";

  //   let params;
  //   if(type == "ASC"){
  //     params = new HttpParams().set('type', 'ASC').set('id_utilisateur', id_utilisateur);
  //   }
  //   else{
  //     params = new HttpParams()
  //     .set('type', 'DESC').set('id_utilisateur', id_utilisateur);
  //   }

  //   const headers = {
  //     headers: new HttpHeaders({ 
  //       'Authorization': localStorage.getItem('sessionToken')
  //     })
  //   };
  //   this.httpClient
  //   .get<any[]>(query, {headers: headers.headers, params: params})
  //     .subscribe(
  //       (resp) => {
  //         this.vehicules = resp;
  //         this.emitListeVehiculesSubject();
  //       },
  //       (error) => {
  //         console.log('Erreur ! : ' + JSON.stringify(error));
  //       }
  //     );
  // }

  // triParMarque(type: string, id_utilisateur: number){
  //   let query = this.IPBackend+"/vehicules/utilisateur/tri/marque/";

  //   let params;
  //   if(type == "ASC"){
  //     params = new HttpParams().set('type', 'ASC').set('id_utilisateur', id_utilisateur);
  //   }
  //   else{
  //     params = new HttpParams().set('type', 'DESC').set('id_utilisateur', id_utilisateur);
  //   }

  //   const headers = {
  //     headers: new HttpHeaders({ 
  //       'Authorization': localStorage.getItem('sessionToken')
  //     })
  //   };
  //   this.httpClient
  //     .get<any[]>(query, {headers: headers.headers, params: params})
  //     .subscribe(
  //       (resp) => {
  //         this.vehicules = resp;
  //         this.emitListeVehiculesSubject();
  //       },
  //       (error) => {
  //         console.log('Erreur ! : ' + JSON.stringify(error));
  //       }
  //     );
  // }

  // triParType(type: string, id_utilisateur: number){
  //   let query = this.IPBackend+"/vehicules/utilisateur/tri/type/";

  //   let params;
  //   if(type == "ASC"){
  //     params = new HttpParams().set('type', 'ASC').set('id_utilisateur', id_utilisateur);
  //   }
  //   else{
  //     params = new HttpParams().set('type', 'DESC').set('id_utilisateur', id_utilisateur);
  //   }

  //   const headers = {
  //     headers: new HttpHeaders({ 
  //       'Authorization': localStorage.getItem('sessionToken')
  //     })
  //   };
  //   this.httpClient
  //     .get<any[]>(query, {headers: headers.headers, params: params})
  //     .subscribe(
  //       (resp) => {
  //         this.vehicules = resp;
  //         this.emitListeVehiculesSubject();
  //       },
  //       (error) => {
  //         console.log('Erreur ! : ' + JSON.stringify(error));
  //       }
  //     );
  // }

  // triParDetail(type: string, id_utilisateur: number){
  //   let query = this.IPBackend+"/vehicules/utilisateur/tri/detail/";

  //   let params;
  //   if(type == "ASC"){
  //     params = new HttpParams().set('type', 'ASC').set('id_utilisateur', id_utilisateur);
  //   }
  //   else{
  //     params = new HttpParams().set('type', 'DESC').set('id_utilisateur', id_utilisateur);
  //   }

  //   const headers = {
  //     headers: new HttpHeaders({ 
  //       'Authorization': localStorage.getItem('sessionToken')
  //     })
  //   };
  //   this.httpClient
  //     .get<any[]>(query, {headers: headers.headers, params: params})
  //     .subscribe(
  //       (resp) => {
  //         this.vehicules = resp;
  //         this.emitListeVehiculesSubject();
  //       },
  //       (error) => {
  //         console.log('Erreur ! : ' + JSON.stringify(error));
  //       }
  //     );
  // }

}