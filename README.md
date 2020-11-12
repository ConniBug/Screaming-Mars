# Screaming-Mars

# Setting up server
sudo apt-get update -y 
sudo apt-get install -y libcurl-dev 
sudo apt install nodejs -y
sudo apt install npm -y
sudo npm install http 
sudo npm install url 

node server.js

# Setting up Client

sudo apt-get upgrade -y 
sudo apt-get update  -y 
sudo apt-get install -y libcurl-dev 
sudo apt-get install -y net-tools

sudo mkdir /screamingmars/src/
sudo mkdir /screamingmars/src/build/
sudo mkdir /screamingmars/commands/

mv ./conf.t /screamingmars/

g++ hello.cpp -o ./build/out -lcurl

./build/out
