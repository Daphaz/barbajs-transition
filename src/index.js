import NormalizeWheel from "normalize-wheel";

import Canvas from "./components/Canvas";

class App {
  constructor() {
    this.createCanvas();

    this.addEventListeners();

    this.onResize();

    this.update();
  }

  createCanvas() {
    this.canvas = new Canvas({
      template: this.template,
      domElement: document.querySelector("canvas.webgl"),
    });
  }

  /**
   * Events.
   */

  onResize() {
    window.requestAnimationFrame((_) => {
      if (this.canvas && this.canvas.onResize) {
        this.canvas.onResize();
      }
    });
  }

  onTouchDown(event) {
    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(event);
    }
  }

  onTouchMouve(event) {
    if (this.canvas && this.canvas.onTouchMouve) {
      this.canvas.onTouchMouve(event);
    }
  }

  onTouchUp(event) {
    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(event);
    }
  }

  onWheel(event) {
    const normalizedWheel = NormalizeWheel(event);

    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(normalizedWheel);
    }
  }

  /**
   * Loop.
   */
  update() {
    if (this.canvas && this.canvas.update) {
      this.canvas.update();
    }

    window.requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Listeners.
   */
  addEventListeners() {
    window.addEventListener("mousewheel", this.onWheel.bind(this));

    window.addEventListener("mousedown", this.onTouchDown.bind(this));
    window.addEventListener("mousemove", this.onTouchMouve.bind(this));
    window.addEventListener("mouseup", this.onTouchUp.bind(this));

    window.addEventListener("touchstart", this.onTouchDown.bind(this));
    window.addEventListener("touchmove", this.onTouchMouve.bind(this));
    window.addEventListener("touchend", this.onTouchUp.bind(this));

    window.addEventListener("resize", this.onResize.bind(this));
  }
}

new App();
