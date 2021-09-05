import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UtilisateurService } from './utilisateur.service';
import { Utilisateur } from '../models/Utilisateur.model';
import { Emitters } from '../emitters/emitters';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private utilisateurService: UtilisateurService,
              private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.utilisateurService.getInfoUtilisateur() == null){
      this.router.navigate(['/']);
    }
    return this.utilisateurService.getByEmail(this.utilisateurService.getInfoUtilisateur())
      .then((resp) => {
          if(resp[0]['estAdmin']){
            return true;
          }
          return false;
      });
  }
}