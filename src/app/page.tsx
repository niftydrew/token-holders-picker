import { TokenAnalysisForm } from '@/components/custom/token-analysis-form';

export default function Home() {
  return (
    <main className='container mx-auto py-10'>
      <div className='flex flex-col items-center space-y-8'>
        <h1 className='text-4xl font-bold text-center'>Token Holders Picker</h1>
        <p className='text-muted-foreground text-center max-w-2xl'>
          Analyze any Solana token&apos;s holder distribution and randomly
          select holders based on your criteria. Perfect for airdrops and
          community analysis.
        </p>
        <TokenAnalysisForm />
      </div>
    </main>
  );
}
