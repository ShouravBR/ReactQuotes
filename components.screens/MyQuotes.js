import { SafeAreaView, FlatList, Text, View, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SentimentText } from '../components/sentiment';
import { styles } from '../App';

export function MyQuotes(props) {
  const navigation = useNavigation();
  console.log('myquotes-screen:', props);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={props.userQuotes}
        keyExtractor={(item, index) => (index)}
        renderItem={({ item }) => (
          <View style={styles.singlequotecontainer}>
            <View style={styles.singlequote}>
              <Text style={styles.text}>{item.text}</Text>
              <Text>{item.author}</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              padding: 5,
            }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                <Pressable onPress={() => { props.deleteQuote(item); }}
                >
                  <AntDesign name={"delete"}></AntDesign>
                </Pressable>

              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                <SentimentText text="item.text" />
              </View>
            </View>
          </View>
        )} />
      <View style={styles.container}>
        <Pressable style={styles.AddQuoteContainer}
          onPress={() => { navigation.navigate('Add Quote'); }}
        >
          <AntDesign name={"plus"} style={styles.AddQuoteIcon}></AntDesign>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
