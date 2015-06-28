import sys, os, json, subprocess, cPickle
from subprocess import Popen, PIPE, STDOUT
from flask import Flask, render_template, request, send_from_directory, redirect, url_for


def get_directory(name):
    return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', name))

SESHAT_PATHS = ['/home/zim/dev/seshat/']
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

app = Flask(__name__, template_folder=get_directory('templates'), static_folder=get_directory('js'), static_url_path='/js')


@app.route("/")
def index():
    return render_template('indexRecognition.html')

@app.route("/stroke", methods=['POST'])
def stroke():
    data = json.loads(request.data)
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
        stdout = stdout.split('\n')
    
    if stderr is not "":
        result = {'error': "Error"}
    elif len(stdout) > 3 and stdout[len(stdout) - 3] == 'LaTeX:':
        result = {'latex': stdout[len(stdout) - 2]}
    else:
        result = {'error': "Error"}
    result = json.dumps(result)
    return result


@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)


if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0', port=8000)

