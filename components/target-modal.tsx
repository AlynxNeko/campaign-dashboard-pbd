"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Save } from "lucide-react"
import type { TargetData } from "@/lib/types"

interface TargetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (targets: TargetData) => void
  currentTargets: TargetData
}

export function TargetModal({ open, onOpenChange, onSave, currentTargets }: TargetModalProps) {
  const [targets, setTargets] = useState<TargetData>(currentTargets)

  const handleSave = () => {
    onSave(targets)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
              Set Campaign Targets
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>WA Masuk Target</Label>
              <Input
                type="number"
                value={targets.wamasuk}
                onChange={(e) => setTargets({ ...targets, wamasuk: Number(e.target.value) })}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Reservasi Target</Label>
              <Input
                type="number"
                value={targets.reservasi}
                onChange={(e) => setTargets({ ...targets, reservasi: Number(e.target.value) })}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Check-in Target</Label>
              <Input
                type="number"
                value={targets.checkin}
                onChange={(e) => setTargets({ ...targets, checkin: Number(e.target.value) })}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Content Production Target</Label>
              <Input
                type="number"
                value={targets.content}
                onChange={(e) => setTargets({ ...targets, content: Number(e.target.value) })}
                className="text-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            Save Targets
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
