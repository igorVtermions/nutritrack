import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useDiary } from '@/bootstrap/AppProvider';
import {
  AppText,
  Field,
  Header,
  Screen,
  styles,
} from '@/design-system/components';
import { AppIcon } from '@/design-system/icons/AppIcon';
export function CatalogScreen({
  onSelect,
  onBack,
}: {
  onSelect: (id: string) => void;
  onBack?: () => void;
}) {
  const { catalog } = useDiary();
  const [query, setQuery] = useState('');
  const foods = catalog.filter((food) =>
    food.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <Screen bottomInset={Boolean(onBack)}>
      <Header title={onBack ? 'Log food' : 'Your foods'} onBack={onBack} />
      <AppText muted>Find something you enjoyed.</AppText>
      <Field
        label="Search foods or meals"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
      />
      <AppText variant="caption" muted>
        Example catalog · illustrative nutrition values
      </AppText>
      {foods.map((food) => (
        <Pressable
          accessibilityRole="button"
          key={food.id}
          onPress={() => onSelect(food.id)}
          style={[styles.card, styles.row]}
        >
          <AppIcon name={food.illustration} size={64} />
          <View style={{ flex: 1 }}>
            <AppText variant="label">{food.name}</AppText>
            <AppText variant="caption" muted>
              {food.serving} · {food.nutrition.calories} kcal
            </AppText>
          </View>
          <AppIcon name="chevron" />
        </Pressable>
      ))}
      {!foods.length && <AppText>No foods found. Try another name.</AppText>}
      <AppText variant="caption" muted>
        Barcode scanning, recipes and custom foods are not available in this
        first prototype.
      </AppText>
    </Screen>
  );
}
