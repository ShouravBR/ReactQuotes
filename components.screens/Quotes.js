import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SingleQuote } from '../components/SingleQuote';
import { styles } from '../App';

export function Quotes(props) {
  // console.log(props);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getQuotes = async () => {
    try {

      const url = "https://type.fit/api/quotes";

      const response = await fetch(url);
      const json = await response.json();
      // setData(json.slice(0, 10));
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuotes();
  }, []);

  const [focusCount, setFocusCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setFocusCount(focusCount + 1);
      // console.log(focusCount, props.userFavourites)
    }, [props.userFavourites])
  );


  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? <ActivityIndicator /> : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => (data.length * focusCount + index)}
          // extraData={focusCount}
          renderItem={({ item }) => (
            <SingleQuote text={item.text}
              author={item.author}
              isFavourite={props.quoteInFavourite(props.userFavourites, item)}
              addFavourite={props.addFavourite}
              removeFavourite={props.removeFavourite} />
          )} />
      )}
    </SafeAreaView>
  );
}
