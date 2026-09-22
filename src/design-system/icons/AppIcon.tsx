import { SvgXml } from 'react-native-svg';
import { assets } from './assets';
export type IconName = keyof typeof assets;
export function AppIcon({
  name,
  size = 24,
}: {
  name: IconName;
  size?: number;
}) {
  return (
    <SvgXml xml={assets[name]} width={size} height={size} accessible={false} />
  );
}
