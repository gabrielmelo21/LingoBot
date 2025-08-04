import {Component,  OnInit} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {AuthService} from "../../services/auth.service";
import {PlaySoundService} from "../../services/play-sound.service";

@Component({
  selector: 'app-level-up',
  templateUrl: './level-up.component.html',
  styleUrls: ['./level-up.component.css']
})
export class LevelUpComponent implements OnInit {
  fromLevel: number = this.authService. getUserLevel() - 1 ;
   toLevel: number = this.authService. getUserLevel();

  show: boolean = false;
  level: number = this.fromLevel;

  ngOnInit() {




    this.show = true;
    setTimeout(() => {
      this.level = this.toLevel;
    }, 2000); // troca o número depois de 1s

    setTimeout(() => {
      this.show = false;
      this.close_modal();
    }, 6000); // desaparece depois de 5s

  }




  showLevelUpModal: any;

  showConfirmButton = false;


  constructor(private authService: AuthService, private playSoundService: PlaySoundService, private modalService: ModalService) {
    this.modalService.showLevelUpModal$.subscribe(state => {
      this.showLevelUpModal = state;
    });




    setTimeout(() => {
      this.showConfirmButton = true;
    }, 1500);



  }

  close_modal() {
     this.modalService.toggleLevelUpModal();
  }


}
