import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { Quotes } from './Quotes';
import { Favourites } from './Favourites';
import { MyQuotesStack } from './MyQuotesStack';

const Tab = createBottomTabNavigator();
export function MyTabs(props) {
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
          deleteQuote={props.deleteQuote} />}
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
