
from typing import List
from sqlmodel import  Field
from pydantic import BaseModel

# from sqlalchemy.exc import IntegrityError

class Currency(BaseModel):
    code: str = Field(primary_key=True, index=True)
    min: float
    max: float

class User(BaseModel):
    user_name: str = Field(primary_key=True, index=True)
    user_email: str
    base_currency: str
    currencies: List[Currency] | None =None

class UserName(BaseModel):
    user_name: str = Field(primary_key=True, index=True)