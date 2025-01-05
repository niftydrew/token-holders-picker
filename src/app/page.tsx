import { TokenAnalysisForm } from '@/components/custom/token-analysis-form';
import { Navbar } from '@/components/custom/navbar';

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col bg-[#001810]'>
      <Navbar />
      <main className='container mx-auto py-10'>
        <TokenAnalysisForm />
      </main>
    </div>
  );
}
