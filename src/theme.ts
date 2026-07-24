import { CATEGORIES } from './types'

export const NEON = [
  '#00f0ff',
  '#ff2ec4',
  '#39ff14',
  '#b026ff',
  '#ffe600',
  '#ff6b00',
  '#00ff9d',
  '#ff3860',
]

export function neonColor(index: number) {
  return NEON[index % NEON.length]
}

export function categoryColor(category: string) {
  const index = (CATEGORIES as readonly string[]).indexOf(category)
  return neonColor(index === -1 ? NEON.length - 1 : index)
}

export const card = 'rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur'

export const input =
  'w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none transition placeholder:text-neutral-600 focus:border-cyan-400 focus:shadow-[0_0_0_1px_rgba(0,240,255,0.4)]'
