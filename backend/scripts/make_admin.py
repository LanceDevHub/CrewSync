import sys
from sqlalchemy import select
from app.core.database import SessionLocal
from app.models.user import User


def make_admin(email: str):
    db = SessionLocal()

    try:
        user = db.scalar(select(User).where(User.email == email))

        if not user:
            print("❌ User nicht gefunden")
            return

        user.is_admin = True
        db.commit()

        print(f"✅ {email} ist jetzt Admin")

    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Bitte Email angeben: python -m scripts.make_admin email@example.com")
    else:
        make_admin(sys.argv[1])