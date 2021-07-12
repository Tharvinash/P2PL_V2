import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import firebase from "firebase";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";
require("firebase/firestore");
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";

function FilterFeed(props) {
  const [data, setData] = useState(0);
  const { currentUser } = props;
  const [cu, setCu] = useState(currentUser);
  const [isModalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState([]);
  const toggleSwitchFs = () => setFs((previousState) => !previousState);
  const toggleSwitchFca = () => setFca((previousState) => !previousState);
  const toggleSwitchFp = () => setFp((previousState) => !previousState);
  const toggleSwitchFol = () => setFol((previousState) => !previousState);

  const toggleSwitchFoe = () => setFoe((previousState) => !previousState);
  const toggleSwitchFod = () => setFod((previousState) => !previousState);
  const toggleSwitchFoeng = () => setFoeng((previousState) => !previousState);
  const toggleSwitchFom = () => setFom((previousState) => !previousState);

  const toggleSwitchFoanss = () => setFoanss((previousState) => !previousState);
  const toggleSwitchFobna = () => setFobna((previousState) => !previousState);
  const toggleSwitchFoena = () => setFoena((previousState) => !previousState);
  const toggleSwitchFolnl = () => setFolnl((previousState) => !previousState);

  const toggleSwitchFobe = () => setFobe((previousState) => !previousState);
  const toggleSwitchFcsit = () => setFcsit((previousState) => !previousState);
  const toggleSwitchAois = () => setAois((previousState) => !previousState);
  const toggleSwitchAoms = () => setAoms((previousState) => !previousState);

  const [fs, setFs] = useState(cu.fs);
  const [fca, setFca] = useState(cu.fca);
  const [fp, setFp] = useState(cu.fp);
  const [fol, setFol] = useState(cu.fol);

  const [foe, setFoe] = useState(cu.foe);
  const [fod, setFod] = useState(cu.fod);
  const [foeng, setFoeng] = useState(cu.foeng);
  const [fom, setFom] = useState(cu.fom);

  const [foanss, setFoanss] = useState(cu.foanss);
  const [fobna, setFobna] = useState(cu.fobna);
  const [foena, setFoena] = useState(cu.foena);
  const [folnl, setFolnl] = useState(cu.folnl);

  const [fobe, setFobe] = useState(cu.fobe);
  const [fcsit, setFcsit] = useState(cu.fcsit);
  const [aois, setAois] = useState(cu.aois);

  const [aoms, setAoms] = useState(cu.aoms);

  // useEffect(() => {
  // 	setData(1)
  //   firebase
  //     .firestore()
  //     .collection("users")
  //     .doc(firebase.auth().currentUser.uid)
  //     .get()
  //     .then((snapshot) => {
  //       if (snapshot.exists) {

  //         setCu(snapshot.data());
  //         console.log(snapshot.data())
  //       } else {
  //         console.log("does not exist");
  //       }
  //     });
  // }, [data]);

  useFocusEffect(
    React.useCallback(() => {
      firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setCu(snapshot.data());
            //console.log(snapshot.data());
          } else {
            console.log("does not exist");
          }
        });
    }, [])
  );

  const ff = [];

  const Save = async () => {
     
    //setModalVisible(!isModalVisible);
    if (fs === true) {
      ff.push("FACULTY OF SCIENCE");
    }
    if (fca === true) {
      ff.push("FACULTY OF CREATIVE ARTS");
    }
    if (fp === true) {
      ff.push("FACULTY OF PHARMACY");
    }
    if (fol === true) {
      ff.push("FACULTY OF LAW");
    }
    if (foe === true) {
      ff.push("FACULTY OF EDUCATION");
    }
    if (fod === true) {
      ff.push("FACULTY OF DENTISTRY");
    }
    if (foeng === true) {
      ff.push("FACULTY OF ENGINEERING");
    }
    if (fom === true) {
      ff.push("FACULTY OF MEDICINE");
    }
    if (foanss === true) {
      ff.push("FACULTY OF ARTS AND SOCIAL SCIENCE");
    }
    if (fobna === true) {
      ff.push("FACULTY OF BUSINESS AND ACCOUNTANCY");
    }
    if (foena === true) {
      ff.push("FACULTY OF ECONOMICS AND ADMINISTRATION");
    }
    if (folnl === true) {
      ff.push("FACULTY OF LANGUAGE AND LINGUISTICS");
    }
    if (fobe === true) {
      ff.push("FACULTY OF BUILT ENVIRONMENT");
    }
    if (fcsit === true) {
      ff.push("FACULTY OF COMPUTER SCIENCE AND INFORMATION TECHNOLOGY");
      console.log("fcsit")
    }
    if (aois === true) {
      ff.push("ACADEMY OF ISLAMIC STUDIES");
    }
    if (aoms === true) {
      ff.push("ACADEMY OF MALAY STUDIES");
    }
console.log(ff)
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        filteredFeed: ff,
        fs,
        fca,
        fp,
        fol,
        foe,
        fod,
        foeng,
        fom,
        foanss,
        fobna,
        foena,
        folnl,
        fobe,
        fcsit,
        aois,
        aoms,
      })
      .then(() => {
        props.navigation.navigate("Feed")
      });
     setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <Text style={styles.title}>
              You may filter your feed according to your need
            </Text>
            <View style={{ marginLeft: -60 }}>
              <Icon
                name="save-outline"
                type="ionicon"
                size={30}
                color="#FFF"
                onPress={() => Save()}
              />
            </View>
          </View>

          <View style={styles.filterContainer}>
            <Text style={styles.faculty}>FACULTY OF SCIENCE</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={fs ? "#E3562A" : "#140F38"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchFs}
              value={fs}
            />
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.faculty}>FACULTY OF CREATIVE ARTS</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={fca ? "#E3562A" : "#140F38"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchFca}
              value={fca}
            />
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.faculty}>FACULTY OF PHARMACY</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={fp ? "#E3562A" : "#140F38"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchFp}
              value={fp}
            />
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.faculty}>FACULTY OF LAW</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={fol ? "#E3562A" : "#140F38"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchFol}
              value={fol}
            />
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.faculty}>FACULTY OF EDUCATION</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={foe ? "#E3562A" : "#140F38"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchFoe}
              value={foe}
            />
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.faculty}>FACULTY OF DENTISTRY</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={fod ? "#E3562A" : "#140F38"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchFod}
              value={fod}
            />
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.faculty}>FACULTY OF ENGINEERING</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={foeng ? "#E3562A" : "#140F38"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchFoeng}
              value={foeng}
            />
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.faculty}>FACULTY OF MEDICINE</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={fom ? "#E3562A" : "#140F38"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchFom}
              value={fom}
            />
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.faculty}>
              FACULTY OF ARTS AND SOCIAL SCIENCE
            </Text>
            <View style={{ marginLeft: -50 }}>
              <Switch
                trackColor={{ false: "#767577", true: "#767577" }}
                thumbColor={foanss ? "#E3562A" : "#140F38"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchFoanss}
                value={foanss}
              />
            </View>
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.faculty}>
              FACULTY OF BUSINESS AND ACCOUNTANCY
            </Text>
            <View style={{ marginLeft: -50 }}>
              <Switch
                trackColor={{ false: "#767577", true: "#767577" }}
                thumbColor={fobna ? "#E3562A" : "#140F38"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchFobna}
                value={fobna}
              />
            </View>
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.faculty}>
              FACULTY OF ECONOMICS AND ADMINISTRATION
            </Text>
            <View style={{ marginLeft: -50 }}>
              <Switch
                trackColor={{ false: "#767577", true: "#767577" }}
                thumbColor={foena ? "#E3562A" : "#140F38"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchFoena}
                value={foena}
              />
            </View>
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.faculty}>
              FACULTY OF LANGUAGE AND LINGUISTICS
            </Text>
            <View style={{ marginLeft: -50 }}>
              <Switch
                trackColor={{ false: "#767577", true: "#767577" }}
                thumbColor={folnl ? "#E3562A" : "#140F38"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchFolnl}
                value={folnl}
              />
            </View>
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.faculty}>FACULTY OF BUILT ENVIRONMENT</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={fobe ? "#E3562A" : "#140F38"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchFobe}
              value={fobe}
            />
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.faculty}>
              FACULTY OF COMPUTER SCIENCE AND INFORMATION TECHNOLOGY
            </Text>
            <View style={{ marginLeft: -50 }}>
              <Switch
                trackColor={{ false: "#767577", true: "#767577" }}
                thumbColor={fcsit ? "#E3562A" : "#140F38"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchFcsit}
                value={fcsit}
              />
            </View>
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.faculty}>ACADEMY OF ISLAMIC STUDIES</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={aois ? "#E3562A" : "#140F38"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchAois}
              value={aois}
            />
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.faculty}>ACADEMY OF MALAY STUDIES</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={aoms ? "#E3562A" : "#140F38"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchAoms}
              value={aoms}
            />
          </View>
        </View>
      </ScrollView>
      <Modal isVisible={isModalVisible}>
          <View style={{ justifyContent: "center",flex:1 }}>
          
          <ActivityIndicator size="large" color="#E3562A" />
          </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#140F38",
    // justifyContent: "center",
    alignItems: "center",
  },

  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginVertical: 10,
    backgroundColor: "#FFF",
    borderRadius: 16,
    height: 48,
    width: 350,
  },

  faculty: {
    color: "#000",
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 18,
    paddingLeft: 10,
  },

  title: {
    fontFamily: "Poppins",
    fontSize: 22,
    margin: 20,
    color: "#fff",
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
    fontSize: 18,
    justifyContent: "space-between",
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(FilterFeed);