from flask import Blueprint, request, jsonify
from server.models.user import User
from server.extensions import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    # Check if user already exists
    if User.objects(email=data.get('email')).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    if User.objects(username=data.get('username')).first():
        return jsonify({'error': 'Username already taken'}), 400
    
    # Create new user
    try:
        user = User(
            email=data.get('email'),
            username=data.get('username')
        )
        user.set_password(data.get('password'))
        user.save()
        
        return jsonify({
            'message': 'User created successfully',
            'user': {
                'email': user.email,
                'username': user.username
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400 