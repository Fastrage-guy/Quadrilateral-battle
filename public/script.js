var socket = io();
var players = {};
var bullets = {};
var ammount;
var verbs = ["galloping", "running", "playing", "killing"]
var nouns = ["human", "horse", "zombie", "stone", "player"]
var floors = [];
var velocity = [0, 0];
var scroll = [0, 0]
var position = [rand(-250, 250), rand(-250, 250)];
const keystate = [];
function Play() {
	var name = document.getElementById("username").value;
	if (name == " " || name == "" || name.length < 2) {
		name = verbs[Math.floor(Math.random() * verbs.length)] + " " + nouns[Math.floor(Math.random() * nouns.length)];
	}
	socket.emit("PlayerConnect");
	socket.emit("Name", name);
	socket.emit("Position", position);
	socket.on('floors', data => {
		for (const [key, value] of Object.entries(data)) {
			console.log(value.x, value.y, value.w, value.h, value.c);
			floors.push([value.x, value.y, value.w, value.h, value.c])
		}
	});
	document.getElementById("JoinScreen").style.display = "none";
}
socket.emit("Position", position);
window.addEventListener('keydown', e => {
  if (!keystate[e.keyCode]) {
    keystate[e.keyCode] = true;
  }
});

window.addEventListener('keyup', e => {
  delete keystate[e.keyCode];
});

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setup() {
  createCanvas(windowWidth,windowHeight);
}

function rectangle(x, y, w, h) {
  rect(x - w/2, y - h/2, w, h);
}

function oval(x, y, r) {
  circle(y, x, r);
}

function draw() {
  background("#33aaff");
	//environment
	for(i in floors) {
		f = floors[i];
		let c = color(f[4]);
		fill(c);
		rectangle(f[0]*5 - scroll[0], f[1]*5 - scroll[1], f[2]*5, f[3]*5);
	}

  //bullets
	for(i in bullets) {
		b = bullets[i];
		let c = color('#656565');
		fill(c);
		rectangle(b.x - scroll[0], b.y - scroll[1], 25, 25);
	}

	//players
	for(i in players) {
		p = players[i];
		if(p.id == socket.id) {
			let c = color('#66ff66');
			fill(c);
			noStroke();
			rectangle(p.x - scroll[0], p.y - scroll[1], 50, 50);
		} else {
			let c = color('#ff6565');
			fill(c);
			noStroke();
			rectangle(p.x - scroll[0], p.y - scroll[1], 50, 50);
		}
		textSize(32);
		text(p.kills + " | " + p.name, p.x - scroll[0], p.y - scroll[1] - 60);
		textAlign(CENTER);
		let c;
		c = color("#aaaaaa");
		fill(c)
		rectangle(p.x - scroll[0], p.y - scroll[1] - 45, 100, 10);
		if(p.id == socket.id) {
			c = color("#66ff66")
		} else {
			c = color("#ff6565")
		}
		fill(c);
		rectangle(p.x - scroll[0] + p.health/2 - 50, p.y - scroll[1] - 45, p.health, 10);
	}
	if (keystate[87]) {
		velocity[1]--;
		socket.emit("Position", position);
	}

	if (keystate[65]) {
		velocity[0]--;
		socket.emit("Position", position);
	}
	
	if (keystate[83]) {
		velocity[1]++;
		socket.emit("Position", position);
	}

	if (keystate[68]) {
		velocity[0]++;
		socket.emit("Position", position);
	}
	if (keystate[32]) {
		var angle = 	angle = atan2(mouseY - height / 2, mouseX - width / 2);
		socket.emit("Shoot", position, angle);
	}

	velocity[0] *= 0.93;
	velocity[1] *= 0.93;
	if(!velocity[0] == 0 && !velocity[1] == 0) {
		position[0] += velocity[0];
		position[1] += velocity[1];
		socket.emit("Position", position);
	}
  scroll[0] += (position[0] - scroll[0] - windowWidth/2) / 7;
	scroll[1] += (position[1] - scroll[1] - windowHeight/2) / 7;
}

function mouseClicked() {
	var angle = atan2(mouseY - height / 2, mouseX - width / 2);
  socket.emit("Shoot", position, angle);
}

socket.on("players", function(pack){
	players = pack;
})

socket.on("bullets", function(pack){
	bullets = pack;
});