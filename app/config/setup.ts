/* eslint-disable @typescript-eslint/no-explicit-any */
import idl from "@/idl.json";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { clusterApiUrl, Connection } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const getOwnProvider = (wallet: NodeWallet) => {
  return new AnchorProvider(connection, wallet);
};

export const getProgram = (wallet?: NodeWallet) => {
  if (!wallet) return new Program(idl as any, {
    connection: connection
  }) as any;
  const provider = getOwnProvider(wallet);
  return new Program(idl as any, provider) as any;
};

