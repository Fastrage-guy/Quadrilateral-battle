function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rectangle(x, y, w, h) {
  rect(x - w/2 - scroll[0], y - h/2 - scroll[1], w, h);
}

function oval(x, y, r) {
  circle(y - scroll[0], x - scroll[1], r);
}

function renderFloors() {
	for(i in floors) {
		f = floors[i];
		let c = color(f[4]);
		fill(c);
		rectangle(f[0]*5, f[1]*5, f[2]*5, f[3]*5);
	}
}

function renderBullets() {
	for(i in bullets) {
		b = bullets[i];
		let c = color('#656565');
		fill(c);
		rectangle(b.x, b.y, 25, 25);
	}
}

function renderPlayers() {
	for(i in players) {
		p = players[i];
		if(p.id == socket.id) {
			let c = color('#66ff66');
			fill(c);
			noStroke();
			rectangle(p.x, p.y, 50, 50);
			position = [p.x, p.y]
		} else {
			let c = color('#ff6565');
			fill(c);
			noStroke();
			rectangle(p.x, p.y, 50, 50);
		}
		textSize(32);
		text(p.kills + " | " + p.name, p.x - scroll[0], p.y - scroll[1] - 60);
		textAlign(CENTER);
		let c;
		c = color("#aaaaaa");
		fill(c)
		rectangle(p.x, p.y - 45, 100, 10);
		if(p.id == socket.id) {
			c = color("#66ff66")
		} else {
			c = color("#ff6565")
		}
		fill(c);
		rectangle(p.x + p.health/2 - 50, p.y - 45, p.health, 10);
	}
}
