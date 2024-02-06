let canvas = document.getElementById('game');
let context = canvas.getContext('2d');
// 创建一个新的 Audio 对象并加载音频文件
var eatSound = new Audio('eat.mp3');
let box = 32;
let snake = [];
snake[0] = { x: 8 * box, y: 8 * box };

// 创建障碍物数组
var obstacles = [
  { x: 5 * box, y: 7 * box },
  { x: 8 * box, y: 10 * box },
  { x: 9 * box, y: 5 * box },
  // 添加更多障碍物...
];



let direction = "right";
let food = {
  x: Math.floor(Math.random() * 15 + 1) * box,
  y: Math.floor(Math.random() * 15 + 1) * box
}

function createBG() {
  context.fillStyle = "lightgreen";
  context.fillRect(0, 0, 16 * box, 16 * box);
}

function createSnake() {
  for (i = 0; i < snake.length; i++) {
    context.fillStyle = "green";
    context.fillRect(snake[i].x, snake[i].y, box, box);
  }
}

function drawFood() {
  context.fillStyle = "red";
  context.fillRect(food.x, food.y, box, box);
}

// 在游戏画布上绘制障碍物
function drawObstacles() {
  context.fillStyle = "blue";
  for (var i = 0; i < obstacles.length; i++) {
    context.fillRect(obstacles[i].x, obstacles[i].y, box, box);
  }
}
// 检查蛇是否与任何障碍物碰撞
function checkCollisionWithObstacles() {
  for (var i = 0; i < obstacles.length; i++) {
    if (snake[0].x == obstacles[i].x && snake[0].y == obstacles[i].y) {
      // 蛇与障碍物碰撞，结束游戏
      clearInterval(game);
      alert('Game Over :(');
    }
  }
}

document.addEventListener('touchstart', function(e) {
  var touch = e.touches[0];
  this.startX = touch.clientX;
  this.startY = touch.clientY;
}, false);

document.addEventListener('touchmove', function(e) {
  var touch = e.touches[0];
  var offsetX = touch.clientX - this.startX;
  var offsetY = touch.clientY - this.startY;

  if (Math.abs(offsetX) > Math.abs(offsetY)) {
      // 水平移动
      direction = offsetX > 0 ? 'right' : 'left';
  } else {
      // 垂直移动
      direction = offsetY > 0 ? 'down' : 'up';
  }
}, false);

// 在游戏逻辑中使用 `direction` 变量来控制蛇的移动方向

document.addEventListener('keydown', update);

function update(event) {
  if (event.keyCode == 37 && direction != "right") direction = "left";
  if (event.keyCode == 38 && direction != "down") direction = "up";
  if (event.keyCode == 39 && direction != "left") direction = "right";
  if (event.keyCode == 40 && direction != "up") direction = "down";
}

function startGame() {
  if (snake[0].x > 15 * box && direction == "right") snake[0].x = 0;
  if (snake[0].x < 0 && direction == "left") snake[0].x = 16 * box;
  if (snake[0].y > 15 * box && direction == "down") snake[0].y = 0;
  if (snake[0].y < 0 && direction == "up") snake[0].y = 16 * box;

  for (i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      clearInterval(game);
      alert('Game Over :(');
    }

  }

  createBG();
  createSnake();
  drawFood();
  drawObstacles();
  checkCollisionWithObstacles();

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction == "right") snakeX += box;
  if (direction == "left") snakeX -= box;
  if (direction == "up") snakeY -= box;
  if (direction == "down") snakeY += box;

  if (snakeX != food.x || snakeY != food.y) {
    snake.pop();
  } else {
    food.x = Math.floor(Math.random() * 15 + 1) * box;
    food.y = Math.floor(Math.random() * 15 + 1) * box;
    eatSound.play();
  }

  let newHead = {
    x: snakeX,
    y: snakeY
  }

  snake.unshift(newHead);
}

let game = setInterval(startGame, 100);