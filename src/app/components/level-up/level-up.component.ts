import { Component } from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {AuthService} from "../../services/auth.service";
import {PlaySoundService} from "../../services/play-sound.service";

@Component({
  selector: 'app-level-up',
  templateUrl: './level-up.component.html',
  styleUrls: ['./level-up.component.css']
})
export class LevelUpComponent {
  showLevelUpModal: any;

  constructor(private authService: AuthService, private playSoundService: PlaySoundService, private modalService: ModalService) {
    this.modalService.showLevelUpModal$.subscribe(state => {
      this.showLevelUpModal = state;
    });

  }

  close_modal() {
      this.playSoundService.playCleanSound()
     this.modalService.toggleLevelUpModal();
  }


}
