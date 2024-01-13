import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReloadService {
  private reloadSubject = new BehaviorSubject<boolean>(false);

  reloadComponent() {
    this.reloadSubject.next(true);
  }

  getReloadObservable() {
    return this.reloadSubject.asObservable();
  }
}