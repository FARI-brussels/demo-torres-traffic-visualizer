import http.server
import socketserver
import os
import requests


STRAPI_URL = "http://46.226.110.124:1337/"
DEMO_URL = STRAPI_URL + "api/demos?locale=en"
#Because of the shitiness of strapi localization we have to rely on the position of the demo in strapi rather than its id
DEMO_POSITIONS = range(len(requests.get(DEMO_URL).json()["data"]))
print(['/'] + [f'{str(id)}' for id in DEMO_POSITIONS])


class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        #get all demo ids
        if self.path in ['/'] + [f'/{str(id)}' for id in DEMO_POSITIONS]:
            self.path = '/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

PORT = 8080

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()