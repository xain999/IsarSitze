# publisher.py

# TODO: Create an MQTT Publisher in Python

import paho.mqtt.client as mqtt
from pymongo import MongoClient
# The callback for when the client receives a CONNACK response from the server.
def onConnect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("$SYS/#")

# The callback for when a PUBLISH message is received from the server.
def onMessage(client, userdata, msg):
    print msg.topic + " " + str(msg.payload)

mqttClient = mqtt.Client()
mqttClient.on_connect = onConnect
mqttClient.on_message = onMessage

mqttClient.connect("localhost")
#mqtt.loop_start()

mongoClient = MongoClient('mongodb://127.0.0.1:3001/meteor')

print mongoClient.database_names()
VehiclesDB = mongoClient.meteor.transportVehicles


RespDB = mongoClient.meteor.respberries

for item in VehiclesDB.find():
    print item

for item in RespDB.find():
    print item
    topic = '/' + item['belongsTo'] + '/' + item['name']
    mqttClient.publish(topic, "Hello From Python!")

print "done"


# while True:
#     temperature = sensor.blocking_read()
#     mqttc.publish("paho/temperature", temperature)

#loop_stop(force=False)
