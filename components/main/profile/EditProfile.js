import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
require("firebase/firestore");
function EditProfile(props) {
  const [userId, setUserId] = useState("");
  const [image, setImage] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(props.route.params.uid)
      .get()
      .then((snapshot) => {
        setUserId(snapshot.data().name);
      });
  }, []);

  const Save = async () => {
    if (imageChanged) {
      const uri = image;
      const childPath = `profile/${firebase.auth().currentUser.uid}`;

      const response = await fetch(uri);
      const blob = await response.blob();

      const task = firebase.storage().ref().child(childPath).put(blob);

      const taskProgress = (snapshot) => {
        console.log(`transferred: ${snapshot.bytesTransferred}`);
      };

      const taskCompleted = () => {
        task.snapshot.ref.getDownloadURL().then((snapshot) => {
          firebase
            .firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .update({
              name: userId,
              creation: firebase.firestore.FieldValue.serverTimestamp(),
              image: snapshot,
            })
            .then(() => {
              props.navigation.goBack();
              console.log("save");
            });
        });
      };

      const taskError = (snapshot) => {
        console.log(snapshot);
      };

      task.on("state_changed", taskProgress, taskError, taskCompleted);
    } else {
    }
  };

  // const Save = () => {
  //       firebase.firestore()
  //         .collection("users")
  //         .doc(props.route.params.uid)
  //         .update({
  //             name:userId,
  //             creation: firebase.firestore.FieldValue.serverTimestamp()
  //         }).then(()=> {
  //             props.navigation.goBack()
  //             console.log("save")
  //         })
  // }

  const pickImage = async () => {
    if (true) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
        setImageChanged(true);
      }
    }
  };

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
          <Text style={styles.label}>Profile Picture</Text>
          <TouchableOpacity style={styles.logout} onPress={() => pickImage()}>
            <Text style={styles.Ltext}>Upload Profile Picture</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity style={styles.logout} onPress={() => Save()}>
          <Text style={styles.Ltext}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  formControl: {
    width: "100%",
  },
  label: {
    fontFamily: "Poppins",
    fontSize: 20,
    marginVertical: 8,
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

export default EditProfile;
