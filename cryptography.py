# Install the cryptography library if you haven't:
# pip install cryptography

from cryptography.fernet import Fernet

# Generate a key (save this securely!)
key = Fernet.generate_key()
cipher_suite = Fernet(key)

# Your data as bytes
data = b"185.90.33.138,161.113.228.37,HBUK2R88MJX2UUW5,CRYPTOHOST,..."

# Encrypt
encrypted_data = cipher_suite.encrypt(data)
print("Encrypted:", encrypted_data)

# Decrypt (example)
decrypted_data = cipher_suite.decrypt(encrypted_data)
print("Decrypted:", decrypted_data.decode())

# Encrypt
encrypted_data = cipher_suite.encrypt(data)
print("Encrypted:", encrypted_data)

# Save encrypted data to a file
with open("encrypted_data.bin", "wb") as f:
    f.write(encrypted_data)

# Decrypt (example)
decrypted_data = cipher_suite.decrypt(encrypted_data)
print("Decrypted:", decrypted_data.decode())

# Encrypt
encrypted_data = cipher_suite.encrypt(data)
print("Encrypted:", encrypted_data)

# Save encrypted data to a file
with open("encrypted_data.bin", "wb") as f:
    f.write(encrypted_data)

# Decrypt (example)
with open("encrypted_data.bin", "rb") as f:
    encrypted_data = f.read()
decrypted_data = cipher_suite.decrypt(encrypted_data)
print("Decrypted:", decrypted_data.decode())

python cryptography.py