import { rgba } from 'polished'

import { sidebarTheme as auspiceSidebarTheme } from 'auspice/src/components/main/styles'

const gridBreakpoints = {
  xs: '0',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '2000px',
}

const containerMaxWidths = {
  sm: '540px',
  md: '720px',
  lg: '960px',
  xl: '1140px',
  xxl: '1950px',
}

export const transparent = '#ffffff00'
export const white = '#ffffff'
export const gray100 = '#f8f9fa'
export const gray150 = '#eff1f3'
export const gray200 = '#e9ecef'
export const gray250 = '#e5e8ea'
export const gray300 = '#dee2e6'
export const gray400 = '#ced4da'
export const gray500 = '#adb5bd'
export const gray550 = '#979fa7'
export const gray600 = '#7b838a'
export const gray650 = '#626a71'
export const gray700 = '#495057'
export const gray800 = '#343a40'
export const gray900 = '#212529'
export const black = '#000'

export const blue = '#2196f3'
export const indigo = '#6610f2'
export const purple = '#6f42c1'
export const pink = '#e83e8c'
export const red = '#e51c23'
export const orange = '#fd7e14'
export const yellow = '#ff9800'
export const green = '#4caf50'
export const teal = '#20c997'
export const cyan = '#9c27b0'

export const primary = blue
export const secondary = gray100
export const success = green
export const info = cyan
export const warning = yellow
export const danger = red
export const light = white
export const dark = gray700

export const basicColors = {
  transparent,
  white,
  gray100,
  gray150,
  gray200,
  gray250,
  gray300,
  gray400,
  gray500,
  gray550,
  gray600,
  gray650,
  gray700,
  gray800,
  gray900,
  black,
  blue,
  indigo,
  purple,
  pink,
  red,
  orange,
  yellow,
  green,
  teal,
  cyan,
}

export const themeColors = {
  primary,
  secondary,
  success,
  info,
  warning,
  danger,
  light,
  dark,
}

export const font = {
  sansSerif: `'Lato', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'system-ui', 'system-sans', 'sans-serif'`,
  monospace: `'Roboto Mono', 'system-mono'`,
  default: 'sans-serif',
}

export const shadows = {
  light: `1px 1px 1px 1px ${rgba(gray600, 0.2)}`,
  slight: `1px 1px 1px 1px ${rgba(gray700, 0.25)}`,
  medium: `0px 0px 10px 8px ${rgba(gray900, 0.25)}`,
  filter: {
    slight: `1px 1px 1px ${rgba(gray700, 0.25)}`,
    medium: `2px 2px 3px ${rgba(gray900, 0.33)}`,
  },
}

export const code = {
  pre: {
    background: gray300,
  },
}

export const theme = {
  bodyColor: basicColors.gray700,
  bodyBg: basicColors.white,

  ...auspiceSidebarTheme,
  ...basicColors,
  ...themeColors,
  ...gridBreakpoints,
  code,
  containerMaxWidths,
  font,
  shadows,
}

export type Theme = typeof theme
