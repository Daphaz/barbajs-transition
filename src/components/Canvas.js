import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import GSAP from "gsap";

import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";

import texture from "./assets/texture.jpg";

export default class Canvas {
  constructor({ domElement, template, scroll }) {
    this.template = template;
    this.container = domElement;
    this.scroll = scroll;

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.setupSetting();

    this.create();
    this.addObjects();
    this.resize();
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
      alpha: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.container.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.materials = [];
  }

  /**
   *  Events.
   */

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer.setSize(this.width, this.height);

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.camera.fov = (2 * Math.atan(this.height / 2 / 600) * 180) / Math.PI;

    this.materials.forEach(m => {
      m.uniforms.uResolution.value.x = this.width;
      m.uniforms.uResolution.value.y = this.height;
    });

    this.imageStore.forEach(item => {
      let bounds = item.img.getBoundingClientRect();
      item.mesh.scale.set(bounds.width,bounds.height,1);
      item.top = bounds.top;
      item.left = bounds.left + this.scroll.currentPos;
      item.width = bounds.width;
      item.height = bounds.height;

      item.mesh.material.uniforms.uQuadSize.value.x = bounds.width;
      item.mesh.material.uniforms.uQuadSize.value.y = bounds.height;

      item.mesh.material.uniforms.uTextureSize.value.x = bounds.width;
      item.mesh.material.uniforms.uTextureSize.value.y = bounds.height;
    });
  }

  onResize() {
    this.resize();
  }

  /**
   *  Add Object for Test.
   */

  addObjects() {
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100);

    const uTexture = this.textureLoader.load(texture);

    this.material = new THREE.ShaderMaterial({
      // wireframe: true,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: uTexture },
        uTextureSize: { value: new THREE.Vector2(100, 100) },
        uCorners: { value: new THREE.Vector4(0, 0, 0, 0) },
        uProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(this.width, this.height) },
        uQuadSize: { value: new THREE.Vector2(300, 300) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    // Timeline.
    this.tl = new GSAP.timeline()
      .to(this.material.uniforms.uCorners.value, {
        x: 1,
        duration: 1,
      })
      .to(
        this.material.uniforms.uCorners.value,
        {
          y: 1,
          duration: 1,
        },
        0.1
      )
      .to(
        this.material.uniforms.uCorners.value,
        {
          z: 1,
          duration: 1,
        },
        0.2
      )
      .to(
        this.material.uniforms.uCorners.value,
        {
          w: 1,
          duration: 1,
        },
        0.3
      );

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.set(300,300,1.0)

    // this.scene.add(this.mesh);

    this.mesh.position.x = 200;

    this.images = [...document.querySelectorAll('.js-image')];

    this.imageStore = this.images.map(img => {
      let bounds = img.getBoundingClientRect();
      let m = this.material.clone();
      this.materials.push(m);
      let texture = new THREE.Texture(img);
      texture.needsUpdate = true;

      m.uniforms.uTexture.value = texture;
      m.uniforms.uTexture.value = texture;



      let mesh = new THREE.Mesh(this.geometry,m);
      this.scene.add(mesh);
      mesh.scale.set(bounds.width,bounds.height,1);
      return {
        img,
        mesh,
        width: bounds.width,
        height: bounds.height,
        top: bounds.top,
        left: bounds.left
      }

    })
  }

  setPosition(){
    this.imageStore.forEach(o => {
      o.mesh.position.x = -this.scroll.currentPos + o.left - this.width / 2 + o.width / 2;
      o.mesh.position.y = -o.top + this.height / 2 - o.height / 2;
    })
  }

  /**
   *  Loop.
   */

  update() {
    let ellapsedTime = this.clock.getElapsedTime();

    this.setPosition();

    this.material.uniforms.uTime.value = ellapsedTime;
    // this.material.uniforms.uProgress.value = this.settings.progress;
    this.tl.progress(this.settings.progress);

    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }
}
