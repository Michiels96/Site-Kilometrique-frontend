import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Emitters } from '../emitters/emitters';
import { Utilisateur } from '../models/Utilisateur.model';
import { DownloadService } from '../services/download.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { saveAs } from 'file-saver';
import { LanguageService } from '../services/language.service';
import { ReloadService } from '../services/component-reload.service';


@Component({
  selector: 'app-telecharger-fichier',
  templateUrl: './telecharger-fichier.component.html',
  styleUrls: ['./telecharger-fichier.component.css']
})
export class TelechargerFichierComponent implements OnInit, OnDestroy {
  private reloadSubscription: Subscription;

  // language terms
  down_title: string;
  down_user: string;
  down_with_out_history: string;
  down_with_out_vhs: string;
  down_with_out_stats: string;
  download: string;
  down_back_home: string;

  telechargerForm: FormGroup;

  // Pour le select (uniquement dispo pour un administrateur)
  utilisateurs:any = [{}];
  utilisateurSubscription: Subscription;
  selectedOption: string;
  utilisateurSelectionne: Utilisateur = null;

  constructor(private formBuilder: FormBuilder, private utilisateurService: UtilisateurService, private downloadService: DownloadService, private reloadService: ReloadService, private languageService: LanguageService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentTelechargerFichier");
    // Observable to reload from 'nav' component when there is a language change
    this.reloadSubscription = this.reloadService.getReloadObservable().subscribe((reload) => {
      if (reload) {
        this.setLanguageTerms();
      }
    });
    this.utilisateurService.getUtilisateursFromServer();
    this.utilisateurSubscription = this.utilisateurService.utilisateursSubject.subscribe(
      (utilisateurs: any[]) => {
        this.utilisateurs = utilisateurs;
        this.chargerInfoUtilisateur(this.utilisateurService.getInfoUtilisateur().id_utilisateur+"");
      }
    );
    this.initForm();
    this.setLanguageTerms();
  }

  setLanguageTerms(){
    let french_lib = this.languageService.getFrenchLib();
    if (this.languageService.getSelectedLanguage() == 'fr'){
      this.down_title = french_lib['telechargement']['down_title'];
      this.down_user = french_lib['telechargement']['down_user'];
      this.down_with_out_history = french_lib['telechargement']['down_with_out_history'];
      this.down_with_out_vhs = french_lib['telechargement']['down_with_out_vhs'];
      this.down_with_out_stats = french_lib['telechargement']['down_with_out_stats'];
      this.download = french_lib['telechargement']['download'];
      this.down_back_home = french_lib['telechargement']['down_back_home'];
    }

    let english_lib = this.languageService.getEnglishLib();
    if (this.languageService.getSelectedLanguage() == 'en'){
      this.down_title = english_lib['telechargement']['down_title'];
      this.down_user = english_lib['telechargement']['down_user'];
      this.down_with_out_history = english_lib['telechargement']['down_with_out_history'];
      this.down_with_out_vhs = english_lib['telechargement']['down_with_out_vhs'];
      this.down_with_out_stats = english_lib['telechargement']['down_with_out_stats'];
      this.download = english_lib['telechargement']['download'];
      this.down_back_home = english_lib['telechargement']['down_back_home'];
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    // delete the observable to avoid component memory leak
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }

  initForm() {
    this.telechargerForm = this.formBuilder.group({
      avecHistoNav: [true, Validators.required],
      avecVehicule: [true, Validators.required],
      avecStat: [true, Validators.required]
    });
  }

  checkAdminStatus(){
    if(this.utilisateurService.getInfoUtilisateur() != null){
      if(this.utilisateurService.getInfoUtilisateur().estAdmin){
        return true;
      }
      return false;
    }
    return false;
  }

  chargerInfoUtilisateur(id_utilisateur: string){
    this.utilisateurService.getById(new Utilisateur(+id_utilisateur))
    .then((resp) => {
      this.utilisateurSelectionne = new Utilisateur(
        resp[0]['id_utilisateur'],
        resp[0]['email'],
        resp[0]['password'],
        resp[0]['nom'],
        resp[0]['prenom'],
        resp[0]['age'],
        resp[0]['nbKilometresCumules'],
        resp[0]['estConnecte'],
        resp[0]['estAdmin']
      );
    });
  }

  onSubmitForm(){
    const formValue = this.telechargerForm.value;
    
    var avecHistorique:boolean = formValue['avecHistoNav'];
    var avecVehicules:boolean = formValue['avecVehicule'];
    var avecStatistiques:boolean = formValue['avecStat'];

    this.downloadService.downloadFile(this.utilisateurSelectionne.id_utilisateur, avecHistorique, avecVehicules, avecStatistiques)
    .then((data) => {
      //console.log(data)
      var blob = new Blob([data+""], {type: "text/plain;charset=utf-8",endings:'native'});
      //blob.text().then((res) => console.log(JSON.stringify(res)));
      //console.log(blob)
      
      var date = new Date();
      let year = date.getFullYear();
      let month = (date.getMonth()+1)+"";
      let day = (date.getDate()-1)+"";
      let hour = (date.getHours())+"";
      let minute = (date.getMinutes())+"";
      let second = (date.getSeconds())+"";
      if(month.length == 1){
          month = "0"+month;
      }
      if(day.length == 1){
          day = "0"+day;
      }
      if(hour.length == 1){
          hour = "0"+hour;
      }
      if(minute.length == 1){
          minute = "0"+minute;
      }
      if(second.length == 1){
          second = "0"+second;
      }
      var fileName = year+"."+month+"."+day+"-"+hour+":"+minute+":"+second+"--utilisateur-"+this.utilisateurSelectionne.id_utilisateur+".txt";
      saveAs(blob, fileName);
    }).catch((err) => console.log("erreur "+JSON.stringify(err)));
  }
}
