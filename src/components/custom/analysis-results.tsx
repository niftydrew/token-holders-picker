import { TokenHolder, AnalysisStats } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface AnalysisResultsProps {
  stats: AnalysisStats;
  selectedHolders: TokenHolder[];
  onDownload: () => void;
}

export function AnalysisResults({
  stats,
  selectedHolders,
  onDownload,
}: AnalysisResultsProps) {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>
            Statistical breakdown of token holders
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <div className='space-y-2'>
            <p className='text-sm font-medium text-muted-foreground'>
              Total Holders
            </p>
            <p className='text-2xl font-bold'>
              {stats.totalHolders.toLocaleString()}
            </p>
          </div>
          <div className='space-y-2'>
            <p className='text-sm font-medium text-muted-foreground'>
              Mean Holdings
            </p>
            <p className='text-2xl font-bold'>{stats.mean.toFixed(2)}</p>
          </div>
          <div className='space-y-2'>
            <p className='text-sm font-medium text-muted-foreground'>
              Standard Deviation
            </p>
            <p className='text-2xl font-bold'>
              {stats.standardDeviation.toFixed(2)}
            </p>
          </div>
          <div className='space-y-2'>
            <p className='text-sm font-medium text-muted-foreground'>
              Selected Range
            </p>
            <p className='text-2xl font-bold'>
              {stats.lowerBound.toFixed(2)} - {stats.upperBound.toFixed(2)}
            </p>
          </div>
          <div className='space-y-2'>
            <p className='text-sm font-medium text-muted-foreground'>
              Eligible Holders
            </p>
            <p className='text-2xl font-bold'>
              {stats.eligibleHolders.toLocaleString()}
            </p>
          </div>
          <div className='space-y-2'>
            <p className='text-sm font-medium text-muted-foreground'>
              Selected Holders
            </p>
            <p className='text-2xl font-bold'>
              {stats.selectedHolders.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle>Selected Holders</CardTitle>
            <CardDescription>
              {selectedHolders.length} holders have been randomly selected
            </CardDescription>
          </div>
          <Button onClick={onDownload}>
            <Download className='mr-2 h-4 w-4' />
            Download
          </Button>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <div className='h-[400px] overflow-auto'>
              <table className='w-full'>
                <thead className='sticky top-0 bg-background'>
                  <tr className='border-b'>
                    <th className='p-2 text-left'>Address</th>
                    <th className='p-2 text-right'>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedHolders.map((holder) => (
                    <tr
                      key={holder.address}
                      className='border-b'
                    >
                      <td className='p-2 font-mono text-sm'>
                        {holder.address}
                      </td>
                      <td className='p-2 text-right'>
                        {holder.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
