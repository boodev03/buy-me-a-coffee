/* eslint-disable @typescript-eslint/no-explicit-any */
import idl from "@/idl.json";
import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

interface SolanaWindow extends Window {
    solana: any;
}


declare const window: SolanaWindow;

const PROGRAM_ID = new PublicKey(
    "J4qMunkmPMHxJh24JSq5Z9zdWC5SWWrHn9bq4VesqUWs"
);
const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

const wallet = window.solana;

if (wallet && !wallet.isConnected) {
    await wallet.connect();
}
const provider = new AnchorProvider(connection, wallet);



export const program = new Program(idl as Idl, provider);


export const [campaign] = PublicKey.findProgramAddressSync(
    [Buffer.from("CAMPAIGN_DEMO")],
    PROGRAM_ID
);
