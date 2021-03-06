const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 15;
const paddleHeight = grid * 5; // 80
const LeftmaxPaddleY = canvas.height - grid - paddleHeight * 2;
const RightmaxPaddleY = canvas.height - grid - paddleHeight;
var paddleSpeed = 7;
var ballSpeed = 4;
var speedCollideAdditive = 0.5;
var record = 0;
var count = 0;
var Storage_size = localStorage.length;

const block = document.querySelector('.block')
var interval;
var resScoreboard = document.getElementById('count');
var winScore = 6;
var secretKey = document.getElementById('secret-key');
var count = 0;
    

if (Storage_size > 0) { record = localStorage.getItem('record') == null ? 0 : localStorage.getItem('record'); } 
else { localStorage.setItem('record',0); }

const leftPaddle = {
  x: grid * 2,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight * 2,
  dy: 0
};
const rightPaddle = {
  x: canvas.width - grid * 3,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,
  dy: 0
};
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: grid,
  height: grid,
  resetting: false,
  dx: ballSpeed,
  dy: -ballSpeed
};

canvas.addEventListener('mousedown', onMouseDown)
canvas.addEventListener('mouseup', onMouseUp)
canvas.addEventListener('touchstart', event => { onMouseDown(event.touches[0]) })
canvas.addEventListener('touchend', onMouseUp)

function onMouseDown(event) {
  var pt = getCursorPosition(event);
  var dir = Math.floor(pt.y * 3 / canvas.height - 1);
  if (dir != 0) {
    moveUserPaddle(dir, false);
  }
}

function onMouseUp(event) {
  if (rightPaddle.dy != 0) {
    moveUserPaddle(0, stop);
  }
}

function getCursorPosition(event) {
    var rect = canvas.getBoundingClientRect()
    var x = event.clientX - rect.left
    var y = event.clientY - rect.top
    return {x: x, y: y};
}

function moveUserPaddle(dir, stop) {
  if (!stop) {
    rightPaddle.dy = paddleSpeed * dir;
  } else {
    rightPaddle.dy = 0;
  }
}

function collides(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}

function getCollideCoefficient(obj1, obj2) {
	return 2.0 * ((obj1.y + obj1.height / 2.0) - (obj2.y + obj2.height / 2.0)) / obj2.height
}

function loop() {
	requestAnimationFrame(loop);


	context.clearRect(0,0,canvas.width,canvas.height);
	leftPaddle.y += leftPaddle.dy;
	rightPaddle.y += rightPaddle.dy;
	
	if (leftPaddle.y < grid) { leftPaddle.y = grid; } 
	else if (leftPaddle.y > LeftmaxPaddleY) { leftPaddle.y = LeftmaxPaddleY; }
	if (rightPaddle.y < grid) { rightPaddle.y = grid; } 
	else if (rightPaddle.y > RightmaxPaddleY) { rightPaddle.y = RightmaxPaddleY; }
  	
	context.fillStyle = 'white';
	context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
	context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
	
	ball.x += ball.dx;
	ball.y += ball.dy;
	leftPaddle.dy = ball.dy;
  
  	if (ball.y < grid) {
    	ball.y = grid;
    	ball.dy *= -1;
  	} else if (ball.y + grid > canvas.height - grid) {
    	ball.y = canvas.height - grid * 2;
    	ball.dy *= -1;
  	}

  	if ((ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
    	ball.resetting = true;
    	if (count > record) { record = count };
    	count = 0;
    	ball.dx = ballSpeed;
    	//localStorage.setItem('record',record);
    	setTimeout(() => {
	      ball.resetting = false;
	      ball.x = canvas.width / 2;
	      ball.y = canvas.height / 2;
	    }, 1000);
  	}
	if (collides(ball, leftPaddle)) {
		ball.dy += ballSpeed /1.5 * getCollideCoefficient(ball, leftPaddle);
	  	ball.dx *= -1;
	  	ball.x = leftPaddle.x + leftPaddle.width;
	} else if (collides(ball, rightPaddle)) {
		ball.dy += ballSpeed / 1.5 * getCollideCoefficient(ball, rightPaddle);
	  	ball.dx *= -1;
	  	ball.x = rightPaddle.x - ball.width;
		count +=1;
		if (count % 4 == 0) {
      ball.dx += Math.sign(ball.dx);
		}
	}

	context.fillRect(ball.x, ball.y, ball.width, ball.height);
	context.fillStyle = 'lightgrey';
	context.fillRect(0, 0, canvas.width, grid);
	context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);
	
	for (let i = grid; i < canvas.height - grid; i += grid * 2) {
	  context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
	}

  	document.addEventListener('keydown', function(e) {
		if (e.which === 38) { rightPaddle.dy = -paddleSpeed; }
	    else if (e.which === 40) { rightPaddle.dy = paddleSpeed; }
	});
  	document.addEventListener('keyup', function(e) {
    	if (e.which === 38 || e.which === 40) { rightPaddle.dy = 0; }
  	});

	context.fillStyle = "#ff0000";
	context.font = "20pt Courier";
	context.fillText('Record: ' + record == null ? 0 : record, 150, 550);
	context.fillText(count, 450, 550);

  resScoreboard.textContent = Math.max(winScore - count, 0);
  if (winScore - count <= 0) { secretKey.style.visibility = "visible"; }
}

requestAnimationFrame(loop);
