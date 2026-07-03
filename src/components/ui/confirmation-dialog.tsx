'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}: ConfirmationDialogProps): JSX.Element | null {
  if (!isOpen) return null

  const handleConfirm = (): void => {
    onConfirm()
    onClose()
  }

  const iconColor = type === 'danger' ? 'text-red-500' : type === 'warning' ? 'text-amber-500' : 'text-blue-500'
  const confirmColor = type === 'danger' ? 'bg-red-500 hover:bg-red-600' : type === 'warning' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-500 hover:bg-blue-600'

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <Card className="relative z-10 w-full max-w-md mx-4 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${iconColor}`}>
                <AlertTriangle className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="text-sm leading-relaxed">
            {description}
          </CardDescription>
          
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-4"
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              className={`px-4 text-white ${confirmColor}`}
            >
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}