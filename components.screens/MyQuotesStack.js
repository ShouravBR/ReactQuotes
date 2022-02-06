import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MyQuotes } from './MyQuotes';
import { AddQuote } from './AddQuote';

const Stack = createNativeStackNavigator();
export function MyQuotesStack(props) {
  // console.log(props);
  return (
    <Stack.Navigator>
      <Stack.Screen name="My Quotes" children={() => <MyQuotes
        userQuotes={props.userQuotes}
        deleteQuote={props.deleteQuote} />} />
      <Stack.Screen name="Add Quote" children={() => <AddQuote
        submitQuote={props.submitQuote} />} />
    </Stack.Navigator>


  );
}
