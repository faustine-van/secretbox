"use client";

import React from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalTitle, 
  ModalDescription, 
  ModalFooter 
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  isConfirming: boolean;
}

export function ConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = 'Confirm',
  isConfirming
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center space-x-3 dark:text-white">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <ModalTitle>{title}</ModalTitle>
          </div>
        </ModalHeader>
        <ModalDescription className="mt-2">
          {description}
        </ModalDescription>
        <ModalFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isConfirming}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? 'Deleting...' : confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
