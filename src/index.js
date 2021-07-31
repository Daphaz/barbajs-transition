import NormalizeWheel from "normalize-wheel";
import ASScroll from '@ashthornton/asscroll';
import barba from "@barba/core";

import Canvas from "./components/Canvas";
import GSAP from "gsap/gsap-core";

class App {
  constructor() {
    this.createASScroll();
    this.createCanvas();
    this.barbaInit();

    this.addEventListeners();

    this.onResize();

    this.update();
  }

  createCanvas() {
    this.canvas = new Canvas({
      template: this.template,
      domElement: document.getElementById("container"),
      scroll: this.asscroll
    });
  }

  createASScroll() {
    this.asscroll = new ASScroll({
      disableRaf: true
    });

    this.asscroll.enable({
      horizontalScroll: !document.body.classList.contains('b-inside'),
    })
  }

  barbaInit(){
    let that = this;
    barba.init({
      transitions: [{
        name: 'from-home-transition',
        from: {
          namespace: ['home']
        },
        leave(data) {
          that.asscroll.disable();
          return GSAP.timeline()
            .to(data.current.container,{
              opacity: 0
            })
        },
        enter(data) {
          that.asscroll = new ASScroll({
            disableRaf: true,
            containerElement: data.next.container.querySelector('[asscroll-container]')
          })
          that.asscroll.enable({
            newScrollElements: data.next.container.querySelector('.scroll-wrap')
          })

          return GSAP.timeline()
            .from(data.current.container,{
              opacity: 0,
              onComplete: () => {
                that.canvas.container.style.visibility = 'hidden'
              }
            })
        }
      },{
        name: 'from-inside-transition',
        from: {
          namespace: ['inside']
        },
        leave(data) {
          that.asscroll.disable();
          return GSAP.timeline()
            .to('.curtain',{
              duration: 0.3,
              y: 0
            })
            .to(data.current.container,{
              opacity: 0
            })
        },
        enter(data) {
          that.asscroll = new ASScroll({
            disableRaf: true,
            containerElement: data.next.container.querySelector('[asscroll-container]')
          })
          that.asscroll.enable({
            horizontalScroll: true,
            newScrollElements: data.next.container.querySelector('.scroll-wrap')
          })

          that.canvas.container.style.visibility = 'visible'

          return GSAP.timeline()
            .to('.curtain',{
              duration: 0.3,
              y: '-100%'
            })
            .from(data.current.container,{
              opacity: 0,
            })
        }
      }]
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
    if(this.asscroll){
      this.asscroll.update()
    }
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
