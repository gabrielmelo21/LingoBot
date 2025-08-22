import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {PlaySoundService} from "../../services/play-sound.service";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-new-item-modal',
  templateUrl: './new-item-modal.component.html',
  styleUrls: ['./new-item-modal.component.css']
})
export class NewItemModalComponent implements OnInit {
  showNewItemModal: any;
  @Input() item!: any;
  showConfirmButton: boolean = false;

  constructor(private authService: AuthService, private playSoundService: PlaySoundService, private modalService: ModalService) {

    setTimeout(() => {
      this.showConfirmButton = true;
    }, 1500);


  }

  ngOnInit() {
    this.setBackground()
  }

  close_modal() {
    this.playSoundService.playCleanSound();
    this.modalService.closeNewItemsModal();
  }

  getDropRate(dropRate: number): string {
    return `${(dropRate * 100).toFixed(2)}%`;
  }


  itemImgUrl: string = '';


  setBackground(): void {
    console.log(this.item)


    switch (this.item?.rarity?.toLowerCase()) {
      case 'common':
        this.itemImgUrl = 'assets/lingobot/itens/background-common.webp';
        break;
      case 'uncommon':
        this.itemImgUrl = 'assets/lingobot/itens/background-uncommon.webp';
        break;
      case 'rare':
        this.itemImgUrl = 'assets/lingobot/itens/background-rare.webp';
        break;
      case 'epic':
        this.itemImgUrl = 'assets/lingobot/itens/background-epic.webp';
        break;
      case 'legendary':
        this.itemImgUrl = 'assets/lingobot/itens/background-legendary.webp';
        break;
    }
  }


}
