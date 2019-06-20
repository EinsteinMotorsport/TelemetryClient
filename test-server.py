import json

import tornado.httpserver
import tornado.websocket
import tornado.ioloop
from tornado.ioloop import PeriodicCallback
import tornado.web
from random import randint  # Random generator

# import Data


# Config
port = 7777  # Websocket Port
timeInterval = 10  # Milliseconds


class WSHandler(tornado.websocket.WebSocketHandler):

    # check_origin fixes an error 403 with Tornado
    # http://stackoverflow.com/questions/24851207/tornado-403-get-warning-when-opening-websocket
    def check_origin(self, origin):
        return True

    def open(self):
        # Send message periodic via socket upon a time interval
        self.callback = PeriodicCallback(self.send_values, timeInterval)
        self.callback.start()

    def send_values(self):
        # Generates random values to send via websocket
        info = [0, randint(0, 70)]
        to_send_info = json.dumps(info)

        print(to_send_info)
        self.write_message(to_send_info)
        # Generates random values to send via websocket
        info = [1, randint(0, 70)]
        to_send_info = json.dumps(info)

        print(to_send_info)
        self.write_message(to_send_info)
        # Generates random values to send via websocket
        info = [2, randint(0, 70)]
        to_send_info = json.dumps(info)

        print(to_send_info)
        self.write_message(to_send_info)
        # Generates random values to send via websocket
        info = [3, randint(0, 70)]
        to_send_info = json.dumps(info)

        print(to_send_info)
        self.write_message(to_send_info)

    def on_message(self, message):
        pass

    def on_close(self):
        self.callback.stop()

    def InputData(self, InputListe):
        SinputList = []
        for line in InputListe:
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
