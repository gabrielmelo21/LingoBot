import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MainAPIService} from "../../services/main-api.service";
import {catchError, map, of, throwError} from "rxjs";
import {Router} from "@angular/router";
import {PlaySoundService} from "../../services/play-sound.service";



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {



  features: string[] = [
    'Descubra significados de expressões que não têm tradução direta.',
    'Receba explicações detalhadas pelo LingoBot',
    'Salve as explicações em flashcards personalizados.',
    'Estude com vídeos em inglês no YouTube.',
    "Desvende Expressões em Inglês com o LingoBot",
    "Tire suas dúvidas com o LingoBot",
    "Resolva exercícios propostos pelo LingoBot"
  ];



  isLoginMode = true;
  isLoading: boolean = false;
  loginIsLoading: boolean = false;
  loginErrorMsg: boolean = false;
  successImg: boolean = false;
  failImg: boolean = false;

  showPresentation = true;

  tentarNovamente() {
    this.playSound.playCleanNavigationSound();
    this.failImg = false;
    this.successImg = false;
    this.isLoading = false;
  }

  signupForm: FormGroup;
  loginForm: FormGroup;


  currentStep: number = 1; // Controla a etapa atual do formulário

  // Método para avançar para a próxima etapa
  nextStep(): void {
    this.playSound.playCleanNavigationSound();
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  // Método para voltar para a etapa anterior
  prevStep(): void {
    this.playSound.playCleanNavigationSound();
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }



  isModalOpen: boolean = false; // Controla a visibilidade do modal

  modalType:any = "";

  openModal(type:any): void {
    this.playSound.playCleanNavigationSound();
    this.modalType = type;
    this.isModalOpen = true;
  }


  closeModal(): void {
    this.playSound.playCleanNavigationSound();
    this.isModalOpen = false;
  }

  constructor(private playSound: PlaySoundService, private fb: FormBuilder, private mainAPI: MainAPIService, private router: Router) {

        this.rotateFeatures();



    localStorage.setItem("refresh_pos_login", "false");
    localStorage.setItem('logged', "false");

    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmSenha: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.loginForm = this.fb.group({
       email: ['', [Validators.required, Validators.email]],
       password: ['', [Validators.required, Validators.minLength(6)]],
    })

  }



  currentFeatureIndex: number = 0;
  rotateFeatures() {
    setInterval(() => {
      const featureElement = document.querySelector('.rotating-feature') as HTMLElement;
      if (featureElement) {
        // Inicia o fade-out
        featureElement.classList.remove('fade-in');

        // Aguarda o término do fade-out antes de atualizar o texto
        setTimeout(() => {
          this.currentFeatureIndex = (this.currentFeatureIndex + 1) % this.features.length;
          featureElement.textContent = this.features[this.currentFeatureIndex];

          // Inicia o fade-in
          featureElement.classList.add('fade-in');
        }, 500); // Tempo correspondente à duração do fade-out
      }
    }, 6000); // Intervalo de 6 segundos entre as frases
  }



  passwordMatchValidator(form: FormGroup) {
    return form.get('senha')?.value === form.get('confirmSenha')?.value ? null : { mismatch: true };
  }
  onSubmit() {
    this.playSound.playCleanNavigationSound();

    this.isLoading = true;

    const formData = this.signupForm.value;
    const modifiedData = {
      nome: formData.nome,
      sobrenome: formData.sobrenome,
      email: formData.email,
      picture: 'https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1',
      credits: 25,
      vip: false,
      checkin: false,
      password:  formData.senha
    };

    //chamar a api

    this.mainAPI.saveNewUser(modifiedData).pipe(
      map(resp => {
        this.isLoading = false;
        this.successImg = true;
        // alert("resposta no MAP " + JSON.stringify(resp));

        // chamar função de redirect login
      }),
      catchError((err: any) => {
        this.isLoading = false;
        this.failImg = true;

        console.error('Erro ao processar resposta da API:', err);
        // Retorne um observable aqui, por exemplo, usando of()
        return of(); // Retorna um observable vazio
      })
    ).subscribe();



  } // end onsubmit





  public exec_login(email: string, password: string) {
    const data = { email: email, password: password };

    this.mainAPI.login(data).pipe(
      map(resp => {
        this.loginIsLoading = false;
        console.log('Login bem-sucedido:', resp);

          //redirect
        localStorage.setItem('UserId', resp);
        localStorage.setItem('logged', "true");
        this.router.navigate(['/redirect']);
        // provavelmente vou ter que criar uma pagina redirect - pra dar tempo de carregar as variaveis
      }),
      catchError(err => {
        this.loginIsLoading = false;
        this.loginErrorMsg = true;
         // Trate erros aqui
        console.error('Erro ao fazer login:', err);
        return of(); // Retorne um observable vazio para finalizar o fluxo
      })
    ).subscribe();
  }



  onLogin() {
    this.loginIsLoading = true;
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      this.exec_login(email, password);
    }
  }
}
