"use client"

import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"

type TooltipPlacement = "top" | "right" | "bottom" | "left"

type TooltipProps = {
  label: string
  children: ReactNode
  placement?: TooltipPlacement
}

const OFFSET = 10
const VIEWPORT_GAP = 8

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function Tooltip({ label, children, placement = "top" }: TooltipProps) {
  const tooltipId = useId()
  const triggerRef = useRef<HTMLSpanElement | null>(null)
  const bubbleRef = useRef<HTMLSpanElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0 })

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current?.firstElementChild
    const bubble = bubbleRef.current
    if (!trigger || !bubble) return

    const triggerRect = trigger.getBoundingClientRect()
    const bubbleRect = bubble.getBoundingClientRect()
    const centerX = triggerRect.left + triggerRect.width / 2
    const centerY = triggerRect.top + triggerRect.height / 2

    let left = centerX - bubbleRect.width / 2
    let top = triggerRect.top - bubbleRect.height - OFFSET

    if (placement === "right") {
      left = triggerRect.right + OFFSET
      top = centerY - bubbleRect.height / 2
    }

    if (placement === "bottom") {
      left = centerX - bubbleRect.width / 2
      top = triggerRect.bottom + OFFSET
    }

    if (placement === "left") {
      left = triggerRect.left - bubbleRect.width - OFFSET
      top = centerY - bubbleRect.height / 2
    }

    const nextPosition = {
      left: clamp(left, VIEWPORT_GAP, window.innerWidth - bubbleRect.width - VIEWPORT_GAP),
      top: clamp(top, VIEWPORT_GAP, window.innerHeight - bubbleRect.height - VIEWPORT_GAP),
    }

    setPosition((currentPosition) => {
      if (
        currentPosition.left === nextPosition.left &&
        currentPosition.top === nextPosition.top
      ) {
        return currentPosition
      }

      return nextPosition
    })
  }, [placement])

  const schedulePositionUpdate = useCallback(() => {
    if (animationFrameRef.current !== null) return

    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = null
      updatePosition()
    })
  }, [updatePosition])

  useEffect(() => {
    if (!visible) return

    schedulePositionUpdate()
    window.addEventListener("resize", schedulePositionUpdate)
    window.addEventListener("scroll", schedulePositionUpdate, true)

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      window.removeEventListener("resize", schedulePositionUpdate)
      window.removeEventListener("scroll", schedulePositionUpdate, true)
    }
  }, [schedulePositionUpdate, visible])

  const show = useCallback(() => setVisible(true), [])
  const hide = useCallback(() => setVisible(false), [])

  return (
    <>
      <span
        ref={triggerRef}
        className="tooltip-trigger"
        aria-describedby={visible ? tooltipId : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onKeyDown={(event) => {
          if (event.key === "Escape") hide()
        }}
      >
        {children}
      </span>
      {visible && (
        <span
          ref={bubbleRef}
          id={tooltipId}
          role="tooltip"
          className="tooltip-bubble"
          data-placement={placement}
          style={{
            left: position.left,
            top: position.top,
          }}
        >
          {label}
        </span>
      )}
    </>
  )
}
