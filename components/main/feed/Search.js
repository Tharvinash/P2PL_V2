import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Picker,
} from "react-native";
import { Icon } from "react-native-elements";

import firebase from "firebase";
require("firebase/firestore");

export default function Search(props) {
  const [users, setUsers] = useState(" ");
  const [faculty, setFaculty] = useState("");

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

  const searchByCategory = () => {
    firebase
      .firestore()
      .collection("Discussion")
      .where("faculty", "==", faculty)
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
          style={styles.search}
          name="ios-search"
          type="ionicon"
          size={20}
          color="#3C3A36"
          onPress={searchByCategory}
        />
        <TextInput
          underlineColorAndroid="transparent"
          placeholder="Search Discussion"
          placeholderTextColor="#000"
          autoCapitalize="none"
          onChangeText={(search) => fetchUsers(search)}
        />
      </View>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={faculty}
          style={{
            height: 50,
            width: 300,
            color: "#fff",
            marginTop: -10,
            fontFamily: "Poppins",
          }}
          onValueChange={(faculty) => setFaculty(faculty)}
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
        key={users.id}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          item === " " ? null : (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    props.navigation.navigate("DiscussionTitle", {
                      did: item.id,
                    })
                  }
                >
                  <Text numberOfLines={2} style={styles.title}>
                    {item.title}
                  </Text>
                  <Text style={styles.faculty}>{item.faculty}</Text>
                </TouchableOpacity>
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

  container2: {
    padding: 15,
    justifyContent: "space-around",
    alignItems: "flex-start",
  },

  dropdown: {
    marginTop: 60,
    marginLeft: 70,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 4,
    backgroundColor: "#E3562A",
    height: 35,
    marginRight: 60,
  },

  input: {
    margin: 10,
    borderColor: "#E3562A",
    borderWidth: 1,
    height: 37,
    backgroundColor: "#FFF",
    width: 370,
    borderRadius: 12,
    padding: 8,
    fontFamily: "Poppins",
    position: "absolute",
    flexDirection: "row",
  },

  bell: {
    position: "absolute",
    width: 30,
    height: 30,
    left: 330,
    top: 59,
  },

  search: {
    padding: 10,
    alignItems: "flex-end",
  },

  gridItem: {
    flex: 1,
    margin: 15,
    width: 340,
    height: 114,
    borderRadius: 16,
    // overflow: Platform.OS ==='android' && Platform.Version>=21 ? "hidden" : 'visible',
    elevation: 5,
    backgroundColor: "#003565",
    marginBottom: 0,
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

  flat: {
    marginTop: 0,
    //justifyContent:,
  },
});
