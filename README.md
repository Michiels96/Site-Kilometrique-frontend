# SiteKilometrique

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.



lien du site : http://michiels.zapto.org


1. initialiser le projet
    ng new site-kilometrique --style=scss --skip-tests:true

2. se d�placer dans le dossier site-kilometrique et installer le package bootstrap
    npm install bootstrap@latest --save

3. cr�er un nouveau component
    ng g c nouveau-component




lancer le serveur ouvert � tous:
    ng serve --host 0.0.0.0

Pour rendre accessible sur internet:
Dans le ficjier services/ip.service.tests
Commenter l'addr IPBackend pour LAN et d�commenter la ligne IPBackend publique


Automatisation pour r�cup�rer l'addresse IP:
le script situ� dans /assets/getIp doit s'ex�cuter tout les jours avec l'outil 'cron'
