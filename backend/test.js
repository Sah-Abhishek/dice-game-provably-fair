import { Keypair } from '@solana/web3.js';
import dotenv from 'dotenv';
dotenv.config();

// const secretKeyBase64 = process.env.escrow_account_base64;
// console.log("This is the escrow account bse64: ", secretKeyBase64);
// const secretKeyBytes = new Uint8Array(Buffer.from(secretKeyBase64, "base64"));
// console.log("This is the secretKey in Byte: ", secretKeyBase64);
// console.log("\n");
// const keyPair = Keypair.fromSecretKey(secretKeyBytes);
// console.log("This line executed: \n");
//
// console.log("This is the keypair: ", keyPair);



const escrowAccountSecretKey = process.env.escrow_sec.split(",").map(Number);
const escrowAccount = Keypair.fromSecretKey(Uint8Array.from(escrowAccountSecretKey));

console.log("This is the escrowAccount: ", escrowAccount);
