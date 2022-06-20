import { Grid } from 'antd'

const { useBreakpoint: useAntBreakpoint } = Grid

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const useBreakpoint = (): {
  breakpoints: Breakpoint[]
  isMobile: boolean
} => {
  const screens = useAntBreakpoint()

  const entries = Object.entries(screens)

  if (!entries.length) {
    return {
      breakpoints: ['xs'],
      isMobile: true,
    }
  }

  const bps = entries
    .filter((screen) => screen[1])
    .map((s) => s[0]) as Breakpoint[]

  return {
    breakpoints: bps,
    isMobile: (bps.includes('xs') || bps.includes('sm')) && !bps.includes('md'),
  }
}
