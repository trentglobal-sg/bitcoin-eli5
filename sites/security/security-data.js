function hashOnce(message, hashFunction) {
    hash = CryptoJS[hashFunction](message);
    ciphertext = hash.toString(CryptoJS.enc.Hex);

    return ciphertext;
}
