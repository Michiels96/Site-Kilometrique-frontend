import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";



@Injectable()
export class IPService {
    // private headers = {
    //     headers: new HttpHeaders({ 
    //         'Access-Control-Allow-Origin': '*',
    //         'Content-Type' : 'application/json',
    //         'Access-Control-Allow-Credentials': 'true',
    //         'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, DELETE',
    //         'Access-Control-Allow-Headers': 'Content-Type',
    //     })
    // };
    private ipBackend = "";

    constructor() { 
        // local (LAN) (development)
        //this.ipBackend = "http://192.168.1.50:3000";

        // internet (production)
        // ne pas oublier le port forwarding
        this.ipBackend = "https://michiels.zapto.org:3000";
    }

    getIPBackend(){
        return this.ipBackend;
    }
}

