function setup() {
  createCanvas(512, 512);
  pixelDensity(1);
  background(255);
}

// start + end points
let x0=-1, y0=-1, x1=-1, y1=-1;

// toggle between D(x,y) and D_hat(x,y)
let useIntForm = false;

function mousePressed() {
  x0 = mouseX; y0 = mouseY;   // store start point
}

function mouseDragged() {
  x1 = mouseX; y1 = mouseY;   // update end point preview
  background(255);
  noStroke();
  fill('red');   ellipse(x0-3, y0-3, 6, 6);
  fill('green'); ellipse(x1-3, y1-3, 6, 6);
}

function mouseReleased() {
  background(255);
  loadPixels();
  if (!useIntForm) drawDistanceFieldWithDivision(); // D(x,y)
  else drawDistanceFieldNoDivision();               // D_hat(x,y)
  updatePixels();
}

// negative -> red, positive -> green
function set_pixel_signed(x, y, v) {
  let idx = (y * 512 + x) * 4;
  let mag = Math.abs(Math.round(v));
  if (mag > 255) mag = 255;

  let R = 0, G = 0;
  if (v < 0) R = mag;
  else if (v > 0) G = mag;

  pixels[idx]   = R;
  pixels[idx+1] = G;
  pixels[idx+2] = 0;
  pixels[idx+3] = 255;
}

// D(x,y) = (dy/dx)*(x-x0) - (y-y0)
function drawDistanceFieldWithDivision() {
  let dx = x1 - x0;
  let dy = y1 - y0;

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      let D = (dy/dx)*(x-x0) - (y-y0);
      set_pixel_signed(x,y,D);
    }
  }
}

// D_hat(x,y) = 2dy(x-x0) - 2dx(y-y0)   (no division)
function drawDistanceFieldNoDivision() {
  let dx = x1 - x0;
  let dy = y1 - y0;

  let A = 2*dy;
  let B = 2*dx;

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      let Dhat = A*(x-x0) - B*(y-y0);
      set_pixel_signed(x,y,Dhat);
    }
  }
}

// space = switch between D(x,y) and D_hat(x,y)
function keyPressed() {
  if (key === ' ') {
    useIntForm = !useIntForm;
    if (x0>=0 && y0>=0 && x1>=0 && y1>=0) mouseReleased();
  }
}
