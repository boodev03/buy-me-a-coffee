"use client";

import { Button } from "@/components/ui/button";
import useIsMounted from "@/hooks/useIsMounted";
import { BN } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { motion } from "framer-motion";
import { Coffee, Heart, RefreshCcw } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { campaign, getProgram } from "../config/setup";
import CampaignTable from "./CampaignTable";

interface Campaign {
  admin: PublicKey;
  name: string;
  description: string;
  amountDonated: any;
}

export default function Home() {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  const donateCoffee = async () => {
    if (!anchorWallet) return;
    try {
      const program = getProgram({
        ...anchorWallet,
        payer: new Keypair(),
      });
      const campaignAccounts = await connection.getProgramAccounts(
        program.programId
      );
      const res = await program.methods
        .donate(new BN(1 * LAMPORTS_PER_SOL))
        .accounts({
          campaign: campaignAccounts[0].pubkey,
          user: anchorWallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      console.log(res);
    } catch (e) {
      console.log("Error on donate", e);
    }
  };

  const getAllCampaigns = async () => {
    if (!anchorWallet) return;
    setIsLoading(true);
    try {
      const program = getProgram({
        ...anchorWallet,
        payer: new Keypair(),
      });
      const campaignAccounts = await connection.getProgramAccounts(
        program.programId
      );
      const parsedCampaigns = await Promise.all(
        campaignAccounts.map(async (account) => {
          const campaignData = await program.account.campaign.fetch(
            account.pubkey
          );
          return {
            admin: campaignData.admin,
            name: campaignData.name,
            description: campaignData.description,
            amountDonated: campaignData.amountDonated,
          };
        })
      );
      setCampaigns(parsedCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (anchorWallet) {
      getAllCampaigns();
    }
  }, [anchorWallet]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-12">
        {isMounted && (
          <div className="flex justify-end">
            <WalletMultiButton />
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-12"
        >
          <Image
            src="/logo.png"
            alt="Coffee cup logo"
            width={150}
            height={150}
            className="mb-4 drop-shadow-2xl size-[200px] object-contain"
          />
          <h1 className="text-5xl font-bold text-center text-white mb-2 drop-shadow-lg">
            Solana Coffee Vibes
          </h1>
          <p className="text-2xl text-center text-white mb-8 drop-shadow">
            Spread love with virtual coffee!
          </p>
          <div className="flex space-x-4">
            <Button
              onClick={donateCoffee}
              disabled={isLoading}
              className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-3 px-6 rounded-full transform hover:scale-105 transition duration-200"
            >
              <Coffee className="mr-2 h-5 w-5" />
              {isLoading ? "Brewing..." : "Donate coffee !!!!"}
            </Button>
            <Button
              onClick={getAllCampaigns}
              disabled={isLoading}
              className="relative overflow-hidden bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold py-3 px-6 rounded-full transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-200"></span>
              <span className="relative flex items-center">
                <RefreshCcw className="mr-2 h-5 w-5 animate-spin" />
                {isLoading ? "Refreshing..." : "Refresh Vibes"}
              </span>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-2xl p-6 backdrop-blur-lg bg-opacity-90"
        >
          <h2 className="text-3xl font-bold text-purple-600 mb-4">
            Awesome Coffee Campaigns
          </h2>
          <CampaignTable campaigns={campaigns} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-6 drop-shadow">
            How It Works
          </h3>
          <div className="flex justify-center space-x-8">
            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                className="bg-yellow-300 rounded-full p-6 mb-4 shadow-lg"
              >
                <Coffee className="h-12 w-12 text-purple-600" />
              </motion.div>
              <p className="text-white font-semibold">Create a Vibe</p>
            </div>
            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                className="bg-pink-300 rounded-full p-6 mb-4 shadow-lg"
              >
                <Heart className="h-12 w-12 text-red-600" />
              </motion.div>
              <p className="text-white font-semibold">Share the Love</p>
            </div>
            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                className="bg-purple-300 rounded-full p-6 mb-4 shadow-lg relative"
              >
                <Image
                  src="/solana.svg"
                  alt="Solana logo"
                  width={48}
                  height={48}
                  className="!size-12 object-contain"
                />
              </motion.div>
              <p className="text-white font-semibold">Receive Solana Magic</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
