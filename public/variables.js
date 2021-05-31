var socket = io();
var players = {};
var bullets = {};
var ammount;
var verbs = ["galloping", "running", "playing", "killing"]
var nouns = ["human", "horse", "zombie", "stone", "player"]
var position = [0, 0];
var floors = [];
var movement = {x: 0, y: 0};
var scroll = [0, 0]
const keystate = [];