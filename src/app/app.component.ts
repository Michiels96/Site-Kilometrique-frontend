import { Component, OnDestroy, OnInit } from '@angular/core';
import { Emitters } from './emitters/emitters';

import { UtilisateurService } from './services/utilisateur.service';
import { Utilisateur } from './models/Utilisateur.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'site-kilometrique';
  componentAffiche: string = "";

  constructor() {}

  ngOnInit(): void {
    Emitters.componentAffiche
    .subscribe((pageStatus:string) => {
      this.componentAffiche = pageStatus;
    });
  }
}
