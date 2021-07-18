import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";

import texture from "./assets/texture.jpg";

export default class Canvas {
  constructor({ domElement, template }) {
    this.template = template;
    this.canvas = domElement;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.setupSetting();

    this.create();
    this.resize();
    this.addObjects();
  }

  /**
   *  Settings
   */

  setupSetting() {
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.001);
  }

  create() {
    this.textureLoader = new THREE.TextureLoader();
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      30,
      this.width / this.height,
      10,
      1000
    );
    this.camera.position.z = 600;

    this.camera.fov = (2 * Math.atan(this.height / 2 / 600) * 180) / Math.PI;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: this.canvas,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }

  /**
   *  Events.
   */

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.renderer.setSize(this.width, this.height);

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  onResize() {
    this.resize();
  }

  /**
   *  Add Object for Test.
   */

  addObjects() {
    this.geometry = new THREE.PlaneBufferGeometry(300, 300, 100, 100);

    const uTexture = this.textureLoader.load(texture);

    this.material = new THREE.ShaderMaterial({
      // wireframe: true,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: uTexture },
        uTextureSize: { value: new THREE.Vector2(100, 100) },
        uProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(this.width, this.height) },
        uQuadSize: { value: new THREE.Vector2(300, 300) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);

    this.mesh.position.x = 200;
    this.mesh.rotation.z = 0.5;
  }

  /**
   *  Loop.
   */

  update() {
    let ellapsedTime = this.clock.getElapsedTime();

    this.material.uniforms.uTime.value = ellapsedTime;
    this.material.uniforms.uProgress.value = this.settings.progress;

    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }
}
