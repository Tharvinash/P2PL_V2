import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";

import { connect } from "react-redux";
import { timeDifference } from "../../../utils";
import firebase from "firebase";
require("firebase/firestore");

function Feed(props) {
  const { posts, currentUser } = props;

  if (currentUser === null || currentUser.filteredFeed === null) {
    return <View />;
  }

  const [post, setPost] = useState(posts);
  const [refreshing, setRefreshing] = useState(false);
  const [FilterFeed, setCu] = useState(currentUser.filteredFeed);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    firebase
      .firestore()
      .collection("Discussion")
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
          renderItem={({ item }) =>
            FilterFeed.indexOf(item.faculty) !== -1 ? (
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() =>
                      props.navigation.navigate("Discussion", {
                        did: item.id,
                      })
                    }
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        style={{
                          width: 35,
                          height: 35,
                          borderRadius: 35 / 2,
                          marginBottom: 10,
                        }}
                        source={{ uri: item.image }}
                      />

                      <View
                        style={{
                          marginLeft: 10,
                          marginTop: 8,
                          flexDirection: "row",
                        }}
                      >
                        <Text style={styles.userName}>{item.postedBy}</Text>
                      </View>
                    </View>

                    <Text numberOfLines={2} style={styles.title}>
                      {item.title}
                    </Text>
                    <Text style={styles.faculty}>{item.faculty}</Text>
                    <Text style={styles.postedTime}>
                      Posted:{" "}
                      {timeDifference(new Date(), item.creation.toDate())}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null
          }
        />
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

  button: {
    alignItems: "center",
    backgroundColor: "#E3562A",
    padding: 14,
    borderRadius: 20,
  },
  text: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
  },

  image: {
    flex: 1,
    aspectRatio: 3 / 1,
  },
  postedTime: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Poppins",
  },

  userName: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins",
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

  gridItem: {
    flex: 1,
    margin: 15,
    width: 340,
    height: 114,
    borderRadius: 16,
    // overflow: Platform.OS ==='android' && Platform.Version>=21 ? "hidden" : 'visible',
    elevation: 5,
    backgroundColor: "#003565",
  },

  cardContent: {
    marginVertical: 10,
    marginHorizontal: 18,
  },

  appLayout: {
    borderBottomColor: "#fff",
    //  height: 37,
    left: -35,
    // right: 80,
    top: 75,
    borderBottomColor: "white",
    borderBottomWidth: 1,
    marginBottom: 5,
  },

  app: {
    fontFamily: "Poppins-MediumItalic",
    fontSize: 20,
    color: "#fff",
    justifyContent: "flex-start",
  },

  line: {
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
  },

  container2: {
    padding: 15,
    justifyContent: "space-around",
    alignItems: "flex-start",
  },

  bell: {
    position: "absolute",
    width: 30,
    height: 30,
    left: 325,
    top: 59,
    // paddingLeft:10
  },

  search: {
    position: "absolute",
    width: 30,
    height: 30,
    left: 290,
    top: 59,
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
    lineHeight: 32,
  },
});

const mapStateToProps = (store) => ({
  posts: store.userState.posts,
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(Feed);
