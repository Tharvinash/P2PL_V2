import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import firebase from "firebase";
require("firebase/firestore");
import defaultImage from "../../../assets/default.jpg";
import DropDownPicker from "react-native-dropdown-picker";

function Profile(props) {
  const userId = firebase.auth().currentUser.uid;
  const { currentUser, posts } = props;
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(currentUser);
  const [image, setImage] = useState(defaultImage);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Edit Personal Info", value: "pi" },
    { label: "Edit Password", value: "ep" },
  ]);

  const onLogout = () => {
    firebase.auth().signOut();
  };

  useFocusEffect(
    React.useCallback(() => {
      firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
            //console.log(snapshot.data())
          } else {
            console.log("does not exist");
          }
        });
    }, [])
  );

  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);

  //   firebase
  //     .firestore()
  //     .collection("users")
  //     .doc(firebase.auth().currentUser.uid)
  //     .get()
  //     .then((snapshot) => {
  //       if (snapshot.exists) {
  //         setUser(snapshot.data());
  //         //console.log(snapshot.data())
  //       } else {
  //         console.log("does not exist");
  //       }
  //     });
  //   setRefreshing(false);

  // }, [refreshing]);

  if (currentUser === null) {
    return <View />;
  }

  const xxx = (x) => {
    if (x === "pi") {
      props.navigation.navigate("EditProfile", { uid: userId });
    }
    if (x === "ep") {
      props.navigation.navigate("Change Password");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ alignItems: "center", marginBottom: 20, marginTop: 10 }}>
        <Image
          style={{
            width: 140,
            height: 140,
            borderRadius: 140 / 2,
            marginBottom: 10,
          }}
          source={{
            uri: user.image,
          }}
        />
      </View>

      <View>
        <Text style={styles.us}>{user.name}</Text>
      </View>
      <View style={styles.bb}>
        <TouchableOpacity style={styles.title}>
          <Text style={styles.Ltext} resizeMode="cover">
            Beginner
          </Text>
          <Icon
            style={styles.arrow}
            name="chevron-forward-outline"
            type="ionicon"
            size={20}
            color="#3C3A36"
          />
        </TouchableOpacity>

        <DropDownPicker
          placeholder="Edit"
          dropDownContainerStyle={{
            width: 160,
            right: 103,
            paddingTop: 5,
          }}
          style={styles.dropdown}
          placeholderStyle={{
            color: "#000000",
            textAlign: "center",
            fontFamily: "Poppins",
            fontWeight: "700",
            fontSize: 15,
            justifyContent: "space-between",
          }}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          onChangeValue={(value) => {
            xxx(value);
          }}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          props.navigation.navigate("Created Discussions", { data: 123 })
        }
      >
        <Text style={styles.text}>Created Discussion</Text>
        <Icon
          style={styles.arrow}
          name="chevron-forward-outline"
          type="ionicon"
          size={20}
          color="#3C3A36"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          props.navigation.navigate("Favorite Discussion", { uid: userId })
        }
      >
        <Text style={styles.text}>Favorite Discussion</Text>
        <Icon
          style={styles.arrow}
          name="chevron-forward-outline"
          type="ionicon"
          size={20}
          color="#3C3A36"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => props.navigation.navigate("Filter Feed")}
      >
        <Text style={styles.text}>Filter Feed</Text>
        <Icon
          style={styles.arrow}
          name="chevron-forward-outline"
          type="ionicon"
          size={20}
          color="#3C3A36"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => props.navigation.navigate("Activity Tracking")}
      >
        <Text style={styles.text}>Discussion Room</Text>
        <Icon
          style={styles.arrow}
          name="chevron-forward-outline"
          type="ionicon"
          size={20}
          color="#3C3A36"
        />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#140F38",
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "flex-end",
  },

  arrow: {
    alignItems: "flex-end",
    left: 20,
  },

  logout: {
    width: 160,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderColor: "#E3562A",
    borderRadius: 16,
    marginTop: 5,
  },

  Ltext: {
    color: "#000000",
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 15,
    justifyContent: "space-between",
    paddingTop: 8,
  },

  title: {
    width: 160,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderColor: "#E3562A",
    borderRadius: 16,
    marginTop: 10,
    left: 100,
    marginBottom: 10,
  },

  edit: {
    width: 160,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderColor: "#E3562A",
    borderRadius: 16,
    marginTop: 10,
    marginHorizontal: 10,
  },

  dropdown: {
    width: 160,
    height: 42,
    left: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,

    marginHorizontal: 110,
  },

  bb: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "space-around",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imageContainer: {
    borderRadius: (Dimensions.get("window").width * 0.7) / 2,
    borderColor: "black",
    borderWidth: 3,
    width: Dimensions.get("window").width * 0.3,
    height: Dimensions.get("window").width * 0.3,
    overflow: "hidden",
    marginVertical: Dimensions.get("window").height / 30,
  },

  us: {
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
    color: "#fff",
    fontSize: 24,
    marginTop: -20,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(Profile);
