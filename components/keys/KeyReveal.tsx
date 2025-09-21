'use client';

import { useKeyReveal } from '@/hooks/useKeyReveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRevealSchema } from '@/lib/validations';
import { z } from 'zod';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from '@/components/ui/modal';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Shield, 
  Clock, 
  AlertTriangle,
  Loader2,
  Key,
  Lock,
  Timer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KeyRevealProps {
  keyId: string;
  onClose: () => void;
}

export function KeyReveal({ keyId, onClose }: KeyRevealProps) {
  const { revealedValue, loading, error, revealKey } = useKeyReveal(keyId);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof KeyRevealSchema>>({
    resolver: zodResolver(KeyRevealSchema),
    defaultValues: {
      masterPassword: '',
    },
  });

  // Auto-hide timer for revealed value
  useEffect(() => {
    if (revealedValue && timeRemaining === 0) {
      setTimeRemaining(30); // 30 seconds countdown
    }
  }, [revealedValue]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsVisible(false);
            toast({
              title: 'Key hidden',
              description: 'The key value has been automatically hidden for security.',
              duration: 3000
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, toast]);

  const handleReveal = async (values: z.infer<typeof KeyRevealSchema>) => {
    await revealKey(values.masterPassword);
    setIsVisible(true);
  };

  const handleCopy = async () => {
    if (!revealedValue) return;
    
    try {
      await navigator.clipboard.writeText(revealedValue);
      setCopied(true);
      toast({
        title: 'Copied to clipboard',
        description: 'The key value has been copied to your clipboard.',
        duration: 3000
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy to clipboard. Please select and copy manually.',
        variant: 'destructive',
        duration: 3000
      });
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Modal open onOpenChange={onClose}>
          <ModalContent
            className="
              max-w-2xl 
              bg-white/95 dark:bg-slate-900/95 
              backdrop-blur-sm 
              overflow-y-auto 
              max-h-[90vh] 
              shadow-lg 
              rounded-xl
            "
    >
        <ModalHeader>
          <ModalTitle className="flex items-center text-xl text-blue-600 dark:text-blue-400">
            <Key className="w-6 h-6 mr-2 " />
            Reveal Secret Key
          </ModalTitle>
          <ModalDescription>
            Enter your master password to securely reveal the key value. The value will be automatically hidden after 30 seconds for security.
          </ModalDescription>
        </ModalHeader>

        <div className="space-y-6 p-6">
          {/* Security Notice */}
          <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>Security Notice:</strong> Make sure you're in a secure environment before revealing sensitive information.
            </AlertDescription>
          </Alert>

          {revealedValue && isVisible ? (
            /* Revealed Key Display */
            <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg text-green-800 dark:text-green-300">
                    <Eye className="w-5 h-5 mr-2" />
                    Key Value Revealed
                  </CardTitle>
                  
                  {/* Countdown Timer */}
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <Timer className="w-3 h-3 mr-1" />
                      {formatTime(timeRemaining)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Key Value Display */}
                <div className="relative">
                  <div className="bg-slate-900 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <code className="text-green-400 dark:text-green-300 font-mono text-sm break-all select-all">
                        {revealedValue}
                      </code>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="ml-2 shrink-0 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                    Click the copy button or select the text to copy to clipboard
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    onClick={handleCopy}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    disabled={copied}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsVisible(false);
                      setTimeRemaining(0);
                    }}
                    className="flex-1"
                  >
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide Key
                  </Button>
                </div>

                {/* Auto-hide warning */}
                {timeRemaining <= 10 && (
                  <Alert className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                    <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <AlertDescription className="text-orange-800 dark:text-orange-200">
                      Key will be automatically hidden in {timeRemaining} seconds
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Password Input Form */
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg text-blue-800 dark:text-blue-300">
                  <Lock className="w-5 h-5 mr-2" />
                  Authentication Required
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleReveal)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="masterPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Master Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your master password"
                                className="pr-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {error && (
                      <Alert variant="destructive" className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Revealing...
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Reveal Key
                          </>
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Security Tips */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-slate-600 dark:text-slate-400" />
              Security Tips
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
              <li>Only reveal keys in secure, private environments</li>
              <li>Clear your clipboard after copying sensitive values</li>
              <li>Keys are automatically hidden after 30 seconds</li>
              <li>Never share revealed keys through insecure channels</li>
            </ul>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}