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
import firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
require("firebase/firestore");
function EditPassword(props) {

  const [problem1, setProblem1] = useState(false);
	const [problem2, setProblem2] = useState(false);
	const [problem3, setProblem3] = useState(false);
	const [problem4, setProblem4] = useState(false);
	const [problem5, setProblem5] = useState(false);
	const [finalValue, setFinalValue] = useState([]);

	const xxx = () =>{
		if(problem1 ===  true){
			finalValue.push("Problem 1")
		}		if(problem2 ===  true){
			finalValue.push("Problem 2")
		}		if(problem3 ===  true){
			finalValue.push("Problem 3")
		}		if(problem4 ===  true){
			finalValue.push("Problem 4")
		}		if(problem5 ===  true){
			finalValue.push("Problem 5")
		}
		console.log(finalValue)
	}

  return (
    <View>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Name: </Text>
        </View>
      </View>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Faculty: </Text>
        </View>
      </View>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Year: </Text>
        </View>
      </View>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Issue: </Text>
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
          />
        </View>
      </View>
			<View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity style={styles.logout} onPress={() => onChangePasswordPress()}>
          <Text style={styles.Ltext}>Send Request </Text>
        </TouchableOpacity>
      </View>
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

export default EditPassword;
