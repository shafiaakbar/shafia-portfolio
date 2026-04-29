'use client'

import { Suspense, lazy, useRef, useCallback } from 'react'
import type { SPEObject, SplineEvent } from '@splinetool/react-spline'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
  onLoad?: (spline: { emitEvent: (type: string, name: string) => void; findObjectByName: (name: string) => SPEObject | undefined }) => void
}

export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <span className="loader" />
        </div>
      }
    >
      <Spline scene={scene} className={className} onLoad={onLoad as any} />
    </Suspense>
  )
}
