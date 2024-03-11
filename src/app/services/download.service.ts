import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IPService } from "./ip.service";
import { UtilisateurService } from "./utilisateur.service";

@Injectable()
export class DownloadService{

    private IPBackend: string;

    constructor(private httpClient: HttpClient, private ipService: IPService, private utilisateurService:UtilisateurService){ 
        this.IPBackend = ipService.getIPBackend();
    }

    downloadFile(id_utilisateur: number, avecHistorique:boolean, avecVehicules: boolean, avecStatistiques: boolean){
        let query = this.IPBackend+"/download/";
        const headers = {
            headers: new HttpHeaders({ 
              'Authorization': localStorage.getItem('sessionToken'),
              
            })
          };
        let body = {
            'utilisateur': this.utilisateurService.getInfoUtilisateur().id_utilisateur,
            'id_utilisateur': id_utilisateur,
            'historique': avecHistorique,
            'vehicules': avecVehicules,
            'statistiques': avecStatistiques
        };
        return this.httpClient
            .post<any[]>(query, body, {headers: headers.headers}).toPromise();
    }
    
}