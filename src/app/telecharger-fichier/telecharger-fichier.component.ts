import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Emitters } from '../emitters/emitters';
import { Utilisateur } from '../models/Utilisateur.model';
import { DownloadService } from '../services/download.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-telecharger-fichier',
  templateUrl: './telecharger-fichier.component.html',
  styleUrls: ['./telecharger-fichier.component.css']
})
export class TelechargerFichierComponent implements OnInit, OnDestroy {

  telechargerForm: FormGroup;

  // Pour le select (uniquement dispo pour un administrateur)
  utilisateurs:any = [{}];
  utilisateurSubscription: Subscription;
  selectedOption: string;
  utilisateurSelectionne: Utilisateur = null;

  constructor(private formBuilder: FormBuilder, private utilisateurService: UtilisateurService, private downloadService: DownloadService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentTelechargerFichier");
    this.utilisateurService.getUtilisateursFromServer();
    this.utilisateurSubscription = this.utilisateurService.utilisateursSubject.subscribe(
      (utilisateurs: any[]) => {
        this.utilisateurs = utilisateurs;
        this.chargerInfoUtilisateur(this.utilisateurService.getInfoUtilisateur().id_utilisateur+"");
      }
    );
    this.initForm();
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
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
