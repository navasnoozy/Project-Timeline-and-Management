"use client";

import { Dialog, Text, Flex, Portal } from "@chakra-ui/react";
import { AppButton } from "@/components/AppButton";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmColorPalette?: string;
}

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColorPalette = "red",
}: ConfirmationDialogProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop zIndex="overlay" />
        <Dialog.Positioner justifyContent="center" alignItems="center" zIndex="modal">
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>{message}</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Flex gap={2} justify="flex-end">
                <AppButton variant="ghost" onClick={onClose}>
                  {cancelText}
                </AppButton>
                <AppButton colorPalette={confirmColorPalette} onClick={onConfirm}>
                  {confirmText}
                </AppButton>
              </Flex>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
