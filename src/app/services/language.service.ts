import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";



@Injectable()
export class LanguageService {
    // private headers = {
    //     headers: new HttpHeaders({ 
    //         'Access-Control-Allow-Origin': '*',
    //         'Content-Type' : 'application/json',
    //         'Access-Control-Allow-Credentials': 'true',
    //         'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, DELETE',
    //         'Access-Control-Allow-Headers': 'Content-Type',
    //     })
    // };
    private selected_lang = "";

    constructor() { 
        // set French as default language
        this.selected_lang = "fr";
    }

    getSelectedLanguage(){
        return this.selected_lang;
    }
}

