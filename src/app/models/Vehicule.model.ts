export class Vehicule {

    id_vehicule: number;
    nom_unique: string;
    marque: number;
    type: string;
    detail: string;
    

    public constructor(
      id_vehicule: string,
      nom_unique: string,
      marque: number | string,
      type: string,
      detail: string
    );

    public constructor(
      id_vehicule: string,
      nom_unique: string,
      marque: number | string,
      type: string
    );

    public constructor(
      nom_unique: string,
      marque: number | string,
      type: string,
      detail: string
    );


    public constructor(...args: any[]){
      if(args.length === 4 && typeof args[0] === 'number'){
        this.id_vehicule = args[0];
        this.nom_unique = args[1];
        this.marque = args[2];
        this.type = args[3];

        this.detail = "";
      }
      else if(args.length === 4){
        this.nom_unique = args[0];
        this.marque = args[1];
        this.type = args[2];
        this.detail = args[3];
      }
      else if(args.length === 5){
        this.id_vehicule = args[0];
        this.nom_unique = args[1];
        this.marque = args[2];
        this.type = args[3];
        this.detail = args[4];
      }
    }
  }