"""
Python script to mock Respberry behavior
"""

import json
from pprint import pprint
import random
import time
import requests
import paho.mqtt.client as mqtt
from pymongo import MongoClient

WEB_ADDRESS = 'http://localhost:3000'

"""
The callback for when the client receives a CONNACK response from the server.
"""
def onConnect(client, userdata, flags, rc):
    print('Connected with result code ' + str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe('$SYS/#')

"""
The callback for when a PUBLISH message is received from the server.
"""
def onMessage(client, userdata, msg):
    print (msg.topic + ' ' + str(msg.payload))

"""
"""
def getSeats(resp):
    data = {'respId': resp[0], 'vehicleId': resp[1], 'password': 'password'}
    data_json = json.dumps(data)
    headers = {'Content-type': 'application/json'}

    response = requests.post(WEB_ADDRESS + '/resp/seats', data=data_json, headers=headers)

    pprint(response.json())

    if 'seats' in response.json():
        return response.json()['seats']

    return []

"""
"""
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

print (mongoClient.database_names())
VehiclesDB = mongoClient.meteor.transportVehicles

urls = []
respberries = []
seats = []
seatStatus = {}
timeDuration = 1

for item in VehiclesDB.find():
    for resp in item['respberryIds']:
        urls.append('/' + item['vehicleId'] + '/' + resp)
        respberries.append((resp, item['vehicleId']))

        gotSeats = getSeats((resp, item['vehicleId']))
        seats.append(gotSeats)

        for seat in gotSeats:
            seatStatus[seat] = False

while True:

    print('NOTE: 0 - ' + str(len(urls)) + ' TO UPDATE SEAT IDS')
    i = 0
    for url in urls:
        print(str(i) + ': ' + url + ' : Seats ' + str(len(seats[i])))
        i = i + 1

    print(str(i) + ": " + 'Simulate')
    print(str(i + 1) + ': Exit')
    choice = input('Select: ')

    if choice == len(urls) + 1:
        break
    if choice > len(urls):
        print('Invalid Input')
        continue
    if choice == len(urls):
        print('Current Time duration is: ' + str(timeDuration))
        choice = input('Enter number of seats: ')

        while choice > 0:
            url = random.randint(0, len(urls) - 1)
            resp = respberries[url]
            seat = seats[url][random.randint(0, len(seats[url]) - 1)]
            seatStatus[seat] = not seatStatus[seat]
            changeSeatStatus(resp, seat, urls[url], seatStatus[seat])
            time.sleep(timeDuration)
            choice = choice - 1
    else:
        resp = respberries[choice]
        seatCount = input('Enter number of seats: ')
        newSeats = []

        for j in range(0, seatCount):
            t = (choice + 1) * 1000000
            newSeats.append(t + random.randint(100000, 999999))

        for seat in newSeats:
            seatStatus[seat] = False

        seats[choice] = newSeats
        updateSeats(resp, newSeats)

print('done')
