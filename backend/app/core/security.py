import json
import base64
import hmac
import hashlib
import time
from datetime import datetime, timedelta, timezone
from typing import Optional, Any
from backend.app.core.config import settings

# Attempt to use passlib & python-jose if installed
try:
    from passlib.context import CryptContext
    from jose import jwt, JWTError
    _USE_JOSE = True
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
except ImportError:
    _USE_JOSE = False


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against the hashed version."""
    if _USE_JOSE:
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception:
            pass
    # Fallback secure hash check
    expected = hashlib.sha256((plain_password + settings.SECRET_KEY).encode("utf-8")).hexdigest()
    return hmac.compare_digest(expected, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate password hash."""
    if _USE_JOSE:
        try:
            return pwd_context.hash(password)
        except Exception:
            pass
    # Fallback secure hash
    return hashlib.sha256((password + settings.SECRET_KEY).encode("utf-8")).hexdigest()


def create_access_token(subject: Any, expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT access token."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    if _USE_JOSE:
        try:
            to_encode = {"exp": expire, "sub": str(subject)}
            return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        except Exception:
            pass

    # Fallback lightweight token encoding
    payload = {"sub": str(subject), "exp": int(expire.timestamp())}
    payload_bytes = base64.urlsafe_b64encode(json.dumps(payload).encode("utf-8")).decode("utf-8")
    sig = hmac.new(settings.SECRET_KEY.encode("utf-8"), payload_bytes.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{payload_bytes}.{sig}"


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT access token."""
    if _USE_JOSE:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload
        except Exception:
            pass

    # Fallback lightweight token decoder
    try:
        parts = token.split(".")
        if len(parts) != 2:
            return None
        payload_bytes, sig = parts[0], parts[1]
        expected_sig = hmac.new(settings.SECRET_KEY.encode("utf-8"), payload_bytes.encode("utf-8"), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected_sig):
            return None
        payload_bytes_str = payload_bytes + '=' * (-len(payload_bytes) % 4)
        decoded_json = base64.urlsafe_b64decode(payload_bytes_str.encode("utf-8")).decode("utf-8")
        payload = json.loads(decoded_json)
        if payload.get("exp") and time.time() > payload["exp"]:
            return None
        return payload
    except Exception:
        return None
