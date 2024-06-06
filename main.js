let mic, fft;
let filledCircles = [];
let outlineCircles = [];
const numCircles = 20;
let bgMusic;
let musicStarted = false;

function preload() {
  bgMusic = loadSound('Futuremono.mp3', () => {
    console.log("Background music loaded.");
  }, () => {
    console.error("Failed to load background music.");
  });
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  document.documentElement.style.overflow = 'hidden';
  document.body.style.margin = '0';

  // 初始化麥克風和 FFT
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);

  // 創建填充圓
  for (let i = 0; i < numCircles; i++) {
    let colorOptions = [
      color(255, 87, 87, 50),    // 紅色
      color(220, 116, 30, 20),  // 橙色
      color(255, 185, 80, 30),  // 調整過透明度的黃色
      color(138, 0, 153, 40),   // 粉色
      color(130, 16, 113, 50)   // 紫色
    ];

    let colorStart = random(colorOptions);
    let colorEnd = random(colorOptions.filter(c => c !== colorStart)); // 確保起始和結束顏色不同

    let breathDuration = random(3, 5); // 呼吸週期
    let speed = (TWO_PI / breathDuration) / 60; // 呼吸速度

    let minRadius = random(30, 60);
    let maxRadius = random(80, 150);

    let x = random(width);
    let y = random(height);

    filledCircles.push({
      colorStart: colorStart,
      colorEnd: colorEnd,
      minRadius: minRadius,
      maxRadius: maxRadius,
      speed: speed,
      angle: random(TWO_PI),
      direction: random([-1, 1]), // 隨機呼吸方向
      x: x,
      y: y
    });
  }

  // 創建只有邊框的圓
  for (let i = 0; i < numCircles; i++) {
    let colorOptions = [
      color(255, 87, 87, 50),    // 紅色
      color(220, 116, 30, 20),  // 橙色
      color(255, 185, 80, 30),  // 調整過透明度的黃色
      color(255, 0, 255, 40),   // 粉色
      color(130, 16, 113, 50)   // 紫色
    ];

    let colorStart = random(colorOptions);
    let colorEnd = random(colorOptions.filter(c => c !== colorStart)); // 確保起始和結束顏色不同

    let breathDuration = random(4, 6); // 呼吸週期
    let speed = (TWO_PI / breathDuration) / 60; // 呼吸速度

    let minRadius = random(30, 60);
    let maxRadius = random(80, 150);

    let x = random(width);
    let y = random(height);

    outlineCircles.push({
      colorStart: colorStart,
      colorEnd: colorEnd,
      minRadius: minRadius,
      maxRadius: maxRadius,
      speed: speed,
      angle: random(TWO_PI),
      direction: random([-1, 1]), // 隨機呼吸方向
      x: x,
      y: y
    });
  }
}

function draw() {
  background(0);
  
  // 分析音訊頻譜
  let spectrum = fft.analyze();
  let avgEnergy = fft.getEnergy("highMid"); // 可以使用 "bass", "lowMid", "mid", "highMid", "treble"
  
  // 根據頻譜調整呼吸率
  let breathRate = map(avgEnergy, 0, 255, 0, 3); // 假設頻率能量範圍是 0 到 255
  console.log(breathRate)
  
  // 更新填充圓大小和速度
  updateCircles(filledCircles, breathRate);

  // 更新只有邊框的圓大小和速度
  updateCircles(outlineCircles, breathRate);

  // 繪製填充圓
  for (let circle of filledCircles) {
    drawCircle(circle, true);
  }

  // 繪製只有邊框的圓
  for (let circle of outlineCircles) {
    drawCircle(circle, false);
  }
}

function updateCircles(circles, breathRate) {
  for (let circle of circles) {
    // 根據呼吸率調整圓大小和速度
    let radius = circle.minRadius + (sin(circle.angle) * (circle.maxRadius - circle.minRadius) / 2) + ((circle.maxRadius - circle.minRadius) / 2);
    let minSpeed = circle.speed * 0.5;
    let maxSpeed = circle.speed * 4.5; // 扩大速度变化范围
    let speed = map(breathRate, 0, 3, minSpeed, maxSpeed);
    circle.angle += speed * circle.direction; // 根據方向調整角度
  }
}

function drawCircle(circle, filled) {
  let radius = circle.minRadius + (sin(circle.angle) * (circle.maxRadius - circle.minRadius) / 2) + ((circle.maxRadius - circle.minRadius) / 2);
  circle.angle += circle.speed * circle.direction; // 根據方向調整角度

  let alpha = map(radius, circle.minRadius, circle.maxRadius, 50, 255);

  let interColor = lerpColor(circle.colorStart, circle.colorEnd, (sin(circle.angle) + 1) / 2);
  interColor.setAlpha(alpha);

  if (filled) {
    fill(interColor);
    ellipse(circle.x, circle.y, radius * 2, radius * 2);
  } else {
    stroke(interColor);
    noFill();
    ellipse(circle.x, circle.y, radius * 2, radius * 2);
  }
}
function startMusic() {
    if (!musicStarted && bgMusic.isLoaded()) {
      bgMusic.setVolume(0.2); // 设置背景音乐音量为 0.1（10%）
      bgMusic.loop(); // 开始循环播放背景音乐
      musicStarted = true; // 标记音乐已开始播放
      console.log("Music started.");
    }
  }
  
  function mousePressed() {
    startMusic();
  }
  
  function touchStarted() {
    startMusic();
  }
