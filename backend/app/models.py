import uuid
from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict, EmailStr


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class BlogCreate(BaseModel):
    title: str = Field(..., max_length=200)
    summary: str = Field(..., max_length=500)
    content: str
    coverImage: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    source: Optional[str] = None
    published: bool = True


class SubscriberCreate(BaseModel):
    email: EmailStr
    locale: str = "en"
    source: str = "footer"


class CommentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: Optional[str] = None
    body: str = Field(..., min_length=1, max_length=2000)


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    company: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=5000)
