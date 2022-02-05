import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Button, SafeAreaView, FlatList, Text, View, ActivityIndicator, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';


const SingleQuote = (props) => {
  const [isFavourite, setFavourite] = useState(props.isFavourite)

  function addFavourite() {
    setFavourite(true)
    props.addFavourite(props.text, props.author)
  }
  function removeFavourite() {
    setFavourite(false)
    props.removeFavourite(props.text, props.author)
  }
  // useIsFocused();
  // console.log(props.isFavourite)

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
          <Text>Sentiment</Text>
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
      setData(json.slice(0, 10));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getQuotes();
  }, []);

  useFocusEffect(
    useCallback(()=>{
      console.log(props.userFavourites.length)
    },[props.userFavourites])
  )


  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? <ActivityIndicator /> : (
        <FlatList
          data={data}
          extraData={props.userFavourites}
          renderItem={({ item }) => (
            <SingleQuote text={item.text} author={item.author}
              isFavourite={props.quoteInFavourite(item)}
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
        // data={userFavs}
        renderItem={({ item }) => (
          <SingleQuote text={item.text} author={item.author}
            isFavourite={props.quoteInFavourite(item)}
            addFavourite={props.addFavourite}
            removeFavourite={props.removeFavourite}
          />
        )}
      />
    </SafeAreaView>
  );
}

function MyQuotes() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Write your own quote!</Text>
      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
        <Button title="Add" />
      </View>
    </View>
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
      <Tab.Screen name="My Quotes" component={MyQuotes}
        options={{
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

  function quoteInFavourite(item) {
    // console.log(userFavourites.length)
    return userFavourites.find(e => JSON.stringify(e) == JSON.stringify(item)) != undefined
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

    console.log(newUserFavs)
    setUserFavourites([...newUserFavs])

    storeFavourites()
  }

  useEffect(() => {
    getUserFavourites();
  }, []);

  // //TODO: move later
  // const [isQuotesLoading, setQuotesLoading] = useState(true);
  // const [userQuotes, setUserQuotes] = useState([]);



  // const getUserQuotes = async () => {
  //   try {
  //     const jsonValue = await AsyncStorage.getItem('Quotes')
  //     const json = jsonValue != null ? JSON.parse(jsonValue) : [];
  //     setUserQuotes(json);
  //     // global.quotes = json;
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setQuotesLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   // getUserFavourites();
  //   // getUserQuotes();
  // }, []);

  return (
    <NavigationContainer>
      {isFavouritesLoading ? <ActivityIndicator /> : (
        <MyTabs
          userFavourites={userFavourites}
          // setUserFavourites={setUserFavourites}
          addFavourite={addFavourite}
          removeFavourite={removeFavourite}
          quoteInFavourite={quoteInFavourite} />
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
  }
});

export default App;