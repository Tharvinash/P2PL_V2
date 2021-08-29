import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions
} from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import { timeDifference } from "../../../utils";
import firebase from "firebase";
require("firebase/firestore");

function LectureFeed(props) {
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

  if (post.length == 0) {
    return (
      <View style={styles.container}>
        <View style={{ paddingTop: 10 }}>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            horizontal={false}
            data={posts}
            renderItem={({ item }) =>
              FilterFeed.indexOf(item.faculty) !== -1 ? (
                <View style={styles.card}>
                  <View style={styles.cardContent}>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() =>
                        props.navigation.navigate("LectureDiscussionView", {
                          did: item.id,
                        })
                      }
                    >
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ flex: 1, justifyContent: "flex-start" }}>
                        <View style={{ flexDirection: "row", width: "100%" }}>
                          <Image
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: 35 / 2,
                              marginBottom: 10,
                            }}
                            source={{ uri: item.image }}
                          />
                          <View style={{ flex: 1, paddingLeft: 10 }}>
                            <Text style={styles.userName}>{item.postedBy}</Text>
                          </View>
                        </View>
                      </View>

                      <Text style={styles.postedTime}>
                        {timeDifference(new Date(), item.creation.toDate())}
                      </Text>
                    </View>

                      <Text numberOfLines={2} style={styles.title}>
                        {item.title}
                      </Text>
                      <Text style={styles.faculty}>{item.faculty}</Text>
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

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: 10 }}>
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
                      props.navigation.navigate("LectureDiscussionView", {
                        did: item.id,
                      })
                    }
                  >
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ flex: 1, justifyContent: "flex-start" }}>
                        <View style={{ flexDirection: "row", width: "100%" }}>
                          <Image
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: 35 / 2,
                              marginBottom: 10,
                            }}
                            source={{ uri: item.image }}
                          />
                          <View style={{ flex: 1, paddingLeft: 10 }}>
                            <Text style={styles.userName}>{item.postedBy}</Text>
                          </View>
                        </View>
                      </View>

                      <Text style={styles.postedTime}>
                        {timeDifference(new Date(), item.creation.toDate())}
                      </Text>
                    </View>

                    <Text numberOfLines={2} style={styles.title}>
                      {item.title}
                    </Text>
                    <Text style={styles.faculty}>{item.faculty}</Text>
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
  posts: store.userState.posts,
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(LectureFeed);
