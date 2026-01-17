# app/core/security.py
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import settings
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Any, Dict, NamedTuple

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)

def create_access_token(data: Dict[str, Any], expires_delta: int | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(seconds=(expires_delta or settings.JWT_EXP_SECONDS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

class TokenPayload(NamedTuple):
    sub: int
    is_admin: bool  # ← добавляем это поле!

def decode_jwt(creds: HTTPAuthorizationCredentials = Depends(security)) -> TokenPayload:
    token = creds.credentials
    print(f"🔐 [SECURITY] decode_jwt called")
    
    try:
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET, 
            algorithms=[settings.JWT_ALGORITHM]
        )
        print(f"🔐 [SECURITY] Token decoded: {payload}")
        
        # sub должен быть строкой в JWT, но мы храним как int
        sub_str = payload.get("sub")
        sub_int = int(sub_str)  # преобразуем в int
        
        is_admin = bool(payload.get("is_admin", False))
        
        print(f"🔐 [SECURITY] Returning: sub={sub_int}, is_admin={is_admin}")
        return TokenPayload(sub=sub_int, is_admin=is_admin)
        
    except (JWTError, ValueError) as e:
        print(f"🔐 [SECURITY] Error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")