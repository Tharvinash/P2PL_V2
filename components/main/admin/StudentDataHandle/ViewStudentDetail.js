import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { FAB } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
require('firebase/firestore');

function ViewStudentDetail(props) {
  const [info, setInfo] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const infoId = props.route.params.did;

  useEffect(() => {
    firebase
      .firestore()
      .collection('users')
      .doc(infoId)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setInfo(snapshot.data());
        } else {
          console.log('does not exist');
        }
      });
  }, []);

  const OriData = () => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Name: {info.name} </Text>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>
                Matric Number: {info.matricNumber}{' '}
              </Text>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Email: {info.email} </Text>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Faculty: {info.faculty}</Text>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Year: {info.year} </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const EditData = () => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Name: {info.name} </Text>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>
                Matric Number: {info.matricNumber}{' '}
              </Text>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Email: {info.email} </Text>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Faculty: {info.faculty}</Text>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Year: {info.year} </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  if (isEdit) {
    return (
      <View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>User Id</Text>
            <TextInput
              style={styles.input}
              value={userId}
              onChangeText={(userId) => setUserId(userId)}
            />
          </View>
          <View style={styles.formControl}>
            <Text style={styles.label}>Year of Study</Text>
            <SelectPicker
              placeholder={year}
              placeholderStyle={{
                fontFamily: 'Poppins',
                fontSize: 15,
                color: '#000',
                marginTop: 5,
              }}
              onSelectedStyle={{
                fontSize: 15,
                color: '#000',
              }}
              style={styles.input}
              onValueChange={setYear}
              selected={year}
            >
              {Object.values(options).map((val, index) => (
                <SelectPicker.Item label={val} value={val} key={index} />
              ))}
            </SelectPicker>
          </View>
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={styles.logout} onPress={() => Save()}>
            <Text style={styles.Ltext}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return OriData();
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

export default ViewStudentDetail;
