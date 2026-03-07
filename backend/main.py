from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB接続設定
DATABASE_URL = "postgresql://user:password@localhost:5432/pressrelease"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# テーブルの定義
class PressReleaseModel(Base):
    __tablename__ = "press_releases"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)

# テーブルを作成する
Base.metadata.create_all(bind=engine)

# リクエストデータの形
class PressRelease(BaseModel):
    title: str
    content: str

class GenerateRequest(BaseModel):
    name: str      # プロモーションするものの名前
    date: str      # 日付
    appeal: str    # おすすめしたいところ

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/save")
def save(data: PressRelease):
    db = SessionLocal()
    try:
        record = PressReleaseModel(title=data.title, content=data.content)
        db.add(record)
        db.commit()
        db.refresh(record)
        return {"message": "保存しました", "id": record.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.get("/list")
def list_all():
    db = SessionLocal()
    try:
        records = db.query(PressReleaseModel).all()
        return [{"id": r.id, "title": r.title, "content": r.content} for r in records]
    finally:
        db.close()

@app.post("/generate")
def generate(data: GenerateRequest):
    model = genai.GenerativeModel("gemini-2.5-flash")
    prompt = f"""
以下の情報をもとにプレスリリースの本文を日本語で作成してください。

商品・サービス名: {data.name}
リリース日: {data.date}
おすすめポイント: {data.appeal}

プレスリリースとして自然な文章で、見出しと本文を含めて作成してください。
"""
    response = model.generate_content(prompt)
    return {"content": response.text}