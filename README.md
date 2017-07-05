# README #

This ReadMe contains basic information about how to run this project.

### What is this repository for? ###

* This repository contains most of the code base for Travis Mobility. It is developed using meteor. Apart from that certain scripts are written in bash and python
* current version: 0.2.4
* https://live.travis-mobility.com

### How do I get set up? ###

* run MQTT Mosquitto:
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

* run meteor
```
#!usr/bin/sh
$ cd {root}
$ meteor
```

* Local Deployment:
  In case the code is to run locally, set:
  1. DEPLOY=False in {root}/scripts/rasp/mockPublisher.py
  2. DEPLOY=false in {root}/server/mqtt/subscription.js

* Raspberry Configuration:
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

* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact