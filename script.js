let canvas, ctx, w, h, particles = [];
let mouse = {
  x: undefined,
  y: undefined
}
let hue = 0;

function init() {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  resizeReset();
  animationLoop();
}

function resizeReset(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

function mousemove(e){
  mouse.x = e.x;
  mouse.y = e.y;
}

function mouseout(){
  mouse.x = undefined;
  mouse.y = undefined;
}

function animationLoop(){
  if (mouse.x !== undefined && mouse.y !== undefined) {
    hue += 2;
    particles.push(new Particle(mouse.x, mouse.y));  // Sửa lại thành Particle
  }
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'lighter';

  drawScene();
  ArrayCleanup();
  requestAnimationFrame(animationLoop);
}

function ArrayCleanup() {
  let dump = [];
  particles.forEach((particle) => {  // Sửa map thành forEach vì không cần trả về mảng
    if (particle.radius > 0) {
      dump.push(particle);
    }
  });
  particles = dump;
}

function drawScene() {
  particles.forEach((particle) => {  // Sử dụng forEach thay vì map
    particle.update();
    particle.draw();
  });
}

class Particle {
  constructor(x, y) {  // Tên lớp cần viết hoa
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.size = 0;
    this.hue = hue % 360;
    this.alpha = 0.5;
    this.rotate = 0;
    this.setPoint();
  }

  setPoint() {
    let r, x, y;
    this.point = [];
    for (let a = 0; a < 360; a += 36) {
      let d = ((a / 36) % 2 === 0) ? this.size : this.size / 2;
      r = (Math.PI / 180) * (a + this.rotate);
      x = this.x + d * Math.sin(r);
      y = this.y + d * Math.cos(r);
      this.point.push({ x: x, y: y, r: this.radius });
    }
  }

  update() {
    this.radius -= 0.1;  // Cập nhật radius để hạt nhỏ dần
  }

  draw() {
    if (this.radius <= 0) return;
    this.point.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.stroke();
    });
  }
}

window.addEventListener('resize', resizeReset);
canvas.addEventListener('mousemove', mousemove);
canvas.addEventListener('mouseout', mouseout);

init();