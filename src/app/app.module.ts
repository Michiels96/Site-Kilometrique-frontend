import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { AccueilComponent } from './accueil/accueil.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavComponent } from './nav/nav.component';
import { UtilisateurService } from './services/utilisateur.service';
import { IPService } from './services/ip.service';
import { AuthGuard } from './services/auth-guard.service';
import { MenuVehiculesComponent } from './menu-vehicules/menu-vehicules.component';
import { VehiculeService } from './services/vehicule.service';
import { VehiculeComponent } from './menu-vehicules/vehicule/vehicule.component';
import { MarqueService } from './services/marque.service';
import { MenuMarquesComponent } from './menu-marques/menu-marques.component';
import { ProfilComponent } from './profil/profil.component';
import { MotDePasseComponent } from './profil/mot-de-passe/mot-de-passe.component';
import { MarqueComponent } from './menu-marques/marque/marque.component';
import { MenuUtilisateursComponent } from './menu-utilisateurs/menu-utilisateurs.component';
import { TypeVehiculeService } from './services/type.service';
import { HistoriqueDeNavigationComponent } from './historique-de-navigation/historique-de-navigation.component';
import { LigneService } from './services/ligne.service';
import { LigneHistoriqueComponent } from './ligne-historique/ligne-historique.component';
import { AdminGuard } from './services/admin-guard.service';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { MenuStatistiquesComponent } from './menu-statistiques/menu-statistiques.component';
import { StatistiqueService } from './services/statistique.service';
import { StatistiqueComponent } from './menu-statistiques/statistique/statistique.component';
import { TelechargerFichierComponent } from './telecharger-fichier/telecharger-fichier.component';
import { DownloadService } from './services/download.service';


@NgModule({
  declarations: [
    AppComponent,
    ConnexionComponent,
    InscriptionComponent,
    AccueilComponent,
    NavComponent,
    MenuVehiculesComponent,
    VehiculeComponent,
    MenuMarquesComponent,
    ProfilComponent,
    MotDePasseComponent,
    MarqueComponent,
    MenuUtilisateursComponent,
    HistoriqueDeNavigationComponent,
    LigneHistoriqueComponent,
    FourOhFourComponent,
    MenuStatistiquesComponent,
    StatistiqueComponent,
    TelechargerFichierComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    IPService,
    UtilisateurService,
    AuthGuard,
    AdminGuard,
    VehiculeService,
    MarqueService,
    TypeVehiculeService,
    LigneService,
    StatistiqueService,
    DownloadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
