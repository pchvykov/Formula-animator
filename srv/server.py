#http://127.0.0.1:8080/index.html

import http.server
import socketserver
import os
 
os.chdir('../')
PORT = 8000
 
Handler = http.server.SimpleHTTPRequestHandler
 
httpd = socketserver.TCPServer(("", PORT), Handler)
 
print("serving at port", PORT)
httpd.serve_forever()
