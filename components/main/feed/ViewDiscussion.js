import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Share,
  ScrollView,
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

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", paddingRight: 15 }}>
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
      ),
    });
  }, []);

  const xxx = () => {
    console.log(24);
  };

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

    firebase
      .firestore()
      .collection("Comment")
      .get()
      .then((snapshot) => {
        let comment = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setComment(comment);
      });

    setData(11);
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
    // firebase.firestore().collection("Comment").doc(cid).delete();
    // console.log("delete");
    // props.navigation.goBack();

    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete this comment ?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            firebase.firestore().collection("Comment").doc(cid).delete();
            setData(4);
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
    <ScrollView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignContent: "space-between",
          paddingRight: 35,
        }}
      >
        
          <Text style={styles.title}>{userPosts.title}</Text>
       
        <View>
          {user.FavDiscussion.includes(discussionId) ? (
            <Icon
              name="bookmark"
              type="ionicon"
              size={35}
              Color="#000"
              onPress={() => RemoveFavDiscussion()}
            />
          ) : (
            <Icon
              name="bookmark-outline"
              type="ionicon"
              size={35}
              Color="#000"
              onPress={() => AddFavDiscussion()}
            />
          )}
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
                      source={require("../../../assets/newProfile.png")}
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
                      <View
                        style={{
                          flexDirection: "row",
                          flexDirection: "row",
                          alignContent: "flex-end",
                        }}
                      >
                        <Text style={styles.userT}>
                         {timeDifference(new Date(), item.creation.toDate())}
                        </Text>
                      </View>
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
                      <Text style={styles.userT}>
                      {timeDifference(new Date(), item.creation.toDate())}
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
                    source={require("../../../assets/newProfile.png")}
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
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.userC}>{item.comment}</Text>
                 
                </View>

                <View style={{ flexDirection: "row"}}>
                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        marginRight: 3,
                        fontFamily: "Poppins",
                      }}
                    >
                      {item.numOfLike}
                    </Text>
                  </View>
                  <View>
                    {item.likeBy.includes(userId) ? (
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
                    ) : (
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
                    )}
                  </View>
                  <View style={{paddingLeft:5}}>
                  <Text style={styles.userT}>
                   {timeDifference(new Date(), item.creation.toDate())}
                  </Text>

                  </View>

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
    </ScrollView>
  );
}

////(credits < 30) ? "freshman" : (credits >= 30 && credits < 60) ?"sophomore" : (credits >= 60 && credits < 90) ? "junior" : "senior"
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    marginRight: 5,
    // marginTop: 20,
    marginBottom: 5,
    // marginLeft: 20,
    // marginLeft:20
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
    fontSize: 20,
    fontFamily: "Poppins",
    lineHeight: 25,
  },
  image: {
    flex: 1,
    //aspectRatio: 3 / 1,
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    height: 300,
    resizeMode: "contain",
  },

  commentCon: {
    borderColor: "#E3562A",
    borderBottomWidth: 5,
    width: 300,
    paddingVertical: 3,
  },

  desc: {
    fontSize: 14,
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
    lineHeight: 20,
    fontSize: 15,
  },

  userT: {
    fontFamily: "Poppins",
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
