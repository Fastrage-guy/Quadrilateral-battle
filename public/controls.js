window.addEventListener('keydown', e => {
  if (!keystate[e.keyCode]) {
    keystate[e.keyCode] = true;
  }
});

window.addEventListener('keyup', e => {
  delete keystate[e.keyCode];
});

function move() {
	movement.x = 0;
	movement.y = 0;
	if (keystate[87]) {
		movement.y--;
		socket.emit("Movement", movement);
	}

	if (keystate[65]) {
		movement.x--;
		socket.emit("Movement", movement);
	}

	if (keystate[83]) {
		movement.y++;
		socket.emit("Movement", movement);
	}

	if (keystate[68]) {
		movement.x++;
		socket.emit("Movement", movement);
	}
	if (keystate[32]) {
		var angle = 	angle = atan2(mouseY - height / 2, mouseX - width / 2);
		socket.emit("Shoot", position, angle);
	}
	scroll[0] += (position[0] - scroll[0] - windowWidth/2) / 7;
	scroll[1] += (position[1] - scroll[1] - windowHeight/2) / 7;
}

function mouseClicked() {
	var angle = atan2(mouseY - height / 2, mouseX - width / 2);
  socket.emit("Shoot", position, angle);
}