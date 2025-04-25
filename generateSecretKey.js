import {randomBytes} from "crypto"

console.log(randomBytes(64).toString("hex"));

//running this file on terminal, typing "node /this file name/", there will be the secretkey. 
// This secret key will be used on JWT_SECRET on .env
// Actually, the JWT_SECRET can be anything anyword but this is generated to make it more secured