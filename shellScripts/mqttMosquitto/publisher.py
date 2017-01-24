"""
Python script to mock Respberry behavior
"""

# TODO: Create an MQTT Publisher in Python

import json
from pprint import pprint
import requests
import random
import time
import paho.mqtt.client as mqtt
from pymongo import MongoClient

WEB_ADDRESS = 'http://localhost:3000'

"""
The callback for when the client receives a CONNACK response from the server.
"""
def onConnect(client, userdata, flags, rc):
    print 'Connected with result code ' + str(rc) 

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe('$SYS/#')

"""
The callback for when a PUBLISH message is received from the server.
"""
def onMessage(client, userdata, msg):
    print msg.topic + ' ' + str(msg.payload)

"""
"""
def getSeats(resp):
    data = {'respId': resp[0], 'vehicleId': resp[1], 'password': 'password'}
    data_json = json.dumps(data)
    headers = {'Content-type': 'application/json'}

    response = requests.post(WEB_ADDRESS + '/resp/seats', data=data_json, headers=headers)

    pprint(response.json())
    return response.json()['seats']


def updateSeats(resp, seats):
    data = {'respId': resp[0], 'vehicleId': resp[1], 'password': 'password', 'seats': seats}
    data_json = json.dumps(data)
    headers = {'Content-type': 'application/json'}

    response = requests.put(WEB_ADDRESS + '/resp/seats', data=data_json, headers=headers)
    pprint(response.json())

def changeSeatStatus(resp, seat, url, status):
    data = {'respId': resp[0], 'vehicleId': resp[1], 'password': 'password', 'seatId': seat, 'status': status} 
    data_json = json.dumps(data)
    mqttClient.publish(url, data_json)
    

mqttClient = mqtt.Client()
mqttClient.on_connect = onConnect
mqttClient.on_message = onMessage

mqttClient.connect('localhost')
#mqtt.loop_start()

mongoClient = MongoClient('mongodb://127.0.0.1:3001/meteor')

print mongoClient.database_names()
VehiclesDB = mongoClient.meteor.transportVehicles

urls = []
respberries = []

for item in VehiclesDB.find():
    for resp in item['respberryIds']:
        urls.append('/' + item['vehicleId'] + '/' + resp)
        respberries.append((resp, item['vehicleId']))

# for url in urls:
#     print url
#    mqttClient.publish(url, 'Hello from: ' + url)


while True:
    i = 0
    for url in urls:
        print str(i) + ': ' + url
        i = i + 1
    print str(i) + ': Exit'
    choice = input('Select: ')

    if (choice == len(urls)):
        break
    if (choice >= len(urls)):
        print 'Invalid Input'
        continue
    
    url = urls[choice]
    resp = respberries[choice]
    
    seats = getSeats(resp)
    seatStatus = {}

    for seat in seats:
        seatStatus[seat] = False

    while True:
        print '0. Update Seats'
        print '1. Set Seat Status'
        print '2. Previous Menu'
        choice = input('Select: ')
        
        if choice == 0:
            seatCount = input('Enter number of seats: ')
            seats = []
            seatStatus = {}
            
            for j in range(0, seatCount):
                seats.append(random.randint(100000, 999999))

            for seat in seats:
                seatStatus[seat] = False
            
            updateSeats(resp, seats)

        elif choice == 1:
            timeDuration = 1
            print 'Current Time duration is: ' + str(timeDuration)
            choice = input('Enter number of seats: ')

            while choice > 0:
                choice = choice - 1
                seat = seats[random.randint(0, len(seats) - 1)]
                seatStatus[seat] = not seatStatus[seat]
                changeSeatStatus(resp, seat, url, seatStatus[seat])
                time.sleep(timeDuration)

        elif choice == 2:
            break
        else:
            print 'Invalid Input'


print 'done'


# while True:
#     temperature = sensor.blocking_read()
#     mqttc.publish("paho/temperature", temperature)

#loop_stop(force=False)
