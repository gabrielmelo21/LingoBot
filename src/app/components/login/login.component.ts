import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MainAPIService} from "../../services/main-api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PlaySoundService} from "../../services/play-sound.service";
import {AuthService} from "../../services/auth.service";

import * as bcrypt from 'bcryptjs';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  signupForm: FormGroup;
  loginForm: FormGroup;


  // Função para identificar se é PC ou celular
  getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile/i.test(userAgent)) {
      return 'mobile';
    } else {
      return 'desktop';
    }
  }

  // Função para capturar a resolução da tela
  getScreenResolution() {
    return "width:"+window.screen.width+",height:"+window.screen.height
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
  features: string[] = [
    'Descubra significados de expressões que não têm tradução direta.',
    'Receba explicações detalhadas pelo LingoBot',
    'Salve as explicações em flashcards personalizados.',
    'Estude com vídeos em inglês no YouTube.',
    "Desvende Expressões em Inglês com o LingoBot",
    "Resolva desafios de Listening, Reading e Writing",
    "Resolva exercícios propostos pelo LingoBot"
  ];





  isLoginMode = true;
  isLoading: boolean = false;
  loginIsLoading: boolean = false;
  successImg: boolean = false;
  failImg: boolean = false;
  showPresentation = true;
  referralCode: string = '';

  tentarNovamente() {
    this.playSound.playCleanNavigationSound();
    this.failImg = false;
    this.successImg = false;
    this.modalType = "criarConta"
    this.isLoading = false;
  }



  currentStep: number = 1; // Controla a etapa atual do formulário

  // Função para passar para a próxima etapa
  nextStep() {
      if (this.currentStep === 1) {
        this.currentStep = 2;
      }
  }

  // Função para voltar para a etapa anterior
  prevStep() {
    if (this.currentStep === 2) {
      this.currentStep = 1;
    }
  }



  isModalOpen: boolean = false; // Controla a visibilidade do modal

  modalType:any = "";

  openModal(type:any): void {
    this.playSound.playCleanNavigationSound();
    this.failImg = false;
    this.successImg = false;
    this.modalType = type;
    this.isModalOpen = true;
  }


  closeModal(): void {
    this.playSound.playCleanNavigationSound();
    this.isModalOpen = false;
  }

  constructor(private route: ActivatedRoute, private auth: AuthService ,private playSound: PlaySoundService, private fb: FormBuilder, private mainAPI: MainAPIService, private router: Router) {

        this.rotateFeatures();



    // Criar o formulário com as validações PARA CRIAR CONTA
    this.signupForm = this.fb.group({
      nome: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)]],
      sobrenome: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)]],
      dataNascimento: ['', Validators.required],
      genero: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmSenha: ['', [Validators.required, Validators.minLength(6)]],
      referal_code: [localStorage.getItem("referralCode")], // Preenche automaticamente o referral_code
      device_type: [this.getDeviceType()],
      screen_resolution: [this.getScreenResolution()],
      language: [navigator.language],
      timezone: [Intl.DateTimeFormat().resolvedOptions().timeZone]
    }, { validator: this.passwordMatchValidator });




    this.loginForm = this.fb.group({
       email: ['', [Validators.required, Validators.email]],
       password: ['', [Validators.required, Validators.minLength(6)]],
    })

  }





  // Função para validar se as senhas coincidem
  passwordMatchValidator(group: FormGroup) {
    const senha = group.get('senha')?.value;
    const confirmSenha = group.get('confirmSenha')?.value;
    return senha === confirmSenha ? null : { mismatch: true };
  }


  // Método para chamar a criação do usuário
  onSubmit() {
    if(this.signupForm.valid){
    this.isLoading = true;
      const usuario = {
        nome: this.signupForm.value.nome,
        sobrenome: this.signupForm.value.sobrenome,
        email: this.signupForm.value.email,
        password: this.signupForm.value.senha,
        gender: this.signupForm.value.genero,
        data_nascimento: this.signupForm.value.dataNascimento,
        referal_code: this.signupForm.value.referal_code || null,
        device_type: this.signupForm.value.device_type,
        screen_resolution: this.signupForm.value.screen_resolution,
        language: this.signupForm.value.language,
        timezone: this.signupForm.value.timezone
      };

      // Gerar o hash da senha
      bcrypt.hash(usuario.password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Erro ao gerar o hash da senha:', err);
          this.isLoading = false;
          return;
        }

        // Substitui a senha com o hash gerado
        usuario.password = hashedPassword;

      //  console.log(usuario.password);
      })


    // Chamada para o serviço API
    this.mainAPI.criarUsuario(usuario).subscribe(
      (response) => {
        this.isLoading = false;
        this.successImg = true;
    //    console.log(response)
        this.modalType = ""
      },
      (error) => {
        this.isLoading = false;
        this.failImg = true;
        console.log(error)
        this.modalType = ""
      }
    );
    }
  }




















// this.router.navigate(['/redirect']);

  loginErrorMsg = ""


  onLogin(email: string, password: string): void {
    this.loginIsLoading = true;

    this.mainAPI.login(email, password).subscribe(
      (response) => {
        this.loginIsLoading = false;

        // Verificar se a resposta contém o token e o refresh token
        if (response && response.access_token && response.refresh_token) {
          // Chama o método setToken para armazenar os tokens
          this.auth.setToken(response.access_token, response.refresh_token);

          // Redireciona o usuário para a página inicial (home)
          this.router.navigate(['/home']);
        } else {
          // Caso a resposta não tenha os tokens, exibe uma mensagem de erro
          alert('Erro: Tokens não encontrados na resposta.');
        }
      },
      (error) => {
        this.loginIsLoading = false;
        this.loginErrorMsg = "Erro ao tentar fazer login. Verifique suas credenciais.";
        // Tratamento de erro
        console.error('Erro no login:', error);
      }
    );
  }





  validateLogin() {
    if (this.loginForm.invalid) return; // Se o formulário for inválido, não faz nada

    this.loginIsLoading = true;
    this.loginErrorMsg = '';

    const { email, password } = this.loginForm.value;
    this.onLogin(email, password);
  }

}
