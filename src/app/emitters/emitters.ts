import { EventEmitter } from "@angular/core";

export class Emitters{
    // string which indicates if the user is connected or not
    static connexionEmitter = new EventEmitter<boolean>();
    //string indiquant quel compenent est actuellement affiché
    static componentAffiche = new EventEmitter<string>();
}