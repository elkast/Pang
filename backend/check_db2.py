import sqlite3

conn = sqlite3.connect("c:/niveau2/backend/ivo.db")
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
print("Tables:", cursor.fetchall())

# Check users table schema
cursor.execute("PRAGMA table_info(users)")
print("\nUsers columns:")
for col in cursor.fetchall():
    print(f"  {col}")

# Check data
cursor.execute("SELECT id, email, username FROM users")
print("\nUsers:")
for row in cursor.fetchall():
    print(f"  {row}")
conn.close()
