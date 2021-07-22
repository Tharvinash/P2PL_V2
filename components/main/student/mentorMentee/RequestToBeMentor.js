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
import * as DocumentPicker from "expo-document-picker";

function requesttobementor(props) {
  const { currentUser } = props;
  const [problem1, setProblem1] = useState(false);
  const [problem2, setProblem2] = useState(false);
  const [problem3, setProblem3] = useState(false);
  const [problem4, setProblem4] = useState(false);
  const [problem5, setProblem5] = useState(false);
  const [user, setUser] = useState(currentUser);
  const [finalValue, setFinalValue] = useState([]);
  const [Doc, setDoc] = useState(null);
  const [desc, setDesc] = useState("");
  const [qualification, setQualification] = useState("");

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    if (!result.cancelled) {
      setDoc(result.uri);
    }
  };

  const uploadDoc = async () => {
    const childPath = `doc/${1234}/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(Doc);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostDoc(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const savePostDoc = (downloadURL) => {
    
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
      .collection("RequestToBeMentor")
      .add({
        name: user.name,
        faculty: user.faculty,
        year: user.year,
        qualificationProof: downloadURL,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
        description: desc,
        qualification,
        problems: finalValue
      })
      .then(function () {
        console.log("Done");
      });
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Name: {user.name}</Text>
        </View>
      </View>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Faculty: {user.faculty}</Text>
        </View>
      </View>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Year: {user.year}</Text>
        </View>
      </View>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Issue can handle: </Text>
          <View style={styles.row}>
            <CheckBox
              value={problem1}
              onValueChange={setProblem1}
              //onChange={() => xxx()}
            />
            <Text style={styles.label2}>Problem 1</Text>
          </View>
          <View style={styles.row}>
            <CheckBox
              value={problem2}
              onValueChange={setProblem2}
              // onChange={() => xxx()}
            />
            <Text style={styles.label2}>Problem 2</Text>
          </View>
          <View style={styles.row}>
            <CheckBox
              value={problem3}
              onValueChange={setProblem3}
              // onChange={() => xxx()}
            />
            <Text style={styles.label2}>Problem 3</Text>
          </View>
          <View style={styles.row}>
            <CheckBox
              value={problem4}
              onValueChange={setProblem4}
              //onChange={() => xxx()}
            />
            <Text style={styles.label2}>Problem 4</Text>
          </View>
          <View style={styles.row}>
            <CheckBox
              value={problem5}
              onValueChange={setProblem5}
              //onChange={() => xxx()}
            />
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
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Qualification: </Text>
          <TextInput
            placeholder="Description"
            autoCapitalize="sentences"
            style={styles.input}
            multiline={true}
            value={qualification}
            onChangeText={(qualification) => setQualification(qualification)}
          />
        </View>
      </View>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Proves: </Text>
        </View>
      </View>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity style={styles.logout} onPress={() => pickDocument()}>
          <Text style={styles.Ltext}>Upload Document </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logout} onPress={() => uploadDoc()}>
          <Text style={styles.Ltext}>Send Request </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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

export default connect(mapStateToProps, null)(requesttobementor);