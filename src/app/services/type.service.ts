import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Marque } from "../models/Marque.model";
import { IPService } from "./ip.service";


@Injectable()
export class TypeVehiculeService{

    private headers = {
      headers: new HttpHeaders({ 
        'Authorization': localStorage.getItem('sessionToken')
      })
    };

    typeVehiculeSubject = new Subject<any[]>();
    private types = ["camion", "voiture", "moto", "avion", "véhicule de chantier"];

    private IPBackend: string;
      
  constructor(private httpClient: HttpClient, private ipService: IPService){ 
      this.IPBackend = ipService.getIPBackend();
  }

  // informe tous les components abboné au service que un de ses attibuts à été maj.
  emitListeTypesSubject(){
    this.typeVehiculeSubject.next(this.types.slice());
  }

  getTypesFromServer(){
    this.emitListeTypesSubject();

    // Sera utile quand les types viendront de la DB
    // let query = this.IPBackend+"/types/";
    // this.httpClient
    //   .get<any[]>(query, this.headers)
    //   .subscribe(
    //     (resp) => {
    //       this.types = resp;
    //       this.emitListeTypesSubject();
    //     },
    //     (error) => {
    //       console.log('Erreur ! : ' + JSON.stringify(error));
    //     }
    //   );
  }

}