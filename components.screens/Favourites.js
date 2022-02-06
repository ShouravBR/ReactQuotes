import { SafeAreaView, FlatList } from 'react-native';
import { SingleQuote } from '../components/SingleQuote';
import { styles } from '../App';

export function Favourites(props) {

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={props.userFavourites}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <SingleQuote text={item.text} author={item.author}
            isFavourite={props.quoteInFavourite(props.userFavourites, item)}
            addFavourite={props.addFavourite}
            removeFavourite={props.removeFavourite} />
        )} />
    </SafeAreaView>
  );
}
