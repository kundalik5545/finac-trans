"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PopoverContextValue {
    open: boolean
    setOpen: (open: boolean) => void
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
        <PopoverContext.Provider value={{ open, setOpen }}>
            <div
                ref={ref}
                className={cn("relative", className)}
                data-popover
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

    React.useEffect(() => {
        if (context?.open && contentRef.current) {
            // Find the trigger element
            const popover = contentRef.current.closest('[data-popover]')
            if (popover) {
                const trigger = popover.querySelector('[data-popover-trigger]')
                if (trigger) {
                    triggerRef.current = trigger as HTMLElement
                }
            }
        }
    }, [context?.open])

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                context?.open &&
                contentRef.current &&
                !contentRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                context.setOpen(false)
            }
        }

        if (context?.open) {
            document.addEventListener("mousedown", handleClickOutside)
            return () => {
                document.removeEventListener("mousedown", handleClickOutside)
            }
        }
    }, [context?.open, context?.setOpen])

    if (!context) {
        throw new Error("PopoverContent must be used within Popover")
    }

    if (!context.open) {
        return null
    }

    return (
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
                "absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95",
                side === "bottom" && "top-full mt-2",
                side === "top" && "bottom-full mb-2",
                align === "start" && "left-0",
                align === "end" && "right-0",
                align === "center" && "left-1/2 -translate-x-1/2",
                className
            )}
            onClick={(e) => e.stopPropagation()}
            {...props}
        />
    )
})
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }

