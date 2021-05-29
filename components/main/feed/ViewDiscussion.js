import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  Share,
} from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import firebase from "firebase";
import * as Linking from "expo-linking";

import { timeDifference } from "../../utils";
require("firebase/firestore");

function ViewDiscussion(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState(null);
  const [data, setData] = useState(null);
  const [discussionId, setDiscussionId] = useState(props.route.params.did);
  // const discussionId = props.route.params.did;
  const userId = firebase.auth().currentUser.uid;


  // function handleDeepLink(event) {
  //     let data = Linking.parse(event.url);
  //     setData(data);
  // }

  // useEffect(() => {
  //     Linking.addEventListener("url", handleDeepLink);
  //     return () => {
  //     Linking.removeEventListener("url");
  //     };
  // }, []);

  useEffect(() => {

    const { currentUser, comments } = props;
    if (currentUser.FavDiscussion !== null) {
      setUser(currentUser);
    }
    setUser(currentUser);
    if (props.route.params.did) {
      setDiscussionId(props.route.params.did);
    }

    firebase
      .firestore()
      .collection("Discussion")
      .doc(props.route.params.did)
      .get()
      .then((snapshot) => {
        setUserPosts(snapshot.data());
  
      });

      firebase.firestore()
      .collection("Comment")
      .get()
      .then((snapshot) => {
          let comment = snapshot.docs.map(doc => {
              const data = doc.data();
              const id = doc.id;
              return { id, ...data }
          })
          setComment(comment)
      })

      setData(11)
  }, [props.currentUser, props.route.params.did, data]);

  if (user === null) {
    return <View />;
  }

  const AddFavDiscussion = () => {
    const FD = user.FavDiscussion;

    if (FD.includes(discussionId)) {
      console.log("already added to fav");
    } else {
      FD.push(discussionId);
    }

    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        FavDiscussion: FD,
      })
      .then(() => {
        console.log("done");
      });

    const FB = [];
    FB.push(userId);
    firebase
      .firestore()
      .collection("Discussion")
      .doc(discussionId)
      .update({
        favBy: FB,
      })
      .then(() => {
        console.log("done");
      });
    setData(1);
  };

  const RemoveFavDiscussion = () => {
    const FD = user.FavDiscussion;


    const index = FD.indexOf(discussionId);
    if (index > -1) {
      FD.splice(index, 1);
    }

    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        FavDiscussion: FD,
      })
      .then(() => {
        console.log("done");
      });

    const FB = userPosts.favBy;


    const indexx = FB.indexOf(userId);
    if (indexx > -1) {
      FB.splice(indexx, 1);
    }

    firebase
      .firestore()
      .collection("Discussion")
      .doc(discussionId)
      .update({
        favBy: FB,
      })
      .then(() => {
        console.log("done");
      });
    setData(0);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: userPosts.description,
        title: userPosts.title,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const Delete = (cid) => {

    firebase.firestore().collection("Comment").doc(cid).delete();
    console.log("delete");
    props.navigation.goBack();
  };

  const addLike = (cid, nol, lb) => {
    const x = nol + 1;
    if (lb.includes(userId)) {
    } else {
      lb.push(userId);
    }

    firebase
      .firestore()
      .collection("Comment")
      .doc(cid)
      .update({
        numOfLike: x,
        likeBy: lb,
      })
      .then(() => {
        console.log("done");
      });
    setData(2);
  };

  const removeLike = (cid, nol, lb) => {
    const x = nol - 1;
    const indexx = lb.indexOf(userId);
    if (indexx > -1) {
      lb.splice(indexx, 1);
    }

    firebase
      .firestore()
      .collection("Comment")
      .doc(cid)
      .update({
        numOfLike: x,
        likeBy: lb,
      })
      .then(() => {
        console.log("done");
      });
    setData(3);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", marginRight: 110 }}>
        <Text style={styles.title}>{userPosts.title}</Text>
        <View style={styles.icon}>
          {user.FavDiscussion.includes(discussionId) ? (
            <Icon
              name="bookmark"
              type="ionicon"
              size={30}
              Color="#000"
              onPress={() => RemoveFavDiscussion()}
            />
          ) : (
            <Icon
              name="bookmark-outline"
              type="ionicon"
              size={30}
              Color="#000"
              onPress={() => AddFavDiscussion()}
            />
          )}

          <Icon
            name="alert-circle-outline"
            type="ionicon"
            size={30}
            color="#000"
          />
          <Icon
            name="share-social-outline"
            type="ionicon"
            size={30}
            color="#000"
            onPress={() => onShare()}
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

                  {item.likeBy.includes(userId) ? (
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontSize: 15,
                          marginRight: 3,
                          fontFamily: "Poppins",
                        }}
                      >
                        {item.numOfLike}
                      </Text>
                      <Icon
                        style={{
                          flexDirection: "row-reverse",
                          paddingLeft: 10,
                        }}
                        name="heart"
                        type="ionicon"
                        size={20}
                        color="#000"
                        onPress={() =>
                          removeLike(item.id, item.numOfLike, item.likeBy)
                        }
                      />
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
                      <Text>
                        ({timeDifference(new Date(), item.creation.toDate())})
                      </Text>
                    </View>
                  ) : (
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontSize: 15,
                          marginRight: 3,
                          fontFamily: "Poppins",
                        }}
                      >
                        {item.numOfLike}
                      </Text>
                      <Icon
                        style={{
                          flexDirection: "row-reverse",
                          paddingLeft: 10,
                        }}
                        name="heart-outline"
                        type="ionicon"
                        size={20}
                        color="#000"
                        onPress={() =>
                          addLike(item.id, item.numOfLike, item.likeBy)
                        }
                      />
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
                      <Text>
                        ({timeDifference(new Date(), item.creation.toDate())})
                      </Text>
                    </View>
                  )}
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
                    {item.numOfLike}
                  </Text>
                  {item.likeBy.includes(userId) ? (
                    <Icon
                      style={{ flexDirection: "row-reverse", paddingLeft: 10 }}
                      name="heart"
                      type="ionicon"
                      size={20}
                      color="#000"
                      onPress={() =>
                        removeLike(item.id, item.numOfLike, item.likeBy)
                      }
                    />
                  ) : (
                    <Icon
                      style={{ flexDirection: "row-reverse", paddingLeft: 10 }}
                      name="heart-outline"
                      type="ionicon"
                      size={20}
                      color="#000"
                      onPress={() =>
                        addLike(item.id, item.numOfLike, item.likeBy)
                      }
                    />
                  )}

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
  );
}

////(credits < 30) ? "freshman" : (credits >= 30 && credits < 60) ?"sophomore" : (credits >= 60 && credits < 90) ? "junior" : "senior"
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

export default connect(mapStateToProps, null)(ViewDiscussion);
