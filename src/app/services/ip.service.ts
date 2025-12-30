import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class IPService {
    private ipBackend = "";

    constructor() { 

        const hostname = window.location.hostname;
        
        if (hostname === "192.168.1.50" || hostname === "localhost" || hostname.startsWith("192.168.")) {

            this.ipBackend = "https://192.168.1.50:3000";
            console.log("[IPService] Mode LAN détecté, backend:", this.ipBackend);
        } else {

            this.ipBackend = "https://michiels.zapto.org:3000";
            console.log("[IPService] Mode Internet détecté, backend:", this.ipBackend);
        }
    }

    getIPBackend(){
        return this.ipBackend;
    }
}
