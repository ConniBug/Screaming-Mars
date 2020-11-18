# Screaming-Mars
Screaming mars is a remote managment software created for the purpose of remote control and remote managment of remote/local servers/computers

This has been tested and deployed on a linux client and linux server this hasnt been tested on windows 
but is assumed to work on windows with a little compatibility

# Contributing
I am fully open to pull requests if what you have done is cool or helpful then your pull will be accepted

# Setting up server
sudo apt-get update -y 
sudo apt-get install -y libcurl-dev 
sudo apt install nodejs -y
sudo apt install npm -y
sudo npm install http 
sudo npm install url 

node    server.js
nodemon server.js 

# Setting up Client

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
