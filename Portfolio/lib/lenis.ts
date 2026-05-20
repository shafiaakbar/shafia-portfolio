import type Lenis from "lenis"

let instance: Lenis | null = null

export function getLenis(): Lenis | null {
  return instance
}

export function setLenis(lenis: Lenis | null): void {
  instance = lenis
}
