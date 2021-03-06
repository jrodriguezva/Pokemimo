import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Dialog, FAB, Paragraph, Portal, Text, useTheme } from 'react-native-paper';
import { globalStyle } from '../theme/styles';
import PokemonItem from '../components/PokemonItem';
import { usePokemonDatabase } from '../hooks/usePokemonDatabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MyPokemonScreen = () => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const { colors } = useTheme();
  const [visible, setVisible] = React.useState(false);
  const [idRemove, setIdRemove] = React.useState<number>();
  const hideDialog = () => setVisible(false);
  const { loading, pokemonList, deletePokemon, loadPokemon } = usePokemonDatabase();

  useEffect(() => {
    loadPokemon();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Warning!!!</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Do you want delete this pokemon?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button color={colors.text} onPress={hideDialog}>
              Cancel
            </Button>
            <Button
              onPress={() => {
                idRemove && deletePokemon(idRemove);
                hideDialog();
              }}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Image source={require('../assets/pokeball.png')} style={globalStyle.pokeballBG} />
      <FlatList
        style={{ marginHorizontal: 10 }}
        data={pokemonList}
        showsVerticalScrollIndicator={false}
        keyExtractor={pokemon => pokemon.id}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        numColumns={2}
        ListEmptyComponent={
          <Text style={{ alignSelf: 'center', marginHorizontal: 20 }}>
            No data available yet. {'\n'}
            You can create new pokemon by pressing float action button.
          </Text>
        }
        renderItem={({ item }) => (
          <PokemonItem
            pokemon={item}
            event={() => {
              setVisible(true);
              setIdRemove(item.idDatabase);
            }}
          />
        )}
        ListHeaderComponent={
          <Text
            style={{
              ...globalStyle.title,
              marginStart: 20,
              top: top + 20,
              marginBottom: top + 20,
              paddingBottom: 10,
            }}>
            Pokedex
          </Text>
        }
        ListFooterComponent={loading ? <ActivityIndicator style={{ height: 100 }} size={20} color={'red'} /> : <></>}
      />
      <View style={styles.reminderView}>
        <FAB
          small
          icon="plus"
          onPress={() => navigation.navigate('CreatePokemonScreen')}
          theme={{
            colors: {
              accent: colors.primary,
            },
          }}
          style={{ ...styles.fabStyle }}
        />
      </View>
    </View>
  );
};
export default MyPokemonScreen;

const styles = StyleSheet.create({
  reminderView: {
    flex: 1,
    right: 0,
    margin: 10,
    bottom: 0,
    position: 'absolute',
  },
  fabStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
});
