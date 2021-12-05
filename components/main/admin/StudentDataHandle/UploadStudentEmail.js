import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { FAB } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
require('firebase/firestore');

function UploadStudentEmail(props) {
  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const [email, setEmail] = useState('');

  const uploadEmail = () => {
    if (!email.match(mailformat)) {
      return Alert.alert('Invalid Email Format', 'Enter valid email', [
        {
          text: 'Retry',
        },
      ]);
    } else {
      firebase
        .firestore()
        .collection('Student')
        .add({
          email,
        })
        .then(function () {
          props.navigation.goBack();
        });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Email : </Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(email) => setEmail(email)}
          />
        </View>
      </View>
      <FAB
        placement='right'
        color='#E3562A'
        onPress={uploadEmail}
        size='large'
        icon={
          <Icon reverse name='upload' type='font-awesome-5' color='#E3562A' />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  formControl: {
    width: '100%',
  },
  label: {
    fontFamily: 'Poppins',
    fontSize: 20,
  },

  label2: {
    fontFamily: 'Poppins',
    fontSize: 16,
    marginTop: 5,
  },

  row: {
    flexDirection: 'row',
  },

  input: {
    fontFamily: 'Poppins',
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },

  logout: {
    width: 160,
    height: 40,
    backgroundColor: '#E3562A',
    borderColor: '#E3562A',
    borderRadius: 16,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  Ltext: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 15,
    justifyContent: 'space-between',
  },
});

export default UploadStudentEmail;
