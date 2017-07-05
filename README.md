# README #

This ReadMe contains basic information about how to run this project.

# What is this repository for? #

* This repository contains most of the code base for Travis Mobility. It is developed using meteor. Apart from that certain scripts are written in bash and python
* current version: 0.2.4
* https://live.travis-mobility.com

# How do I get set up? #

## Run MQTT Mosquitto: ##
```
#!usr/bin/sh
$ cd {root}/scripts/mqttMosquitto
$ ./server.sh
```
in case of port occupied error:
```
#!usr/bin/sh
$ ./clearPort.sh
$ kill -9 {pid returned by above script}
```

## Run Meteor ##
```
#!usr/bin/sh
$ cd {root}
$ meteor
```

## Local Deployment ##
In case the code is to run locally, set:
1. DEPLOY=False in *{root}/scripts/rasp/mockPublisher.py*
2. DEPLOY=false in *{root}/server/mqtt/subscription.js*

## Raspberry Configuration ##
1. copy or scp 'raspScript.py', 'listDevices.sh' and 'GeoTrust Global CA.pem' onto raspberry
2. 'GeoTrust Global CA.pem' should be in path or in the current directory when running the 'raspScript.py'.
3. Edit the 'raspScript.py' and set the variables
4. 'listDevices.sh' can be used to find the name of the signal receiver that is passed as an argument to the 'raspScript.py'
5. Run 'raspScript.py' in configure mode using:
```
#!usr/bin/sh
$ python raspScript.py /dev/ttyUSB0 --configure
```
6. Run 'raspScript.py' using:
```
#!usr/bin/sh
$ python raspScript.py /dev/ttyUSB0
```
or in background as detached process using:
```
#!usr/bin/sh
$ nohup python raspScript.py /dev/USB0tty --configure &
```

# Deployment instructions #
1. Launch all three instance images, namely mqtt, meteor, mongoDB
2. MongoDB will automatically start on startup.
3. run mqttMosquitto in background using:
```
#!/usr/bin/sh
$ mosquitto -d -c /usr/local/etc/mosquitto/mosquitto.conf
```
4. run meteor:
```
#!/usr/bin/sh
$ scp -i {sshKey} bundle.zip ec2-user@{machine_ip}
$ ssh -i {sshKey}
$ unzip bundle.zip
$ cd bundle
$ (cd programs/server && sudo npm install)
$ export MONGO_URL=''mongodb://travis:thisiszain@mongo.travis-mobility.com:27017/travis'
$ export PORT=3000
$ export ROOT_URL='http://live.travis-mobility.com'
$ export MAIL_URL='{smtp://user:password@mailhost:port/}' NOT NECESSARY
$ sudo -E pm2 start main.js -n "Travis"
```
5. run https-proxy on port 443.

## Security ##
1. The connection between *user/admin* and *meteor* is over SSL using certificates
2. The connection between *meteor* and *mongoDB* is not encrypted but the security group is configured by IP and port in a way that only *meteor* can connect to it.
3. The connection between *MQTT Mosquitto* and *raspberryPi/meteor* is also over SSL using certificates.
4. The user authentication is provided through fixed username and password configured at the startup. See *server/main.js*
5. The raspberry authentication is also over username and password that needs to be setup at the start of the raspberry script.

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner: *Fabian Gruß* fabian_gruss@yahoo.de
* Other community or team contact
1. *Zain Ul-Abideen* ZuAbideen@outlook.com
2. *Hania Syed* hania.syed@hotmail.com