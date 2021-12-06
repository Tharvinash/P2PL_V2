import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import firebase from 'firebase';
import { Icon } from 'react-native-elements';
import { FAB } from 'react-native-elements';

require('firebase/firestore');
function EditPassword(props) {
  const [currentPassword, setCurrentPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);

  const reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(cred);
  };

  const onChangePasswordPress = () => {
    reauthenticate(currentPassword)
      .then(() => {
        var user = firebase.auth().currentUser;
        user
          .updatePassword(newPassword)
          .then(() => {
            Alert.alert('Password was changed');
            props.navigation.navigate('Profile');
          })
          .catch((error) => {
            console.log(error.message);
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            placeholder='Current Password'
            autoCapitalize='none'
            secureTextEntry={true}
            style={styles.input}
            value={currentPassword}
            onChangeText={(currentPassword) =>
              setCurrentPassword(currentPassword)
            }
          />
        </View>
      </View>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            placeholder='New Password'
            autoCapitalize='none'
            secureTextEntry={true}
            style={styles.input}
            value={newPassword}
            onChangeText={(newPassword) => setNewPassword(newPassword)}
          />
        </View>
      </View>
      <FAB
        placement='right'
        color='#E3562A'
        style={styles.floatButton}
        onPress={() => onChangePasswordPress()}
        size='large'
        icon={
          <Icon name='save-outline' type='ionicon' size={25} color='#FFF' />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  formControl: {
    width: '100%',
  },
  label: {
    fontFamily: 'Poppins',
    fontSize: 20,
    marginVertical: 8,
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

export default EditPassword;
