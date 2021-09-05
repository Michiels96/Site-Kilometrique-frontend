export class Ligne {

  id_ligne: number;
  vehicule: number | string;
  nbKilometres: number;
  nbKilometresDepart: number;
  description: string;
  date: string;

  public constructor(
    vehicule: number | string,
    nbKilometres: number,
    nbKilometresDepart: number,
    date: string
  );

  public constructor(
    id_ligne: number,
    vehicule: number | string,
    nbKilometres: number,
    nbKilometresDepart: number,
    date: string
  );

  public constructor(
    id_ligne: number,
    vehicule: number | string,
    nbKilometres: number,
    nbKilometresDepart: number,
    description: string,
    date: string
  );

  public constructor(...args: any[]){
    if(args.length == 4){
      this.id_ligne = -1;
      this.vehicule = args[0];
      this.nbKilometres = args[1];
      this.nbKilometresDepart = args[2];
      this.description = null;
      this.date = args[3];
    }
    if(args.length == 5){
      this.id_ligne = -1;
      this.vehicule = args[0];
      this.nbKilometres = args[1];
      this.nbKilometresDepart = args[2];
      this.description = args[3];
      this.date = args[4];
    }
    else if(args.length == 6){
      this.id_ligne = args[0];
      this.vehicule = args[1];
      this.nbKilometres = args[2];
      this.nbKilometresDepart = args[3];
      this.description = args[4];
      this.date = args[5];
    }
  }
}