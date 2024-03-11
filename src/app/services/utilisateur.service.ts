import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Utilisateur } from "../models/Utilisateur.model";
import { IPService } from "./ip.service";


@Injectable()
export class UtilisateurService {

    private headers = {
        headers: new HttpHeaders({ 
            'Access-Control-Allow-Origin':'*'
        })
    };

    utilisateursSubject = new Subject<any[]>();
    private utilisateurs = [{}];
      

    private IPBackend: string;
    private utilisateurConnecte: Utilisateur = null;

    constructor(private httpClient: HttpClient, private ipService: IPService) { 
        this.IPBackend = ipService.getIPBackend();
    }

    // informe tous les components abboné au service que un de ses attibuts à été maj.
    emitListeUtilisateursSubject(){
        this.utilisateursSubject.next(this.utilisateurs.slice());
    }

    getUtilisateursFromServer(){
      let query = this.IPBackend+"/utilisateurs/";
  
      const headers = {
        headers: new HttpHeaders({ 
          'Authorization': localStorage.getItem('sessionToken')
        })
      };
      let params = new HttpParams().set('id_utilisateur', this.utilisateurConnecte.id_utilisateur);

      this.httpClient
        .get<any[]>(query, {headers: headers.headers, params})
        .subscribe(
          (resp) => {
            this.utilisateurs = resp;
            this.emitListeUtilisateursSubject();
          },
          (error) => {
            console.log('Erreur ! : ' + JSON.stringify(error));
          }
        );
    }

    chargerInfoUtilisateur(){
        this.getByEmail(this.utilisateurConnecte)
        .then((resp) => {
            let userDB = new Utilisateur(
            resp['user']['utilisateur']['id_utilisateur'],
            resp['user']['utilisateur']['email'],
            resp['user']['utilisateur']['password'],
            resp['user']['utilisateur']['nom'],
            resp['user']['utilisateur']['prenom'],
            resp['user']['utilisateur']['age'],
            resp['user']['utilisateur']['nb_kilometres_cumule'],
            resp['user']['utilisateur']['estConnecte'],
            resp['user']['utilisateur']['estAdmin']
            );
            this.setInfoUtilisateur(userDB);
        });
    }

    setInfoUtilisateur(utilisateur: Utilisateur){
        this.utilisateurConnecte = utilisateur;
    }

    getInfoUtilisateur(){
        return this.utilisateurConnecte;
    }

    getByEmail(utilisateur: Utilisateur){
        let query = this.IPBackend+"/utilisateurs/email/"+utilisateur.email;

        return this.httpClient
            .get<any[]>(query, this.headers)
            .toPromise();
    }

    getById(utilisateur: Utilisateur){
      let query = this.IPBackend+"/utilisateurs/id/";

      const headers = {
          headers: new HttpHeaders({ 
            'Authorization': localStorage.getItem('sessionToken')
          })
        };

      let params = new HttpParams()
      .set('id_utilisateur', utilisateur.id_utilisateur)
      .set('utilisateur', this.utilisateurConnecte.id_utilisateur);

      return this.httpClient
          .get<any[]>(query, {headers: headers.headers, params: params})
          .toPromise();
    }

    checkPasswd(utilisateur:Utilisateur,pass:string){
      let query = this.IPBackend+"/utilisateurs/pass";
      let body = {'email': utilisateur.email, 'pass': pass};
      return this.httpClient
          .post<any[]>(query, body, this.headers)
          .toPromise();
    }
  
    supprimerUtilisateur(ids_utilisateurs:number[]){
      const headers = {
        headers: new HttpHeaders({ 
          'Authorization': localStorage.getItem('sessionToken')
        })
      };
      let query = this.IPBackend+"/utilisateurs/";
      let params = new HttpParams()
      .set('ids', JSON.stringify(ids_utilisateurs))
      .set('id_utilisateur', this.utilisateurConnecte.id_utilisateur);
      return this.httpClient
        .delete<any[]>(query, {headers: headers.headers, params})
        .toPromise();
    }
  

    setConnecte(utilisateur: Utilisateur, etat: number){
      let query = this.IPBackend+"/utilisateurs/connexion";
      let body = {'id_utilisateur': utilisateur.id_utilisateur,'email': utilisateur.email,'estConnecte': etat};
      return this.httpClient
          .post<any[]>(query, body, this.headers)
          .toPromise();
    }

    inscription(utilisateur: Utilisateur, avecAge: boolean){
      let query = this.IPBackend+"/utilisateurs/";
      let body;
      if(avecAge){
          body = {
              'email': utilisateur.email, 
              'password': utilisateur.password, 
              'nom': utilisateur.nom, 
              'prenom': utilisateur.prenom,
              'age': utilisateur.age
          };
      }
      else{
          body = {
              'email': utilisateur.email, 
              'password': utilisateur.password, 
              'nom': utilisateur.nom, 
              'prenom': utilisateur.prenom
          };
      }
      return this.httpClient
          .post<any[]>(query, body)
          .toPromise();
    }

    checkToken(token: string){
      let query = this.IPBackend+"/utilisateurs/connexion/token";
      let body = {'token': token};
      return this.httpClient
          .post<any[]>(query, body)
          .toPromise();
    }

    modifierUtilisateur(utilisateur: Utilisateur, avecAge: boolean, avecMdp: boolean){
      let authorizationHeader = {
          headers: new HttpHeaders({ 
            'Authorization': localStorage.getItem('sessionToken')
          })
        };
      if(!avecMdp){
        utilisateur.password = null;
      }
      
      let query = this.IPBackend+"/utilisateurs/";
      let body;
      if(avecAge){
          body = {
              'utilisateur': this.utilisateurConnecte.id_utilisateur,
              'id_utilisateur': utilisateur.id_utilisateur,
              'email': utilisateur.email, 
              'password': utilisateur.password,
              'nom': utilisateur.nom, 
              'prenom': utilisateur.prenom,
              'age': utilisateur.age,
              'modifierAge': 1,
              'nbKilometresCumules': utilisateur.nbKilometresCumules,
              'estConnecte': utilisateur.estConnecte,
              'estAdmin': utilisateur.estAdmin
          };
      }
      else{
          body = {
              'utilisateur': this.utilisateurConnecte.id_utilisateur,
              'id_utilisateur': utilisateur.id_utilisateur,
              'email': utilisateur.email, 
              'password': utilisateur.password,
              'nom': utilisateur.nom, 
              'prenom': utilisateur.prenom,
              'modifierAge': 0,
              'nbKilometresCumules': utilisateur.nbKilometresCumules,
              'estConnecte': utilisateur.estConnecte,
              'estAdmin': utilisateur.estAdmin
          };
      }
      return this.httpClient
          .put<any[]>(query, body, authorizationHeader)
          .toPromise();
    }

    majKilometresCumules(id_utilisateur:number){
      let authorizationHeader = {
        headers: new HttpHeaders({ 
          'Authorization': localStorage.getItem('sessionToken')
        })
      };
      
      let body = {'utilisateur': this.utilisateurConnecte.id_utilisateur, 'id_utilisateur': id_utilisateur};

      let query = this.IPBackend+"/utilisateurs/nbKilometresCumules";
      return this.httpClient
            .put<any[]>(query, body, authorizationHeader)
            .toPromise();
    }

    triParId(type: string){
      let query = this.IPBackend+"/utilisateurs/tri/id/";
  
      let params;
      if(type == "ASC"){
        params = new HttpParams()
        .set('type', 'ASC')
        .set('id_utilisateur', this.utilisateurConnecte.id_utilisateur);
        //query += "ASC";
      }
      else{
        params = new HttpParams()
        .set('type', 'DESC')
        .set('id_utilisateur', this.utilisateurConnecte.id_utilisateur);
        //query += "DESC";
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
            this.utilisateurs = resp;
            this.emitListeUtilisateursSubject();
          },
          (error) => {
            console.log('Erreur ! : ' + JSON.stringify(error));
          }
        );
    }

    triParEmail(type: string){
      let query = this.IPBackend+"/utilisateurs/tri/email/";
  
      let params;
      if(type == "ASC"){
        params = new HttpParams()
        .set('type', 'ASC')
        .set('id_utilisateur', this.utilisateurConnecte.id_utilisateur);
      }
      else{
        params = new HttpParams()
        .set('type', 'DESC')
        .set('id_utilisateur', this.utilisateurConnecte.id_utilisateur);
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
            this.utilisateurs = resp;
            this.emitListeUtilisateursSubject();
          },
          (error) => {
            console.log('Erreur ! : ' + JSON.stringify(error));
          }
        );
    }

    triParNom(type: string){
      let query = this.IPBackend+"/utilisateurs/tri/nom/";
  
      let params;
      if(type == "ASC"){
        params = new HttpParams()
        .set('type', 'ASC')
        .set('id_utilisateur', this.utilisateurConnecte.id_utilisateur);
      }
      else{
        params = new HttpParams()
        .set('type', 'DESC')
        .set('id_utilisateur', this.utilisateurConnecte.id_utilisateur);
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
            this.utilisateurs = resp;
            this.emitListeUtilisateursSubject();
          },
          (error) => {
            console.log('Erreur ! : ' + JSON.stringify(error));
          }
        );
    }

    triParPrenom(type: string){
      let query = this.IPBackend+"/utilisateurs/tri/prenom/";
  
      let params;
      if(type == "ASC"){
        params = new HttpParams()
        .set('type', 'ASC')
        .set('id_utilisateur', this.utilisateurConnecte.id_utilisateur);
      }
      else{
        params = new HttpParams()
        .set('type', 'DESC')
        .set('id_utilisateur', this.utilisateurConnecte.id_utilisateur);
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
            this.utilisateurs = resp;
            this.emitListeUtilisateursSubject();
          },
          (error) => {
            console.log('Erreur ! : ' + JSON.stringify(error));
          }
        );
    }

    triParAge(type: string){
      let query = this.IPBackend+"/utilisateurs/tri/age/";
  
      let params;
      if(type == "ASC"){
        params = new HttpParams()
        .set('type', 'ASC')
        .set('id_utilisateur', this.utilisateurConnecte.id_utilisateur);
      }
      else{
        params = new HttpParams()
        .set('type', 'DESC')
        .set('id_utilisateur', this.utilisateurConnecte.id_utilisateur);
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
            this.utilisateurs = resp;
            this.emitListeUtilisateursSubject();
          },
          (error) => {
            console.log('Erreur ! : ' + JSON.stringify(error));
          }
        );
    }

    triParNbKilometresCumules(type: string){
      let query = this.IPBackend+"/utilisateurs/tri/nbKilometresCumules/";
  
      let params;
      if(type == "ASC"){
        params = new HttpParams()
        .set('type', 'ASC')
        .set('id_utilisateur', this.utilisateurConnecte.id_utilisateur);
      }
      else{
        params = new HttpParams()
        .set('type', 'DESC');
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
            this.utilisateurs = resp;
            this.emitListeUtilisateursSubject();
          },
          (error) => {
            console.log('Erreur ! : ' + JSON.stringify(error));
          }
        );
    }

    triParEstConnecte(type: string){
      let query = this.IPBackend+"/utilisateurs/tri/estConnecte/";
  
      let params;
      if(type == "ASC"){
        params = new HttpParams()
        .set('type', 'ASC')
        .set('id_utilisateur', this.utilisateurConnecte.id_utilisateur);
      }
      else{
        params = new HttpParams()
        .set('type', 'DESC')
        .set('id_utilisateur', this.utilisateurConnecte.id_utilisateur);
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
            this.utilisateurs = resp;
            this.emitListeUtilisateursSubject();
          },
          (error) => {
            console.log('Erreur ! : ' + JSON.stringify(error));
          }
        );
    }

    triParEstAdmin(type: string){
      let query = this.IPBackend+"/utilisateurs/tri/estAdmin/";
  
      let params;
      if(type == "ASC"){
        params = new HttpParams()
        .set('type', 'ASC')
        .set('id_utilisateur', this.utilisateurConnecte.id_utilisateur);
      }
      else{
        params = new HttpParams()
        .set('type', 'DESC')
        .set('id_utilisateur', this.utilisateurConnecte.id_utilisateur);
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
            this.utilisateurs = resp;
            this.emitListeUtilisateursSubject();
          },
          (error) => {
            console.log('Erreur ! : ' + JSON.stringify(error));
          }
        );
    }
}
