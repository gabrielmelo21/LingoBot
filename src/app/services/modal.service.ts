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



  // MISSOES DIARIAS

  private showDailySubject = new BehaviorSubject<boolean>(false);
  showDailyModal$ = this.showDailySubject.asObservable();

  toggleDailyModal() {
    this.showDailySubject.next(!this.showDailySubject.value);
  }


  // USER INFOS
  private showUserInfosModalSubject = new BehaviorSubject<boolean>(false);
  showUserInfosModal$ = this.showUserInfosModalSubject.asObservable();

  toggleUserInfosModal() {
    this.showUserInfosModalSubject.next(!this.showUserInfosModalSubject.value);
  }




  // ITEMS MODAL
  private showItemsModalSubject = new BehaviorSubject<boolean>(false);
  showItemsModal$ = this.showItemsModalSubject.asObservable();

  toggleItemsModal() {
    this.showItemsModalSubject.next(!this.showItemsModalSubject.value);
  }





  // SELECT QUESYT
  private showSelectQuestSubject = new BehaviorSubject<boolean>(false);
  showSelectQuestModal$ = this.showSelectQuestSubject.asObservable();

  toggleSelectQuestModal() {
    this.showSelectQuestSubject.next(!this.showSelectQuestSubject.value);
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

  // GEMAS WARNING
  private showGemasWarningSubject = new BehaviorSubject<boolean>(false);
  showGemasWarningModal$ = this.showGemasWarningSubject.asObservable();

  toggleGemasWarningModal() {
    this.showGemasWarningSubject.next(!this.showGemasWarningSubject.value);
  }


}
