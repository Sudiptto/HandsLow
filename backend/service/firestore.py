import firebase_admin
from firebase_admin import credentials, firestore
import datetime

# Path to your service account JSON file
SERVICE_ACCOUNT_PATH = "/Users/ishmam/echo/backend/service/keys/service-account.json"

def initialize_firebase():
    try:
        # Initialize the Firebase Admin SDK
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred)
        print("Firebase Admin SDK initialized successfully!")

        # Access Firestore
        db = firestore.client()
        print("Connected to Firestore!")

        # Test Writing to Firestore
        user_collection = db.collection("users")
        """
        user_collection.add({
            "username": "johndoe1",
            "email": "johndoe@example.com",
            "password": "abc123",
            "profile_picture": "",
            "bio": "Just another tech enthusiast!",
            "followers": [],
            "following": []
        })
        """

        posts_collection = db.collection("posts")
        """
        posts_collection.add({
            "username": "john_doe_123",                   
            "content": "This is a sample post content",   
            "media": "",
            "likes": [],
            "comments": [],
            "created": "2025-01-23T10:00:00Z" 
        })
        """

        print("Document written successfully!")
        return db

    except Exception as e:
        print("An error occurred:", e)
        return None

def check_user_exists(email: str):
    users_collection = db.collection("users")
    query = users_collection.where("email", "==", email)

    results = list(query.stream())
    user = results[0].to_dict() if len(results) > 0 else None
    print(user)
    return user

def check_email_exists(email: str):
    users_collection = db.collection("users")
    query = users_collection.where("email", "==", email)

    results = list(query.stream())
    user = results[0].to_dict() if len(results) > 0 else None
    return user

def register_new_user(username: str, email:str, password: str):
    users_collection = db.collection("users")
    users_collection.add({
        "username": username,
        "email": email,
        "password": password,
        "profile_picture": "",
        "bio": "No bio yet.",
        "followers": [],
        "following": []
    })
    return check_user_exists(username)

def create_posts( username: str, content: str):

    posts_collection = db.collection("posts")
    posts_collection.add({
        "username": username,                   
        "content": content,   
        "media": "",
        "likes": [],
        "comments": [],
        "created": str(datetime.date.today())
    })

db = initialize_firebase()