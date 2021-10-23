import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import PDFReader from "rn-pdf-reader-js";
import { FAB } from "react-native-elements";
import { Icon } from "react-native-elements";
import Modal from "react-native-modal";
import firebase from "firebase";
require("firebase/firestore");

function ViewDetailMentor(props) {
  const [info, setInfo] = useState([]);
  const [array, setarray] = useState([]);
  const [pdf, setpdf] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const infoId = props.route.params.did;

  useEffect(() => {
    firebase
      .firestore()
      .collection("RequestToBeMentor")
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

  const xxx = () => {
    props.navigation.navigate("AddInGroupV2", {
      did: infoId,
    });
  };

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
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>
              Qualification: {info.qualification}{" "}
            </Text>
          </View>
        </View>
        {info.qualificationProof && (
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Attachment: </Text>
              <View style={styles.attachment}>
                <TouchableOpacity
                  style={styles.icon}
                  onPress={() => setIsVisible(true)}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins",
                    }}
                  >
                    Doc
                  </Text>
                  <Icon
                    name="download-outline"
                    type="ionicon"
                    size={25}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <Modal isVisible={isVisible}>
        <PDFReader
          source={{
            uri: info.qualificationProof,
          }}
        />
        <TouchableOpacity onPress={() => setIsVisible(false)}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </Modal>


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
  icon: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 5,
  },

  attachment: {
    backgroundColor: "#808080",
    height: 45,
    marginRight: 5,
    borderColor: "#000",
    borderRadius: 5,
    justifyContent: "center",
    paddingLeft: 10,
    elevation: 2,
    marginVertical: 3,
  },
});

export default ViewDetailMentor;