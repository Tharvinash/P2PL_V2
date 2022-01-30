import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import CheckBox from 'expo-checkbox';
import { Checkbox } from 'react-native-paper';
import { connect } from 'react-redux';
import firebase from 'firebase';
require('firebase/firestore');
import { FAB } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import SnackBar from 'react-native-snackbar-component';

function requestformentor(props) {
  const { currentUser } = props;
  const [problem1, setProblem1] = useState(false);
  const [problem2, setProblem2] = useState(false);
  const [problem3, setProblem3] = useState(false);
  const [problem4, setProblem4] = useState(false);
  const [problem5, setProblem5] = useState(false);
  const [finalValue, setFinalValue] = useState([]);
  const [user, setUser] = useState(currentUser);
  const [desc, setDesc] = useState('');
  const userId = firebase.auth().currentUser.uid;

  const UploadReq = () => {
    if (problem1 === true) {
      finalValue.push('Academic');
    }
    if (problem2 === true) {
      finalValue.push('Internship');
    }
    if (problem3 === true) {
      finalValue.push('Subject Registration');
    }
    if (problem4 === true) {
      finalValue.push('Club Activities');
    }
    if (problem5 === true) {
      finalValue.push('Personal Projects');
    }

    firebase
      .firestore()
      .collection('RequestForMentor')
      .add({
        name: user.realName,
        faculty: user.faculty,
        year: user.year,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
        description: desc,
        problems: finalValue,
        image: user.image,
        //commenting out just for testing purpose
        matricNumber: user.matricNumber,
        userId,
        pushToken: user.pushToken, // change for notification
      })
      .then(function () {
        props.navigation.goBack();
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Name :</Text>
            <Text style={styles.input}>Name: {user.realName} </Text>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Matric Number :</Text>
            <Text style={styles.input}>{user.matricNumber}</Text>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Faculty :</Text>
            <Text style={styles.input}>{user.faculty}</Text>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Year :</Text>
            <Text style={styles.input}>{user.year} </Text>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={{ paddingBottom: 10, ...styles.label }}>Issue: </Text>
            <View style={styles.row}>
              <CheckBox value={problem1} onValueChange={setProblem1} />
              <Text style={styles.label2}>Academic</Text>
            </View>
            <View style={styles.row}>
              <CheckBox value={problem2} onValueChange={setProblem2} />
              <Text style={styles.label2}>Internship</Text>
            </View>
            <View style={styles.row}>
              <CheckBox value={problem3} onValueChange={setProblem3} />
              <Text style={styles.label2}>Subject Registration</Text>
            </View>
            <View style={styles.row}>
              <CheckBox value={problem4} onValueChange={setProblem4} />
              <Text style={styles.label2}>Club Activities</Text>
            </View>
            <View style={styles.row}>
              <CheckBox value={problem5} onValueChange={setProblem5} />
              <Text style={styles.label2}>Personal Projects</Text>
            </View>
          </View>
        </View>
        <View style={{ ...styles.form, marginBottom: 70 }}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Description: </Text>
            <TextInput
              placeholder='Description'
              autoCapitalize='sentences'
              style={styles.input}
              multiline={true}
              value={desc}
              onChangeText={(desc) => setDesc(desc)}
            />
          </View>
        </View>
      </ScrollView>
      <FAB
        placement='right'
        color='#E3562A'
        onPress={() => UploadReq()}
        icon={<Icon reverse name='send' type='font-awesome' color='#E3562A' />}
      />
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

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(requestformentor);
