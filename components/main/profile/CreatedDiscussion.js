import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";
import { Icon } from "react-native-elements";

function Cd(props) {
  const [ownDiscussion, setOwnDiscussion] = useState([]);
  const { posts } = props;
  const userId = firebase.auth().currentUser.uid;
  //console.log(userId)

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <FlatList
        horizontal={false}
        extraData={ownDiscussion}
        data={posts}
        keyExtractor={ownDiscussion.id}
        renderItem={({ item }) =>
          item.userId == userId ? (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    props.navigation.navigate("Created Discussion", {
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
  },
});

const mapStateToProps = (store) => ({
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(Cd);
