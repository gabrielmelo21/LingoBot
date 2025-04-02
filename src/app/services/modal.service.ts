import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private showCelularModalSubject = new BehaviorSubject<boolean>(false);
  showCelularModal$ = this.showCelularModalSubject.asObservable();

  toggleCelularModal() {
    this.showCelularModalSubject.next(!this.showCelularModalSubject.value);
  }


}
