'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface GenericAddModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  helpText?: string
  children: React.ReactNode
}

interface GenericEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  entityName?: string
  helpText?: string
  children: React.ReactNode
}

interface GenericViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle?: string
  children: React.ReactNode
}

interface GenericDeleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: string
  itemName: string
  onConfirm: () => void
  isLoading?: boolean
}

// Generic Add Modal
export function GenericAddModal({
  open,
  onOpenChange,
  title,
  description,
  helpText,
  children,
}: GenericAddModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-2 border-border bg-card">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {description} <span className="text-destructive font-semibold">*</span>
          </DialogDescription>
        </DialogHeader>

        {helpText && (
          <div className="bg-secondary/30 rounded-lg p-4 mb-4">
            <p className="text-sm text-muted-foreground">{helpText}</p>
          </div>
        )}

        {children}
      </DialogContent>
    </Dialog>
  )
}

// Generic Edit Modal
export function GenericEditModal({
  open,
  onOpenChange,
  title,
  description,
  entityName,
  helpText,
  children,
}: GenericEditModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-2 border-border bg-card">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {description}
            {entityName && (
              <span className="font-semibold text-foreground"> {entityName}</span>
            )}
            . All fields marked with <span className="text-destructive font-semibold">*</span> are required.
          </DialogDescription>
        </DialogHeader>

        {helpText && (
          <div className="bg-secondary/30 rounded-lg p-4 mb-4">
            <p className="text-sm text-muted-foreground">{helpText}</p>
          </div>
        )}

        {children}
      </DialogContent>
    </Dialog>
  )
}

// Generic View Modal
export function GenericViewModal({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
}: GenericViewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-2 border-border bg-card">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {title}
          </DialogTitle>
          {subtitle && (
            <DialogDescription className="text-base text-muted-foreground">
              {subtitle}
            </DialogDescription>
          )}
        </DialogHeader>

        {children}

        <div className="flex gap-3 border-t border-border pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Generic Delete Confirmation Modal
export function GenericDeleteModal({
  open,
  onOpenChange,
  title,
  message,
  itemName,
  onConfirm,
  isLoading = false,
}: GenericDeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-2 border-destructive/30 bg-card">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex size-14 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
              <AlertTriangle className="size-7 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-foreground">
                {title}
              </DialogTitle>
              <DialogDescription className="mt-3 text-base text-muted-foreground">
                {message}{' '}
                <span className="font-bold text-foreground">
                  {itemName}
                </span>
                ? This action cannot be undone and will remove all associated data.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-3 my-4">
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">
            Warning: This will permanently delete the item and cannot be reversed.
          </p>
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Deleting...' : 'Yes, Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
