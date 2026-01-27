import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class IPService {
    private ipBackend = "";

    constructor() { 

        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        const port = window.location.port;
        
        // Mode développement local (ng serve sur port 4200)
        if (hostname === "localhost" && port === "4200") {
            // En dev local avec ng serve, pointer vers HTTPS local
            this.ipBackend = "https://192.168.1.50:4100/api";
            console.log("[IPService] Mode DEV local (ng serve) détecté, backend:", this.ipBackend);
        }
        // Mode réseau local (192.168.x.x ou 192.168.1.50)
        else if (hostname === "192.168.1.50" || hostname.startsWith("192.168.")) {
            // En LAN, utiliser le reverse proxy /api sur le même domaine/port
            this.ipBackend = protocol + "//" + hostname + (port ? ":" + port : "") + "/api";
            console.log("[IPService] Mode LAN détecté, backend:", this.ipBackend);
        }
        // Mode Internet (michiels.zapto.org) - UNIQUEMENT PORT 80
        else if (hostname === "michiels.zapto.org") {
            // Sur Internet, port 80 uniquement (pas de port dans l'URL)
            this.ipBackend = protocol + "//" + hostname + "/api";
            console.log("[IPService] Mode Internet détecté, backend:", this.ipBackend);
        }
        // Fallback pour autres domaines
        else {
            this.ipBackend = protocol + "//" + hostname + (port ? ":" + port : "") + "/api";
            console.log("[IPService] Mode générique détecté, backend:", this.ipBackend);
        }
    }

    getIPBackend(){
        return this.ipBackend;
    }
}
