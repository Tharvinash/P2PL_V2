import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import { FAB } from "react-native-elements";
import { Icon } from "react-native-elements";
import firebase from "firebase";
import { TouchableOpacity } from "react-native";
require("firebase/firestore");

function ViewDetailMentee(props) {
  const [info, setInfo] = useState([]);
  const [array, setarray] = useState([]);
  const infoId = props.route.params.did;

  const xxx = () => {
    props.navigation.navigate("AddInGroup", {
      did: infoId,
    });
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("RequestForMentor")
      .doc(infoId)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setInfo(snapshot.data());
          setarray(snapshot.data().problems);
        } else {
          console.log("does not exist");
        }
      });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Name: {info.name} </Text>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Faculty: {info.faculty}</Text>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Year: {info.year} </Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Description: {info.description} </Text>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Issue: </Text>
            {array.map((item, key) => (
              <Text key={key} style={styles.label}>
                {" "}
                - {item}{" "}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
      <FAB
        placement="right"
        title="Add in group"
        overlayColor="#000"
        style={styles.floatButton}
        onPress={() => xxx()}
        icon={<Icon name="add-outline" type="ionicon" size={30} color="#fff" />}
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

export default ViewDetailMentee;
