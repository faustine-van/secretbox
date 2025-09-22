import * as React from "react"
import { Button } from "@/components/ui/button"
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal"
import { AlertTriangle, Loader2 } from "lucide-react"

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: React.ReactNode
  isConfirming?: boolean
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isConfirming = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = 'default'
}: ConfirmationDialogProps) {
  const descriptionId = React.useId();

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent aria-describedby={descriptionId} className="max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <ModalHeader>
          <ModalTitle className="flex items-center">
            {variant === 'destructive' && (
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
            )}
            {title}
          </ModalTitle>
          <ModalDescription id={descriptionId}>
            {description}
          </ModalDescription>
        </ModalHeader>
        
        <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 pt-0">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isConfirming}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isConfirming}
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            className="w-full sm:w-auto"
          >
            {isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  )
}