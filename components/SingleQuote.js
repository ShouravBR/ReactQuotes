import { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { SentimentText } from './sentiment';
import { styles } from '../App';

// import { Sentiment } from 'sentiment';
export const SingleQuote = (props) => {
  // console.log(props);
  const [isFavourite, setFavourite] = useState(props.isFavourite);

  function addFavourite() {
    setFavourite(true);
    props.addFavourite(props.text, props.author);
  }
  function removeFavourite() {
    setFavourite(false);
    props.removeFavourite(props.text, props.author);
  }

  return (
    <View style={styles.singlequotecontainer}>
      <View style={styles.singlequote}>
        <Text style={styles.text}>{props.text}</Text>
        <Text>{props.author}</Text>
      </View>
      <View style={{
        flexDirection: 'row',
        padding: 5,
      }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
          <Pressable
            onPress={() => {
              isFavourite ? removeFavourite() : addFavourite();
            }}
          >
            <AntDesign name={isFavourite ? "heart" : "hearto"}></AntDesign>
          </Pressable>

        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
          <SentimentText text="props.text" />
        </View>
      </View>

    </View>
  );
};
