import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Picker,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");
import { connect } from "react-redux";
import Modal from "react-native-modal";


function Add(props) {
  const { currentUser } = props;
  const userId = firebase.auth().currentUser.uid;
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [faculty, setFaculty] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      // const cameraStatus = await Camera.requestPermissionsAsync();
      // setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus =
        await ImagePicker.requestCameraRollPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, [isLoading]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasGalleryPermission === false) {
    return <View />;
  }
  if (hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const uploadImage = async () => {
    setModalVisible(!isModalVisible);
    if (image != null) {
      //const uri = props.route.params.image;
      const childPath = `post/${
        firebase.auth().currentUser.uid
      }/${Math.random().toString(36)}`;
      console.log(childPath);

      const response = await fetch(image);
      const blob = await response.blob();

      const task = firebase.storage().ref().child(childPath).put(blob);

      const taskProgress = (snapshot) => {
        console.log(`transferred: ${snapshot.bytesTransferred}`);
      };

      const taskCompleted = () => {
        task.snapshot.ref.getDownloadURL().then((snapshot) => {
          savePostData(snapshot, title, description);
          console.log("downloadUri" + snapshot);
          setIsLoading(false);
        });
      };

      const taskError = (snapshot) => {
        console.log(snapshot);
      };

      task.on("state_changed", taskProgress, taskError, taskCompleted);
    } else {
      firebase
        .firestore()
        .collection("Discussion")
        .add({
          userId,
          title,
          faculty,
          description,
          postedBy: currentUser.name,
          image: currentUser.image,
          favBy: [],
          creation: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(function () {
          props.navigation.popToTop();
          console.log("Done");
        });
    }
  };

  const savePostData = (downloadURL, title, description) => {
    firebase
      .firestore()
      .collection("Discussion")
      .add({
        userId,
        downloadURL,
        title,
        faculty,
        description,
        postedBy: currentUser.name,
        favBy: [],
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        setModalVisible(!isModalVisible);
        props.navigation.popToTop();
        console.log("Done");
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          borderBottomColor: "#fff",
          borderBottomWidth: 1,
          margin: 20,
        }}
      >
        <TextInput
          style={styles.title}
          placeholder="Place your title here"
          placeholderTextColor="#fff"
          multiline={true}
          onChangeText={(title) => setTitle(title)}
        />
      </View>

      <View style={{ margin: 20 }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.fac}>Add Faculty: </Text>
          <Picker
            // style={{c: "grey", color: "blue", fontSize:17}}
            selectedValue={faculty}
            style={{ height: 50, width: 300, color: "#fff", marginTop: -10 }}
            onValueChange={(faculty, itemIndex) => setFaculty(faculty)}
            itemStyle={{ fontFamily: "Poppins" }}
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

        <View style={{ flexDirection: "row" }}>
          <Text style={styles.image}>Add Image:</Text>
          <TouchableOpacity style={styles.ui} onPress={pickImage}>
            <Text style={styles.uit}>Upload Image</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ alignItems: "center" }}>
        {image && (
          <Image source={{ uri: image }} style={{ height: 200, width: 200 }} />
        )}
      </View>

      <View
        style={{
          borderBottomColor: "#fff",
          borderBottomWidth: 1,
          margin: 20,
        }}
      >
        <Text style={styles.title}>Discussion Description</Text>
      </View>
      <View>
        <TextInput
          style={styles.desc}
          placeholder="Type here"
          multiline={true}
          onChangeText={(description) => setDescription(description)}
        />
      </View>


        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            style={styles.blogout}
            onPress={() => uploadImage()}
          >
            <Text style={styles.Ltext}>Upload</Text>
          </TouchableOpacity>
        </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#140F38",
  },

  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "contain",
  },

  dropdown: {
    color: "#fff",
  },

  title: {
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 25,
    color: "#fff",
    alignContent: "space-around",
  },

  fac: {
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 20,
    color: "#fff",
    alignContent: "space-around",
    paddingBottom: 20,
  },

  image: {
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 20,
    color: "#fff",
    alignContent: "space-around",
    paddingRight: 20,
  },

  ui: {
    width: 120,
    height: 25,
    backgroundColor: "#E3562A",
    borderRadius: 16,
    marginRight: 20,
  },

  uit: {
    color: "#fff",
    justifyContent: "center",
    left: 10,
    top: 2,
    fontFamily: "Poppins",
  },

  desc: {
    color: "#000",
    marginTop: -10,
    margin: 20,
    height: 250,
    borderColor: "#E3562A",
    borderWidth: 1,
    backgroundColor: "#FFF",
    width: 350,
    borderRadius: 12,
    padding: 10,
    fontFamily: "Poppins",
  },

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
    fontSize: 15,
    justifyContent: "space-between",
    paddingTop: 8,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(Add);
