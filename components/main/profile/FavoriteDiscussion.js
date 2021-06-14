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
import { bindActionCreators } from "redux"; //call  function from action
import { fetchUserPosts } from "../../../redux/actions/index";
import { useFocusEffect } from "@react-navigation/native";
import { SwipeListView } from "react-native-swipe-list-view";

function FavDiscussion(props) {
  const [userPosts, setUserPosts] = useState([]);
  const userId = firebase.auth().currentUser.uid;

  // useEffect(() => {
  //   props.fetchUserPosts();
  //   const { posts } = props;
  //   setUserPosts(posts);
  //   // console.log(posts)
  //   // console.log(userId);
  // }, [props.route.params.uid]);

  useFocusEffect(
    React.useCallback(() => {
      props.fetchUserPosts();
      const { posts } = props;
      setUserPosts(posts);

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
const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUserPosts }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(FavDiscussion);
