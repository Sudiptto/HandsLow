import cloudinary
import cloudinary.uploader
from passwords import *

# Configure Cloudinary with your credentials
cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET
)

def upload_video(video_path):
    """
    Uploads a video to Cloudinary and returns the URL.

    :param video_path: Path to the local video file.
    :return: URL of the uploaded video.
    """
    try:
        response = cloudinary.uploader.upload(video_path, resource_type="video")
        return response["secure_url"]  # Returns the video URL
    except Exception as e:
        print(f"Error uploading video: {e}")
        return None

# Example usage:
video_url = upload_video("1.mov")
print("Uploaded Video URL:", video_url)

