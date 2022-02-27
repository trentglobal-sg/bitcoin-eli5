//////////////////////////////////////////////////////////////
//slide navbar mechanism
//////////////////////////////////////////////////////////////
currentPage = 0;
const MAXSLIDES = 10; //the highest slide number

//button clicks
document.querySelector("#next-btn").addEventListener("click", nextPage);
document.querySelector("#previous-btn").addEventListener("click", previousPage);

//left right keyboard presses
document.onkeydown = function (e) {
    if (e.key == "ArrowLeft") {
        previousPage();
    } else if (e.key == "ArrowRight") {
        nextPage();
    }
};

//functions
function nextPage() {
    if (currentPage < MAXSLIDES) {
        currentSlide = document.querySelector(`#slide-${currentPage}`);
        currentSlide.classList.remove("show");
        currentSlide.classList.add("hidden");
        nextSlide = document.querySelector(`#slide-${currentPage + 1}`);
        nextSlide.classList.remove("hidden");
        nextSlide.classList.add("show");
        currentPage++;
        document.querySelector("#pageNumber").innerText = currentPage;
    }
}
function previousPage() {
    if (currentPage > 0) {
        currentSlide = document.querySelector(`#slide-${currentPage}`);
        currentSlide.classList.remove("show");
        currentSlide.classList.add("hidden");
        previousSlide = document.querySelector(`#slide-${currentPage - 1}`);
        previousSlide.classList.remove("hidden");
        previousSlide.classList.add("show");
        currentPage--;
        document.querySelector("#pageNumber").innerText = currentPage;
    }
}

//////////////////////////////////////////////////////////////
//slide-1
//////////////////////////////////////////////////////////////
document.querySelector("#hash-example-1-plaintext").addEventListener("input", function () {
    hashPicked = document.querySelector("#hash-example-1-select :checked").value;
    if (!hashPicked) {
        this.setAttribute("placeholder", "You did not pick a hash function. Please pick a hash function above!");
        this.value = "";
    } else {
        messagePicked = document.querySelector("#hash-example-1-plaintext").value;

        ciphertext = hashOnce(messagePicked, hashPicked);

        document.querySelector("#hash-example-1-message").innerText = `ciphertext = ${hashPicked} ( plaintext )`;
        document.querySelector("#hash-example-1-ciphertext").value = ciphertext;
    }
});

document.querySelector("#hash-example-1-select").addEventListener("change", function () {
    console.log("triggered");
    document.querySelector("#hash-example-1-plaintext").setAttribute("placeholder", `Please key in your message to be hashed.`);
});

//////////////////////////////////////////////////////////////
//slide-4 (NOT WORKING)
//////////////////////////////////////////////////////////////
document.querySelector("#hash-example-2-button").addEventListener("click", function () {
    marker = true;
    const genRanHex = (size) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
    hashPicked = document.querySelector("#hash-example-2-select :checked").value;
    ciphertextArray = [];
    count = 0;
    for (let i = 0; i < 100; i++) {
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

//////////////////////////////////////////////////////////////
//slide-5
//////////////////////////////////////////////////////////////
document.querySelector("#hash-example-3-input").addEventListener("input", function () {
    const POSSIBILITIES = 2 ** 256;
    document.querySelector("#hash-example-3-days").innerText = (POSSIBILITIES / this.value / 60 / 60 / 24);
    document.querySelector("#hash-example-3-months").innerText = (POSSIBILITIES / this.value / 60 / 60 / 24 / 30);
    document.querySelector("#hash-example-3-years").innerText = (POSSIBILITIES / this.value / 60 / 60 / 24 / 365);
})

//////////////////////////////////////////////////////////////
//slide-8
//////////////////////////////////////////////////////////////




