import os
from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Multi-Agent Meeting Assistant"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"

    # Security & Auth
    SECRET_KEY: str = "super-secret-jwt-key-change-this-in-production-mode"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./meeting_assistant.db"

    # Gemini & Vector DB
    GEMINI_API_KEY: str = ""
    CHROMADB_DIR: str = "./chroma_db_store"
    EMBEDDING_MODEL: str = "models/embedding-001"
    LLM_MODEL: str = "gemini-2.5-flash"

    # Whisper
    WHISPER_MODEL: str = "base"

    # CORS
    CORS_ORIGINS: Union[List[str], str] = ["*"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
