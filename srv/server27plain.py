#http://127.0.0.1:8000
# Run from the Formular-animator directory, i.e. python srv/server27plain.py

import SimpleHTTPServer
import SocketServer
import os
from urlparse import parse_qs
from cgi import parse_header
import shutil
import json
from subprocess import Popen, PIPE, STDOUT

PORT = 8000

def get_directory(name):
    return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', name))

# Add the corresponding directories on your machine
SESHAT_PATHS = ['/home/zim/dev/seshat/']
# Temp just holds temporary files, it can be any empty directory
TEMP_PATHS = ['/home/zim/dev/temp/']
base_seshat = ''
base_temp = ''

for p in SESHAT_PATHS:
    if os.path.exists(p):
        base_seshat = p
        break

for p in TEMP_PATHS:
    if os.path.exists(p):
        base_temp = p
        break

class RequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.end_headers()
            f = open('index.html', 'r')
            self.wfile.write(f.read())
        else:
            f = self.send_head()
            if f:
                self.copyfile(f, self.wfile)
                f.close()

    def do_POST(self):
        length = int(self.headers['content-length'])
        data = json.loads(self.rfile.read(length).decode('utf-8'))
        cmd = base_seshat + 'seshat -c ' + base_seshat + 'Config/CONFIG -i ' + base_temp + 'stroke.scgink'
        with open(base_temp + 'stroke.scgink', 'w') as f:
            f.write('SCG_INK\n' + str(len(data)) + '\n')
            for stroke in data:
                f.write(str(len(stroke)) + '\n')
                for e in stroke:
                    f.write(str(e[0]) + ' ' + str(e[1]) + '\n')
        p = Popen(cmd, shell=True, stdout=PIPE, stderr=PIPE)
        stdout, stderr = p.communicate()
        print stderr
        if stdout is not None:
            stdout = stdout.decode('utf-8').split('\n')
            if stderr is not "":
                result = {'error': "Error"}
            elif len(stdout) > 3 and stdout[len(stdout) - 3] == 'LaTeX:':
                result = {'latex': stdout[len(stdout) - 2]}
            else:
                result = {'error': "Error"}
            result = json.dumps(result)
        self.wfile.write(result)
 
httpd = SocketServer.TCPServer(("", PORT), RequestHandler)
 
print "serving at port " + str(PORT)
httpd.serve_forever()
