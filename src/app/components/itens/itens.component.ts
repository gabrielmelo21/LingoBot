import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {PlaySoundService} from "../../services/play-sound.service";


export interface UserItem {
  itemName: string;
  dropRate: number;
  gemsValue: number;
  quant: number;
  rarity: string;
  itemSrc: string;
  describe: string;
}



@Component({
  selector: 'app-itens',
  templateUrl: './itens.component.html',
  styleUrls: ['./itens.component.css']
})
export class ItensComponent implements OnInit {
  itens: UserItem[] = [];
  selectedIndex: number | null = null;
  selectedItem: UserItem | null = null;
  user: any;
  goldCoins: any;
  gemsCoins: any;
  userItems: UserItem[] = [];

  constructor(private authService: AuthService,
              private playSoundService: PlaySoundService,
              private cdr: ChangeDetectorRef) {


  }

  renderizar(){
    this.cdr.detectChanges();
  }




  ngOnInit() {
    this.itens = this.authService.getUserItems();


    this.authService.user$.subscribe(userData => {
      if (!userData) return;
      this.user = userData;
      this.goldCoins = userData.tokens;
      this.gemsCoins = userData.gemas;

    });


  }



  isCommonToRare(rarity: string): boolean {
    const normalized = rarity.toLowerCase();
    return normalized === 'common' || normalized === 'uncommon' || normalized === 'rare';
  }

  getGemImage(rarity: string): string {
    return this.isCommonToRare(rarity)
      ? 'assets/lingobot/itens/gold.png'
      : 'assets/lingobot/itens/gemas.png';
  }




  selectItem(index: number) {
    this.playSoundService.playCleanSound()
    this.selectedIndex = index;
    this.selectedItem = this.itens[index];
    this.renderizar();
  }

  sellItem(item: UserItem): void {
    console.log(item);
    if (item.quant > 0) {
      const success = this.authService.sellUserItem(item);

      if (success) {
      //  alert(`Você vendeu 1x ${item.itemName} com sucesso!`);

        // Atualiza a lista de itens visível
        this.itens = this.authService.getUserItems();

        // Atualiza o item selecionado também
        this.selectedItem = this.userItems.find(i =>
          i.itemName === item.itemName &&
          i.rarity === item.rarity &&
          i.itemSrc === item.itemSrc
        ) || null;


        // Força a atualização da tela
        this.cdr.detectChanges();


      } else {
       // alert("Erro ao vender o item.");
      }

    } else {
     // alert("Você não possui mais este item!");
    }

    this.renderizar();
  }


  addItem() {
     this.authService.addRandomItemToUser();
    // Atualiza a lista de itens visível
    this.itens = this.authService.getUserItems();

    // Força a atualização da tela
    this.cdr.detectChanges();
  }


}
