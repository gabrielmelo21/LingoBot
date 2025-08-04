import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {PlaySoundService} from "../../services/play-sound.service";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.css']
})
export class ItemModalComponent implements OnInit, OnDestroy {
  private sub!: Subscription;
  modal: boolean = false;
  isClosing: boolean = false;
  animandoSaida = false;
  animandoEntrada = false;

  constructor(private playSoundService: PlaySoundService,
              private modalService: ModalService) {
  }



  openModal() {
    if (this.modal) {
      this.animandoSaida = true;
      this.isClosing = true;
      this.playSoundService.playHologram();
    } else {
      this.animandoEntrada = true;
      this.isClosing = false;
      this.modalService.toggleItemsModal();
    }
  }

  onAnimationEnd(event: AnimationEvent) {
    const { animationName } = event;

    if (animationName === 'entrarDaEsquerda') {
      this.animandoEntrada = false;
    }

    if (animationName === 'sairParaEsquerda') {
      this.animandoSaida = false;
      this.modalService.toggleItemsModal();
      this.isClosing = false;
    }
  }










  ngOnInit(): void {
    this.sub = this.modalService.showItemsModal$.subscribe(show => {
      this.modal = show;
    });

  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }


}
