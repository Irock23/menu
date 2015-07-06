/*
    (c) 2015 Brayden Strasen
    https://creativecommons.org/licenses/by-nc-sa/4.0/
*/
var players = [],
	loopPlayers,
	Halo3Index = 2;

function initalize() {
	getTotalPlayers();
	totalPlayersLoop();
}

$(document).ready(function() {
	initalize();
});

function getTotalPlayers() {
	var totalPlayers = 0;
	$.getJSON("http://192.99.124.162/list", function(data) {
		for (var i = 0; i < data.result.servers.length; i++) {
			var serverIP = data.result.servers[i];
			if (!serverIP.toString().contains("?")) {
				$.getJSON("http://" + serverIP, function(serverInfo) {
					totalPlayers += serverInfo.numPlayers;
					$('#players-online').text(totalPlayers + " Players Online");
				});
			}
		}
	});
}

function totalPlayersLoop() {
	delay(function() {
		var totalPlayers = 0;
		$.getJSON("http://192.99.124.162/list", function(data) {
			for (var i = 0; i < data.result.servers.length; i++) {
				var serverIP = data.result.servers[i];
				if (!serverIP.toString().contains("?")) {
					$.getJSON("http://" + serverIP, function(serverInfo) {
						totalPlayers += serverInfo.numPlayers;
						$('#players-online').text(totalPlayers + " Players Online");
					});
				}
			}
		});
		totalPlayersLoop();
	}, 30000);
}