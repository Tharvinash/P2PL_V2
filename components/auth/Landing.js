import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Modal from "react-native-modal";
export default function Landing({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require("../../assets/Logo.png")} />
      <View>
        <Text style={styles.title}>Peer to Peer Learning Platform</Text>
      </View>
      <View style={{ padding: 20 }}>
        <TouchableOpacity style={styles.button} onPress={() => toggleModal()}>
          <Text style={styles.text}>REGISTER</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.text}>LOGIN</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible}>
        <View style={styles.container}>
          <View style={{ justifyContent: "center", marginBottom: 5 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.text}>Register as Student</Text>
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: "center", marginBottom: 5 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("LectureRegister")}
            >
              <Text style={styles.text}>Register as Lecture</Text>
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: "center" }}>
            <TouchableOpacity style={styles.button} onPress={() => toggleModal()}>
              <Text style={styles.text}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#140F38",
    alignItems: "center",
    justifyContent: "center",
  },

  Ltext: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 15,
    justifyContent: "space-between",
    paddingTop: 8,
  },

  button: {
    alignItems: "center",
    backgroundColor: "#E3562A",
    padding: 14,
    borderRadius: 20,
    width: 275,
    height: 56,
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
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

  img: {
    width: 147,
    height: 184,
  },
});
