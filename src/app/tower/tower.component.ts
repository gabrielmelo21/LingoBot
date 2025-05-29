import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {PlaySoundService} from "../services/play-sound.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-tower',
  templateUrl: './tower.component.html',
  standalone: true,
  styleUrls: ['./tower.component.css']
})
export class TowerComponent implements AfterViewInit, OnDestroy {

  constructor(private playSoundService: PlaySoundService, private router: Router) { }

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() height: number = 400; // 200 = 4 andares

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


  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onWindowResize);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.controls.dispose();
    this.renderer.dispose();
  }

  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();


    const textureLoader = new THREE.TextureLoader();
    //this.scene.background = textureLoader.load('assets/lingobot/tower/noite.png');  // Coloque sua textura aqui


    const loader = new THREE.CubeTextureLoader();
    this.scene.background = loader.load([
      'assets/lingobot/tower/noite.png', 'assets/lingobot/tower/noite.png',
      'assets/lingobot/tower/noite.png', 'assets/lingobot/tower/noite.png',
      'assets/lingobot/tower/noite.png', 'assets/lingobot/tower/noite.png',
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
    const sideTexture = new THREE.TextureLoader().load('assets/lingobot/tower/andar-textura.png');
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
    const topTexture = new THREE.TextureLoader().load('assets/lingobot/tower/topo-textura.png');
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
    const ringTexture = textureLoader.load('assets/lingobot/tower/chao-textura.png');
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
    const colunaTexture = textureLoader.load('assets/lingobot/tower/chao-textura.png');
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
    const displacementTexture = new THREE.TextureLoader().load('assets/lingobot/tower/andar-textura.png');
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


    const ameiaTexture = new THREE.TextureLoader().load('assets/lingobot/tower/ameias.png');
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
    const groundTexture = new THREE.TextureLoader().load('assets/lingobot/tower/planeta.png'); // substitua pela textura da Terra depois

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
}
