import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGODB_SETTINGS = {
        'db': 'Cluster0',  # Changed to match your Atlas cluster name
        'host': os.getenv('MONGO_URI'),
        'connect': True
    }
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')