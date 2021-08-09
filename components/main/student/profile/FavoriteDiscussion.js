import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";
import DiscussinCard from "../../component/discussionCard";
import { useFocusEffect } from "@react-navigation/native";

function FavDiscussion(props) {
  const [userPosts, setUserPosts] = useState([]);
  const userId = firebase.auth().currentUser.uid;

  useEffect(() => {
    firebase
      .firestore()
      .collection("Discussion")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUserPosts(posts);
      });
  }, [props.route.params.uid]);

  useFocusEffect(
    React.useCallback(() => {
      firebase
        .firestore()
        .collection("Discussion")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setUserPosts(posts);
        });
    }, [])
  );

  const anyAdult = userPosts.some((person) => person.favBy.includes(userId));

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <FlatList
        horizontal={false}
        extraData={userPosts}
        data={userPosts}
        keyExtractor={(userPosts) => userPosts.id}
        renderItem={({ item }) =>
          item.favBy.includes(userId) ? (
            <DiscussinCard
              title={item.title}
              faculty={item.faculty}
              onSelect={() =>
                props.navigation.navigate("Discussion", {
                  did: item.id,
                })
              }
            />
          ) : null
        }
      />
      {anyAdult === true ? null : (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text>No discussion has been added to favourite</Text>
        </View>
      )}
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

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
});

export default connect(mapStateToProps)(FavDiscussion);
