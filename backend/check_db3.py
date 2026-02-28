import sqlite3

conn = sqlite3.connect("c:/niveau2/backend/ivo.db")
cursor = conn.cursor()
cursor.execute("SELECT id, email, username, hashed_password FROM users")
print("Users:")
for row in cursor.fetchall():
    print(f"  ID: {row[0]}, Email: {row[1]}, Username: {row[2]}")
    print(f"    Hash: {row[3][:50]}...")
conn.close()
