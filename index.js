var express = require('express');
var app = express();
var canshoot = true;
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');
var port = process.env.PORT || 8080;
const floors = {};
var players = {};
var bullets = {};
var iterator = 0;
var id = io.id
const map = JSON.parse(fs.readFileSync("map.json"));

for (const f of map.data) {
	floors[f] = {
		x: f[0],
		y: f[1],
		w: f[2],
		h: f[3],
		c: f[4]
	};
}
console.log(floors)

server.listen(port, function() {
	console.log('Server listening at port ' + port);
});

console.log('Server Started');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket) {
	socket.on("PlayerConnect", function() {
		players[socket.id] = {
			x: rand(-250, 250),
			y: rand(-250, 250),
			vx: 0,
			vy: 0,
			health: 100,
			kills: 0,
			name: "Player: " + socket.id,
			id: socket.id
		};
		io.emit("floors", floors)
		send()
		socket.on("Movement", function(position) {
			send();
			players[socket.id].vx += position.x;
			players[socket.id].vy += position.y;
		});
		socket.on("Shoot", function(position, angle) {
			if(canshoot) {
				bullets[Math.random()] = {
					x: position[0],
					y: position[1],
					vx: Math.cos(angle)*50,
					vy: Math.sin(angle)*50,
					lifetime: 150,
					id: socket.id
				}
				canshoot = false;
				setTimeout(function(){canshoot = true}, 50);
			}
		});
		socket.on("Name", function(name) {
			send();
			players[socket.id].name = name;
		})
		socket.on('disconnect', () => {
			console.log('User left: ' + socket.id)
			delete players[socket.id] 
		});
	});
});

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function update() {
	//console.log(bullets)
	io.emit('bullets', bullets)
	for(i in bullets) {
		b = bullets[i];
		b.x += b.vx;
		b.y += b.vy;
		for(pl in players) {
			p = players[pl];
			if (p.x < b.x + 25 &&
				p.x + 35 > b.x &&
				p.y < b.y + 25 &&
				p.y + 35 > b.y && b.id != p.id) {
					if(p.health < 5) {
						//death
						p.x = rand(-100, 100);
						p.y = rand(-100, 100);
						p.health = 100;
						console.log(b.id)
						for(i in players) {
							killer = players[i]
							if(killer.id == b.id) {
								console.log(killer.name + " got a kill")
								killer.kills += 1;
							}
						}
						send();
					}
					p.health -= 5;
					delete bullets[i];
			}
		}

		b.lifetime -= 1;
		if(b.lifetime < 1) {
			delete bullets[i];
		}
	}
}

function send(){
	io.emit('players', players);
}

setInterval(() => {
	update();
	for (i in players) {
		p = players[i];
		p.x += p.vx;
		p.y += p.vy;
		p.vy *= 0.9;
		p.vx *= 0.9;
	}
	send();
}, 1000/60);