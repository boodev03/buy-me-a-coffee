import { PublicKey } from "@solana/web3.js";

export interface Donator {
    pubKey: PublicKey;
    amount: number;
}