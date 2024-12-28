# Token Holders Picker

A Next.js application that allows you to analyze and select Solana token holders based on specific criteria. This tool helps you identify and export token holder addresses that meet your specified conditions.

## Features

- 🔍 Token holder analysis based on minimum holdings
- 💰 Automatic token decimal handling using Solana SPL Token standard
- 📊 Filter holders by custom criteria
- ⬇️ Export selected holder addresses
- 🚀 Built on Solana web3.js and SPL Token libraries

## Prerequisites

Before running this application, you need:

- Node.js 18+ or Bun runtime
- A Helius API key (set in environment variables)

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_RPC_URL=https://api.helius-rpc.com/?api-key=
NEXT_PUBLIC_HELIUS_API_KEY=your_helius_api_key_here
```

## Installation

```bash
# Install dependencies using bun
bun install
```

## Development

Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Enter a valid Solana token mint address
2. Set your minimum token holdings requirement
3. Specify the number of holders you want to select
4. Submit the form to analyze holders
5. Download the list of selected holder addresses

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Solana Web3.js
- Solana SPL Token
- Tailwind CSS
- Shadcn UI Components

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
