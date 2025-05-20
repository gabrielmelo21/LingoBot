import {ChangeDetectorRef, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RenderService {

  constructor( private cdr: ChangeDetectorRef) { }


  renderizar(){
    this.cdr.detectChanges();
  }

}
