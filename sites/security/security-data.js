document.querySelector("#message").addEventListener("input", function () {
    console.log(document.querySelector("#hash-select"))


});






// //Pass in a hexdecimal string of any length and it will return the base58 encoding
// function hexToBase58(hex) {
//     const BASE58_CHARS = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"; //Bitcoin encoding (unique)
//     let base10 = BigInt("0x" + hex); //BigInt usage to avoid truncation errors
//     console.log("base10: ", base10);
//     let result = "";
//     while (base10 != 0) {
//         //base conversion algorithm
//         remainder = Number(base10 % 58n);
//         result = BASE58_CHARS[remainder] + result;
//         base10 = base10 / 58n;
//     }
//     return result;
// }
