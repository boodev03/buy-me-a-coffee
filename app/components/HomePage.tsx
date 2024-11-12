/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import useIsMounted from "@/hooks/useIsMounted";
import { Donator } from "@/types";
import { BN } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Coffee,
  Droplet,
  RefreshCcw,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getProgram } from "../config/setup";

interface Campaign {
  admin: PublicKey;
  name: string;
  description: string;
  amountDonated: number;
  donators: Donator[];
}

export default function Home() {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const isMounted = useIsMounted();
  const scrollRef = useRef<HTMLDivElement>(null);

  const donateCoffee = async () => {
    if (!anchorWallet) return;
    setShowModal(true);
    try {
      const payer = new Keypair();
      const program = getProgram({
        ...anchorWallet,
        payer,
      });
      const campaignAccounts = await connection.getProgramAccounts(
        program.programId
      );
      await program.methods
        .donate(new BN(0.1 * LAMPORTS_PER_SOL))
        .accounts({
          campaign: campaignAccounts[0].pubkey,
          user: anchorWallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      setShowModal(false);
      toast.success("Donated successfully");
      getAllCampaigns();
    } catch (e) {
      toast.error("Error on donate. Let try again");
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
      if (campaignAccounts.length > 0) {
        const campaignData = await program.account.campaign.fetch(
          campaignAccounts[0].pubkey
        );
        setCampaign({
          admin: campaignData.admin,
          name: campaignData.name,
          description: campaignData.description,
          amountDonated: campaignData.amountDonated.toNumber(),
          donators: campaignData.donators,
        });
      }
    } catch (e) {
      toast.error("Error fetching campaigns");
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
    <main
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden"
      ref={scrollRef}
    >
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          {isMounted && (
            <motion.div
              className="flex justify-end mb-8"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 transition-colors" />
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center mb-16"
          >
            <motion.div
              className="relative w-64 h-64 mb-8"
              animate={{
                rotateY: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-xl" />
              <Image
                src="/logo.png"
                fill
                alt="3D Coffee Cup"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </motion.div>
            <motion.h1
              className="text-6xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {campaign?.name}
            </motion.h1>
            <motion.p
              className="text-2xl text-center mb-8 max-w-2xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {campaign?.description} ☕😉
            </motion.p>
            <motion.div
              className="flex space-x-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                onClick={donateCoffee}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-full transform hover:scale-105 transition duration-200 shadow-lg"
              >
                <Coffee className="mr-2 h-5 w-5" />
                {isLoading ? "Brewing..." : "Donate Coffee"}
              </Button>
              <Button
                onClick={getAllCampaigns}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold py-3 px-6 rounded-full transform hover:scale-105 transition duration-200 shadow-lg"
              >
                <RefreshCcw
                  className={`mr-2 h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
                />
                {isLoading ? "Updating..." : "Refresh Data"}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {[
              {
                icon: Users,
                title: "Donators",
                value: campaign?.donators.length || 0,
                description: "Coffee enthusiasts",
              },
              {
                icon: Coffee,
                title: "Total Donated",
                value: campaign
                  ? `${(campaign.amountDonated / LAMPORTS_PER_SOL).toFixed(
                      2
                    )} SOL`
                  : "0.00 SOL",
                description: "Liquid motivation",
              },
              {
                icon: TrendingUp,
                title: "Campaign Growth",
                value: "33%",
                description: "Steady increase",
                showProgress: true,
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border-none text-white overflow-hidden"
              >
                <CardContent className="p-6">
                  <motion.div
                    className="flex items-center mb-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <item.icon className="h-8 w-8 mr-2 text-purple-400" />
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                  </motion.div>
                  <motion.p
                    className="text-3xl font-bold mb-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  >
                    {item.value}
                  </motion.p>
                  <motion.p
                    className="text-gray-400"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  >
                    {item.description}
                  </motion.p>
                  {item.showProgress && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                      <Progress value={33} className="h-2 mt-4" />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-2xl p-6 mb-16 overflow-hidden"
          >
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              Recent Donators 🙏
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-2 text-left text-gray-400">
                      Donators
                    </th>
                    <th className="px-4 py-2 text-right text-gray-400">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaign?.donators.map((donator, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-gray-700"
                    >
                      <td className="px-4 py-2 text-pink-400">
                        {donator.pubKey.toString()}
                      </td>
                      <td className="px-4 py-2 text-right text-teal-400">
                        {(donator.amount / LAMPORTS_PER_SOL).toFixed(2)} SOL
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold mb-8 text-purple-400">
              How It Works
            </h3>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                {
                  icon: Coffee,
                  title: "Create a Campaign",
                  description: "Start your coffee revolution",
                },
                {
                  icon: Zap,
                  title: "Energize the Network",
                  description: "Spread your caffeinated vision",
                },
                {
                  icon: Droplet,
                  title: "Collect Liquid Motivation",
                  description: "Receive SOL for your passion",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center max-w-xs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-6 mb-4 shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <item.icon className="h-12 w-12 text-white" />
                  </motion.div>
                  <h4 className="text-xl font-semibold mb-2 text-purple-300">
                    {item.title}
                  </h4>
                  <p className="text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <footer className="text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Buy me a Coffee (boo.dev03). All
              rights reserved.
            </p>
          </footer>
        </div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-8 w-8 text-purple-400 opacity-75" />
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-lg shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-4 text-white">
                Thank You! 😘✌️
              </h2>
              <p className="text-white">
                Your coffee donation is brewing success!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
