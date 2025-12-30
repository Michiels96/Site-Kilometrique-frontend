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


  emitListeTypesSubject(){
    this.typeVehiculeSubject.next(this.types.slice());
  }

  getTypesFromServer(){
    this.emitListeTypesSubject();














  }

}