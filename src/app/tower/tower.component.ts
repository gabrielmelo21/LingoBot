import {AfterViewInit, Component, ElementRef, Input, OnDestroy, TrackByFunction, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {PlaySoundService} from "../services/play-sound.service";
import {Router} from "@angular/router";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {AuthService} from "../services/auth.service";
import {RewardService} from "../services/reward.service";



interface Wave {
  id: number;
  isActive: boolean;
}

@Component({
    selector: 'app-tower',
    templateUrl: './tower.component.html',
    standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass,
    NgStyle
  ],
    styleUrls: ['./tower.component.css']
})
export class TowerComponent implements AfterViewInit, OnDestroy{


  coinsToUpgrade = 0;
  gemasToUpgrade = 0;


  constructor(private playSoundService: PlaySoundService,
              private router: Router,
              private auth: AuthService,
              private rewardService: RewardService) {

    this.playSoundService.playSpaceTheme(true, "20%");

    this.executeAutoClickSequence();

    this.ranking = this.auth.getRanking();
    this.currentLevel = Math.floor(this.ranking / 4);

    this.verifyIsCanUpgrade();
    // pega os valores numericos do texto
    this.coinsToUpgrade = parseInt(this.resultadoPedagio.requisitos[1].nome.match(/\d+/)?.[0] || '0', 10);
    this.gemasToUpgrade = parseInt(this.resultadoPedagio.requisitos[0].nome.match(/\d+/)?.[0] || '0', 10);


  }



  /** Rules **/


  upgradeModal: boolean = false;
  ranking = this.auth.getRanking();
  currentLevel: number;
  firstNewFloor = Math.abs(this.ranking+1);
  lastNewFloor = Math.abs(this.ranking+4);


  resultadoPedagio: {
    precisaPagar: boolean;
    podeSubir: boolean;
    mensagem: string;
    requisitos: { nome: string; completo: boolean }[];
  } = {
    precisaPagar: false,
    podeSubir: false,
    mensagem: '',
    requisitos: []
  };


  checkQuestModal: boolean = false;

  getRequisitoIcon(index: number): string {
    const icons = [
      'assets/lingobot/itens/gemas.webp',
      'assets/lingobot/itens/gold.webp',
      'assets/lingobot/menu-icons/level.webp',
      'assets/lingobot/skills/listening.webp',
      'assets/lingobot/skills/speaking.webp',
      'assets/lingobot/skills/reading.webp',
      'assets/lingobot/skills/writing.webp'
    ];
    return icons[index];
  }

  verifyIsCanUpgrade(){
    this.resultadoPedagio = this.auth.checkQuest();
  }

  checkQuest(){
    this.checkQuestModal = !this.checkQuestModal;
  }

   openUpgradeModal(){
    this.playSoundService.playCleanSound2();
      this.upgradeModal = !this.upgradeModal;
   }

  upgradeTower() {

    // no video upgrade , alterar variavel de ranking do usuario, se estava 4, agora é 8 , soma
    // ver o tamanho do video para redirecionar

    this.playSoundService.playCleanSound2();

    localStorage.setItem("upgradeAnimation", "true");

    this.auth.decreaseLocalUserData({ gemas: this.gemasToUpgrade  });
    this.auth.decreaseLocalUserData({ tokens: this.coinsToUpgrade });

    this.router.navigate(['/upgradeTowerVideo']);
  }











   /** 3D CONFIGS **/

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() height: number = (this.auth.getRanking() / 4) * 200;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cylinder!: THREE.Mesh;
  private controls!: OrbitControls;
  private animationFrameId: any;
  // No início do componente (ou onde for acessível)
  private groundMesh!: THREE.Mesh; // ou Mesh<any, any>


  ngAfterViewInit(): void {
    this.initScene();
    this.startRenderingLoop();
    window.addEventListener('resize', this.onWindowResize);

    // Add click event listener
    this.renderer.domElement.addEventListener('click', this.onCanvasClick.bind(this), false);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onWindowResize);
    this.renderer.domElement.removeEventListener('click', this.onCanvasClick.bind(this), false);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.controls.dispose();
    this.renderer.dispose();
  }

  private onCanvasClick(event: MouseEvent): void {
    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects([this.cylinder]);

    if (intersects.length > 0) {
      // An object was clicked, check if it's the tower
      if (intersects[0].object === this.cylinder) {
        this.openQuestModal();
      }
    }
  }

  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();


    const textureLoader = new THREE.TextureLoader();
    //this.scene.background = textureLoader.load('assets/lingobot/tower/noite.webp');  // Coloque sua textura aqui


    const loader = new THREE.CubeTextureLoader();
    this.scene.background = loader.load([
      'assets/lingobot/tower/noite.webp', 'assets/lingobot/tower/noite.webp',
      'assets/lingobot/tower/noite.webp', 'assets/lingobot/tower/noite.webp',
      'assets/lingobot/tower/noite.webp', 'assets/lingobot/tower/noite.webp',
    ]);



    const cameraFar = this.height * 5.5;

    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      cameraFar
    );
    this.camera.position.set(550, this.height / 2, 15);
    this.camera.lookAt(0, this.height / 2, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;

    // Permite rotação vertical entre 45° e 90°, para visão mais dinâmica
    this.controls.minPolarAngle = Math.PI / 4;   // 45 graus
    this.controls.maxPolarAngle = Math.PI / 2;   // 90 graus

    // Limita o zoom (distância da câmera)
    this.controls.minDistance = 10; // mínimo distância para aproximar
    this.controls.maxDistance = this.height * 3; // máximo distância para afastar

    this.controls.target.set(0, this.height / 2, 0);
    this.controls.update();

    // Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(10, 10, 10);
    this.scene.add(ambientLight, pointLight);

    // Torre (cilindro)
    const geometry = new THREE.CylinderGeometry(20, 20, this.height, 128, 20, false);
    // openEnded: false → cria topo e base









    // Textura lateral
    const sideTexture = new THREE.TextureLoader().load('assets/lingobot/tower/andar-textura.webp');
    sideTexture.wrapS = THREE.RepeatWrapping;
    sideTexture.wrapT = THREE.RepeatWrapping;
    sideTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

    const verticalRepeat = Math.max(1, this.height / 50);
    sideTexture.repeat.set(3, verticalRepeat);

    const sideMaterial = new THREE.MeshStandardMaterial({
      map: sideTexture,
      side: THREE.DoubleSide,
    });

    // Textura topo
    const topTexture = new THREE.TextureLoader().load('assets/lingobot/tower/topo-textura.webp');
    topTexture.wrapS = THREE.RepeatWrapping;
    topTexture.wrapT = THREE.RepeatWrapping;
    topTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    topTexture.repeat.set(1, 1);

    const topMaterial = new THREE.MeshStandardMaterial({
      map: topTexture,
      side: THREE.DoubleSide
    });

    // Material da base (opcional: pode ser o mesmo que o topo, ou cor lisa)
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x999999,
      side: THREE.DoubleSide
    });

    // Ordem: [lateral, topo, base]
    const materials = [sideMaterial, topMaterial, baseMaterial];

    this.cylinder = new THREE.Mesh(geometry, materials);





// --- Textura para argolas ---
    const ringTexture = textureLoader.load('assets/lingobot/tower/chao-textura.webp');
    ringTexture.wrapS = THREE.RepeatWrapping;
    ringTexture.wrapT = THREE.RepeatWrapping;
    ringTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

// --- Criar argolas ---
    const numeroAndares = Math.floor(this.height / 50);
// --- Criar argolas ---
    for (let i = 0; i <= numeroAndares; i++) {
      const ringGeometry = new THREE.TorusGeometry(20.5, 1, 16, 100);

      const ringMaterial = new THREE.MeshStandardMaterial({
        map: ringTexture,
        metalness: 0.6,
        roughness: 0.3
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -this.height / 2 + i * 50;

      this.scene.add(ring);
    }


    //COLOCAR COLUNAS
    // --- Textura para colunas ---
    const colunaTexture = textureLoader.load('assets/lingobot/tower/chao-textura.webp');
    colunaTexture.wrapS = THREE.RepeatWrapping;
    colunaTexture.wrapT = THREE.RepeatWrapping;
    colunaTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

// --- Criar colunas ---
    const colunas = 6;
    const radius = 19.5; // Ajustado para grudar mais na torre

// --- Criar colunas ---
    for (let i = 0; i < colunas; i++) {
      const colunaGeometry = new THREE.CylinderGeometry(2, 2, this.height, 8);

      const colunaMaterial = new THREE.MeshStandardMaterial({
        map: colunaTexture,
        metalness: 0.5,
        roughness: 0.4
      });

      const coluna = new THREE.Mesh(colunaGeometry, colunaMaterial);

      const angle = (i / colunas) * Math.PI * 2;

      coluna.position.x = Math.cos(angle) * radius;
      coluna.position.z = Math.sin(angle) * radius;
      coluna.position.y = 0;

      this.scene.add(coluna);
    }



    /**
     NAO SEI OQUE FAZ AINDA
    const displacementTexture = new THREE.TextureLoader().load('assets/lingobot/tower/andar-textura.webp');
    displacementTexture.wrapS = THREE.RepeatWrapping;
    displacementTexture.wrapT = THREE.RepeatWrapping;
    displacementTexture.repeat.set(3, numeroAndares);

    sideMaterial.displacementMap = displacementTexture;
    sideMaterial.displacementScale = 2;  // ajuste conforme gosto
    **/


    this.scene.add(this.cylinder);





    // =================== AMEIAS (torre de xadrez) ===================

    const numeroAmeias = 8; // Número de blocos no topo
    const raio = 20; // mesmo raio do cilindro
    const largura = 4; // largura de cada bloco
    const profundidade = 2; // profundidade de cada bloco
    const alturaAmeia = 5; // altura de cada bloco

    const alturaDaTorre = this.height;


    const ameiaTexture = new THREE.TextureLoader().load('assets/lingobot/tower/ameias.webp');
    ameiaTexture.wrapS = THREE.RepeatWrapping;
    ameiaTexture.wrapT = THREE.RepeatWrapping;
    ameiaTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    ameiaTexture.repeat.set(1, 1); // ajuste se quiser repetir a textura


    for (let i = 0; i < numeroAmeias; i++) {
      const angle = (i / numeroAmeias) * Math.PI * 2;

      const x = Math.cos(angle) * raio;
      const z = Math.sin(angle) * raio;

      const geometry = new THREE.BoxGeometry(largura, alturaAmeia, profundidade);
      const material = new THREE.MeshStandardMaterial({
        map: ameiaTexture,
        side: THREE.DoubleSide
      });

      const ameia = new THREE.Mesh(geometry, material);

      // Posicionar acima do topo da torre
      ameia.position.set(x, alturaDaTorre / 2 + alturaAmeia / 2, z);

      // Fazer a ameia "olhar" para o centro da torre
      ameia.lookAt(0, alturaDaTorre / 2, 0);


      this.scene.add(ameia);

    }


//========================== planeta terra ======================
// Carregar textura da Terra (ou sua textura de solo)
    const groundTexture = new THREE.TextureLoader().load('assets/lingobot/tower/planeta.webp'); // substitua pela textura da Terra depois

// Geometria de esfera
    const groundGeometry = new THREE.SphereGeometry(3000, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2);
// Material
    const groundMaterial = new THREE.MeshStandardMaterial({
      map: groundTexture,
      side: THREE.FrontSide
    });


// Mesh
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);

    // Dentro da função onde você cria o planeta:
    this.groundMesh = groundMesh;


// Ajustar posição: empurrar a esfera para baixo para parecer "o chão"
   // groundMesh.position.y = -700; // centro da esfera abaixo da torre

// Centralizar o Brasil (aproximadamente -55° de longitude e -10° de latitude)
    groundMesh.rotation.y = THREE.MathUtils.degToRad(-15); // gira para alinhar a longitude do Brasil
    groundMesh.rotation.x = THREE.MathUtils.degToRad(10);  // inclina para alinhar a latitude do Brasil



    groundMesh.position.y = -3000;


// Adicionar à cena
    this.scene.add(groundMesh);






  }

  private clock = new THREE.Clock();

  private startRenderingLoop(): void {
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);

      const delta = this.clock.getDelta();
      this.groundMesh.rotation.y += 0.00002; // valor menor para rotação lenta como a Terra


      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }



  // Dentro do loop de animação:
  animate() {
    requestAnimationFrame(() => this.animate());

    // Roda o planeta aos poucos
    if (this.groundMesh) {
      this.groundMesh.rotation.y += 1; // ajuste a velocidade aqui
    }

    this.renderer.render(this.scene, this.camera);
  }


  private onWindowResize = () => {
    const canvas = this.canvasRef.nativeElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  };


  back() {
    this.playSoundService.playCleanSound2();
    this.router.navigate(['/babel-tower']);
  }



  modal: boolean = false;
  isClosing: boolean = false;
  openQuestModal() {
    if (this.modal) {
      this.animandoSaida = true;
      this.isClosing = true;

    } else {
      this.playSoundService.playHologram();
      this.animandoEntrada = true;
      this.isClosing = false;
      this.modal = true;
    }
  }



  animandoEntrada: boolean = false;
  animandoSaida: boolean = false;

  onAnimationEnd(event: AnimationEvent) {
    const { animationName } = event;

    if (animationName === 'entrarDaEsquerda') {
      this.animandoEntrada = false;
    }

    if (animationName === 'sairParaEsquerda') {
      this.animandoSaida = false;
       this.modal = false;
      this.isClosing = false;
    }
  }




  selectedIndex = 0;

  private touchStartX = 0;
  private touchEndX = 0;

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const swipeDistance = this.touchStartX - this.touchEndX;
    this.playSoundService.playPop();
    if (Math.abs(swipeDistance) < 30) return;

    if (swipeDistance > 0) {

      this.swipeLeft();
    } else {
      this.swipeRight();
    }
  }

  swipeLeft() {
    if (this.selectedIndex < this.resultadoPedagio.requisitos.length - 1) {
      this.selectedIndex++;
    }
  }

  swipeRight() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  getItemStyle(index: number) {
    const offset = index - this.selectedIndex;
    const baseScale = 1 - Math.abs(offset) * 0.2;
    const translateX = offset * 240;

    return {
      transform: `translateX(${translateX}px) scale(${baseScale})`,
      opacity: Math.abs(offset) > 2 ? 0 : 1,
      zIndex: 100 - Math.abs(offset),
    };
  }

  getLevelImagePaths(): string[] {
    const levelStr = this.currentLevel.toString();
    return levelStr.split('').map(digit => `assets/lingobot/levels/${digit}.webp`);
  }
























  isClicking: boolean = false;
  isVisible: boolean = true;
  waves: Wave[] = [];
  private waveCounter: number = 0;

  onHandClick(): void {
    this.isClicking = true;
    this.createWaves();

    // Remove a classe de click após a animação
    setTimeout(() => {
      this.isClicking = false;
    }, 300);
  }

  // Método público para executar 3 cliques automáticos e depois sumir
  executeAutoClickSequence(): void {

    this.playSoundService.playPop();
    this.isVisible = true;
    let clickCount = 0;
    const totalClicks = 3;
    const clickInterval = 800; // 800ms entre cada clique

    const autoClick = () => {
      if (clickCount < totalClicks) {
        this.performClick();
        clickCount++;

        setTimeout(autoClick, clickInterval);

      } else {
        // Após os 3 cliques, espera um pouco e some
        setTimeout(() => {
          this.isVisible = false;
        }, 500);
      }
    };

    autoClick();
  }

  // Método para mostrar a mãozinha novamente
  showHand(): void {
    this.isVisible = true;
  }

  trackByWaveId(index: number, wave: Wave): number {
    return wave.id;
  }

  private performClick(): void {
    this.isClicking = true;
    this.createWaves();

    // Remove a classe de click após a animação
    setTimeout(() => {
      this.isClicking = false;
    }, 300);
  }

  private createWaves(): void {
    // Limpa ondas antigas
    this.waves = [];

    // Cria 3 ondas
    for (let i = 0; i < 3; i++) {
      const wave: Wave = {
        id: this.waveCounter++,
        isActive: true
      };

      this.waves.push(wave);

      // Remove a onda após a animação
      setTimeout(() => {
        const index = this.waves.findIndex(w => w.id === wave.id);
        if (index > -1) {
          this.waves.splice(index, 1);
        }
      }, 1000);
    }
  }
}
