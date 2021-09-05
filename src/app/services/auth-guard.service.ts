import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UtilisateurService } from './utilisateur.service';
import { Utilisateur } from '../models/Utilisateur.model';
import { Emitters } from '../emitters/emitters';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private utilisateurService: UtilisateurService,
              private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if(localStorage.getItem('sessionToken') == null){
          Emitters.componentAffiche.emit("");
          this.router.navigate(['/connexion']);
          Emitters.connexionEmitter.emit(false);
          return false;
        }
        return this.utilisateurService.checkToken(localStorage.getItem('sessionToken'))
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
          this.utilisateurService.setInfoUtilisateur(user);
          //sessionStorage.setItem('utilisateur', JSON.stringify(user));
          Emitters.connexionEmitter.emit(true);
          return true;
        }).catch(err => this.logout(err));
  }

  logout(err){
    //console.log("Erreur "+JSON.stringify(err))
    Emitters.connexionEmitter.emit(false);
    return this.router.navigate(['/connexion']);
  }
}