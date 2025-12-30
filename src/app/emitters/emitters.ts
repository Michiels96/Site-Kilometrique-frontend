import { EventEmitter } from "@angular/core";

export class Emitters{

    static connexionEmitter = new EventEmitter<boolean>();

    static componentAffiche = new EventEmitter<string>();
}