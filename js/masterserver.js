$(document).ready(function() {
    // queryServer("192.99.124.162/list");
   // addServer("127.0.0.1:11775", "Test server", "emoose", "Guardian", "guardian", "Team Slayer", "1", "16");
    fetchServerList();
});

function fetchServerList() {
    $("#serverlist > tbody > tr").remove();

    $.getJSON( "http://192.99.124.162/list", function( data ) {
        if(data.result.code != 0) {
            alert("Error received from master: " + data.result.msg);
            return;
        }
        console.log(data);
        for(var i = 0; i < data.result.servers.length; i++) {
            var serverIP = data.result.servers[i];
	        if(validateIP(serverIP)) {
		        queryServer(serverIP);
	        }
        }
    });
}
    
function queryServer(serverIP)
{
    console.log(serverIP);
    var startTime = Date.now();
    $.getJSON("http://" + serverIP, function(serverInfo) {
        var timeTaken = Date.now() - startTime;
        console.log(timeTaken);
        if(serverInfo.name === undefined) return;
        var isPassworded = serverInfo.passworded !== undefined;
	//if no serverInfo.map, they jumped into an active game without unannouncing their server, causing a duplicate unjoinable game
        if(serverInfo.map == "") return;
        
	//if any variables include js tags, skip them
	if(invalidServer(serverInfo.name, serverInfo.variant, serverInfo.variantType, serverInfo.mapFile, serverInfo.maxPlayers, serverInfo.numPlayers, serverInfo.hostPlayer) == true) return;    
        
        addServer(serverIP, isPassworded, serverInfo.name, serverInfo.hostPlayer, serverInfo.map, serverInfo.mapFile, serverInfo.variant, serverInfo.status, serverInfo.numPlayers, serverInfo.maxPlayers, timeTaken);
        console.log(serverInfo);
    });
}

function promptPassword(serverIP)
{
    var password = prompt("The server at " + serverIP + " is passworded, enter the password to join", "");
    if(password != null)
    {
        window.open("dorito:" + serverIP + "/" + password);
    }
}

function sanitizeString(str){
    return String(str).replace(/(<([^>]+)>)/ig,"") //shouldn't need to strip tags with the below replacements, but I'll keep it anyway
                      .replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/'/g, '&#39;')
                      .replace(/"/g, '&quot;');
}

function validateIP(str){
    if (str) {
        str = String(str);
		if(/^(?:(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)\.){3}(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)(?:\:(?:\d|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?$/i.test(str)) {
			return true;
		} else{
			console.log(str + " is not a valid ip, skipping");
			return false;
		}
	} else {
    	console.log(str + " is not a valid ip, skipping");
        return false;
	}
}

function invalidServer() {
    if (/[<>]/.test(Array.prototype.slice.call(arguments).join(''))) {
        console.log("Javascript potentially in one of the variables, skipping server");
        return true;
    } else {
        return false;
    }
}