import { Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
var Sentiment = require('sentiment');

var sentiment = new Sentiment();
export const SentimentText = (props) => {
  const senti = sentiment.analyze(props.text);
  const idx = senti.score > 1 ? 0 : senti.score >= -1 ? 1 : 2;
  const sentiIcon = ['smileo', 'meh', 'frowno'];
  const sentiText = ['Happy', 'Neutral', 'Sad'];

  return (
    <Text>
      <AntDesign name={sentiIcon[idx]}></AntDesign> {sentiText[idx]}
    </Text>
  );
};
