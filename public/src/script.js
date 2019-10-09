var socket = io();

var speech = new p5.Speech();
var speechRec = new p5.SpeechRec('en-US', gotSpeech);
var continuous = true;
var interim = false;

var displayName = "assistant";

function activate() {
	speechRec.start(continuous, interim);
}

function gotSpeech() {
	if (speechRec.resultValue) {
		input = speechRec.resultString;
		
		var output = respond(input, displayName);
		
		console.log('[Assistant Response] : ' + output);
		speech.speak(output);
	}
}

window.onload = function() {
	var name = prompt('What is your name');
	var data = {
		Name: name,
	}
	socket.emit('userdata', data);
}

socket.on('userdata', (d) => console.log(d) );