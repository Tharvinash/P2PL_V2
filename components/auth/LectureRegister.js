import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Picker,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import firebase from "firebase";
import "firebase/firestore";

export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      name: "",
      faculty: null,
      year: "",
    };

    this.onSignUp = this.onSignUp.bind(this);
  }

  updateYear = (year) => {
    this.setState({ year: year });
  };

  updateFaculty = (faculty) => {
    this.setState({ faculty: faculty });
  };

  onSignUp() {
    const { email, password, name, faculty, year } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            name,
            email,
            FavDiscussion: [],
            faculty,
            status: 1,
            year,
            fca: true,
            fp: true,
            fs: true,
            fol: true,
            foe: true,
            fod: true,
            foeng: true,
            fom: true,
            foanss: true,
            fobna: true,
            foena: true,
            folnl: true,
            fobe: true,
            fcsit: true,
            aois: true,
            aoms: true,
            image:
              "https://firebasestorage.googleapis.com/v0/b/p2pl-bcbbd.appspot.com/o/default%2FnewProfile.png?alt=media&token=b2e22482-506a-4e78-ae2e-e38c83ee7c27",
            filteredFeed: [
              "FACULTY OF SCIENCE",
              "FACULTY OF CREATIVE ARTS",
              "FACULTY OF PHARMACY",
              "FACULTY OF LAW",
              "FACULTY OF EDUCATION",
              "FACULTY OF DENTISTRY",
              "FACULTY OF ENGINEERING",
              "FACULTY OF MEDICINE",
              "FACULTY OF ARTS AND SOCIAL SCIENCE",
              "FACULTY OF BUSINESS AND ACCOUNTANCY",
              "FACULTY OF ECONOMICS AND ADMINISTRATION",
              "FACULTY OF LANGUAGE AND LINGUISTICS",
              "FACULTY OF BUILT ENVIRONMENT",
              "FACULTY OF COMPUTER SCIENCE AND INFORMATION TECHNOLOGY",
              "ACADEMY OF ISLAMIC STUDIES",
              "ACADEMY OF MALAY STUDIES",
            ],
          });
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.title2}>Create your account</Text>
        </View>

        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Full Name"
          placeholderTextColor="#000"
          autoCapitalize="none"
          onChangeText={(name) => this.setState({ name })}
        />

        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="E-mail"
          placeholderTextColor="#000"
          autoCapitalize="none"
          onChangeText={(email) => this.setState({ email })}
        />

        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Passowrd"
          placeholderTextColor="#000"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />

        <View style={styles.input}>
          <Picker
            selectedValue={this.state.faculty}
            style={{ height: 50, width: 300, color: "#000", marginTop: -10 }}
            itemStyle={{ fontFamily: "Poppins" }}
            onValueChange={this.updateFaculty}
          >
            <Picker.Item
              label="FACULTY OF EDUCATION"
              value="FACULTY OF EDUCATION"
            />
            <Picker.Item
              label="FACULTY OF DENTISTRY"
              value="FACULTY OF DENTISTRY"
            />
            <Picker.Item
              label="FACULTY OF ENGINEERING"
              value="FACULTY OF ENGINEERING"
            />
            <Picker.Item
              label="FACULTY OF SCIENCE"
              value="FACULTY OF SCIENCE"
            />
            <Picker.Item label="FACULTY OF LAW" value="FACULTY OF LAW" />
            <Picker.Item
              label="FACULTY OF MEDICINE"
              value="FACULTY OF MEDICINE"
            />
            <Picker.Item
              label="FACULTY OF ARTS AND SOCIAL SCIENCE"
              value="FACULTY OF ARTS AND SOCIAL SCIENCE"
            />
            <Picker.Item
              label="FACULTY OF BUSINESS AND ACCOUNTANCY"
              value="FACULTY OF BUSINESS AND ACCOUNTANCY"
            />
            <Picker.Item
              label="FACULTY OF ECONOMICS AND ADMINISTRATION"
              value="FACULTY OF ECONOMICS AND ADMINISTRATION"
            />
            <Picker.Item
              label="FACULTY OF LANGUAGE AND LINGUISTICS"
              value="FACULTY OF LANGUAGE AND LINGUISTICS"
            />
            <Picker.Item
              label="FACULTY OF BUILT ENVIRONMENT"
              value="FACULTY OF BUILT ENVIRONMENT"
            />
            <Picker.Item
              label="FACULTY OF COMPUTER SCIENCE AND INFORMATION TECHNOLOGY"
              value="FACULTY OF COMPUTER SCIENCE AND INFORMATION TECHNOLOGY"
            />
            <Picker.Item
              label="FACULTY OF PHARMACY"
              value="FACULTY OF PHARMACY"
            />
            <Picker.Item
              label="FACULTY OF CREATIVE ARTS"
              value="FACULTY OF CREATIVE ARTS"
            />
            <Picker.Item
              label="ACADEMY OF ISLAMIC STUDIES"
              value="ACADEMY OF ISLAMIC STUDIES"
            />
            <Picker.Item
              label="ACADEMY OF MALAY STUDIES"
              value="ACADEMY OF MALAY STUDIES"
            />
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => this.onSignUp()}>
          <Text style={styles.text}>Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#140F38",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: 30,
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
  },

  title2: {
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
    marginBottom: 20,
  },

  button: {
    alignItems: "center",
    backgroundColor: "#E3562A",
    padding: 14,
    borderRadius: 20,
    width: 275,
    height: 56,
    margin: 10,
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
  },

  input: {
    margin: 5,
    height: 53,
    borderColor: "#E3562A",
    borderWidth: 1,
    backgroundColor: "#FFF",
    width: 275,
    borderRadius: 12,
    padding: 10,
    fontSize: 15,
  },
});

export default Register;
