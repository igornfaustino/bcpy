from flask import Flask, render_template, send_from_directory
import socketio
from os.path import abspath, join, dirname
from threading import Thread
import logging

sio = socketio.Server(async_mode='threading')
web_dir = abspath(join(dirname(__file__), '../web'))
app = Flask(__name__, template_folder=web_dir)
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
app.config.debug = False
app.wsgi_app = socketio.Middleware(sio, app.wsgi_app)

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)


@app.route('/')
def sessions():
    return render_template('index.html')


@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory(join(web_dir, 'js'), path)


@sio.on('connect')
def connect(sid, environ):
    print('connect ', sid)


@sio.on('eeg_data')
def my_custom_event(sid, data):
    sio.emit('eeg', data, skip_sid=sid)


def run():
    try:
        app.run()
    except Exception as ex:
        print(ex)
        exit(1)


def start_server():
    Thread(target=run).start()