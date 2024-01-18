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
        'profil': {
            'user_title': 'Your User profile',
            'user_email': 'Email address',
            'user_password': 'Change password',
            'user_name': 'Name',
            'user_lastname': 'Lastname',
            'user_age': 'Age',
            'user_total_kms': 'Total accumulated kilometers',
            'user_connection_status': 'Is connected',
            'user_admin_status': 'Is admin',
            'user_modify': 'Modify',
            'user_back_home': 'Back home',
            'user_back_users': 'Return to the list of users'
        },
        '404': {
            't404_title': '404 error',
            't404_legend': 'The page you are looking for does not exist'
        },
        'historique-de-navigation': {
            'logs_page_title': 'Navigation logs',
            'logs_user': 'User',
            'logs_add_line': 'Add a new log',
            'logs_back_page': 'Previous page',
            'logs_next_page': 'Next page',
            'logs_tab_date': 'Date',
            'logs_tab_date_alt': 'Sort by date',
            'logs_tab_kms': 'Kilometers',
            'logs_tab_kms_alt': 'Sort by kilometers',
            'logs_tab_total_kms': 'Accumulated kilometers',
            'logs_tab_total_kms_alt': 'Sort by total accumulated kilometers',
            'logs_tab_desc': 'Description',
            'logs_tab_desc_alt': 'Sort by description',
            'logs_tab_vhs': 'Vehicle',
            'logs_tab_vhs_alt': 'Sort by vehicle',
            'logs_tab_del': 'Delete',
            'empty_logs_msg': 'has not yet recorded browsing history.',
            'logs_back_to_main': 'Return to the home menu'
        }
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
        'profil': {
            'user_title': 'Votre profil utilisateur',
            'user_email': 'Adresse email',
            'user_password': 'Modifier le mot de passe',
            'user_name': 'Nom',
            'user_lastname': 'Prénom',
            'user_age': 'Age',
            'user_total_kms': 'Nombre de kilomètres cumulés',
            'user_connection_status': 'Est connecte',
            'user_admin_status': 'Est administrateur',
            'user_modify': 'Modifier',
            'user_back_home': 'Retour à l\'accueil',
            'user_back_users': 'Retour à la liste des utilisateurs'
        },
        '404': {
            't404_title': 'Erreur 404',
            't404_legend': 'La page que vous cherchez n\'existe pas'
        },
        'historique-de-navigation': {
            'logs_page_title': 'Historique de navigation',
            'logs_user': 'Utilisateur',
            'logs_add_line': 'Ajouter une nouvelle ligne',
            'logs_back_page': 'Page précédente',
            'logs_next_page': 'Page suivante',
            'logs_tab_date': 'Date',
            'logs_tab_date_alt': 'tri par date',
            'logs_tab_kms': 'Kilomètres',
            'logs_tab_kms_alt': 'tri nombre de kilomètres',
            'logs_tab_total_kms': 'Kilomètres cumulés',
            'logs_tab_total_kms_alt': 'tri nombre de kilomètres cumulés',
            'logs_tab_desc': 'Description',
            'logs_tab_desc_alt': 'tri par description',
            'logs_tab_vhs': 'Véhicule',
            'logs_tab_vhs_alt': 'tri par véhicule',
            'logs_tab_del': 'Supprimer',
            'empty_logs_msg': 'n\'a pas encore enregistré son historique de navigation',
            'logs_back_to_main': 'Retour au menu d\'accueil'
        }
    }

    getFrenchLib(){
        return this.french_lib;
    }

    getEnglishLib(){
        return this.english_lib;
    }
}

