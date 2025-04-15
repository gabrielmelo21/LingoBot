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



  private showRankingModalSubject = new BehaviorSubject<boolean>(false);
  showRankingModal$ = this.showRankingModalSubject.asObservable();

  toggleRankingModal() {
    this.showRankingModalSubject.next(!this.showRankingModalSubject.value);
  }


  private showSettingsModalSubject = new BehaviorSubject<boolean>(false);
  showSettingsModal$ = this.showSettingsModalSubject.asObservable();

  toggleSettingsModal() {
    this.showSettingsModalSubject.next(!this.showSettingsModalSubject.value);
  }

}
