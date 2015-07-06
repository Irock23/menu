$(document).ready(function()
{
    // queryServer("192.99.124.162/list");
   // addServer("127.0.0.1:11775", "Test server", "emoose", "Guardian", "guardian", "Team Slayer", "1", "16");
});

    $("#serverlist").find("tr:gt(0)").remove();

    $.getJSON( "http://192.99.124.162/list", function( data ) {
        if(data.result.code != 0)
        {
            alert("Error received from master: " + data.result.msg);
            return;
        }
        console.log(data);
        for(var i = 0; i < data.result.servers.length; i++)
        {
            var serverIP = data.result.servers[i];
	    if(validateIP(serverIP)) {
		queryServer(serverIP);
	    }
        }
    });
    
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
    str = str.toString();
    if(str != null) str = str.replace(/(<([^>]+)>)/ig,"");
    return str;
}

function validateIP(str){
    str = str.toString();
    if(str != null){
		if(/^(?:(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)\.){3}(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)(?:\:(?:\d|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?$/i.test(str)) {
			return true;
		}else{
			console.log(str + " is not a valid ip, skipping");
			return false;
		}
	}else {
	console.log(str + " is not a valid ip, skipping");
    return false;
	}
}

function invalidServer(name, variant, variantType, map, maxPlayers, numPlayers, hostPlayer) {

       if (encodeURIComponent(name).match("%3C","%3E") || encodeURIComponent(variant).match("%3C","%3E") || encodeURIComponent(map).match("%3C","%3E") || encodeURIComponent(maxPlayers).match("%3C","%3E") || encodeURIComponent(numPlayers).match("%3C","%3E") || encodeURIComponent(hostPlayer).match("%3C","%3E"))
		{
			console.log("Javascript found in one of the variables, skipping server");
			return true;
		}else{
			return false;
		}
}