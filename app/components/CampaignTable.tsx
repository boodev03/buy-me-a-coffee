import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PublicKey } from "@solana/web3.js";
import { Coffee } from "lucide-react";
import { motion } from "framer-motion";

interface Campaign {
  admin: PublicKey;
  name: string;
  description: string;
  amountDonated: number;
}

export default function CampaignTable({
  campaigns,
}: {
  campaigns: Campaign[];
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-purple-500 to-pink-500">
            <TableHead className="text-white font-bold">Campaign</TableHead>
            <TableHead className="text-white font-bold">Description</TableHead>
            <TableHead className="text-white font-bold">Admin</TableHead>
            <TableHead className="text-white font-bold text-right">
              Coffee Love
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200"
            >
              <TableCell className="font-medium text-purple-700">
                {campaign.name}
              </TableCell>
              <TableCell className="text-pink-600">
                {campaign.description}
              </TableCell>
              <TableCell className="font-mono text-xs text-gray-500">
                {campaign.admin.toString().slice(0, 8)}...
              </TableCell>
              <TableCell className="text-right">
                <span className="inline-flex items-center bg-gradient-to-r from-yellow-300 to-yellow-500 text-purple-900 rounded-full px-3 py-1 font-bold">
                  <Coffee className="h-4 w-4 mr-2 text-purple-700" />
                  {Math.floor(campaign.amountDonated / 1e9)}
                </span>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
