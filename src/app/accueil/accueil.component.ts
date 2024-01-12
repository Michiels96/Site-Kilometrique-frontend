import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Emitters } from '../emitters/emitters';
import { UtilisateurService } from '../services/utilisateur.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit, OnDestroy {
  message: string = "message";

  constructor(private httpClient: HttpClient, private utilisateurService: UtilisateurService, private languageService: LanguageService){}

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentAccueil");
    this.message = "Bienvenue "+this.utilisateurService.getInfoUtilisateur().nom+" "+this.utilisateurService.getInfoUtilisateur().prenom;
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
  }

  checkAdminStatus(){
    if(this.utilisateurService.getInfoUtilisateur().estAdmin){
      return true;
    }
    return false;
  }
}
