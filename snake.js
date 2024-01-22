// 设置画布
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var obstacles = [];
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
function gameOver() {

    // 重置蛇的位置和方向
    snake.x = canvas.width / 2;
    snake.y = canvas.height / 2;
    snake.dx = grid;
    snake.dy = 0;
    
    // 重置蛇的长度
    snake.cells = [];
    snake.maxCells = 4;
    
    // 重新生成苹果和障碍物
    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;
    obstacles = [];
    for (var i = 0; i < 10; i++) {
        createObstacle();
    }
    
    // 显示游戏结束的弹窗，并刷新页面
    alert('游戏结束');
    location.reload();
      
  }
// 随机生成苹果的位置
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function createObstacle() {
    var obstacle = {
        x: getRandomInt(0, 25) * grid,
        y: getRandomInt(0, 25) * grid
    };

    obstacles.push(obstacle);
}
for (var i = 0; i < 10; i++) {
    createObstacle();
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
  obstacles.forEach(function(obstacle) {
    context.fillStyle = 'black';
    context.fillRect(obstacle.x, obstacle.y, grid-1, grid-1);
});
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
    
    obstacles.forEach(function(obstacle) {
        if (snake.x === obstacle.x && snake.y === obstacle.y) {
            // 蛇碰到了障碍物，游戏结束
            gameOver();
        }
    });

    // 检查蛇是否碰到自己
    for (var i = index + 1; i < snake.cells.length; i++) {
        
        // 如果碰到自己，重新开始游戏
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
            gameOver();

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


var touchStartX = 0;
var touchStartY = 0;

// 监听 touchstart 事件
canvas.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, false);

// 监听 touchmove 事件
canvas.addEventListener('touchmove', function(e) {
    var touchEndX = e.changedTouches[0].clientX;
    var touchEndY = e.changedTouches[0].clientY;
    var diffX = touchStartX - touchEndX;
    var diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // 左右滑动
        if (diffX > 0) {
            // 左滑动
            snake.dx = -grid;
            snake.dy = 0;
        } else {
            // 右滑动
            snake.dx = grid;
            snake.dy = 0;
        }
    } else {
        // 上下滑动
        if (diffY > 0) {
            // 上滑动
            snake.dy = -grid;
            snake.dx = 0;
        } else {
            // 下滑动
            snake.dy = grid;
            snake.dx = 0;
        }
    }

    e.preventDefault();
}, { passive: false });  // 注意这里的 { passive: false }



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