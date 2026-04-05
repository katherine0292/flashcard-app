from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from bson import ObjectId
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# 允许前端访问后端（解决跨域问题）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://flashcard-app-q1pb.onrender.com", "https://flashcard-app-jet-seven.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 连接 MongoDB
client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("DATABASE_NAME")]
collection = db["flashcards"]


# 定义闪卡的数据格式
class Flashcard(BaseModel):
    question: str
    answer: str
    category: Optional[str] = "未分类"


class FlashcardUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None


def card_to_dict(card) -> dict:
    """把数据库里的卡片转成可以返回给前端的格式"""
    return {
        "id": str(card["_id"]),
        "question": card["question"],
        "answer": card["answer"],
        "category": card.get("category", "未分类"),
    }


# ========== API 接口 ==========

# READ - 获取所有闪卡
@app.get("/api/flashcards")
async def get_flashcards():
    cards = await collection.find().to_list(1000)
    return [card_to_dict(c) for c in cards]


# CREATE - 创建新闪卡
@app.post("/api/flashcards", status_code=201)
async def create_flashcard(card: Flashcard):
    result = await collection.insert_one(card.model_dump())
    new_card = await collection.find_one({"_id": result.inserted_id})
    return card_to_dict(new_card)


# UPDATE - 修改闪卡
@app.put("/api/flashcards/{card_id}")
async def update_flashcard(card_id: str, card: FlashcardUpdate):
    updates = {k: v for k, v in card.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="没有提供要修改的内容")
    result = await collection.update_one(
        {"_id": ObjectId(card_id)}, {"$set": updates}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="找不到该闪卡")
    updated = await collection.find_one({"_id": ObjectId(card_id)})
    return card_to_dict(updated)


# DELETE - 删除闪卡
@app.delete("/api/flashcards/{card_id}")
async def delete_flashcard(card_id: str):
    result = await collection.delete_one({"_id": ObjectId(card_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="找不到该闪卡")
    return {"message": "删除成功"}
