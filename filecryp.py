def encrypt_file(input_file, output_file):
    with open(input_file, 'rb') as f:
        plaintext = f.read()
    
    # Dummy key (not recommended for secure encryption)
    key = 0x55
    
    # XOR each byte of plaintext with the key
    ciphertext = bytes(byte ^ key for byte in plaintext)
    
    with open(output_file, 'wb') as f:
        f.write(ciphertext)

def decrypt_file(input_file, output_file):
    with open(input_file, 'rb') as f:
        ciphertext = f.read()
    
    key = 0x55
    
    plaintext = bytes(byte ^ key for byte in ciphertext)
    
    with open(output_file, 'wb') as f:
        f.write(plaintext)
        
if __name__ == "__main__":
    pass
