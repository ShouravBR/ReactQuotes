import * as React from 'react';
import { StyleSheet, Button, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';

const SingleQuote = (props) => {
  return (
    <View style={styles.singlequotecontainer}>
      <View style={styles.singlequote}>
        <Text style={styles.text}>{props.text}</Text>
        <Text>{props.author}</Text>
      </View>
      <View style={{
        flexDirection: 'row'
      }}>
        <View style={{ flex:1, justifyContent: 'center', alignItems: 'flex-start'}}>
          <Button title="Favourite" />
        </View>
        <View style={{ flex:1, justifyContent: 'center', alignItems: 'flex-end' }}>
          <text>Sentiment</text>
        </View>
      </View>

    </View>
  )
}

function Quotes() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text>Quotes in the Wild!</Text>
        <SingleQuote text="Old is Gold" author="Golden Girls" />
      </ScrollView>
    </SafeAreaView>
  );
}

function Favourites() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Your Favourites!</Text>
    </View>
  );
}

function Write() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Write your own quote!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Quotes" component={Quotes}
        options={{
          tabBarLabel: 'Quotes',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="book" color={color} size={size} />
          ),
        }} />
      <Tab.Screen name="Favourites" component={Favourites}
        options={{
          tabBarLabel: 'Favourites',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="heart" color={color} size={size} />
          ),
        }} />
      <Tab.Screen name="Write" component={Write}
        options={{
          tabBarLabel: 'Write',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="form" color={color} size={size} />
          ),
        }} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
  },
  scrollView: {
    // backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 32,
  },
  singlequotecontainer: {
    borderWidth: 1,
    borderRadius: 5,
  },
  singlequote: {
    // width: '100%',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;