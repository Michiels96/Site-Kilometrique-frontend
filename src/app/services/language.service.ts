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
            'Connection page': 'Sign in page',
            'Connection': 'Sign in',
            'register page': 'Register page',
            'Register': 'Register'
        },
        'connexion': {
            'Connection': 'Sign in',
            'Email address': 'Email',
            'Password': 'Password',
            'submitConnection': 'Sign in'
        },
        'inscription': {
            'register': 'Register',
            'emailAddress': 'Email',
            'password': 'Password',
            'name': 'Name',
            'lastname': 'Lastname',
            'age': 'Age',
            'submitRegister': 'Register',
            'createUser': 'Create user',
            'backToUsers': 'Back to users list'
        },
        'accueil': {
            'admin_status': 'Admin',
            'nav_history_menu_title': 'Navigation logs',
            'nav_history_menu_legend': 'Add/delete navigation logs',
            'nav_history_menu_button': 'Navigation logs menu',
            'vehicles_menu_title': 'Vehicles',
            'vehicles_menu_legend': 'Provide the list of all your vehicles',
            'vehicles_menu_button': 'Vehicles menu',
            'brands_menu_title': 'Brands',
            'brands_menu_legend': 'Provide the list of all brands registered in the system',
            'brands_menu_button': 'Brands menu',
            'users_menu_title': 'Users',
            'users_menu_legend': 'Provide the list of all users registered in the system',
            'users_menu_button': 'Users menu',
            'stats_menu_title': 'Statistics',
            'stats_menu_legend': 'Statistics of navigation logs',
            'stats_menu_button': 'Statistics menu',
            'down_menu_title': 'Download your data',
            'down_menu_legend': 'Download a text file of your navigation logs',
            'down_menu_button': 'Download',
            'footer': 'Icons designed by'
        },
    };

    private french_lib = {
        'nav': {
            'Connection page': 'Page de connexion',
            'Connection': 'Connexion',
            'register page': 'Page d\'inscription',
            'Register': 'S\'inscrire'
        },
        'connexion': {
            'Connection': 'Page de connexion',
            'Email address': 'Adresse Email',
            'Password': 'Mot de passe',
            'submitConnection': 'Connexion'
        },
        'inscription': {
            'register': 'Page d\'inscription',
            'emailAddress': 'Email',
            'password': 'Mot de passe',
            'name': 'Nom',
            'lastname': 'Prénom',
            'age': 'Age',
            'submitRegister': 'Inscription',
            'createUser': 'Créer utilisateur',
            'backToUsers': 'Retour à la liste des utilisateurs'
        },
        'accueil': {
            'admin_status': 'Administrateur',
            'nav_history_menu_title': 'Historique de navigation',
            'nav_history_menu_legend': 'Ajouter/supprimer l\'historique de navigation',
            'nav_history_menu_button': 'Menu historique de navigation',
            'vehicles_menu_title': 'Véhicules',
            'vehicles_menu_legend': 'Donne la liste de tous vos véhicules',
            'vehicles_menu_button': 'Menu véhicules',
            'brands_menu_title': 'Marques',
            'brands_menu_legend': 'Donne la liste de toutes les marques inscrits dans le système',
            'brands_menu_button': 'Menu marques',
            'users_menu_title': 'Utilisateurs',
            'users_menu_legend': 'Donne la liste de tous les utilisateurs inscrits dans le système',
            'users_menu_button': 'Menu utilisateurs',
            'stats_menu_title': 'Statistiques',
            'stats_menu_legend': 'Statistiques de l\'historique de navigation',
            'stats_menu_button': 'Voir les statistiques',
            'down_menu_title': 'Télécharger vos données',
            'down_menu_legend': 'Télécharger un fichier texte de vos données',
            'down_menu_button': 'Télécharger',
            'footer': 'Icônes conçues par'
        },
    }

    getFrenchLib(){
        return this.french_lib;
    }

    getEnglishLib(){
        return this.english_lib;
    }
}

