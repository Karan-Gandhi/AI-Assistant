var output;
var wikipediaApi = "https://en.wikipedia.org/w/api.php";

function respond(nonParsedinput, displayName) {
	// Tons of if else statements !!
	if (nonParsedinput.toLowerCase().includes(displayName.toLowerCase())) {

		var input = nonParsedinput.slice(nonParsedinput.indexOf(displayName.toLowerCase()) + displayName.length);
		console.log('[Input] : ' + input);
		
		var hello1 = input.toLowerCase().includes("hello") || input.toLowerCase().includes("hey"); 
		var search1 = input.toLowerCase().includes("search") && !(input.toLowerCase().includes("wikipedia"));
		var search2 = input.toLowerCase().includes("wikipedia");

		// user says hello
		if (hello1 && !(input.toLowerCase().includes("search"))) {
			output = hello();
		}

		// user says what can you do 
		else if (input.toLowerCase().includes("what can you do")) {
			output = "I can do many things like opening a website, sending a email and many more (under working)";
		} 

		// user tells ai to search something on google
		else if (search1 && !search2) {
			gSearch(input);
			output = ok();
		}
		
		else if (search2) {
			var s = "wikipedia";
			var query = input.slice(input.indexOf(s) + s.length + 3);
			for(var i = 0; i < 100; i++) {
				query = query.replace(" ", "_");
			}
			console.log('[Wikipedia Query] : ' + query);
			wikiSearch(query);
			output = ok();
		}

		else if (input.toLowerCase().includes("weather")) {
			loc();
			return sessionStorage.getItem("weather");
		}

		else if (input.toLowerCase().includes("youtube")) {
			var s = "youtube";
			var query = input.slice(input.indexOf(s) + s.length);
			youtubeSearch(query);
		}

		// user says thank you
		else if (input.toLowerCase().includes("thank you") || input.toLowerCase().includes("thanks") || input.toLowerCase().includes("thanks a lot")) {
			output = thankYou();
		}

		// does not understand what you say
		else {
			output = "sorry I did not understand what you were saying";
		}

		// Returns a output
		return output;
	}
	else {
		return "";
	}
}

function wikiSearch(query) {
	var params = {
		action: "opensearch",
		search: query,
		limit: 10,
		namespace: "0",
		format: "json"
	};

	wikipediaApi += "?origin=*";
	Object.keys(params).forEach(function(key){wikipediaApi += "&" + key + "=" + params[key];});

	fetch(wikipediaApi).then(function(response) {
			return response.json();
		}).then(function(response) {
			window.open(response[3][0],'_blank');
			console.log('[Wikipedia Search Response] : ' + response);
		}).catch(function(error) {
			console.error('[Wikipedia Search Response Error] : ' + error);
		});
}

function hello() {
	var options = ["HelLo, I am your ai Assistant. Try saying what can you do", "hello", "Heyy! how are you doing", "Salve! Thats hello in latin", "salut! Thats hello in french"];
	var index = Math.floor(Math.random() * (options.length));
	return options[index];
}

function thankYou() {
	var options = ["No problem" ,"Your welcome", "Don't mention it.", "You got it.", "No worries.", "Not a problem.", "My pleasure.", "I'm happy to help."];
	var index = Math.floor(Math.random() * (options.length));
	return options[index];
}
function ok() {
	var options = ["ok", "done", "you've got it"];
	var index = Math.floor(Math.random() * (options.length));
	return options[index];
}

async function gSearch(query) {
	var api = `gPlaySearch/${query}`;
	var response = await fetch(api);
	var json = await response.json();

	window.open(json[0].url,'_blank');

	return ok();
}

async function openApp(query) {
	if(!isMobileDevice()) {
		var api = `open/${query}`;
		var response = await fetch(api);
		var json = await response.json();

		console.log('[Open App Resopnse] : ' + json);

		return json;
	}
}

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

function call(num) {
	if(isMobileDevice()) {
		window.open(`tel:${num}`);
		return ok();
	} else {
		return "You cannot perform a call from a non-mobile device";
	}
}

function youtubeSearch(q) {
	var url = `https://www.youtube.com/results?search_query=${q}`;
	window.open(url,'_blank');
}

async function weather(loc) {
	var api = `weather/${loc}`;
	var response = await fetch(api);
	var json = await response.json();

	this.sentence = `Today is ${json.iconName.replace('_', " ")} in ${json.city} with a high tempreature of ${json.highTemperature} degree celsius and a low tempreature of ${json.lowTemperature} degree celsius. The humidity level is ${json.humidity} and the barometer Pressure is ${json.barometerPressure}.`;
	sessionStorage.setItem("weather", sentence);
}

async function loc() {
	var api = "/location";
	var response = await fetch(api);
	var json = response.json();
	json.then(async function(data) { 
		weather(data.city);
	}, function(errorMessage) { console.log('[Location api Error] : ' + errorMessage); });
}

function gSearch(input) {
	var s = "search";
	var query = input.slice(input.indexOf(s) + s.length);
	console.log('[Google Search query] : ' + query);
	url ='http://www.google.com/search?q=' + query;
	window.open(url,'_blank');
}

async function music(name) {
	var api = `userData/isMobile=${isMobileDevice()}`;
	var response = await fetch(api);
	var json = await response.json();
	musc(json, name);
	return json;	
}

// function musc(input, name) {
// 	var home = input.USERPROFILE;
// 	var music_url = `${home}/music/${name}`;
	
// 	window.open(music_url,'_blank');
// }

// function open_website(name) {
// 	var websites = ["www.google.com", "www.youtube.com", "www.codepen.io", "www.codeacademy.in", "www.gmail.com", "www.hotmail.com", "www.wikipedia.com", "www.github.com"];

// 	var bestMatch = websites.forEach((website) => {
// 		// if (name.toLowerCase().includes(website.toLowerCase().replace('.', ' '))) {
// 		// 	return website;
// 		// }
// 		for (var i = 0; i < website.length; i++) {
// 			website.replace('.', ' ');
// 		}
// 		console.log(website);
		
// 	});

// 	console.log(bestMatch);
	
// }