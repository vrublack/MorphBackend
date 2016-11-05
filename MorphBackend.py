import os

from flask import Flask, redirect, send_from_directory, send_file

app = Flask(__name__)


@app.route('/')
def hello_world():
    return redirect("/static/index.html", code=302)


@app.route('/morph/<path:m>')
def morph(m):
    print("Requested morph " + m)
    # return app.send_static_file('/morph/' + m)
    # root_dir = os.path.dirname(os.getcwd())
    # return send_from_directory(os.path.join(root_dir, 'morph'), m)

    return send_file('morph/' + m, mimetype='image/gif')


if __name__ == '__main__':
    # TODO removed this because of sudo permission
    # app.run(host='0.0.0.0', port=80)
    app.run(port=80)
