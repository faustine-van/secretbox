
'use client';

import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface NoCollectionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NoCollectionsModal({ open, onOpenChange }: NoCollectionsModalProps) {
  const router = useRouter();

  const handleGoToCollections = () => {
    router.push('/dashboard/collections');
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>No Collections Found</ModalTitle>
          <ModalDescription>
            You need to create a collection before you can add a key.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button onClick={handleGoToCollections}>Create Collection</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
