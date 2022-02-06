import { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyTabs } from './components.screens/Tab';


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

export const styles = StyleSheet.create({
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