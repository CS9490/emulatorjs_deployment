from flask import Blueprint

views = Blueprint('views', __name__)

@views.route('/somepage')
def some_page():
    return "This is some page!"
