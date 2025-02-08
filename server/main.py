from flask import Flask
from server.extensions import db
from server.routes.auth import auth_bp
from server.settings import Config
from server.models.user import User

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/')
def home():
    return "Welcome to the API!"

# Add this debug route
@app.route('/test-db')
def test_db():
    try:
        User.objects().first()
        return "Database connection successful!"
    except Exception as e:
        return f"Database error: {str(e)}"

if __name__ == '__main__':
    app.run(debug=True) 