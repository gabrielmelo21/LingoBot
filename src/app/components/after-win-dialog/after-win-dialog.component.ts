import {Component, Input, OnInit} from '@angular/core';
import {PlaySoundService} from "../../services/play-sound.service";
import {Router} from "@angular/router";
import {RewardService} from "../../services/reward.service";

@Component({
  selector: 'app-after-win-dialog',
  templateUrl: './after-win-dialog.component.html',
  styleUrls: ['./after-win-dialog.component.css']
})
export class AfterWinDialogComponent implements OnInit{

chestWasOpen: boolean = false;
chestImage: string = "assets/lingobot/itens/chest-closed.webp";


   constructor(
    private playSoundService: PlaySoundService,
    private router: Router,
    private rewardService: RewardService,
   ) { }

  ngOnInit() {
    // Som para o label de ouro (aparece aos 0.2s, animação dura 0.6s)
    setTimeout(() => {
      this.playSoundService.playPop();
    }, 800); // 0.2s delay + 0.6s animação

    // Som para o label de XP (aparece aos 0.8s, animação dura 0.6s)
    setTimeout(() => {
      this.playSoundService.playPop();
    }, 1400); // 0.8s delay + 0.6s animação

    // Som para o label de Level Up (aparece aos 1.4s, animação dura 0.6s)
    setTimeout(() => {
      this.playSoundService.playPop();
    }, 2000); // 1.4s delay + 0.6s animação

    // Som para o label de jackpot (aparece aos 2.0s, animação dura 0.6s)
    if (this.jackpot) {
      setTimeout(() => {
        this.playSoundService.playPop();
      }, 2600); // 2.0s delay + 0.6s animação
    }
  }


openChest() {
  if (!this.chestWasOpen) {
        this.rewardService.giveUserItem();
    this.chestWasOpen = true;
    this.chestImage = "assets/lingobot/itens/chest-open.webp";
  }
}



  back() {
    this.router.navigate(['/babel-tower']);
  }



  @Input() jackpot: boolean = false;
  @Input() elder_img: string = '';
  @Input() reward_xp: number = 0;
  @Input() reward_coins: number = 0;
  @Input() dialogText: string = 'Parabéns, você venceu o desafio!';
  @Input() leveledUpSkillIcon: string = 'assets/lingobot/skills/writing.webp';

}
