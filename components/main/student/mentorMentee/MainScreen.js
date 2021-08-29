import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SpeedDial } from "react-native-elements";
import { connect } from "react-redux";
import { timeDifference } from "../../../utils";
import firebase from "firebase";
require("firebase/firestore");

function MainScreen(props) {
  const { discussionroom, currentUser } = props;

  if (currentUser === null || currentUser.filteredFeed === null) {
    return <View />;
  }

  const [post, setPost] = useState(discussionroom);
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    firebase
      .firestore()
      .collection("DiscussionRoom")
      .orderBy("creation", "desc")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setPost(posts);
        setRefreshing(false);
      });

    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setCu(snapshot.data().filteredFeed);
        } else {
          console.log("does not exist");
        }
      });
    setRefreshing(false);
  }, [refreshing]);

  return (
    <View style={styles.container}>
      <View style={{ margin: 8 }}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          horizontal={false}
          data={post}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    props.navigation.navigate("View Room", {
                      did: item.id,
                    })
                  }
                >
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1, justifyContent: "flex-start" }}>
                      <View style={{ flexDirection: "row", width: "100%" }}>
                        <View style={{ flex: 1 }}>
                          <Text numberOfLines={2} style={styles.title}>
                            {item.title}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <Text style={styles.postedTime}>
                      {timeDifference(new Date(), item.creation.toDate())}
                    </Text>
                  </View>

                  <Text style={styles.faculty}>{item.description}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <SpeedDial
          isOpen={open}
          icon={{ name: "edit", color: "#fff" }}
          openIcon={{ name: "close", color: "#fff" }}
          onOpen={() => setOpen(!open)}
          onClose={() => setOpen(!open)}
        >
          <SpeedDial.Action
            icon={{ name: "add", color: "#fff" }}
            title="Request To Be Mentor"
            onPress={() => props.navigation.navigate("RequestToBeMentor")}
          />
          <SpeedDial.Action
            icon={{ name: "add", color: "#fff" }}
            title="Request For Mentor"
            onPress={() => props.navigation.navigate("RequestForMentor")}
          />
        </SpeedDial>
      </View>
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

  image: {
    flex: 1,
    aspectRatio: 3 / 1,
  },
  postedTime: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins",
  },

  userName: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Poppins",
  },

  card: {
    //16
    borderRadius: Dimensions.get("window").width / 24.5,
    elevation: 5,
    backgroundColor: "#003565",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    width: Dimensions.get("window").width * 0.95,
  },

  cardContent: {
    marginVertical: 10,
    marginHorizontal: 18,
  },

  faculty: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins",
  },

  title: {
    color: "#fff",
    fontSize: 25,
    fontFamily: "Poppins",
    lineHeight: 35,
  },
});

const mapStateToProps = (store) => ({
  discussionroom: store.userState.discussionroom,
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(MainScreen);
