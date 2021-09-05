export class TypeVehicule {

    id_type: number;
    nom_unique: string;
  
    public constructor(
        id_type: number,
        nom_unique: string
    );
  
    public constructor(...args: any[]){
        this.id_type = args[0];
        this.nom_unique = args[1];
    }
  }