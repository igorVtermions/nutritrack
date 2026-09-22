import { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useDiary } from '@/bootstrap/AppProvider';
import {
  AppText,
  Button,
  Field,
  Header,
  Screen,
  styles,
} from '@/design-system/components';
import { ChoiceGroup } from '@/design-system/components/ChoiceGroup';
import { AppIcon } from '@/design-system/icons/AppIcon';
import { space } from '@/design-system/tokens';
export function CatalogScreen({
  onSelect,
  onCreate,
  onBack,
}: {
  onSelect: (id: string) => void;
  onCreate: () => void;
  onBack?: () => void;
}) {
  const { catalog, state } = useDiary();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All foods' | 'Favorites' | 'My foods'>(
    onBack ? 'All foods' : 'Favorites',
  );
  const foods = catalog.filter(
    (food) =>
      food.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (filter === 'All foods' ||
        (filter === 'Favorites'
          ? state.favoriteIds.includes(food.id)
          : food.id.startsWith('custom:'))),
  );
  return (
    <Screen bottomInset={Boolean(onBack)} scroll={false}>
      <FlatList
        data={foods}
        keyExtractor={(food) => food.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={{ gap: space.xl }}>
            <Header
              title={onBack ? 'Log food' : 'Your foods'}
              onBack={onBack}
            />
            <AppText muted>
              {onBack
                ? 'Find something you enjoyed.'
                : 'The meals you come back to.'}
            </AppText>
            <Field
              label="Search foods or meals"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
            />
            <ChoiceGroup
              label="Show"
              options={['Favorites', 'My foods', 'All foods']}
              value={filter}
              onChange={setFilter}
            />
          </View>
        }
        renderItem={({ item: food }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => onSelect(food.id)}
            style={[styles.card, styles.row]}
          >
            <AppIcon
              name={food.illustration}
              size={food.illustration === 'food' ? 24 : 64}
            />
            <View style={{ flex: 1 }}>
              <AppText variant="label">{food.name}</AppText>
              <AppText variant="caption" muted>
                {food.serving} · {food.nutrition.calories} kcal
              </AppText>
              <AppText variant="caption" muted>
                {food.id.startsWith('custom:') ? 'My food' : 'Example food'}
              </AppText>
            </View>
            <AppIcon name="chevron" />
          </Pressable>
        )}
        ListEmptyComponent={
          <AppText>
            {query.trim()
              ? 'No foods found. Try another name.'
              : filter === 'Favorites'
                ? 'No favorites yet. Open a food and save it to your favorites.'
                : filter === 'My foods'
                  ? 'Make it yours. Create your first food below.'
                  : 'No foods available.'}
          </AppText>
        }
        ListFooterComponent={
          <View style={{ gap: space.lg }}>
            <Button label="Create a food" onPress={onCreate} />
            <AppText variant="caption" muted>
              Example foods use illustrative nutrition. Your own foods use the
              values you enter. Barcode scanning and recipes are not available.
            </AppText>
          </View>
        }
      />
    </Screen>
  );
}
