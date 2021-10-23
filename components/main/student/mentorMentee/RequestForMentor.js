import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  CheckBox,
} from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";
require("firebase/firestore");
import { FAB } from "react-native-elements";
import { Icon } from "react-native-elements";

function requestformentor(props) {
  const { currentUser } = props;
  const [problem1, setProblem1] = useState(false);
  const [problem2, setProblem2] = useState(false);
  const [problem3, setProblem3] = useState(false);
  const [problem4, setProblem4] = useState(false);
  const [problem5, setProblem5] = useState(false);
  const [finalValue, setFinalValue] = useState([]);
  const [user, setUser] = useState(currentUser);
  const [desc, setDesc] = useState("");
  const userId = firebase.auth().currentUser.uid;

  const UploadReq = () => {
    if (problem1 === true) {
      finalValue.push("Problem 1");
    }
    if (problem2 === true) {
      finalValue.push("Problem 2");
    }
    if (problem3 === true) {
      finalValue.push("Problem 3");
    }
    if (problem4 === true) {
      finalValue.push("Problem 4");
    }
    if (problem5 === true) {
      finalValue.push("Problem 5");
    }

    firebase
      .firestore()
      .collection("RequestForMentor")
      .add({
        name: user.name,
        faculty: user.faculty,
        year: user.year,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
        description: desc,
        problems: finalValue,
        image: user.image,
        //commenting out just for testing purpose
        //matricNumber: user.matricNumber,
        userId,
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
            <Text style={styles.label}>Name: {user.name} </Text>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Matric Number: {user.matricNumber}</Text>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Faculty: {user.faculty}</Text>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Year: {user.year} </Text>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Issue: </Text>
            <View style={styles.row}>
              <CheckBox value={problem1} onValueChange={setProblem1} />
              <Text style={styles.label2}>Problem 1</Text>
            </View>
            <View style={styles.row}>
              <CheckBox value={problem2} onValueChange={setProblem2} />
              <Text style={styles.label2}>Problem 2</Text>
            </View>
            <View style={styles.row}>
              <CheckBox value={problem3} onValueChange={setProblem3} />
              <Text style={styles.label2}>Problem 3</Text>
            </View>
            <View style={styles.row}>
              <CheckBox value={problem4} onValueChange={setProblem4} />
              <Text style={styles.label2}>Problem 4</Text>
            </View>
            <View style={styles.row}>
              <CheckBox value={problem5} onValueChange={setProblem5} />
              <Text style={styles.label2}>Problem 5</Text>
            </View>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Description: </Text>
            <TextInput
              placeholder="Description"
              autoCapitalize="sentences"
              style={styles.input}
              multiline={true}
              value={desc}
              onChangeText={(desc) => setDesc(desc)}
            />
          </View>
        </View>
      </ScrollView>
      <FAB
        placement="right"
        color="#E3562A"
        onPress={() => UploadReq()}
        icon={<Icon reverse name="send" type="font-awesome" color="#E3562A" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginLeft: 20,
    marginVertical: 10,
  },
  formControl: {
    width: "100%",
  },
  label: {
    fontFamily: "Poppins",
    fontSize: 20,
  },

  label2: {
    fontFamily: "Poppins",
    fontSize: 16,
    marginTop: 5,
  },

  row: {
    flexDirection: "row",
  },

  input: {
    fontFamily: "Poppins",
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },

  logout: {
    width: 160,
    height: 40,
    backgroundColor: "#E3562A",
    borderColor: "#E3562A",
    borderRadius: 16,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  Ltext: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 15,
    justifyContent: "space-between",
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(requestformentor);
