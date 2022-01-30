import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import CheckBox from 'expo-checkbox';
import firebase from 'firebase';
require('firebase/firestore');
import { FAB } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import { RadioButton } from 'react-native-paper';
import SelectPicker from 'react-native-form-select-picker';

function ContactAdmin({ navigation }) {
  const [userName, setUserName] = useState('');
  const [fac, setFac] = useState('');
  const [probDesc, setProbDesc] = useState('');
  const [maticNum, setMatricNum] = useState('');
  const [email, setEmail] = useState('');
  const [checked, setChecked] = useState('first');
  const [finalValue, setFinalValue] = useState([]);
  const [desc, setDesc] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [facultyData, setFacultyData] = useState([]);

  useEffect(() => {
    const loadAsync = async () => {
      await firebase
        .firestore()
        .collection('Faculty')
        .get()
        .then((snapshot) => {
          let faculty = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setFacultyData(faculty);
        });
    };
    loadAsync();
  }, []);

  const UploadReq = () => {
    setModalVisible(!isModalVisible);
    let x = '';
    if (checked === 'first') {
      x = 'Student';
    } else {
      x = 'Lecture';
    }
    firebase
      .firestore()
      .collection('AdminIssue')
      .add({
        userName,
        fac,
        probDesc,
        maticNum,
        email,
        status: x,
      })
      .then(function () {
        setModalVisible(!isModalVisible);
        return Alert.alert(
          'Request send succeccfully',
          'The Admin will review this requst for further action',
          [
            {
              text: 'Ok',
              onPress: () => {
                navigation.navigate('Landing');
              },
            },
          ]
        );
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#140F38' }}>
      <ScrollView>
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Text style={{ ...styles.label, fontWeight: '700', fontSize: 25 }}>
            Do provide the relevant details{' '}
          </Text>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Full Name :</Text>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={(userName) => setUserName(userName)}
            />
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Email :</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(email) => setEmail(email)}
            />
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Faculty :</Text>
            <SelectPicker
              placeholder={fac}
              placeholderStyle={{
                fontFamily: 'Poppins',
                fontSize: 20,
                color: '#000',
              }}
              onSelectedStyle={{
                fontFamily: 'Poppins',
                fontSize: 15,
                color: '#000',
                ...Platform.select({
                  ios: {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: 0,
                  },
                }),
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                ...styles.ui,
              }}
              style={styles.input}
              onValueChange={setFac}
              selected={fac}
            >
              {Object.values(facultyData).map((val) => (
                <SelectPicker.Item
                  label={val.faculty}
                  value={val.faculty}
                  key={val.id}
                />
              ))}
            </SelectPicker>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Problem Description :</Text>
            <TextInput
              style={styles.input}
              value={probDesc}
              onChangeText={(probDesc) => setProbDesc(probDesc)}
            />
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Status :</Text>
            <View style={styles.form}>
              <View style={{ flexDirection: 'row' }}>
                <RadioButton
                  value='first'
                  status={checked === 'first' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('first')}
                />
                <View>
                  <Text style={styles.label}>Student</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <RadioButton
                  value='second'
                  status={checked === 'second' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('second')}
                />
                <View style={{ marginTop: 4 }}>
                  <Text style={styles.label}>Lecture</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        {checked === 'first' && (
          <View style={{...styles.form, marginBottom:20}}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Matric Number :</Text>
              <TextInput
                style={styles.input}
                value={maticNum}
                onChangeText={(maticNum) => setMatricNum(maticNum)}
              />
            </View>
          </View>
        )}
      </ScrollView>
      <FAB
        placement='right'
        color='#E3562A'
        onPress={() => UploadReq()}
        icon={<Icon reverse name='send' type='font-awesome' color='#E3562A' />}
      />
      <Modal isVisible={isModalVisible}>
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <ActivityIndicator size='large' color='#E3562A' />
        </View>
      </Modal>
    </View>
  );
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
    color: '#fff',
  },

  label2: {
    fontFamily: 'Poppins',
    fontSize: 16,
    marginLeft: 5,
    marginBottom: 10,
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
});

export default ContactAdmin;
