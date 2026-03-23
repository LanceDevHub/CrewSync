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

        if user.is_admin:
            print(f"ℹ️ {email} ist bereits Admin")
            return

        user.is_admin = True
        db.commit()

        print(f"✅ {email} ist jetzt Admin")

    finally:
        db.close()


def remove_admin(email: str):
    db = SessionLocal()

    try:
        user = db.scalar(select(User).where(User.email == email))

        if not user:
            print("❌ User nicht gefunden")
            return

        if not user.is_admin:
            print(f"ℹ️ {email} ist kein Admin")
            return

        user.is_admin = False
        db.commit()

        print(f"✅ {email} ist kein Admin mehr")

    finally:
        db.close()


def list_admins():
    db = SessionLocal()

    try:
        admins = db.scalars(
            select(User).where(User.is_admin.is_(True)).order_by(User.email.asc())
        ).all()

        if not admins:
            print("ℹ️ Es gibt aktuell keine Admins")
            return

        print("📋 Admins:")
        for user in admins:
            print(
                f"- {user.first_name} {user.last_name} "
                f"(@{user.username}, {user.email})"
            )

    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Verwendung:")
        print("python -m scripts.manage_admin make email@example.com")
        print("python -m scripts.manage_admin remove email@example.com")
        print("python -m scripts.manage_admin list")
        sys.exit(1)

    action = sys.argv[1]

    if action == "make":
        if len(sys.argv) < 3:
            print("❌ Bitte Email angeben")
            print("python -m scripts.manage_admin make email@example.com")
            sys.exit(1)

        email = sys.argv[2]
        make_admin(email)

    elif action == "remove":
        if len(sys.argv) < 3:
            print("❌ Bitte Email angeben")
            print("python -m scripts.manage_admin remove email@example.com")
            sys.exit(1)

        email = sys.argv[2]
        remove_admin(email)

    elif action == "list":
        list_admins()

    else:
        print("❌ Ungültige Aktion. Verwende 'make', 'remove' oder 'list'.")
        sys.exit(1)