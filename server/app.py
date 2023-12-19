from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from mci_modules.models import db, User, Favorite
import requests
from dotenv import load_dotenv
import os
from mci_modules.views import views 
from config import DevelopmentConfig

# used to load .env file values
load_dotenv()

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)
app.register_blueprint(views)

# getting GiantBomb API key
giant_bomb_api_key = os.getenv('GIANT_BOMB_API_KEY')

# Database setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mci.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a random secret key

# initialize all extensions (database, JWT, and CORS)
CORS(app)
db.init_app(app)
jwt = JWTManager(app)

# checking if game is a favorite
@app.route('/is_favorite', methods=['GET'])
@jwt_required()
def is_favorite():
    user = User.query.filter_by(email=get_jwt_identity()).first()
    game_id = request.args.get('game', '')
    platform_id = request.args.get('platform', 0)
    favorite = Favorite.query.filter_by(user_id=user.id, game_id=game_id, platform_id=platform_id).first()
    return jsonify(isFavorite=bool(favorite)), 200



# add_favorite avoids duplicates and ensure user is logged in
@app.route('/add_favorite', methods=['POST'])
@jwt_required()
def add_favorite():
    user = User.query.filter_by(email=get_jwt_identity()).first()
    game_id = request.args.get('game', '')
    platform_id = request.args.get('platform', 0)
    # Check if already favorited
    existing_favorite = Favorite.query.filter_by(user_id=user.id, game_id=game_id, platform_id=platform_id).first()
    if existing_favorite:
        return jsonify({"msg": "Game is already added to favorites."}), 400
    # Add to favorites
    new_favorite = Favorite(user_id=user.id, game_id=game_id, platform_id=platform_id)
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify({"msg": "Game added to favorites."}), 201


@app.route('/remove_favorite', methods=['POST'])
@jwt_required()
def remove_favorite():
    user = User.query.filter_by(email=get_jwt_identity()).first()
    game_id = request.args.get('game', '')
    platform_id = request.args.get('platform', 0)
    # Check if the game is actually a favorite
    favorite = Favorite.query.filter_by(user_id=user.id, game_id=game_id, platform_id=platform_id).first()
    if not favorite:
        return jsonify({"msg": "Game is not in favorites."}), 400
    # Remove from favorites
    db.session.delete(favorite)
    db.session.commit()
    return jsonify({"msg": "Game removed from favorites."}), 200


@app.route('/get_favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    favorites = Favorite.query.filter_by(user_id=user.id).all()
    favorite_games = []

    for favorite in favorites:
        response = requests.get(
            f"https://www.giantbomb.com/api/game/{favorite.game_id}/",
            headers={'User-Agent': 'MCIRetroVault/1.0'},
            params={
                "api_key": giant_bomb_api_key,
                "format": "json",
                "field_list": "name,id,image"
            }
        )
        if response.status_code == 200:
            game_data = response.json()['results']
            favorite_games.append({
                "name": game_data['name'], 
                "id": game_data['id'], 
                "image": game_data['image'],
                "platform_id": favorite.platform_id
            })

    return jsonify(favorite_games), 200

# register
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    print(data)
    first_name = data.get('first_name', None)
    last_name = data.get('last_name', None)
    email = data.get('email', None)
    password = data.get('password')

    if not first_name or not last_name or not email or not password:
        return jsonify({"msg": "Missing input... please fill in all fields."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already exists"}), 409
    
    new_user = User(first_name=first_name, last_name=last_name, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"}), 201

# login 
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Invalid email or password"}), 401

# number of users registered
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    num_users = len(users)
    return jsonify({"num_users": num_users}), 200

# search games
@app.route('/search_games', methods=['GET'])
def search_games():
    game_name = request.args.get('gameName', '')
    platform_id = request.args.get('platformID', '')

    if len(game_name) >= 2:
        headers = {'User-Agent': 'MCIRetroVault/1.0'}
        response = requests.get(
            "https://www.giantbomb.com/api/games/",
            headers=headers,
            params={
                "api_key": giant_bomb_api_key,
                "filter": f"name:{game_name},platforms:{platform_id}",
                "sort": "name:asc",
                "format": "json",  # Change this to json
                "field_list": "name,platforms,image,id"
            }
        )
        print("Response from API:", response.text)  # Debugging
        if response.status_code == 200:
            return jsonify(response.json()['results'])
        else:
            return jsonify({"error": "API request failed"}), response.status_code
    else:
        return jsonify([])

# display game info
@app.route('/display_info', methods=['GET'])
def display_info():
    game_id = request.args.get('game', '')

    if not game_id:
        return jsonify({"error": "No game ID provided"}), 400

    headers = {'User-Agent': 'MCIRetroVault/1.0'}
    response = requests.get(
        f"https://www.giantbomb.com/api/game/{game_id}/",  # API endpoint for a specific game
        headers=headers,
        params={
            "api_key": giant_bomb_api_key,
            "format": "json",
            "field_list": "description,image,images,name,original_release_date,publishers"
        }
    )
    print("Response from API:", response.text)  # Debugging
    if response.status_code == 200:
        return jsonify(response.json()['results'])
    else:
        return jsonify({"error": "API request failed"}), response.status_code

#displaying different game info for play window 
@app.route('/display_game', methods=['GET'])
def display_game():
    game_id = request.args.get('game', '')

    if not game_id:
        return jsonify({"error": "No game ID provided"}), 400

    headers = {'User-Agent': 'MCIRetroVault/1.0'}
    response = requests.get(
        "https://www.giantbomb.com/api/games/",
        headers=headers,
        params={
            "api_key": giant_bomb_api_key,
            "filter": f"id:{game_id}",
            "format": "json", 
            "field_list": "name,deck"
        }
    )
    print("Response from API:", response.text)  # Debugging
    if response.status_code == 200:
        return jsonify(response.json()['results'])
    else:
        return jsonify({"error": "API request failed"}), response.status_code

#displaying platform info
@app.route('/display_platform', methods=['GET'])
def display_platform():
    platformID = request.args.get('platformID', '')

    if not platformID:
        return jsonify({"error": "No platform ID provided"}), 400

    headers = {'User-Agent': 'MCIRetroVault/1.0'}
    response = requests.get(
        f"https://www.giantbomb.com/api/platform/{platformID}/",  # API endpoint for a specific game
        headers=headers,
        params={
            "api_key": giant_bomb_api_key,
            "format": "json",
            "field_list": "company,description,image,install_base,name,original_price,release_date"
        }
    )
    print("Response from API:", response.text)  # Debugging
    if response.status_code == 200:
        return jsonify(response.json()['results'])
    else:
        return jsonify({"error": "API request failed"}), response.status_code

# get user email
@app.route('/user_email', methods=['GET'])
@jwt_required()
def get_user_email():
    current_user_email = get_jwt_identity()
    return jsonify({"email": current_user_email}), 200

# Other routes...

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables
    app.run(debug=True)