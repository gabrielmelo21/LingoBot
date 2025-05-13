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


  private showItensModalSubject = new BehaviorSubject<boolean>(false);
  showItensModal$ = this.showItensModalSubject.asObservable();

  toggleItensModal() {
    this.showItensModalSubject.next(!this.showItensModalSubject.value);
  }



  private showLevelUpSubject = new BehaviorSubject<boolean>(false);
  showLevelUpModal$ = this.showLevelUpSubject.asObservable();

  toggleLevelUpModal() {
    this.showLevelUpSubject.next(!this.showLevelUpSubject.value);
  }






  private showNewItemsSubject = new BehaviorSubject<boolean>(false);
  showNewItemsModal$ = this.showNewItemsSubject.asObservable();

  private newItemSubject = new BehaviorSubject<any | null>(null);
  newItem$ = this.newItemSubject.asObservable();

  toggleNewItemsModal(show: boolean, item?: any) {
    this.showNewItemsSubject.next(show);
    if (item) this.newItemSubject.next(item);
  }

  closeNewItemsModal() {
    this.showNewItemsSubject.next(false);
  }



}
