import cloudinary
import cloudinary.uploader
import cloudinary.api

def configure_cloudinary(cloud_name, api_key, api_secret):
    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret
    )

def upload_video(file_path, folder="videos"):
    try:
        response = cloudinary.uploader.upload(
            file_path,
            resource_type="video",
            folder=folder
        )
        return response
    except Exception as e:
        print(f"Error uploading video: {e}")
        return None

def get_video_url(public_id):
    try:
        url = cloudinary.CloudinaryVideo(public_id).build_url()
        return url
    except Exception as e:
        print(f"Error retrieving video URL: {e}")
        return None

# Example usage
if __name__ == "__main__":
    configure_cloudinary("your_cloud_name", "your_api_key", "your_api_secret")
    
    # Upload a video
    upload_response = upload_video("path/to/video.mp4")
    if upload_response:
        print("Upload successful!", upload_response)
    
    # Retrieve video URL
    if upload_response:
        video_url = get_video_url(upload_response["public_id"])
        print("Video URL:", video_url)


