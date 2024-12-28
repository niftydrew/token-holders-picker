'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { SOLANA_ADDRESS_REGEX } from '@/lib/constants';
import { AnalysisResults } from '@/lib/types';

const formSchema = z.object({
  mintAddress: z
    .string()
    .min(1, 'Token mint address is required')
    .regex(SOLANA_ADDRESS_REGEX, 'Invalid Solana address format'),
  minHoldings: z
    .number()
    .min(0.000001, 'Minimum holdings must be greater than 0'),
  numberOfHolders: z
    .number()
    .min(1, 'Must select at least 1 holder')
    .max(10000, 'Maximum 10,000 holders can be selected'),
  excludeTopPercent: z
    .number()
    .min(0, 'Cannot be negative')
    .max(99, 'Cannot exclude all holders'),
});

export function TokenAnalysisForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [processingTime, setProcessingTime] = useState<string>();
  const [progressStage, setProgressStage] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setElapsedSeconds(0);
      const interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const formatElapsedTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mintAddress: '',
      minHoldings: 0,
      numberOfHolders: 100,
      excludeTopPercent: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setProgress(0);
    setResults(null);
    setProcessingTime(undefined);
    setProgressStage('Initializing analysis...');

    try {
      console.log('Submitting form with values:', values);
      setProgress(20);
      setProgressStage('Fetching token information...');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      setProgress(60);
      setProgressStage('Processing token holders...');

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze token holders');
      }

      setProgress(100);
      setProgressStage('Analysis complete!');
      const { processingTimeSeconds, ...analysisResults } = data;
      setResults(analysisResults);
      setProcessingTime(processingTimeSeconds);

      toast({
        title: 'Analysis Complete',
        description: 'Token holder analysis has been completed successfully.',
      });
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Handle network errors (including timeouts)
      if (error instanceof Error && (
        error.message === 'Failed to fetch' || 
        error.message.includes('network') ||
        error.message.includes('timeout')
      )) {
        toast({
          title: 'Analysis Timeout',
          description: 'Analysis timed out. The token has too many holders to process. Try excluding more top holders or increasing the minimum holdings.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
      setProgress(0);
      setProgressStage('');
    }
  }

  const handleDownload = () => {
    if (!results?.selectedHolders) return;

    const addresses = results.selectedHolders.map((h) => h.address).join('\n');
    const blob = new Blob([addresses], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected_addresses.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Success',
      description: 'Addresses downloaded successfully',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Token Holder Analysis</CardTitle>
          <CardDescription>
            Select random token holders based on your criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Contract Address - Full width */}
              <FormField
                control={form.control}
                name="mintAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Solana token contract address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Grid layout for numeric inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Minimum Holdings */}
                <FormField
                  control={form.control}
                  name="minHoldings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Holdings</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Minimum tokens required
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Exclude Top Holders */}
                <FormField
                  control={form.control}
                  name="excludeTopPercent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exclude Top (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Exclude top % of holders
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Number of Holders */}
                <FormField
                  control={form.control}
                  name="numberOfHolders"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Holders to Select</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Number to randomly select
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {isLoading && (
                <Card>
                  <CardHeader>
                    <CardTitle>Analyzing Token Holders</CardTitle>
                    <CardDescription>
                      {progressStage}
                      {progress < 100 && (
                        <>
                          <span className="block mt-1 text-sm text-muted-foreground">
                            This may take several minutes for tokens with a large number of holders.
                            Please keep this window open.
                          </span>
                          <span className="block mt-1 text-sm">
                            Time elapsed: {formatElapsedTime(elapsedSeconds)}
                          </span>
                        </>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Progress value={progress} className="w-full" />
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Analyzing..." : "Find Holders"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                Found {results.selectedHolders.length} eligible holders
              </CardDescription>
            </div>
            <Button onClick={handleDownload}>Download Addresses</Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Holders
                </p>
                <p className="text-2xl font-bold">
                  {results.totalHolders.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Eligible Holders
                </p>
                <p className="text-2xl font-bold">
                  {results.eligibleHolders.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Selected Holders
                </p>
                <p className="text-2xl font-bold">
                  {results.selectedHolders.length.toLocaleString()}
                </p>
              </div>
              <div className="md:col-span-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Processing Time: {processingTime}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-md border">
              <div className="h-[400px] overflow-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b">
                      <th className="p-2 text-left">Address</th>
                      <th className="p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.selectedHolders.map((holder) => (
                      <tr key={holder.address} className="border-b">
                        <td className="p-2 font-mono text-sm">
                          {holder.address}
                        </td>
                        <td className="p-2 text-right">
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
      )}
    </div>
  );
}
