import { useState } from 'react';
import { TextInput, SafeAreaView, Text, View, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../App';

export function AddQuote(props) {
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
          onChangeText={newText => setQuoteText(newText)} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput style={styles.inputName}
          onChangeText={newText => setQuoteAuthor(newText)}
          value="Me" />
      </View>
      <View style={styles.container}>
        <Pressable style={styles.submitQuoteButton}
          onPress={() => {
            props.submitQuote(quoteText, quoteAuthor);
            navigation.navigate('My Quotes');
          }}>
          <AntDesign name={"addfile"} style={styles.AddQuoteIcon}>
            <Text>Add quote</Text>
          </AntDesign>

        </Pressable>
      </View>
    </SafeAreaView>
  );
}
