import { EventEmitter } from "@angular/core";

export class Emitters{
    static connexionEmitter = new EventEmitter<boolean>();
    //string indiquant quel compenent est actuellement affiché
    static componentAffiche = new EventEmitter<string>();
}