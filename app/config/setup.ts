/* eslint-disable @typescript-eslint/no-explicit-any */
import idl from "@/idl.json";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey(
  "J4qMunkmPMHxJh24JSq5Z9zdWC5SWWrHn9bq4VesqUWs"
);
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const getProvider = (wallet: Wallet) => {
  return new AnchorProvider(connection, wallet);
};

export const getProgram = (wallet: Wallet) => {
  const provider = getProvider(wallet);
  return new Program(idl as any, provider) as any;
};

export const [campaign] = PublicKey.findProgramAddressSync(
  [Buffer.from("CAMPAIGN_DEMO")],
  PROGRAM_ID
);
