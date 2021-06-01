import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image
} from "react-native";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";
import firebase from "firebase";
import { timeDifference } from "../../utils";
require("firebase/firestore");

function EditDeleteDiscussion(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [comment, setComment] = useState(null);
  const [user, setUser] = useState(null);

  const discussionId = props.route.params.did;
  // console.log(discussionId)
  const userId = firebase.auth().currentUser.uid;

  useEffect(() => {
    const { currentUser, posts, comments } = props;
    setComment(comments);
    setUser(currentUser);

    firebase
      .firestore()
      .collection("Discussion")
      .doc(props.route.params.did)
      .get()
      .then((snapshot) => {
        // console.log(snapshot.data())
        setUserPosts(snapshot.data());
      });
  }, [props.route.params.uid]);

  if (user === null) {
    return <View />;
  }

  const Delete = () => {


    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete this comment ?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            firebase
            .firestore()
            .collection("Discussion")
            .doc(discussionId)
            .delete();
          props.navigation.goBack({ data: 5 });
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };

  return (
  <ScrollView>
    <View style={styles.container}>
      <View style={{ flexDirection: "row", marginRight: 110 }}>
        <Text style={styles.title}>{userPosts.title}</Text>
        <View style={styles.icon}>
          <Icon
            styles={{ paddingHorizontal: 20 }}
            name="create-outline"
            type="ionicon"
            size={28}
            color="#000"
            onPress={() =>
              props.navigation.navigate("Edit Discussion", { did: discussionId })
            }
          />
          <Icon
            styles={{ paddingHorizontal: 20 }}
            name="trash-outline"
            type="ionicon"
            size={28}
            color="#000"
            onPress={() => Delete()}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row", paddingBottom: 10 }}>
        <Image style={styles.image} source={{ uri: userPosts.downloadURL }} />
      </View>

      <View style={styles.desc}>
        <Text style={styles.descT}>{userPosts.description}</Text>
      </View>
      <View style={{ paddingBottom: 10 }}>
        <Text style={styles.comT}>Comments:</Text>
      </View>
      <FlatList
        horizontal={false}
        extraData={comment}
        data={comment}
        renderItem={({ item }) =>
          item.discussionId === discussionId && item.userId === userId ? (
            <View>
              <View style={{ flexDirection: "row" }}>
                <View>
                  {!item.image ? (
                    <Image
                      style={{
                        marginRight: 15,
                        width: 35,
                        height: 35,
                        borderRadius: 35 / 2,
                      }}
                      source={require("../../../assets/default.jpg")}
                    />
                  ) : (
                    <Image
                      style={{
                        marginRight: 15,
                        width: 35,
                        height: 35,
                        borderRadius: 35 / 2,
                      }}
                      source={{
                        uri: item.image,
                      }}
                    />
                  )}
                </View>
                <View style={styles.commentCon}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.userT}>{item.postedBy} </Text>
                  </View>

                  <Text style={styles.userC}>{item.comment}</Text>

                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: 15,
                        marginRight: 3,
                        fontFamily: "Poppins",
                      }}
                    >
                      23
                    </Text>
                    <Icon
                      style={{ flexDirection: "row-reverse", paddingLeft: 10 }}
                      name="heart-outline"
                      type="ionicon"
                      size={20}
                      color="#000"
                    />
                    <View
                      style={{ flexDirection: "row-reverse", paddingLeft: 10 }}
                    >
                      <Icon
                        style={{
                          flexDirection: "row-reverse",
                          paddingLeft: 10,
                        }}
                        name="create-outline"
                        type="ionicon"
                        size={20}
                        color="#000"
                        onPress={() =>
                          props.navigation.navigate("EditComment", {
                            cid: item.id,
                          })
                        }
                      />
                    </View>
                    <View
                      style={{ flexDirection: "row-reverse", paddingLeft: 10 }}
                    >
                      <Icon
                        style={{
                          flexDirection: "row-reverse",
                          paddingLeft: 10,
                        }}
                        name="trash-outline"
                        type="ionicon"
                        size={20}
                        color="#000"
                        onPress={() => Delete(item.id)}
                      />
                    </View>
                    <Text>
                      ({timeDifference(new Date(), item.creation.toDate())})
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : item.discussionId === discussionId && item.userId != userId ? (
            <View style={{ flexDirection: "row" }}>
              <View>
                {!item.image ? (
                  <Image
                    style={{
                      marginRight: 15,
                      width: 35,
                      height: 35,
                      borderRadius: 35 / 2,
                    }}
                    source={require("../../../assets/default.jpg")}
                  />
                ) : (
                  <Image
                    style={{
                      marginRight: 15,
                      width: 35,
                      height: 35,
                      borderRadius: 35 / 2,
                    }}
                    source={{
                      uri: item.image,
                    }}
                  />
                )}
              </View>
              <View style={styles.commentCon}>
                <Text style={styles.userT}>{item.postedBy}</Text>

                <Text style={styles.userC}>{item.comment}</Text>

                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontSize: 15,
                      marginRight: 3,
                      fontFamily: "Poppins",
                    }}
                  >
                    23
                  </Text>
                  <Icon
                    style={{ flexDirection: "row-reverse", paddingLeft: 10 }}
                    name="heart-outline"
                    type="ionicon"
                    size={20}
                    color="#000"
                  />
                  <Text>
                    ({timeDifference(new Date(), item.creation.toDate())})
                  </Text>
                </View>
              </View>
            </View>
          ) : null
        }
      />
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={styles.blogout}
          onPress={() =>
            props.navigation.navigate("Post Comment", { did: discussionId })
          }
        >
          <Text style={styles.Ltext}>Add Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  container3: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 400,
  },
  title: {
    // marginTop:20,
    fontSize: 20,
    fontFamily: "Poppins",
    //paddingRight:190
    lineHeight: 25,
  },
  image: {
    flex: 1,
    //aspectRatio: 3 / 1,
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    height: 300,
    resizeMode: 'contain'
  },

  commentCon: {
    borderColor: "#E3562A",
    // borderTopColor: "#E3562A",
    // borderTopWidth: 2,
    // borderBottomColor: "#E3562A",
    borderBottomWidth: 5,
    width: 300,
    paddingVertical: 3,
  },

  icon: {
    // position: "relative",
    marginTop: 5,
    paddingHorizontal: 3,
    flexDirection: "row",
    // alignItems:"flex-end"
  },

  desc: {
    fontSize: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  descT: {
    fontSize: 20,
    fontFamily: "Poppins",
  },

  comT: {
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 18,
  },

  userT: {
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 15,
  },

  userC: {
    fontFamily: "Poppins",
    //   paddingLeft: 10,
    fontSize: 15,
  },

  blogout: {
    width: 160,
    height: 40,
    backgroundColor: "#E3562A",
    borderColor: "#E3562A",
    borderRadius: 16,
    marginTop: 20,
  },

  Ltext: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 15,
    justifyContent: "space-between",
    paddingTop: 8,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  comments: store.userState.comment,
});

export default connect(mapStateToProps, null)(EditDeleteDiscussion);
