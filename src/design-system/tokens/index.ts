import base from '../../../design/tokens.json';
export const colors = {
  ...base.colors,
  inverseMuted: '#BCC5CB',
  inverseLine: '#455054',
} as const;
export const space = {
  xs: base.spacing[0]!,
  sm: base.spacing[1]!,
  md: base.spacing[2]!,
  lg: base.spacing[3]!,
  page: base.spacing[4]!,
  xl: base.spacing[5]!,
  xxl: base.spacing[6]!,
};
export const radii = { ...base.radii, button: 17 };
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};
export const type = {
  display: { fontSize: 42, lineHeight: 48, fontFamily: fonts.bold },
  title: { fontSize: 34, lineHeight: 42, fontFamily: fonts.bold },
  section: { fontSize: 24, lineHeight: 32, fontFamily: fonts.bold },
  body: { fontSize: 16, lineHeight: 24, fontFamily: fonts.regular },
  label: { fontSize: 14, lineHeight: 20, fontFamily: fonts.semibold },
  caption: { fontSize: 12, lineHeight: 18, fontFamily: fonts.regular },
  metric: { fontSize: 52, lineHeight: 62, fontFamily: fonts.bold },
};
