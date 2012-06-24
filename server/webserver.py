#!/usr/bin/python

import threading
import tornado.web
import tornado.ioloop
import tornado.websocket
import tornado.httpserver
import redis

LISTENERS = []
CHAN = "kinect"

def redis_listener():
    print "Redis thread started"
    r = redis.Redis(host='localhost', db=1)
    
    chan = r.pubsub()
    chan.subscribe([CHAN])
    for message in chan.listen():
        #print "Got event %s" % message['data']
        for element in LISTENERS:
            element.write_message(unicode(message['data']))

class RealtimeHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print "Socket connected"
        LISTENERS.append(self)

    def on_message(self, message):
        pass

    def on_close(self):
        LISTENERS.remove(self)


settings = {
        'auto_reload': True,
        }

application = tornado.web.Application([
    (r'/', RealtimeHandler),
    ], **settings)


if __name__ == "__main__":
    threading.Thread(target=redis_listener).start()
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
