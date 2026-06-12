import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

// import { cn } from "@/lib/utils"


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
                className={`bg-white/10 z-50 w-fit rounded-xl px-3 py-1.5 text-sm font-semibold shadow-lg shadow-black/50 backdrop-blur-sm ring-1 ring-white/10 pointer-events-none max-w-72`}
                {...props}
            >
                {children}

                {showArrow && (
                    <TooltipPrimitive.Arrow
                        style={{
                            fill: "#171624",
                            stroke: "rgba(0,0,0)",
                            strokeWidth: 0,
                        }}
                        className={`bg-primary relative -z-1 fill-foreground fill-black text-primary-foreground size-2.5 rotate-0 rounded-xs ${direction === "left" ? "-top-0.5" : "top-1.5 -translate-y-1.5"}`}
                    />
                )}
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
