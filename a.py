import secrets

def generate_token(length: int = 32):
    return secrets.token_urlsafe(length)

if __name__ == "__main__":
    token = generate_token()
    print(token)