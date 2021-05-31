function Play() {
	var name = document.getElementById("username").value;
	if (name == " " || name == "" || name.length < 2) {
		name = verbs[Math.floor(Math.random() * verbs.length)] + " " + nouns[Math.floor(Math.random() * nouns.length)];
	}
	socket.emit("PlayerConnect");
	socket.emit("Name", name);
	socket.emit("Movement", movement);
	socket.on('floors', data => {
		for (const [key, value] of Object.entries(data)) {
			console.log(value.x, value.y, value.w, value.h, value.c);
			floors.push([value.x, value.y, value.w, value.h, value.c])
		}
	});
	document.getElementById("JoinScreen").style.display = "none";
}

socket.emit("Movement", movement);

function setup() {
  createCanvas(windowWidth,windowHeight);
}

function draw() {
  background("#33aaff");
	renderFloors();
	renderBullets();
	renderPlayers();
	move();
}

document.body.innerHTML += `
		<div id="JoinScreen">
			<div id="container">
				<h1>Rectangular Battle</h1>
				<input id="username" placeholder="Username" maxlength="14">
				<button id="play" onclick="Play()">Play</button>
			</div>
		</div>
`

socket.on("players", function(pack){
	players = pack;
})

socket.on("bullets", function(pack){
	bullets = pack;
});