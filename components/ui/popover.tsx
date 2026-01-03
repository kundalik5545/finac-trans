"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface PopoverContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  popoverId?: string
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(
  undefined
)

const Popover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(({ className, open: controlledOpen, onOpenChange, children, ...props }, ref) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const popoverIdRef = React.useRef(`popover-${Math.random().toString(36).substr(2, 9)}`)
  const open = controlledOpen ?? internalOpen
  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [controlledOpen, onOpenChange]
  )

  return (
    <PopoverContext.Provider value={{ open, setOpen, popoverId: popoverIdRef.current }}>
      <div
        ref={ref}
        className={cn("relative", className)}
        data-popover={popoverIdRef.current}
        {...props}
      >
        {children}
      </div>
    </PopoverContext.Provider>
  )
})
Popover.displayName = "Popover"

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild, children, onClick, ...props }, ref) => {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error("PopoverTrigger must be used within Popover")
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    context.setOpen(!context.open)
    onClick?.(e)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
      ref,
      "data-popover-trigger": true,
    })
  }

  return (
    <button
      ref={ref}
      type="button"
      className={cn(className)}
      onClick={handleClick}
      data-popover-trigger
      {...props}
    >
      {children}
    </button>
  )
})
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "start" | "center" | "end"
    side?: "top" | "right" | "bottom" | "left"
    sideOffset?: number
  }
>(({ className, align = "start", side = "bottom", sideOffset = 4, ...props }, ref) => {
  const context = React.useContext(PopoverContext)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = React.useState(false)

  // Find trigger element
  React.useEffect(() => {
    if (context?.open && context?.popoverId) {
      const popover = document.querySelector(`[data-popover="${context.popoverId}"]`)
      if (popover) {
        const trigger = popover.querySelector('[data-popover-trigger]')
        if (trigger) {
          triggerRef.current = trigger as HTMLElement
        }
      }
      setMounted(true)
    } else {
      setMounted(false)
    }
  }, [context?.open, context?.popoverId])

  // Position and click outside handler
  React.useEffect(() => {
    if (!context?.open || !mounted) return

    const updatePosition = () => {
      if (!contentRef.current || !triggerRef.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const content = contentRef.current
      
      // For fixed positioning, use viewport coordinates directly
      let top = 0
      let left = 0

      if (side === "bottom") {
        top = triggerRect.bottom + sideOffset
      } else if (side === "top") {
        // Get content height, default to 300 if not yet rendered
        const contentHeight = content.offsetHeight || 300
        top = triggerRect.top - contentHeight - sideOffset
      } else {
        top = triggerRect.top
      }

      if (align === "start") {
        left = triggerRect.left
      } else if (align === "end") {
        const contentWidth = content.offsetWidth || 280
        left = triggerRect.right - contentWidth
      } else if (align === "center") {
        const contentWidth = content.offsetWidth || 280
        left = triggerRect.left + (triggerRect.width / 2) - (contentWidth / 2)
      } else {
        left = triggerRect.left
      }

      // Ensure calendar stays within viewport
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const contentWidth = content.offsetWidth || 280
      const contentHeight = content.offsetHeight || 300

      // Adjust if going off-screen
      if (left + contentWidth > viewportWidth) {
        left = viewportWidth - contentWidth - 10
      }
      if (left < 10) {
        left = 10
      }
      if (top + contentHeight > viewportHeight) {
        top = viewportHeight - contentHeight - 10
      }
      if (top < 10) {
        top = 10
      }

      content.style.top = `${top}px`
      content.style.left = `${left}px`
      content.style.position = "fixed"
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        context.setOpen(false)
      }
    }

    // Initial position
    requestAnimationFrame(() => {
      updatePosition()
      setTimeout(updatePosition, 10)
    })

    // Update on scroll/resize
    window.addEventListener("scroll", updatePosition, true)
    window.addEventListener("resize", updatePosition)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("scroll", updatePosition, true)
      window.removeEventListener("resize", updatePosition)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [context?.open, context?.setOpen, side, align, sideOffset, mounted])

  if (!context) {
    throw new Error("PopoverContent must be used within Popover")
  }

  if (!context.open || !mounted) {
    return null
  }

  const content = (
    <div
      ref={(node) => {
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
        contentRef.current = node
      }}
      className={cn(
        "fixed z-[9999] w-auto rounded-md border bg-popover text-popover-foreground shadow-lg outline-none",
        className
      )}
      style={{
        position: "fixed",
        visibility: "visible",
        opacity: 1,
        pointerEvents: "auto",
      }}
      onClick={(e) => e.stopPropagation()}
      {...props}
    />
  )

  // Use portal to render outside dialog
  if (typeof window !== "undefined") {
    return createPortal(content, document.body)
  }

  return content
})
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
