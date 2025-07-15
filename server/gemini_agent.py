import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv(""))

model = genai.GenerativeModel('models/gemini-1.5-flash')  

def query_gemini(prompt: str):
    response = model.generate_content(prompt)
    return response.text
