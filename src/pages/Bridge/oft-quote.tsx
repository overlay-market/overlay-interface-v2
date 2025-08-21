"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { oft } from "@layerzerolabs/oft-v2-solana-sdk";
import { useState, useEffect } from "react";
import { AddressLookupTableInput, publicKey, transactionBuilder, Umi } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { addressToBytes32 } from "@layerzerolabs/lz-v2-utilities";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BSC_MAINNET_EID, SOLANA_ESCROW, SOLANA_MAINNET_RPC, SOLANA_OFT_PROGRAM_ID, SOLANA_OVL_MINT, SOLANA_TOKEN_PROGRAM_ID } from "../../constants/bridge";
import { fetchAddressLookupTable, findAssociatedTokenPda, mplToolbox, setComputeUnitLimit, setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox'

const SOLANA_OFT_MINT_ADDRESS = SOLANA_OVL_MINT

const amount = 0.1 * LAMPORTS_PER_SOL;

const SOLANA_ESCROW_ADDRESS = SOLANA_ESCROW;
const SOLANA_PROGRAM_ADDRESS = SOLANA_OFT_PROGRAM_ID;

const toEid = BSC_MAINNET_EID;
type GradientButtonProps = {
    destination: string
}

const getAddressLookupTable = async (umi: Umi) => {
    // Lookup Table Address and Priority Fee Calculation
    const lookupTableAddress = publicKey('AokBxha6VMLLgf97B5VYHEtqztamWmYERBmmFvjuTzJB')
    const addressLookupTableInput: AddressLookupTableInput = await fetchAddressLookupTable(umi, lookupTableAddress)
    if (!addressLookupTableInput) {
        throw new Error(`No address lookup table found for ${lookupTableAddress}`)
    }
    return {
        lookupTableAddress,
        addressLookupTableInput,
    }
}

export const OftQuote: React.FC<GradientButtonProps> = ({destination}) => {
  const wallet = useWallet();

  const [isClient, setIsClient] = useState(false);
  const [nativeFee, setNativeFee] = useState<bigint | null>(null);

  useEffect(() => {
    setIsClient(true); // Set to true when component mounts (client-side)
  }, []);

  if (!isClient) return null; // Prevent rendering mismatched content

  const rpcUrl = SOLANA_MAINNET_RPC;
  const umi = createUmi(rpcUrl);
  umi.use(walletAdapterIdentity(wallet));
  umi.use(mplToolbox())

  async function onClickQuote() {
    if (!wallet.connected || !wallet.publicKey) {
      console.error("Wallet is not connected or publicKey is missing.");
      return;
    }
  console.log(await umi.rpc.getLatestBlockhash())

    if (
      !destination ||
      !SOLANA_OFT_MINT_ADDRESS ||
      !SOLANA_ESCROW_ADDRESS ||
      !SOLANA_PROGRAM_ADDRESS
    ) {
      console.error("Missing environment variables.");
      return;
    }

    const mint = publicKey(SOLANA_OFT_MINT_ADDRESS);
    const recipientAddressBytes32 = addressToBytes32(destination);
    console.log(umi.rpc, wallet.publicKey.toBase58())
    const tokenAccount = findAssociatedTokenPda(umi, {
        mint: mint,
        owner: publicKey(wallet.publicKey),
        tokenProgramId: publicKey(SOLANA_TOKEN_PROGRAM_ID),
    })

    console.log({
        tokenMint: mint,
        tokenEscrow: publicKey(SOLANA_ESCROW_ADDRESS),
        payInLzToken: false,
        to: Buffer.from(recipientAddressBytes32),
        dstEid: toEid,
        amountLd: BigInt(amount),
        minAmountLd: 1n,
        options: Buffer.from(""), // enforcedOptions must have been set
        composeMsg: undefined,
        oft: publicKey(SOLANA_PROGRAM_ADDRESS),
    })

    const { nativeFee } = await oft.quote(
      umi.rpc,
      {
        payer: publicKey(wallet.publicKey),
        tokenMint: mint,
        tokenEscrow: publicKey(SOLANA_ESCROW_ADDRESS),
      },
      {
        payInLzToken: false,
        to: Buffer.from(recipientAddressBytes32),
        dstEid: toEid,
        amountLd: BigInt(amount),
        minAmountLd: 100000000n,
        options: Buffer.from(""), // enforcedOptions must have been set
        composeMsg: undefined,
      },
      {
        oft: publicKey(SOLANA_PROGRAM_ADDRESS),
      },
      [],
      publicKey("AokBxha6VMLLgf97B5VYHEtqztamWmYERBmmFvjuTzJB"),
    );
    console.log({nativeFee, signer: umi.identity})
    setNativeFee(nativeFee);

    const ix = await oft.send(
        umi.rpc,
        {
            payer: umi.identity,
            tokenMint: mint,
            tokenEscrow: publicKey(SOLANA_ESCROW_ADDRESS),
            tokenSource: tokenAccount[0],
        },
        {
            to: Buffer.from(recipientAddressBytes32),
            dstEid: toEid,
            amountLd: BigInt(amount),
            minAmountLd: 100000000n,
            options: Buffer.from(""), // enforcedOptions must have been set
            composeMsg: undefined,
            nativeFee: nativeFee,
        },
        { oft: publicKey(SOLANA_PROGRAM_ADDRESS), token: publicKey(SOLANA_TOKEN_PROGRAM_ID) } // ← use override
    )
    console.log({ix})

    // Create and sign transaction
    const latestBlockhash = await umi.rpc.getLatestBlockhash();
    const unitPriceIx = setComputeUnitPrice(umi, {
          microLamports: BigInt(0)
        })
    const unitLimitIx = setComputeUnitLimit(umi, { units: 3383770 })
    console.log({unitPriceIx, unitLimitIx})
    const { addressLookupTableInput } = await getAddressLookupTable(umi)

    const tx = transactionBuilder()
      .add(unitPriceIx)
      .add(unitLimitIx)
      .setAddressLookupTables([addressLookupTableInput])
      .add(ix)
      .setBlockhash(latestBlockhash)
      .build(umi);

    console.log("Signing transaction...")
    const signedTx = await umi.identity.signTransaction(tx);
    
    console.log("Sending transaction... 2")
    const signature = await umi.rpc.sendTransaction(signedTx);
    
    console.log("Transaction sent:", signature);
    
    // Wait for confirmation
    const confirmation = await umi.rpc.confirmTransaction(signature, {
      strategy: { type: "blockhash", ...latestBlockhash },
      commitment: "confirmed"
    });
    
    console.log("Transaction confirmed:", confirmation);
  }

  return (
    <div>
      <div />

      <p>Solana OFT Mint Address: {SOLANA_OFT_MINT_ADDRESS}</p>
      <p>Solana Escrow Address: {SOLANA_ESCROW_ADDRESS}</p>

      <div />

      <p>(Harcoded) Sepolia address: {destination}</p>
      <p>Connected Solana address: {wallet.publicKey?.toBase58()} </p>

      <div />

      <p>(Hardcoded) Amount: {amount}</p>

      <button onClick={onClickQuote}>OFT Quote</button>

      <p>Quote result (nativeFee): {nativeFee ? nativeFee.toString() : "null"}</p>
    </div>
  );
}