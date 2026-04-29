'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Vapi from '@vapi-ai/web'

type CallStatus = 'idle' | 'connecting' | 'active' | 'ending'

export function useVapi() {
  const vapiRef = useRef<Vapi | null>(null)
  const [status, setStatus] = useState<CallStatus>('idle')
  const [volume, setVolume] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY!)
    vapiRef.current = vapi

    vapi.on('call-start', () => setStatus('active'))
    vapi.on('call-end', () => {
      setStatus('idle')
      setVolume(0)
      setIsSpeaking(false)
    })
    vapi.on('speech-start', () => setIsSpeaking(true))
    vapi.on('speech-end', () => setIsSpeaking(false))
    vapi.on('volume-level', (vol: number) => setVolume(vol))
    vapi.on('error', () => setStatus('idle'))

    return () => {
      vapi.stop()
    }
  }, [])

  const start = useCallback(async () => {
    setStatus('connecting')
    try {
      await vapiRef.current?.start(process.env.NEXT_PUBLIC_VAPI_AGENT_ID!)
    } catch {
      setStatus('idle')
    }
  }, [])

  const stop = useCallback(() => {
    setStatus('ending')
    vapiRef.current?.stop()
  }, [])

  const toggle = useCallback(() => {
    if (status === 'idle') start()
    else if (status === 'active') stop()
  }, [status, start, stop])

  return { status, volume, isSpeaking, toggle }
}
