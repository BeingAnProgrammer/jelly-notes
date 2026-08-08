import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
  input,
} from '@angular/core';
import * as THREE from 'three';

// A jellyfish recreated entirely in code: a shaded, ribbed bell with a mottled margin,
// an iridescent fresnel rim and inner glow, plus undulating tentacles/oral arms driven by
// a vertex-shader traveling wave. Ported from a react-three-fiber scene to plain three.js
// so it can run inside an Angular (zoneless, SSR) component without pulling in React.

const BELL_VERT = /* glsl */ `
  varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;
  void main(){
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position,1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const BELL_FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;

  void main(){
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vView);
    float fres = pow(1.0 - max(dot(N,V),0.0), 2.4);

    float h = clamp((vPos.y + 0.40)/1.40, 0.0, 1.0);
    float ang = atan(vPos.z, vPos.x);

    // vertical colour gradient: deep blue apex -> accent -> pale ink-blue margin
    vec3 top  = vec3(0.18, 0.32, 0.72);
    vec3 mid  = vec3(0.30, 0.52, 0.96);
    vec3 edge = vec3(0.42, 0.68, 1.00);
    vec3 col = mix(edge, mid, smoothstep(0.0,0.5,h));
    col = mix(col, top, smoothstep(0.45,1.0,h));

    float ribs = abs(fract(ang/(2.0*3.14159265)*18.0) - 0.5) * 2.0;
    float ribLine = smoothstep(0.80, 0.99, ribs);
    float ribMask = smoothstep(0.98,0.55,h) * smoothstep(-0.02,0.22,h);
    col *= 1.0 - ribLine * 0.55 * ribMask;

    float backw = gl_FrontFacing ? 1.0 : 0.0;

    col += fres * vec3(0.14, 0.26, 0.55);
    col += (1.0 - fres) * vec3(0.05,0.09,0.23) * (0.5 + 0.5*h);

    float alpha = 0.50 + fres*0.45 + ribLine*ribMask*0.22;
    alpha *= mix(0.30, 1.0, backw);
    alpha = clamp(alpha, 0.0, 0.96);
    gl_FragColor = vec4(col, alpha);
  }
`;

const STRAND_VERT = /* glsl */ `
  uniform float uTime; uniform float uLen; uniform float uPhase; uniform float uAmp; uniform float uFreq;
  varying float vK; varying vec3 vNormal; varying vec3 vView; varying float vWorldY;
  void main(){
    vec3 p = position;
    float k = clamp(-p.y / uLen, 0.0, 1.0);
    float amp = k*k*uAmp;
    p.x += sin(uTime*1.5 + k*uFreq + uPhase) * amp;
    p.z += cos(uTime*1.2 + k*uFreq*0.9 + uPhase*1.3) * amp;
    vK = k;
    vWorldY = (modelMatrix * vec4(p,1.0)).y;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(p,1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const STRAND_FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uTop; uniform vec3 uTip; uniform float uOpacity; uniform vec2 uFade; uniform vec2 uFadeTop;
  varying float vK; varying vec3 vNormal; varying vec3 vView; varying float vWorldY;
  void main(){
    float fres = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)),0.0), 1.6);
    float vis = smoothstep(uFade.x, uFade.y, vWorldY)
              * smoothstep(uFadeTop.y, uFadeTop.x, vWorldY);
    vec3 col = mix(uTop, uTip, vK) + fres*0.25;
    float alpha = ((1.0 - vK*0.92) * uOpacity + fres*0.12) * vis;
    gl_FragColor = vec4(col, clamp(alpha,0.0,1.0));
  }
`;

interface StrandSpec {
  readonly angle: number;
  readonly radius: number;
  readonly yOffset: number;
  readonly length: number;
  readonly thickness: number;
  readonly curl: number;
  readonly amp: number;
  readonly freq: number;
  readonly phase: number;
  readonly top: string;
  readonly tip: string;
  readonly opacity: number;
}

function buildStrandSpecs(): StrandSpec[] {
  const specs: StrandSpec[] = [];
  // Long, thin marginal tentacles.
  for (let i = 0; i < 28; i++) {
    specs.push({
      angle: (i / 28) * Math.PI * 2,
      radius: 0.82,
      yOffset: -0.25,
      length: 4.2,
      thickness: 0.016,
      curl: 0.05,
      amp: 0.5,
      freq: 7.0,
      phase: i * 0.5,
      top: '#b3caff',
      tip: '#edf2ff',
      opacity: 0.55,
    });
  }
  // Frilly, fuller oral arms clustered under the centre.
  for (let i = 0; i < 8; i++) {
    specs.push({
      angle: (i / 8) * Math.PI * 2,
      radius: 0.22,
      yOffset: -0.1,
      length: 2.0,
      thickness: 0.07,
      curl: 0.14,
      amp: 0.32,
      freq: 10.0,
      phase: i * 1.0 + 0.4,
      top: '#e0eaff',
      tip: '#5b8ef5',
      opacity: 0.72,
    });
  }
  return specs;
}

function strandGeometry(length: number, thickness: number, curl: number): THREE.BufferGeometry {
  const seg = 40;
  const radial = 6;
  const spine: THREE.Vector3[] = [];
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    spine.push(
      new THREE.Vector3(Math.sin(t * 3) * curl * t, -t * length, Math.cos(t * 2) * curl * t),
    );
  }
  const curve = new THREE.CatmullRomCurve3(spine);
  const frames = curve.computeFrenetFrames(seg, false);
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    const p = curve.getPointAt(t);
    const r = thickness * (1 - Math.pow(t, 0.75));
    const nf = frames.normals[i];
    const bf = frames.binormals[i];
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const c = Math.cos(a);
      const s = Math.sin(a);
      pos.push(
        p.x + (c * nf.x + s * bf.x) * r,
        p.y + (c * nf.y + s * bf.y) * r,
        p.z + (c * nf.z + s * bf.z) * r,
      );
    }
  }
  for (let i = 0; i < seg; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j;
      const b = a + radial + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geometry.setIndex(idx);
  geometry.computeVertexNormals();
  return geometry;
}

@Component({
  selector: 'app-jellyfish-scene',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas></canvas>`,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
})
export class JellyfishSceneComponent implements AfterViewInit, OnDestroy {
  readonly loopSeconds = input(20);

  @ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly timeUniform = { value: 0 };
  private startTime = 0;
  private readonly disposables: Array<{ dispose(): void }> = [];

  private renderer?: THREE.WebGLRenderer;
  private camera?: THREE.PerspectiveCamera;
  private scene?: THREE.Scene;
  private jellyGroup?: THREE.Group;
  private resizeObserver?: ResizeObserver;
  private frameId?: number;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.startTime = performance.now();
    this.setupScene();
    this.observeResize();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.renderFrame(0);
    } else {
      this.animate();
    }
  }

  ngOnDestroy(): void {
    if (this.frameId !== undefined) cancelAnimationFrame(this.frameId);
    this.resizeObserver?.disconnect();
    this.disposables.forEach((d) => d.dispose());
    this.renderer?.dispose();
  }

  private setupScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement!;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.4, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const { width, height } = parent.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    const jellyGroup = new THREE.Group();
    scene.add(jellyGroup);

    const bellGeometry = new THREE.SphereGeometry(1, 160, 160, 0, Math.PI * 2, 0, 1.98);
    const bellMaterial = new THREE.ShaderMaterial({
      vertexShader: BELL_VERT,
      fragmentShader: BELL_FRAG,
      uniforms: { uTime: this.timeUniform },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const bell = new THREE.Mesh(bellGeometry, bellMaterial);
    bell.scale.set(1, 0.84, 1);
    jellyGroup.add(bell);
    this.disposables.push(bellGeometry, bellMaterial);

    const glowGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: '#5b8ef5',
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(0, 0.18, 0);
    jellyGroup.add(glow);
    this.disposables.push(glowGeometry, glowMaterial);

    for (const spec of buildStrandSpecs()) {
      const geometry = strandGeometry(spec.length, spec.thickness, spec.curl);
      const material = new THREE.ShaderMaterial({
        vertexShader: STRAND_VERT,
        fragmentShader: STRAND_FRAG,
        uniforms: {
          uTime: this.timeUniform,
          uLen: { value: spec.length },
          uPhase: { value: spec.phase },
          uAmp: { value: spec.amp },
          uFreq: { value: spec.freq },
          uTop: { value: new THREE.Color(spec.top) },
          uTip: { value: new THREE.Color(spec.tip) },
          uOpacity: { value: spec.opacity },
          uFade: { value: new THREE.Vector2(-1.85, -0.7) },
          uFadeTop: { value: new THREE.Vector2(-0.62, -0.22) },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(Math.cos(spec.angle) * spec.radius, spec.yOffset, Math.sin(spec.angle) * spec.radius);
      jellyGroup.add(mesh);
      this.disposables.push(geometry, material);
    }

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.jellyGroup = jellyGroup;
  }

  private observeResize(): void {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement!;
    this.resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!this.renderer || !this.camera || width === 0 || height === 0) return;
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) this.renderFrame(this.timeUniform.value);
    });
    this.resizeObserver.observe(parent);
  }

  private renderFrame(t: number): void {
    if (!this.renderer || !this.scene || !this.camera || !this.jellyGroup) return;
    this.timeUniform.value = t;
    this.jellyGroup.rotation.y = -(t / this.loopSeconds()) * Math.PI * 2;
    this.jellyGroup.position.y = Math.sin(t * 0.6) * 0.08;
    const k = Math.sin(t * 1.7);
    this.jellyGroup.scale.set(1 + k * 0.05, 1 - k * 0.06, 1 + k * 0.05);
    this.renderer.render(this.scene, this.camera);
  }

  private animate = (): void => {
    this.renderFrame((performance.now() - this.startTime) / 1000);
    this.frameId = requestAnimationFrame(this.animate);
  };
}
