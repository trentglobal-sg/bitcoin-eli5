document.querySelector("#hash-example-1-plaintext").addEventListener("input", async function () {
    hashPicked = document.querySelector("#hash-example-1-select :checked").value;
    if (!hashPicked) {
        document.querySelector("#hash-example-1-plaintext").value = "You did not pick a hash function. Please pick a hash!";
    } else {
        messagePicked = document.querySelector("#hash-example-1-plaintext").value;

        ciphertext = hashOnce(messagePicked, hashPicked);

        document.querySelector("#hash-example-1-message").innerText = `ciphertext = ${hashPicked} ( plaintext )`;
        document.querySelector("#hash-example-1-ciphertext").value = ciphertext;
    }
});

document.querySelector("#hash-example-1-select").addEventListener("change", function () {
    console.log("triggered");
    document.querySelector("#hash-example-1-plaintext").value = `Please key in your message to be hashed.`;
});

document.querySelector("#hash-example-2-button").addEventListener("click", function () {
    marker = true;
    const genRanHex = (size) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
    hashPicked = document.querySelector("#hash-example-2-select :checked").value;
    ciphertextArray = [];
    count = 0;
    for (i = 0; i < 10; i++) {
        console.log(count);
        plaintext = genRanHex(128);
        ciphertext = hashOnce(plaintext, hashPicked);
        collisionFlag = ciphertextArray.includes(ciphertext);
        if (collisionFlag) {
            break;
        } else {
            ciphertextArray.push(ciphertext);
        }
        count++;
        tr = document.createElement("tr");
        td1 = document.createElement("td");
        td1.innerText = count;
        td2 = document.createElement("td");
        td2.innerText = plaintext;
        td3 = document.createElement("td");
        td3.innerText = ciphertext;
        td4 = document.createElement("td");
        td4.innerText = collisionFlag;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        document.querySelector("#hash-output").appendChild(tr);
    }
});
