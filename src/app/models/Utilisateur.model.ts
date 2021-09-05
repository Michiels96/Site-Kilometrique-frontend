export class Utilisateur {

    id_utilisateur: number;
    email: string;
    password: string;
    nom: string;
    prenom: string;
    age: number;
    nbKilometresCumules: number;
    estConnecte: boolean;
    estAdmin: boolean;

    public constructor(
      id_utilisateur: number
    );


    public constructor(
      email: string,
      password: string,
    );

    public constructor(
      email: string,
      password: string,
      nom: string,
      prenom: string,
    );

    public constructor(
      email: string,
      password: string,
      nom: string,
      prenom: string,
      age: number,
    );

    public constructor(
      id_utilisateur: number,
      email: string,
      password: string,
      nom: string,
      prenom: string,
      age: number,
      nbKilometresCumules: number,
      estConnecte: boolean,
      estAdmin: boolean
    );



    public constructor(...args: any[]){
      if(args.length === 1){
        this.id_utilisateur = args[0];

        this.email = '';
        this.password = '';
        this.nom = '';
        this.prenom = '';
        this.age = -1;
        this.nbKilometresCumules = 0;
        this.estConnecte = false;
        this.estAdmin = false;
      }
      if(args.length === 2){
        this.id_utilisateur = -1;

        this.email = args[0];
        this.password = args[1];

        this.nom = '';
        this.prenom = '';
        this.age = -1;
        this.nbKilometresCumules = 0;
        this.estConnecte = false;
        this.estAdmin = false;
      }
      if(args.length === 4){
        this.id_utilisateur = -1;

        this.email = args[0];
        this.password = args[1];
        this.nom = args[2];
        this.prenom = args[3];

        this.age = -1;
        this.nbKilometresCumules = 0;
        this.estConnecte = false;
        this.estAdmin = false;
      }
      if(args.length === 5){
        this.id_utilisateur = -1;

        this.email = args[0];
        this.password = args[1];
        this.nom = args[2];
        this.prenom = args[3];
        this.age = args[4];

        this.nbKilometresCumules = 0;
        this.estConnecte = false;
        this.estAdmin = false;
      }
      if(args.length === 9){
        this.id_utilisateur = args[0];
        this.email = args[1];
        this.password = args[2];
        this.nom = args[3];
        this.prenom = args[4];
        this.age = args[5];
        this.nbKilometresCumules = args[6];
        this.estConnecte = args[7];
        this.estAdmin = args[8];
      }
    }


    // constructor(
    //   public id_utilisateur: number,
    //   public email: string,
    //   public password: string,
    //   public nom: string,
    //   public prenom: string,
    //   public age: number,
    //   public nb_kilometres_cumules: number,
    //   public connecte: boolean
    // ) {}

    // constructor(
    //   public email: string,
    //   public password: string,
    // ) {}


  }