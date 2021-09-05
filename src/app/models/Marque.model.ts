export class Marque {

  id_marque: number;
  nom_unique: string;

  public constructor(
    nom_unique: string
  );

  public constructor(
    id_marque: number,
    nom_unique: string
  );

  public constructor(...args: any[]){
    if(args.length == 2){
      this.id_marque = args[0];
      this.nom_unique = args[1];
    }
    else{
      this.id_marque = -1;
      this.nom_unique = args[0];
    }
  }
}