import json
import tornado.httpserver
import tornado.websocket
import tornado.ioloop
from tornado.ioloop import PeriodicCallback
import tornado.web
from random import randint  # Random generator

# Config
port = 7777  # Websocket Port
interval = 10  # Milliseconds

data = [0, 0, 0, 0]

class WSHandler(tornado.websocket.WebSocketHandler):

    # check_origin fixes an error 403 with Tornado
    # http://stackoverflow.com/questions/24851207/tornado-403-get-warning-when-opening-websocket
    def check_origin(self, origin):
        return True

    def open(self):
        # Send message periodic via socket upon a time interval
        self.periodicCallback = PeriodicCallback(self.send_values, interval)
        self.periodicCallback.start()

    def send_values(self):
        # Generates random values to send via websocket

        for i in range(len(data)):
            data[i] = data[i] + randint(-3, 3)
            data[i] = max(min(70, data[i]), 0)
            json_response = json.dumps([i, data[i]])
            print(json_response)
            self.write_message(json_response)

    def on_message(self, message):
        pass

    def on_close(self):
        self.periodicCallback.stop()

    def InputData(self, inputList):
        SinputList = []
        for line in inputList:
            # he call .decode('ascii') converts the raw bytes to a string.
            # .split(',') splits the string on commas.
            s = line.decode("utf-8").split(',')
            SinputList.append(s)
        return SinputList


application = tornado.web.Application([
    (r'/service', WSHandler),
])

http_server = tornado.httpserver.HTTPServer(application)
http_server.listen(port)
tornado.ioloop.IOLoop.instance().start()
