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
import SelectPicker from 'react-native-form-select-picker';
require('firebase/firestore');

function ViewIssue(props) {
  const [info, setInfo] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [fac, setFac] = useState('');
  const [data, setData] = useState(0);
  const infoId = props.route.params.did;

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', paddingRight: 15 }}>
          <TouchableOpacity>
            <Icon
              name='checkmark-circle-outline'
              type='ionicon'
              size={30}
              color='#000'
              onPress={() => {
                Resolve();
              }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [data]);

  const Resolve = () => {
    return Alert.alert('Issue Resolved ? ', 'If yes please press Resolved', [
      // The "Yes" button
      {
        text: 'Resolved',
        onPress: () => {
          removeIssue();
        },
      },
      {
        text: 'No',
      },
    ]);
  };

  const removeIssue = () => {
    firebase.firestore().collection('AdminIssue').doc(infoId).delete();
    props.navigation.navigate('IssueHandle');
  };

  const fetchData = () => {
    firebase
      .firestore()
      .collection('AdminIssue')
      .doc(infoId)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setInfo(snapshot.data());
          setName(snapshot.data().userName);
          setEmail(snapshot.data().email);
          setFac(snapshot.data().fac);
        } else {
          console.log('does not exist');
        }
      });
  };

  const OriData = () => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Name :</Text>
              <Text style={styles.input}>{info.userName} </Text>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Email :</Text>
              <Text style={styles.input}>{info.email} </Text>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Faculty :</Text>
              <Text style={styles.input}>{info.fac}</Text>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Status :</Text>
              <Text style={styles.input}>{info.status}</Text>
            </View>
          </View>
          {info.maticNum !== '' && (
            <View style={styles.form}>
              <View style={styles.formControl}>
                <Text style={styles.label}>Matric Number :</Text>
                <Text style={styles.input}>{info.maticNum}</Text>
              </View>
            </View>
          )}
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Problem Description :</Text>
              <Text style={styles.input}>{info.probDesc}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  return OriData();
}

const styles = StyleSheet.create({
  form: {
    marginHorizontal: 20,
    marginVertical: 3,
  },
  formControl: {
    width: '100%',
  },
  label: {
    fontFamily: 'Poppins',
    fontSize: 20,
    marginVertical: 5,
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
    borderColor: '#E3562A',
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    fontFamily: 'Poppins',
    fontSize: 15,
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

export default ViewIssue;
