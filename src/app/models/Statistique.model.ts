export class Statistique {

  id_statistique: number;
  utilisateur: number | string;
  description: number;
  dateDAjout: string;
  dateDeModification: string;

  public constructor(
    utilisateur: number | string,
    description: number
  );

  public constructor(
    utilisateur: number | string,
    description: number,
    dateDAjout: string,
    dateDeModification: string
  );

  public constructor(
    id_statistique: number,
    utilisateur: number | string,
    description: number,
    dateDAjout: string,
    dateDeModification: string
  );

  public constructor(...args: any[]){
    if(args.length == 2){
      this.id_statistique = -1;
      this.utilisateur = args[0];
      this.description = args[1];
      this.dateDAjout = null;
      this.dateDeModification = null;
    }
    else if(args.length == 4){
      this.id_statistique = -1;
      this.utilisateur = args[0];
      this.description = args[1];
      this.dateDAjout = args[2];
      this.dateDeModification = args[3];
    }
    else if(args.length == 5){
      this.id_statistique = args[0];
      this.utilisateur = args[1];
      this.description = args[2];
      this.dateDAjout = args[3];
      this.dateDeModification = args[4];
    }
  }
}