document.querySelector("#hash-example-1-plaintext").addEventListener("input", async function () {
    hashPicked = document.querySelector("#hash-example-1-select :checked").value;
    messagePicked = document.querySelector("#hash-example-1-plaintext").value;

    hash = CryptoJS[hashPicked](messagePicked);
    ciphertext = hash.toString(CryptoJS.enc.Hex);
    document.querySelector("#hash-example-1-message").innerText = `ciphertext = ${hashPicked} ( plaintext )`;
    document.querySelector("#hash-example-1-ciphertext").value = ciphertext;
});
