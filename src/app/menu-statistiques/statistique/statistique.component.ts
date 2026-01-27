import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/emitters/emitters';
import { Subscription } from 'rxjs';
import { Statistique } from 'src/app/models/Statistique.model';
import { StatistiqueService } from 'src/app/services/statistique.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-statistique',
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.css']
})
export class StatistiqueComponent implements OnInit, OnDestroy {

  statistiqueAModifier:any = null;
  statistiqueModifiee: boolean = false;
  statistiqueForm: FormGroup;
  nouvelleStatistique: boolean = false;

  private idUtilisateurDesStatistiques: number;

  constructor(private router: Router, private formBuilder: FormBuilder, private statistiqueService: StatistiqueService, private languageService: LanguageService, private translateService: TranslateService) { }

  ngOnInit(): void {
    Emitters.componentAffiche.emit("componentStatistique");

    if(sessionStorage.getItem('statistiqueAModifier') != null){
      this.statistiqueAModifier = JSON.parse(sessionStorage.getItem('statistiqueAModifier'));
      this.initFormModification();
    }

    if(sessionStorage.getItem('statistiqueAAjouter') != null){

      this.idUtilisateurDesStatistiques = +sessionStorage.getItem('statistiqueAAjouter');

      this.nouvelleStatistique = true;
      this.initFormCreation();
    }
    if(sessionStorage.getItem('statistiqueAModifier') == null && sessionStorage.getItem('statistiqueAAjouter') == null){
      this.router.navigate(['/statistiques']);
    }
  }

  ngOnDestroy(): void{
    Emitters.componentAffiche.emit("");
    this.resetStatistiqueSessionMemory();
  }

  initFormModification() {
    let date = this.statistiqueAModifier['dateDAjout'];
    date = date.substring(0,(date.indexOf("T")));
    this.statistiqueForm = this.formBuilder.group({
      id: [this.statistiqueAModifier['id_statistique'], Validators.required],
      description: [this.statistiqueAModifier['description'], Validators.required],
      date: [date, Validators.required]
    });
  }

  initFormCreation() {
    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth()+1)+"";
    let day = (date.getDate())+"";
    if(month.length == 1){
      month = "0"+month;
    }
    if(day.length == 1){
      day = "0"+day;
    }
    let actualDate = year+"-"+month+"-"+day;
    this.statistiqueForm = this.formBuilder.group({
      description: ['', Validators.required],
      date: [actualDate, Validators.required]
    });
  }

  dateToString(dateToConvert:string){
    var convert = Date.parse(dateToConvert)/1000;
    var date = new Date(convert * 1000);
    let year = date.getFullYear();
    let month = (date.getMonth()+1)+"";
    let day = (date.getDate())+"";
    if(month.length == 1){
      month = "0"+month;
    }
    if(day.length == 1){
      day = "0"+day;
    }
    return day+"/"+month+"/"+year;
  }

  onSubmitForm(){
    if(!this.nouvelleStatistique){
      const formValue = this.statistiqueForm.value;
      if(formValue['description'] != this.statistiqueAModifier['description']){
        if(formValue['description'] == ''){
          alert('Le champ description ne peut être vide!');
          return;
        }
        this.statistiqueModifiee = true;
      }
      let date = this.statistiqueAModifier['dateDAjout'].substring(0,(this.statistiqueAModifier['dateDAjout'].indexOf("T")));
      if(formValue['date'] != date){
        this.statistiqueModifiee = true;

      }

      if(this.statistiqueModifiee){
        let statistiqueModifiee = new Statistique(
          this.statistiqueAModifier['id_statistique'],
          this.statistiqueAModifier['utilisateur'],
          formValue['description'],

          formValue['date'],
          this.statistiqueAModifier['dateDeModification']
        );
        this.statistiqueService.modifierStatistique(statistiqueModifiee, this.idUtilisateurDesStatistiques)
          .then((resp) => {
            if(resp['status'] == "ok"){
              this.statistiqueService.getStatistiquesFromServer(this.statistiqueModifiee['utilisateur']);
              this.router.navigate(['/statistiques']);
            }
          });
      }
    }

    else{
      const formValue = this.statistiqueForm.value;
      let nouvelleStatistique = new Statistique(
        this.idUtilisateurDesStatistiques,
        formValue['description']
      );
      this.statistiqueService.ajouterStatistique(nouvelleStatistique, +nouvelleStatistique.utilisateur)
        .then((resp) => {
          this.statistiqueService.getStatistiquesFromServer(this.idUtilisateurDesStatistiques);
          this.router.navigate(['/statistiques']);
        });
    }
  }

  resetStatistiqueSessionMemory(){
    sessionStorage.removeItem('statistiqueAModifier');
    sessionStorage.removeItem('statistiqueAAjouter');
  }
}
