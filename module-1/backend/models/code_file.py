from sqlalchemy import Column, Integer, String, Text
from database.db import Base


class CodeFile(Base):
    __tablename__ = "code_files"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, nullable=False)
    filename = Column(String(200), nullable=False)
    language = Column(String(50), nullable=True)
    content = Column(Text, nullable=False)