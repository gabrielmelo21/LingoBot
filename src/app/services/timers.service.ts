// src/app/services/missao-timer.service.ts
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService, DailyMissionData } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class TimersService implements OnInit {

  private _missionsSubject: BehaviorSubject<DailyMissionData>;
  public missions$: Observable<DailyMissionData>;

  constructor(private authService: AuthService) {
    const initialData = this.authService.getDailyData();
    this._missionsSubject = new BehaviorSubject<DailyMissionData>(initialData);
    this.missions$ = this._missionsSubject.asObservable();
    this.checkAndResetMissions();
    this.checkAndResetStrikes(); // Call the new method here


   // this.markChestAsOpen(1);
   //this.authService.updateDailyMission({  refreshTimeAt : 1755704930 })
 this.updateMission("writing");
  //this.updateMission("reading");
  //this.updateMission("listening");
  //this.updateMission("speaking");
  }

  ngOnInit(): void {
    // ngOnInit is not strictly necessary for services, but keeping it for consistency if other logic is added later.
  }

  /** Retorna o JSON atual (para debug) */
  public getMissionsData(): DailyMissionData {
    return this.authService.getDailyData();
  }

  /** Atualiza uma missão para true */
  public updateMission(mission: string): void {
    const updates: Partial<DailyMissionData> = {};
    (updates as any)[mission.toLowerCase()] = true;
    this.authService.updateDailyMission(updates);
    this._missionsSubject.next(this.authService.getDailyData());
  }

  /** Marca um baú específico como aberto */
  public markChestAsOpen(chestNumber: number): void {
    if (chestNumber < 1 || chestNumber > 4) return;
    const updates: Partial<DailyMissionData> = {};
    (updates as any)[`chestWasOpen${chestNumber}`] = true;
    console.log((updates as any)[`chestWasOpen${chestNumber}`]);
    this.authService.updateDailyMission(updates);
    this._missionsSubject.next(this.authService.getDailyData());
  }

  /** Reseta todas as missões */
  public resetMissions(): void {
    this.authService.resetDailyMissions();
    this._missionsSubject.next(this.authService.getDailyData());

  }


  public giveUserGems(): number {
    const data = this.authService.getDailyData();
    return data.rewardPerChest + data.strikes;
  }

  public getStrikes(): number {
    const data = this.authService.getDailyData();
    return data.strikes;
  }

  public addStrike(): void {
    const data = this.authService.getDailyData();
    this.authService.updateDailyMission({ strikes: data.strikes + 1 });
    this._missionsSubject.next(this.authService.getDailyData());
  }

  public resetStrikes(){
    this.authService.updateDailyMission({ strikes: 0 });
    this._missionsSubject.next(this.authService.getDailyData());
  }

  public claimChestReward(): void {
    const gemsToGive = this.giveUserGems();
    this.authService.updateLocalUserData({ gemas: gemsToGive });
    this.resetStrikes(); // Reset strikes after claiming reward
  }

  public getChestsOpenedAt(): number {
    const data = this.authService.getDailyData();
    return data.chestsOpenedAt;
  }

  public setChestsOpenedAt(timestamp: number): void {
    this.authService.updateDailyMission({ chestsOpenedAt: timestamp });
  }

  public getRefreshTimeAt(): number {
    const data = this.authService.getDailyData();
    return data.refreshTimeAt;
  }

  public setRefreshTimeAt(timestamp: number): void {
    this.authService.updateDailyMission({ refreshTimeAt: timestamp });
    this._missionsSubject.next(this.authService.getDailyData());
  }

  public checkAllChestsOpened(): void {
    const data = this.authService.getDailyData();
    if (data.chestWasOpen1 && data.chestWasOpen2 && data.chestWasOpen3 && data.chestWasOpen4) {
        if(data.chestsOpenedAt === 0) { // check if it has not been set before
            const currentTime = Date.now();
            this.authService.updateDailyMission({
              chestsOpenedAt: currentTime,
              refreshTimeAt: currentTime + (24 * 60 * 60 * 1000),
              strikes: data.strikes + 1
            });
            this._missionsSubject.next(this.authService.getDailyData());
            
        }
    }
  }

  public checkAndResetMissions(): void {
    const data = this.authService.getDailyData();
    if (data.refreshTimeAt !== 0 && Date.now() >= data.refreshTimeAt) {
      this.resetMissions();
      this._missionsSubject.next(this.authService.getDailyData());
    }
  }

  public checkAndResetStrikes(): void {
    const data = this.authService.getDailyData();
    const now = Date.now();

    // If refreshTimeAt is set and it's past the refresh time
    // AND the chestsOpenedAt is older than the refreshTimeAt (meaning missions weren't completed for the new cycle)
    if (data.refreshTimeAt !== 0 && now >= data.refreshTimeAt && data.chestsOpenedAt < data.refreshTimeAt) {
      this.authService.updateDailyMission({
        strikes: 0,
        rewardPerChest: 5
      });
      this._missionsSubject.next(this.authService.getDailyData());
      
    }
  }

}
