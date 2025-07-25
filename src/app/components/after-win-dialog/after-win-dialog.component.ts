import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-after-win-dialog',
  templateUrl: './after-win-dialog.component.html',
  styleUrls: ['./after-win-dialog.component.css']
})
export class AfterWinDialogComponent {

  @Input() jackpot: boolean = false;
  @Input() elder_img: string = '';
  @Input() reward_xp: number = 0;
  @Input() reward_coins: number = 0;




}
