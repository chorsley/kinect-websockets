kinect-websockets
=================

Proof of concept quality. Use PyOpenNI to capture Kinect gestures, publish to Redis, consume from Tornado and send over WebSockets to browser clients.

You will need:

* Kinect
* OpenNI
* PyOpenNI
* Running instance of redis-server
* Latest copy of Tornado (had problems with WebSocket protocols until upgrading)

Then:

* Run kinect.py
* Run webserver.py


Issues: 

* Need to smooth out jerky behaviour when Kinect loses track of hands
