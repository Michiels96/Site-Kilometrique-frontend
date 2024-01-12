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
        if(localStorage.getItem('lang') == null){
            // set French as default language
            this.selected_lang = "fr";
            localStorage.setItem('lang', this.selected_lang)
        }
        return localStorage.getItem('lang');
    }

    changeSelectedLanguage(){
        if(this.selected_lang == "fr"){
            this.selected_lang = "en";
        }
        else{
            this.selected_lang = "fr";
        }
        localStorage.setItem('lang', this.selected_lang)
    }


    private english_lib = {
        'nav': {
            'Connection page': 'Connection page',
            'Connection': 'Connection',
            'Register': 'Register'
        },
        'connexion': {
            'Connection': 'Sign in',
            'Email address': 'Email',
            'Password': 'Password',
            'submitConnection': 'Sign in'
        }
    };

    private french_lib = {
        'nav': {
            'Connection page': 'Page de connexion',
            'Connection': 'Connexion',
            'Register': 'S\'inscrire'
        },
        'connexion': {
            'Connection': 'Page de connexion',
            'Email address': 'Adresse Email',
            'Password': 'Mot de passe',
            'submitConnection': 'Connexion'
        }
    }

    getFrenchLib(){
        return this.french_lib;
    }

    getEnglishLib(){
        return this.english_lib;
    }
}

