# Screaming-Mars
Screaming mars is a remote managment software created for the purpose of remote control and remote managment of remote/local servers/computers

This has been tested and deployed on a linux client and linux server this hasnt been tested on windows 
but is assumed to work on windows with a little compatibility

# Contributing
I am fully open to pull requests if what you have done is cool or helpful then your pull will be accepted

# Setting up server

### Config 
You can edit the values at the top of the `server.js` such as the port [here](https://github.com/ConniTheKiwi/Screaming-Mars/blob/352a0447806f727fc6b75138ade72aac5a56ba59/server/server.js#L3)

to add more valid commands modify these lines

```
// Valid commands
var ster = ["shutdown", "SpamShutdown", "SayHey", "delall"];

var commandsNonPerm = [ ["shutdown", "Shutdown"], 
                 ["SpamShutdown", "Perm Shutdown"], 
                 ["SayHey", "Display Hello Message"] 
];
                 
var commandsPerm = [ ["delall", "Erase Device"] ];
```

add the name of the commands file name from the clients commands folder of the `.sh` script to execute(without the extention) 

for example if you had 
```
/
    /screamingmars
        /commands
            /lockAllUsers.sh
```

you would add `lockAllUsers` to the `ster` array eg

```
// Valid commands
var ster = ["shutdown", "SpamShutdown", "SayHey", "delall", "lockAllUsers"];
```

then you must add the command and the text to be shown on the Web GUI for that command
to either the non perm array or the perm array

this will indicate to the web gui what page to show the command button under

to add it to the perm/non perm array you would append 
`["Command File name should match the name in array 'ster'", "Display name in web GUI"]`

In our Example we would create this 
`["lockAllUsers", "Lock out all currently logged in users"]`

and as this command wont be perminent OS damage we would add it to the non perm array eg

```
var commandsNonPerm = [ ["shutdown", "Shutdown"], 
                 ["SpamShutdown", "Perm Shutdown"], 
                 ["SayHey", "Display Hello Message"],
                 ["lockAllUsers", "Lock out all currently logged in users"]
];
```

And thats all.

### Installation
```
sudo apt-get update -y 
sudo apt-get install -y libcurl-dev 
sudo apt install nodejs -y
sudo apt install npm -y
sudo npm install http 
sudo npm install url 

node    server.js
nodemon server.js 
```

# Setting up Client

### Config

First create your own `conf.t` file 
the formatting of this file is shown in `conf.t.example` 

dont change the line space or anything about its order or what line the values are on 
as the code reads specific lines and passes them as the config values

### Installation
```
sudo apt-get upgrade -y 
sudo apt-get update  -y 
sudo apt-get install -y libcurl-dev 
sudo apt-get install -y net-tools

sudo mkdir /screamingmars/src/
sudo mkdir /screamingmars/bin/
sudo mkdir /screamingmars/commands/

mv ./conf.t /screamingmars/

g++ client.cpp -o /screamingmars/bin -lcurl

/screamingmars/bin/client
```

# Legal Stuff
I am not be responsible for any direct or indirect damage caused due to the usage of this tool.
This software is built for Internal usage only.
