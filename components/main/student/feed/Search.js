import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Picker,
  Dimensions,
} from "react-native";
import { Icon } from "react-native-elements";

import firebase from "firebase";
require("firebase/firestore");

export default function Search(props) {
  const [users, setUsers] = useState(" ");
  const [faculty, setFaculty] = useState("");
  const userId = firebase.auth().currentUser.uid;

  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("Discussion")
      .where("title", ">=", search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        // console.log(users)
        setUsers(users);
      });
  };

  const searchByCategory = (xxx) => {
    setFaculty(xxx)
    firebase
      .firestore()
      .collection("Discussion")
      .where("faculty", "==", xxx)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUsers(users);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <Icon
          name="ios-search"
          type="ionicon"
          size={25}
          color="#3C3A36"
          onPress={searchByCategory}
        />
        <TextInput
          underlineColorAndroid="transparent"
          placeholder="Search Discussion"
          placeholderTextColor="#000"
          autoCapitalize="none"
          onChangeText={(search) => fetchUsers(search)}
          style={{ flex: 1, paddingLeft: 10, fontSize: 18 }}
        />
      </View>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={faculty}
          style={{
            height: 50,
            width: 300,
            alignItems:'center',
            justifyContent:'center',
            color: "#fff",
            fontFamily: "Poppins",
          }}
          onValueChange={(faculty) => searchByCategory(faculty)}
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
          <Picker.Item label="FACULTY OF SCIENCE" value="FACULTY OF SCIENCE" />
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

      <FlatList
        horizontal={false}
        extraData={users}
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          item === " " ? null : (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                {userId === "aszrJayRTbZNtcX5DPzXU5HTD6a2" ||
                userId === "uvlRbumPXGb0cie0E75eUClfYHR2" ? (
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() =>
                      props.navigation.navigate("LectureDiscussionView", {
                        did: item.id,
                      })
                    }
                  >
                    <Text numberOfLines={2} style={styles.title}>
                      {item.title}
                    </Text>
                    <Text style={styles.faculty}>{item.faculty}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() =>
                      props.navigation.navigate("Discussion", {
                        did: item.id,
                      })
                    }
                  >
                    <Text numberOfLines={2} style={styles.title}>
                      {item.title}
                    </Text>
                    <Text style={styles.faculty}>{item.faculty}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#140F38",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  card: {
    borderRadius: 16,
    elevation: 5,
    backgroundColor: "#003565",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    width: 340,
  },

  cardContent: {
    marginVertical: 10,
    marginHorizontal: 18,
  },

  dropdown: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: "#E3562A",
    height: Dimensions.get("window").height / 15,
    justifyContent:'center',
    alignItems:'center',
  },

  input: {
    margin: 10,
    borderColor: "#E3562A",
    borderWidth: 1,
    height: Dimensions.get("window").height / 15,
    backgroundColor: "#FFF",
    width: 370,
    borderRadius: 12,
    fontFamily: "Poppins",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft:10
  },

  search: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  faculty: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins",
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Poppins",
    paddingVertical: 0,
    //  marginVertical: -5,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    lineHeight: 25,
  },
});
