import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, Modal } from "react-native";
import UploadFile from "../../component/UploadFile";
import * as DocumentPicker from "expo-document-picker";
import AddComment from "../../component/addComment";
import { FAB, ListItem, BottomSheet } from "react-native-elements";
import firebase from "firebase";
require("firebase/firestore");

let name2;
const Inventory = (prop) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Doc, setDoc] = useState(null); //save local uri
  const [name, setName] = useState("hi");

  const uploadDoc = async() => {
    if (name2 == undefined) {
      Alert.alert(
        "No document selected",
        "Please select a document",
        [
          {
            text: "Ok",

          },
        ]
      );
    }
    else {
      console.log("else block")
      const childPath = `inventory/${firebase.auth().currentUser.uid}}/${Math.random().toString(36)}`;
      console.log(childPath);

      const response = await fetch(Doc);
      console.log("Doc "+Doc)
      const blob = await response.blob();

      const task = firebase.storage().ref().child(childPath).put(blob);

      const taskProgress = (snapshot) => {
        console.log(`transferred: ${snapshot.bytesTransferred}`);
      };

      const taskCompleted = () => {
        task.snapshot.ref.getDownloadURL().then((snapshot) => {
          console.log(snapshot);
        });
      };

      const taskError = (snapshot) => {
        console.log(snapshot);
      };

      task.on("state_changed", taskProgress, taskError, taskCompleted);
    }


  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setName("")
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.cancelled) {
      setDoc(result.uri);
      setName(result.name);
      console.log(result.name);
      console.log(result.uri);
      name2 = result.name;
      console.log(name2);

    }
  };

  return (
    <View style={{ backgroundColor: "#140F38", flex: 1 }}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={styles.blogout}
          onPress={toggleModal}
        >
          <Text style={styles.Ltext}>Upload File</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Modal visible={isModalVisible} transparent={true} animationType="slide" >
          <UploadFile
            toggleModal={() => toggleModal()}
            pickDocument={() => pickDocument()}
            docName={name}
            setNewDocName={(newDocName) => setName(newDocName)}
            uploadDoc={() => uploadDoc()}
          />
        </Modal>
      </View>

    </View>
  )

}

const styles = StyleSheet.create({
  blogout: {
    width: 160,
    height: 40,
    backgroundColor: "#E3562A",
    borderColor: "#E3562A",
    borderRadius: 16,
    marginTop: 20,
  },
  Ltext: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 18,
    justifyContent: "space-between",
    paddingTop: 8,
  }
});

export default Inventory;