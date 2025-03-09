import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css']
})
export class Step4Component {
  formulario: FormGroup;

  constructor(private formBuilder: FormBuilder,) {

    this.formulario = this.formBuilder.group({
      mainTheme: ['', Validators.required], // Campo do tema
      respostaUsuario: [''] // Resposta do usuário
    });


  }
}
