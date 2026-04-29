'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Vapi from '@vapi-ai/web'

type CallStatus = 'idle' | 'connecting' | 'active' | 'ending' | 'error'

export function useVapi() {
  const vapiRef = useRef<Vapi | null>(null)
  const [status, setStatus] = useState<CallStatus>('idle')
  const [volume, setVolume] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY!)
    vapiRef.current = vapi

    vapi.on('call-start', () => {
      setStatus('active')
      setErrorMsg(null)
    })

    vapi.on('call-end', () => {
      setStatus('idle')
      setVolume(0)
      setIsSpeaking(false)
    })

    vapi.on('speech-start', () => setIsSpeaking(true))
    vapi.on('speech-end', () => setIsSpeaking(false))
    vapi.on('volume-level', (vol: number) => setVolume(vol))

    vapi.on('call-start-progress', (e) => {
      console.log('[Vapi] progress:', e.stage, e.status)
    })

    vapi.on('call-start-failed', (e) => {
      console.error('[Vapi] call-start-failed:', e)
      setStatus('error')
      setErrorMsg(e.error ?? `Failed at stage: ${e.stage}`)
      setTimeout(() => { setStatus('idle'); setErrorMsg(null) }, 4000)
    })

    vapi.on('error', (e) => {
      console.error('[Vapi] error:', e)
      setStatus('error')
      const msg = typeof e === 'string' ? e : e?.message ?? e?.error ?? 'Unknown error'
      setErrorMsg(msg)
      setTimeout(() => { setStatus('idle'); setErrorMsg(null) }, 4000)
    })

    return () => { vapi.stop() }
  }, [])

  const start = useCallback(async () => {
    setStatus('connecting')
    setErrorMsg(null)
    try {
      const result = await vapiRef.current?.start(process.env.NEXT_PUBLIC_VAPI_AGENT_ID!)
      if (!result) {
        setStatus('error')
        setErrorMsg('Call returned null — check assistant ID and API key')
        setTimeout(() => { setStatus('idle'); setErrorMsg(null) }, 4000)
      }
    } catch (e: any) {
      console.error('[Vapi] start threw:', e)
      setStatus('error')
      setErrorMsg(e?.message ?? 'Failed to start call')
      setTimeout(() => { setStatus('idle'); setErrorMsg(null) }, 4000)
    }
  }, [])

  const stop = useCallback(() => {
    setStatus('ending')
    vapiRef.current?.stop()
  }, [])

  const toggle = useCallback(() => {
    if (status === 'idle' || status === 'error') start()
    else if (status === 'active') stop()
  }, [status, start, stop])

  return { status, volume, isSpeaking, errorMsg, toggle }
}
