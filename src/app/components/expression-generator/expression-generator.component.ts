import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MainAPIService} from "../../services/main-api.service";
import {catchError, finalize, tap} from "rxjs";

@Component({
  selector: 'app-expression-generator',
  templateUrl: './expression-generator.component.html',
  styleUrls: ['./expression-generator.component.css']
})
export class ExpressionGeneratorComponent  {
  formulario: FormGroup;
  buttonGPT: boolean = false;
  isLoading: boolean = false;
  expressaoAleatoria: string = "";



  constructor( private formBuilder: FormBuilder, private _snackBar: MatSnackBar, private mainAPI: MainAPIService) {

    let expressoesEmIngles: string[] = [
      "A piece of cake",
      "Bite the bullet",
      "Hit the hay",
      "Cost an arm and a leg",
      "Kick the bucket",
      "Let the cat out of the bag",
      "Under the weather",
      "Speak of the devil",
      "Bite off more than you can chew",
      "Break the ice"
    ];

    this.expressaoAleatoria = expressoesEmIngles[Math.floor(Math.random() * expressoesEmIngles.length)];



    this.formulario = this.formBuilder.group({
      english: ['', Validators.required],
      portugues: ['', Validators.required],
      explain: [''],
      owner: [localStorage.getItem("UserId")+""]
    });

  }


  cleanString(input: string): string {
    const regex = /[^a-zA-Z0-9 ]/g;
    return input.replace(regex, '');
  }


  public verify_button_completeWithGPT() {
    const englishControl = this.formulario.get('english');
    //faz aparecer o botão caso tenha conteudo no input
    if (englishControl) {
      const englishExpression = englishControl.value;
      this.buttonGPT = !!englishExpression; // Ativa o botão se houver algum conteúdo em 'englishExpression'

    } else {
      this.buttonGPT = false;
    }
  }

   showInputs: boolean = false;
  public completeGPT() {



    const englishControlValue = this.formulario.get('english') ? this.formulario.get('english')?.value : '';
    const englishControl = this.cleanString(englishControlValue);

    const explainControl = this.formulario.get('explain');  // explicação do GPT
    const portugueseControl = this.formulario.get('portugues'); //tradução em pt-br

    if (englishControl && portugueseControl) {
      const englishExpression = englishControl;
      this.isLoading = true;

      // precisamos limpar a expressão enviada, se houver caracteres especiais nos tiramos. como o " /


       // TRADUZINDO A EXPRESSÃO
      this.mainAPI.transalateWithGPT(englishExpression)
        .pipe(
          tap((response) => {

            if (portugueseControl) {
              portugueseControl.setValue(response);
            }


          }),
          catchError((error) => {
            console.error('Erro na chamada API:', error);
            throw error;

          }),
          finalize(() => {
            this.isLoading = false;
            console.log('Processamento do servidor concluído.');
          })
        )
        .subscribe();



      this.mainAPI.completeWithGPT(englishExpression).pipe(
          tap((response) => {

            console.log('Resposta do servidor:', response);

            if (explainControl) {
              explainControl.setValue(response);
            }

          }),
          catchError((error) => {
            console.error('Erro na chamada API:', error);
            throw error;

          }),
          finalize(() => {
            this.isLoading = false;
            this.showInputs = true;
            console.log('Processamento do servidor concluído.');
          })
        )
        .subscribe();
    }
  }

  openSnackBar(mensagem: string, acao: string) {
    this._snackBar.open(mensagem, acao, {
      duration: 2500,
    });
  }


  onSubmit() {

    this.mainAPI.addWords(this.formulario.value).subscribe(

      response => {
        console.log(response);
        this.formulario.reset();
        this.openSnackBar("Smartcard salvo com Sucesso!", "close");
      },

      error => {
        console.error('Erro ao enviar a mensagem:', error);
        this.openSnackBar("Erro ao enviar.", "close");
      }


    );





  }


}
