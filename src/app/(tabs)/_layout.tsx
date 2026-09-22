import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { useDiary } from '@/bootstrap/AppProvider';
import { AppIcon } from '@/design-system/icons/AppIcon';
import { colors, fonts } from '@/design-system/tokens';
export default function TabLayout() {
  const { state } = useDiary();
  if (!state.onboarded) return <Redirect href="/" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.white },
        tabBarLabelStyle: { fontFamily: fonts.medium },
      }}
    >
      <Tabs.Screen
        name="today"
        options={{ title: 'Today', tabBarIcon: () => <AppIcon name="home" /> }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: () => <AppIcon name="chart" />,
        }}
      />
      <Tabs.Screen
        name="foods"
        options={{ title: 'Foods', tabBarIcon: () => <AppIcon name="food" /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: () => <AppIcon name="settings" />,
        }}
      />
    </Tabs>
  );
}
