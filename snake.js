// 设置画布
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

// 设置网格大小和游戏大小
var grid = 16;
var count = 0;
var score = 0;
// 创建一个新的 Audio 对象
var eatSound = new Audio('./eat.mp3');
// 设置蛇
var snake = {
  x: 160,
  y: 160,
  
  // 蛇移动的速度
  dx: grid,
  dy: 0,
  
  // 保存蛇身体的位置
  cells: [],
  
  // 蛇的长度
  maxCells: 4
};

// 设置苹果
var apple = {
  x: 320,
  y: 320
};

// 随机生成苹果的位置
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


// 游戏循环
function loop() {
  requestAnimationFrame(loop);
  
  // 控制游戏速度
  if (++count < 4) {
    return;
  }
  
  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  // 移动蛇
  snake.x += snake.dx;
  snake.y += snake.dy;

  // 如果蛇超出边界，从另一边出现
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // 保存蛇的位置
  snake.cells.unshift({x: snake.x, y: snake.y});

  // 如果蛇的长度超过最大长度，删除最后一个元素
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // 绘制苹果
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  // 绘制蛇
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {

    // 绘制蛇身体
    context.fillRect(cell.x, cell.y, grid-1, grid-1);  
    
    // 如果蛇吃到苹果
    if (cell.x === apple.x && cell.y === apple.y) {
      score++;  // 添加这行代码
      snake.maxCells++;
      eatSound.play();  // 播放音频
      
      // 随机生成新的苹果位置
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }
    
    // 检查蛇是否碰到自己
    for (var i = index + 1; i < snake.cells.length; i++) {
        
        // 如果碰到自己，重新开始游戏
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
            alert('游戏结束');  // 添加这行代码

            snake.x = 160;
            snake.y = 160;
            snake.cells = [];
            snake.maxCells = 4;
            snake.dx = grid;
            snake.dy = 0;
            
            // 随机生成新的苹果位置
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
        }
    }
  });
    // 绘制分数
    context.fillStyle = 'white';
    context.font = '16px Arial';
    context.fillText('Score: ' + score, 8, 20);
}

// 监听键盘事件，控制蛇的移动方向
document.addEventListener('keydown', function(e) {
  
  // 左箭头
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // 上箭头
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // 右箭头
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // 下箭头
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// 开始游戏循环
requestAnimationFrame(loop);