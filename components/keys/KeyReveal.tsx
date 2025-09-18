
'use client';

import { useKeyReveal } from '@/hooks/useKeyReveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRevealSchema } from '@/lib/validations';
import { z } from 'zod';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, ModalClose } from '@/components/ui/modal';

interface KeyRevealProps {
  keyId: string;
  onClose: () => void;
}

export function KeyReveal({ keyId, onClose }: KeyRevealProps) {
  const { revealedValue, loading, error, revealKey } = useKeyReveal(keyId);
  const form = useForm<z.infer<typeof KeyRevealSchema>>({
    resolver: zodResolver(KeyRevealSchema),
    defaultValues: {
      masterPassword: '',
    },
  });

  const handleReveal = async (values: z.infer<typeof KeyRevealSchema>) => {
    await revealKey(values.masterPassword);
  };

  return (
    <Modal open onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Reveal Key</ModalTitle>
          <ModalDescription>
            Enter your master password to reveal the key value. The value will be hidden again after 30 seconds.
          </ModalDescription>
        </ModalHeader>
        {revealedValue ? (
          <div>
            <p className="text-lg font-mono bg-muted p-4 rounded-md">{revealedValue}</p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(handleReveal)} className="space-y-4">
            <Input
              type="password"
              placeholder="Master Password"
              {...form.register('masterPassword')}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? 'Revealing...' : 'Reveal'}
            </Button>
          </form>
        )}
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Close</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
