import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitters';
import { Utilisateur } from '../models/Utilisateur.model';
import { UtilisateurService } from '../services/utilisateur.service';

@Component({
  selector: 'app-four-oh-four',
  templateUrl: './four-oh-four.component.html',
  styleUrls: ['./four-oh-four.component.css']
})
export class FourOhFourComponent implements OnInit, OnDestroy {

  constructor(private utilisateurService: UtilisateurService, private router: Router) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("component404");
    if(localStorage.getItem('sessionToken') != null){
      this.utilisateurService.checkToken(localStorage.getItem('sessionToken'))
        .then((resp) => {
          let user = new Utilisateur(
            resp['user'][0]['id_utilisateur'],
            resp['user'][0]['email'],
            //resp['user'][0]['password'],
            null,
            resp['user'][0]['nom'],
            resp['user'][0]['prenom'],
            resp['user'][0]['age'],
            resp['user'][0]['nbKilometresCumules'],
            resp['user'][0]['estConnecte'],
            resp['user'][0]['estAdmin']
          );
          localStorage.setItem('sessionToken', resp['newToken']);
          Emitters.connexionEmitter.emit(true);
          this.deconnexion(user);
        });
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
  }


  deconnexion(utilisateur:Utilisateur){
    this.utilisateurService.setConnecte(utilisateur, 0)
    .then((resp) => {
      if(resp['status'] == "OK"){
        localStorage.clear();
        sessionStorage.clear();
        this.utilisateurService.setInfoUtilisateur(null);
        Emitters.connexionEmitter.emit(false);
        //window.location.reload();
        //this.router.navigate(['/connexion']);
      }
    });
  }
}
