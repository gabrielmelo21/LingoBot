import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gemas-warning',
  templateUrl: './gemas-warning.component.html',
  styleUrls: ['./gemas-warning.component.css']
})
export class GemasWarningComponent implements OnInit {
  show = true;

  ngOnInit() {
    // Auto-oculta o componente após 4 segundos
    setTimeout(() => {
      this.show = false;
    }, 4000);
  }
}
