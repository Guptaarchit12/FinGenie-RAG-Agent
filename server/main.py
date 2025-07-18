from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from query_agent import get_gemini_response

app = FastAPI(
    title="Gemini AI FastAPI",
    description="This API lets you send a query to Google Gemini AI and get a response.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str = Field(..., alias="question", example="Hey Gemini! how are you doing today? ")

    class Config:
        allow_population_by_field_name = True

@app.post("/ask", summary="Ask a question", response_description="AI-generated response")
async def ask_question(query: QueryRequest):
    try:
        response = await get_gemini_response(query.query)
        return {"response": response}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching AI response: {e}"
        )

@app.get("/", summary="Health check", response_description="Server status")
def root():
    return {"response": "ok"}
