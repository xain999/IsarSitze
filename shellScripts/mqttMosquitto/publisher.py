# TODO: Create an MQTT Publisher in Python

import paho.mqtt.client as mqtt

# The callback for when the client receives a CONNACK response from the server.
def onConnect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("$SYS/#")

# The callback for when a PUBLISH message is received from the server.
def onMessage(client, userdata, msg):
    print msg.topic + " " + str(msg.payload)

client = mqtt.Client()
client.on_connect = onConnect
client.on_message = onMessage

client.connect("127.0.0.1:3001/meteor")

#mqtt.loop_start()

topics = [line.rstrip('\n') for line in open('topics.txt')]

for topic in topics:
    print topic
    client.publish(topic, "Hello From Python!")

# while True:
#     temperature = sensor.blocking_read()
#     mqttc.publish("paho/temperature", temperature)

#loop_stop(force=False)
