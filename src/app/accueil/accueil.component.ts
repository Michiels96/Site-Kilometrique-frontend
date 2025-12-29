import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Emitters } from '../emitters/emitters';
import { Subscription } from 'rxjs';
import { UtilisateurService } from '../services/utilisateur.service';
import { LanguageService } from '../services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit, OnDestroy {

  constructor(private httpClient: HttpClient, private utilisateurService: UtilisateurService, private languageService: LanguageService, private translateService: TranslateService){}

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentAccueil");
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
