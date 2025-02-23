import base64
from huggingface_hub import InferenceClient
import os

# Load API Key

api_key = os.getenv("HF_KEY")


client = InferenceClient(api_key=api_key)

# Load Boxing Coach Prompt
COACH_PROMPT = """You are a professional coach that reviews form. In 2 sentences max and in real english, give descriptive info on what they can improve with their form and be descriptive."""

def recognize(presigned_urls):
    """
    Analyzes boxing form from a list of presigned URLs using LLaMA 3.2.
    Returns a list of two-sentence critiques, one for each URL.
    """
    critiques = []
    
    for url in presigned_urls:
        # Construct message for single URL
        message = [
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": url}},
                    {"type": "text", "text": COACH_PROMPT},
                ],
            }
        ]
        
        try:
            # Send request for individual URL
            stream = client.chat.completions.create(
                model="meta-llama/Llama-3.2-11B-Vision-Instruct",
                messages=message,
                max_tokens=500,
                stream=True
            )
            
            # Collect the streamed response
            critique = ""
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    critique += chunk.choices[0].delta.content
            
            # Add the critique to our list
            critiques.append(critique)
            
        except Exception as e:
            critiques.append(f"Error analyzing image: {str(e)}")
    
    return critiques



