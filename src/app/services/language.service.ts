import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageService {

    constructor(private translateService: TranslateService) { 

        const lang = this.getSelectedLanguage();
        this.translateService.use(lang);
    }

    getSelectedLanguage(): string {
        if (localStorage.getItem('lang') == null) {

            localStorage.setItem('lang', 'fr');
            return 'fr';
        }
        return localStorage.getItem('lang');
    }

    changeLanguage(lang: string): void {
        this.translateService.use(lang);
        localStorage.setItem('lang', lang);
    }
}
