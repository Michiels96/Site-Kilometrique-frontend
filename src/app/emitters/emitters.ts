import { EventEmitter } from "@angular/core";

export class Emitters{
    // string which indicates if the user is connected or not
    static connexionEmitter = new EventEmitter<boolean>();
    // string which indicates which component is on
    static componentAffiche = new EventEmitter<string>();
}