"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"

interface MultiSelectFilterProps {
  label: string
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function MultiSelectFilter({ label, options, selected, onChange }: MultiSelectFilterProps) {
  const handleSelectAll = () => {
    if (selected.length === options.length) {
      onChange([])
    } else {
      onChange(options)
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between bg-transparent">
            {selected.length > 0 ? `${selected.length} selected` : "All"}
            <span className="ml-2 text-muted-foreground">▼</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 max-h-64 overflow-auto">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 border-b pb-2">
              <Checkbox
                id={`${label}-select-all`}
                /*  shadcn/ui Checkbox accepts `checked` as:  
                    boolean | "indeterminate".  
                    We pass the correct value to avoid writing an invalid
                    `indeterminate` attribute to the DOM. */
                checked={selected.length === options.length ? true : selected.length === 0 ? false : "indeterminate"}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor={`${label}-select-all`} className="text-sm font-medium">
                Select All
              </Label>
            </div>
            {options.map((option) => {
              const checked = selected.includes(option)
              return (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${label}-${option}`}
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      const newSelected = isChecked ? [...selected, option] : selected.filter((item) => item !== option)
                      onChange(newSelected)
                    }}
                  />
                  <Label htmlFor={`${label}-${option}`} className="text-sm font-normal">
                    {option}
                  </Label>
                </div>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
