import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"


type Direction = "top" | "right" | "bottom" | "left"

function TooltipProvider({
    delayDuration = 0,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
    return (
        <TooltipPrimitive.Provider
            data-slot="tooltip-provider"
            delayDuration={delayDuration}
            {...props}
        />
    )
}

function Tooltip({
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
    return (
        <TooltipProvider>
            <TooltipPrimitive.Root data-slot="tooltip" {...props} disableHoverableContent />
        </TooltipProvider>
    )
}

function TooltipTrigger({
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
    return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
    className,
    sideOffset = 0,
    showArrow = true,
    direction = "top",
    children,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
    showArrow?: boolean
    direction?: Direction
}) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                data-slot="tooltip-content"
                side={direction}
                sideOffset={sideOffset}
                className={`z-50 w-fit rounded-lg border border-border-subtle bg-surface-elevated px-3 py-1.5 text-sm font-medium text-text-primary shadow-lg shadow-black/30 ${className ?? ''}`}
                {...props}
            >
                {children}

                {showArrow && (
                    <TooltipPrimitive.Arrow
                        style={{
                            fill: "#111827",
                            stroke: "rgba(0, 198, 255, 0.15)",
                            strokeWidth: 1,
                        }}
                        className={`size-2.5 ${direction === "left" ? "-top-0.5" : "top-1.5 -translate-y-1.5"}`}
                    />
                )}
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
