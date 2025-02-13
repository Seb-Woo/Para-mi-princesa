//Para el corazon
class Tool {
  static randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static randomColorRGB() {
    return `rgb(${this.randomNumber(0, 255)}, ${this.randomNumber(
      0,
      255
    )}, ${this.randomNumber(0, 255)})`;
  }

  static randomColorHSL(hue, saturation, lightness) {
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  static gradientColor(ctx, cr, cg, cb, ca, x, y, r) {
    const col = `${cr},${cg},${cb}`;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${col}, ${ca * 1})`);
    g.addColorStop(0.5, `rgba(${col}, ${ca * 0.5})`);
    g.addColorStop(1, `rgba(${col}, ${ca * 0})`);
    return g;
  }
}

class Angle {
  constructor(a) {
    this.a = a;
    this.rad = (this.a * Math.PI) / 180;
  }

  incDec(num) {
    this.a += num;
    this.rad = (this.a * Math.PI) / 180;
  }
}

let canvas;
let offCanvas;

class Canvas {
  constructor(bool) {
    this.canvas = document.createElement("canvas");
    if (bool === true) {
      this.canvas.style.position = "relative";
      this.canvas.style.display = "block";
      this.canvas.style.top = 0;
      this.canvas.style.left = 0;
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.width < 768 ? (this.heartSize = 180) : (this.heartSize = 250);
    this.mouseX = null;
    this.mouseY = null;
    this.hearts = [];
    this.offHeartNum = 1;
    this.offHearts = [];
    this.data = null;
  }

  onInit() {
    let index = 0;
    for (let i = 0; i < this.height; i += 12) {
      for (let j = 0; j < this.width; j += 12) {
        let oI = (j + i * this.width) * 4 + 3;
        if (this.data[oI] > 0) {
          index++;
          const h = new Heart(
            canvas.ctx,
            j + Tool.randomNumber(-3, 3),
            i + Tool.randomNumber(-3, 3),
            Tool.randomNumber(6, 12),
            index
          );
          canvas.hearts.push(h);
        }
      }
    }
  }

  offInit() {
    for (let i = 0; i < this.offHeartNum; i++) {
      const s = new Heart(
        this.ctx,
        this.width / 2,
        this.height / 2.3,
        this.heartSize
      );
      this.offHearts.push(s);
    }
    for (let i = 0; i < this.offHearts.length; i++) {
      this.offHearts[i].offRender(i);
    }
    this.data = this.ctx.getImageData(0, 0, this.width, this.height).data;
    this.onInit();
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.hearts.length; i++) {
      this.hearts[i].render(i);
    }
  }

  resize() {
    this.offHearts = [];
    this.hearts = [];
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.width < 768 ? (this.heartSize = 180) : (this.heartSize = 250);
  }
}

class Heart {
  constructor(ctx, x, y, r, i) {
    this.ctx = ctx;
    this.init(x, y, r, i);
  }

  init(x, y, r, i) {
    this.x = x;
    this.xi = x;
    this.y = y;
    this.yi = y;
    this.r = r;
    this.i = i * 0.5 + 200;
    this.l = this.i;
    this.c = Tool.randomColorHSL(Tool.randomNumber(-5, 5), 80, 60);
    this.a = new Angle(Tool.randomNumber(0, 360));
    this.v = {
      x: Math.random(),
      y: -Math.random(),
    };
    this.ga = Math.random();
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = this.ga;
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.moveTo(this.x, this.y + this.r);
    ctx.bezierCurveTo(
      this.x - this.r - this.r / 5,
      this.y + this.r / 1.5,
      this.x - this.r,
      this.y - this.r,
      this.x,
      this.y - this.r / 5
    );
    ctx.bezierCurveTo(
      this.x + this.r,
      this.y - this.r,
      this.x + this.r + this.r / 5,
      this.y + this.r / 1.5,
      this.x,
      this.y + this.r
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  updateParams() {
    this.a.incDec(1);
    Math.sin(this.a.rad) < 0
      ? (this.r = -Math.sin(this.a.rad) * 20)
      : (this.r = Math.sin(this.a.rad) * 20);
  }

  updatePosition() {
    this.l -= 1;
    if (this.l < 0) {
      this.v.y -= 0.01;
      this.v.x += 0.02;
      this.y += this.v.y;
      this.x += this.v.x;
    }
  }

  wrapPosition() {
    if (this.x > canvas.width * 1.5) {
      this.init(this.xi, this.yi, Tool.randomNumber(6, 12), this.i);
    }
  }

  render() {
    this.wrapPosition();
    this.updateParams();
    this.updatePosition();
    this.draw();
  }

  offRender(i) {
    this.draw();
  }
}

(function () {
  "use strict";
  window.addEventListener("load", function () {
    offCanvas = new Canvas(false);
    canvas = new Canvas(true);

    offCanvas.offInit();

    function render() {
      window.requestAnimationFrame(function () {
        canvas.render();
        render();
      });
    }

    render();

    window.addEventListener(
      "resize",
      function () {
        canvas.resize();
        offCanvas.resize();
        offCanvas.offInit();
      },
      false
    );
  });
})();

//para la musica
function PlayAudio() {
  document.getElementById("background-music").play();
}

//para las imagenes
$(document).ready(function () {
  let activeImages = []; // Almacena las posiciones activas de imágenes

  function showRandomImage() {
    let images = $(".side-image");
    let randomIndex = Math.floor(Math.random() * images.length);
    let image = $(images[randomIndex]);

    let side = Math.random() > 0.5 ? "left" : "right";
    let viewportHeight = $(window).height();
    let viewportWidth = $(window).width();

    let imageHeight = image.outerHeight(true);
    let imageWidth = image.outerWidth(true);

    let maxTop = viewportHeight - imageHeight - 10;
    let maxLeft = viewportWidth - imageWidth - 10;

    let randomTop, newPosition;
    let attempts = 0;
    let overlap = true;

    // Reintentar encontrar una posición sin solapamiento hasta 10 veces
    while (overlap && attempts < 10) {
      randomTop = Math.random() * maxTop;

      newPosition = {
        top: `${randomTop}px`,
        [side]: "10px",
      };

      // Verifica si hay otra imagen en esta posición
      overlap = activeImages.some(
        (pos) => Math.abs(pos.top - randomTop) < imageHeight // Si se solapan en el eje Y
      );

      attempts++;
    }

    // Almacenar la posición de la imagen actual
    activeImages.push({ top: randomTop, side: side });

    // Eliminar posiciones antiguas después de que la imagen desaparezca
    image
      .css(newPosition)
      .fadeIn(1000)
      .delay(2000)
      .fadeOut(1000, function () {
        activeImages = activeImages.filter((pos) => pos.top !== randomTop);
        showRandomImage();
      });
  }

  showRandomImage();

  // Iniciar la animación
  setTimeout(showRandomImage, 1000);
});

image
  .css(newPosition)
  .css({ transform: "scale(0.8)" }) // Pequeño tamaño inicial
  .fadeIn(1000)
  .animate({ transform: "scale(1)" }, 500) // Zoom al aparecer
  .delay(2000)
  .fadeOut(1000, showRandomImage);
