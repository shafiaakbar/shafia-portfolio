"use client"

import { Mic, MicOff, Loader2 } from "lucide-react"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { useElevenLabs } from "@/hooks/use-elevenlabs"

export function TalkButton() {
  const { status, isSpeaking, toggle } = useElevenLabs()
  const isLive = status === "active" || status === "connecting"

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9999,
      }}
      className="md:bottom-12 md:right-14"
    >
      <LiquidButton
        size="lg"
        onClick={toggle}
        disabled={status === "connecting" || status === "ending"}
        className={`font-mono tracking-widest transition-all duration-300 disabled:opacity-60 ${
          isLive
            ? "text-pink-300 shadow-[0_0_28px_rgba(255,0,127,0.5)]"
            : "text-pink-400 shadow-[0_0_18px_rgba(255,0,127,0.25)]"
        }`}
      >
        <span className="flex items-center gap-2">
          {status === "connecting" || status === "ending" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : status === "active" ? (
            <MicOff className="h-3.5 w-3.5" />
          ) : (
            <Mic className="h-3.5 w-3.5" />
          )}
          {status === "active" ? "END_CALL" : status === "connecting" ? "CONNECTING..." : "TALK_TO_ME"}
        </span>
      </LiquidButton>
    </div>
  )
}
