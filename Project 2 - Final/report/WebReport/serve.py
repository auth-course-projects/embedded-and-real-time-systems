import sys
import thread
import webbrowser
import time

import BaseHTTPServer, SimpleHTTPServer

def start_server():
    httpd = BaseHTTPServer.HTTPServer(('localhost', 9026), SimpleHTTPServer.SimpleHTTPRequestHandler)
    httpd.serve_forever()

thread.start_new_thread(start_server,())
url = 'http://localhost:9026'
webbrowser.open_new(url)

while True:
    try:
        time.sleep(1)
    except KeyboardInterrupt:
        sys.exit(0)
