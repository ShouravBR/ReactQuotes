import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TextInput, SafeAreaView, FlatList, Text, View, ActivityIndicator, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Sentiment } from 'sentiment';


var Sentiment = require('sentiment');
var sentiment = new Sentiment();

const SentimentText = (props) => {
  const senti = sentiment.analyze(props.text);
  const idx = senti.score > 1 ? 0 : senti.score >= -1 ? 1 : 2
  const sentiIcon = ['smileo', 'meh', 'frowno']
  const sentiText = ['Happy', 'Neutral', 'Sad']

  return (
    <Text>
      <AntDesign name={sentiIcon[idx]}></AntDesign> {sentiText[idx]}
      </Text>
  )
}

const SingleQuote = (props) => {
  // console.log(props);
  const [isFavourite, setFavourite] = useState(props.isFavourite)

  function addFavourite() {
    setFavourite(true)
    props.addFavourite(props.text, props.author)
  }
  function removeFavourite() {
    setFavourite(false)
    props.removeFavourite(props.text, props.author)
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
              isFavourite ? removeFavourite() : addFavourite()
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
  )
}

function Quotes(props) {
  // console.log(props);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getQuotes = async () => {
    try {

      const url = "https://type.fit/api/quotes"

      const response = await fetch(url);
      const json = await response.json();
      // setData(json.slice(0, 10));
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getQuotes();
  }, []);

  const [focusCount, setFocusCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setFocusCount(focusCount + 1)
      // console.log(focusCount, props.userFavourites)
    }, [props.userFavourites])
  )


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
              removeFavourite={props.removeFavourite}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function Favourites(props) {

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={props.userFavourites}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <SingleQuote text={item.text} author={item.author}
            isFavourite={props.quoteInFavourite(props.userFavourites, item)}
            addFavourite={props.addFavourite}
            removeFavourite={props.removeFavourite}
          />
        )}
      />
    </SafeAreaView>
  );
}

const Stack = createNativeStackNavigator();

function MyQuotes(props) {
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
                <Pressable onPress={() => { props.deleteQuote(item) }}
                >
                  <AntDesign name={"delete"}></AntDesign>
                </Pressable>

              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                <Text>Sentiment</Text>
              </View>
            </View>
          </View>
        )}
      />
      <View style={styles.container}>
        <Pressable style={styles.AddQuoteContainer}
          onPress={() => { navigation.navigate('Add Quote') }}
        >
          <AntDesign name={"plus"} style={styles.AddQuoteIcon}></AntDesign>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function AddQuote(props) {
  const navigation = useNavigation();
  // console.log(props)

  const [quoteText, setQuoteText] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("Me");


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput style={styles.inputQuote}
          multiline={true}
          numberOfLines={5}
          onChangeText={newText => setQuoteText(newText)}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput style={styles.inputName}
          onChangeText={newText => setQuoteAuthor(newText)}
          value="Me"
        />
      </View>
      <View style={styles.container}>
        <Pressable style={styles.submitQuoteButton}
          onPress={() => {
            props.submitQuote(quoteText, quoteAuthor)
            navigation.navigate('My Quotes')
          }}>
          <AntDesign name={"addfile"} style={styles.AddQuoteIcon}>
            <Text>Add quote</Text>
          </AntDesign>

        </Pressable>
      </View>
    </SafeAreaView>
  )
}
function MyQuotesStack(props) {
  // console.log(props);
  return (
    <Stack.Navigator>
      <Stack.Screen name="My Quotes" children={() =>
        <MyQuotes
          userQuotes={props.userQuotes}
          deleteQuote={props.deleteQuote}
        />}
      />
      <Stack.Screen name="Add Quote" children={() =>
        <AddQuote
          submitQuote={props.submitQuote}
        />}
      />
    </Stack.Navigator>


  );
}

const Tab = createBottomTabNavigator();

function MyTabs(props) {
  // console.log(props)
  return (
    <Tab.Navigator>
      <Tab.Screen name="Quotes"
        children={() => <Quotes {...props} />}
        options={{
          tabBarLabel: 'Quotes',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="book" color={color} size={size} />
          ),
        }} />
      <Tab.Screen name="Favourites"
        children={() => <Favourites {...props} />}
        options={{
          tabBarLabel: 'Favourites',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="heart" color={color} size={size} />
          ),
        }} />
      <Tab.Screen name="My Quotes Stack"
        children={() => <MyQuotesStack
          userQuotes={props.userQuotes}
          submitQuote={props.submitQuote}
          deleteQuote={props.deleteQuote}
        />}
        options={{
          headerShown: false,
          tabBarLabel: 'My Quotes',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="form" color={color} size={size} />
          ),
        }} />
    </Tab.Navigator>
  );
}

function App() {
  const [isFavouritesLoading, setFavouritesLoading] = useState(true);
  const [userFavourites, setUserFavourites] = useState([]);

  const getUserFavourites = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('Favourites')
      // console.log(jsonValue)
      const json = jsonValue != null ? JSON.parse(jsonValue) : [];
      setUserFavourites(json);

    } catch (error) {
      console.error(error);
    } finally {
      setFavouritesLoading(false);
    }
  }

  function quoteInFavourite(userFavs, item) {

    const y = userFavs.find(e => JSON.stringify(e) == JSON.stringify(item)) != undefined

    // console.log(y)

    return y
  }

  const storeFavourites = async () => {
    try {
      const jsonValue = JSON.stringify(userFavourites)
      await AsyncStorage.setItem('Favourites', jsonValue)
      // console.log(jsonValue)
    } catch (e) {
      console.error('error updating favourites')
    } finally {
      console.log('favourites updated', userFavourites)
    }
  }

  function addFavourite(text, author) {
    // console.log('callback reached')
    const newUserFavs = userFavourites
    // console.log(newUserFavs)

    newUserFavs.push({
      'text': text,
      'author': author
    })
    // console.log(newUserFavs)
    setUserFavourites([...newUserFavs])

    storeFavourites()
  }

  function removeFavourite(text, author) {
    // console.log('callback reached')
    const newUserFavs = userFavourites
    // console.log(newUserFavs)

    const item = {
      'text': text,
      'author': author
    }

    const idx = newUserFavs.findIndex(e => JSON.stringify(e) == JSON.stringify(item))

    if (idx < 0) {
      console.error('quote', text, 'not in favourites')
    }

    newUserFavs.splice(idx, 1)

    // console.log(newUserFavs)
    setUserFavourites([...newUserFavs])

    storeFavourites()
  }

  const [isQuotesLoading, setQuotesLoading] = useState(true);
  const [userQuotes, setUserQuotes] = useState([]);

  const getUserQuotes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('Quotes')
      // console.log(jsonValue)
      const json = jsonValue != null ? JSON.parse(jsonValue) : [];
      setUserQuotes(json);

    } catch (error) {
      console.error(error);
    } finally {
      setQuotesLoading(false);
    }
  }

  const storeQuotes = async () => {
    try {
      const jsonValue = JSON.stringify(userQuotes)
      await AsyncStorage.setItem('Quotes', jsonValue)
      // console.log(jsonValue)
    } catch (e) {
      console.error('error updating User Quotes')
    } finally {
      console.log('User Quotes updated', userQuotes)
    }
  }

  function submitQuote(text, author) {
    const newUserQuotes = userQuotes
    newUserQuotes.push({
      'text': text,
      'author': author
    })

    setUserQuotes([...newUserQuotes])
    storeQuotes()
  }

  function deleteQuote(quoteItem) {
    const newUserQuotes = userQuotes

    const idx = newUserQuotes.findIndex(e => JSON.stringify(e) == JSON.stringify(quoteItem))

    if (idx < 0) {
      console.error('quote', text, 'not in User Quotes')
    }

    newUserQuotes.splice(idx, 1)
    setUserQuotes([...newUserQuotes])

    storeQuotes()
  }

  useEffect(() => {
    getUserFavourites();
    getUserQuotes();
  }, []);

  return (
    <NavigationContainer>
      {isFavouritesLoading & isQuotesLoading ? <ActivityIndicator /> : (
        <MyTabs
          userFavourites={userFavourites}
          quoteInFavourite={quoteInFavourite}
          addFavourite={addFavourite}
          removeFavourite={removeFavourite}
          userQuotes={userQuotes}
          submitQuote={submitQuote}
          deleteQuote={deleteQuote}
        />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
  },
  singlequotecontainer: {
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
  },
  singlequote: {
    padding: 5,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  AddQuoteContainer: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    elevation: 8
  },
  AddQuoteIcon: {
    fontSize: 40,
    color: 'white'
  },
  inputQuote: {
    height: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  inputName: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  submitQuoteButton: {
    backgroundColor: '#03A9F4',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    margin: 12,
    padding: 5,
  }
});

export default App;