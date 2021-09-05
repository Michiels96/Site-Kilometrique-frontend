import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { MarqueComponent } from './menu-marques/marque/marque.component';
import { MenuMarquesComponent } from './menu-marques/menu-marques.component';
import { MenuUtilisateursComponent } from './menu-utilisateurs/menu-utilisateurs.component';
import { MenuVehiculesComponent } from './menu-vehicules/menu-vehicules.component';
import { MotDePasseComponent } from './profil/mot-de-passe/mot-de-passe.component';
import { ProfilComponent } from './profil/profil.component';
import { AuthGuard } from './services/auth-guard.service';
import { VehiculeComponent } from './menu-vehicules/vehicule/vehicule.component';
import { HistoriqueDeNavigationComponent } from './historique-de-navigation/historique-de-navigation.component';
import { LigneHistoriqueComponent } from './ligne-historique/ligne-historique.component';
import { AdminGuard } from './services/admin-guard.service';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { MenuStatistiquesComponent } from './menu-statistiques/menu-statistiques.component';
import { StatistiqueComponent } from './menu-statistiques/statistique/statistique.component';
import { TelechargerFichierComponent } from './telecharger-fichier/telecharger-fichier.component';

const routes: Routes = [  
  { path: 'connexion', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'accueil', canActivate: [AuthGuard], component: AccueilComponent },
  { path: 'vehicules', canActivate: [AuthGuard], component: MenuVehiculesComponent },
  { path: 'vehicules/vehicule', canActivate: [AuthGuard], component: VehiculeComponent },
  { path: 'marques', canActivate: [AuthGuard], component: MenuMarquesComponent },
  { path: 'marques/marque', canActivate: [AuthGuard], component: MarqueComponent },
  { path: 'profil', canActivate: [AuthGuard], component: ProfilComponent },
  { path: 'profil/motdepasse', canActivate: [AuthGuard], component: MotDePasseComponent },
  { path: 'utilisateurs', canActivate: [AdminGuard, AuthGuard], component: MenuUtilisateursComponent },
  { path: 'lignes', canActivate: [AuthGuard], component: HistoriqueDeNavigationComponent },
  { path: 'lignes/ligne', canActivate: [AuthGuard], component: LigneHistoriqueComponent },
  { path: 'statistiques', canActivate: [AuthGuard], component: MenuStatistiquesComponent },
  { path: 'statistiques/statistique', canActivate: [AuthGuard], component: StatistiqueComponent },
  { path: 'download', canActivate: [AuthGuard], component: TelechargerFichierComponent },
  { path: '', canActivate: [AuthGuard], component: AccueilComponent },
  { path: 'not-found', component: FourOhFourComponent },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
