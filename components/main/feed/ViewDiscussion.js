import React, { useState, useEffect, useLayoutEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
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
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-elements";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import firebase from "firebase";
import * as Linking from "expo-linking";
import Images from "react-native-scalable-image";

import { timeDifference } from "../../utils";
import { RefreshControlBase } from "react-native";
require("firebase/firestore");

function ViewDiscussion(props) {
  const { currentUser, options } = props;
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditCommentModalVisible, setEditCommentModalVisible] =
    useState(false);
  const [commentId, setCommentId] = useState(null);
  const [isReportVisible, setReportVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newOption, setOption] = useState(options);
  const [editComment, setEditComment] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState(null);
  const [data, setData] = useState(null);
  const [discussionId, setDiscussionId] = useState(props.route.params.did);
  // const discussionId = props.route.params.did;
  const userId = firebase.auth().currentUser.uid;
  const postedBy = currentUser.name;

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", paddingRight: 15 }}>
          <Icon
            name="alert-circle-outline"
            type="ionicon"
            size={30}
            color="#000"
            onPress={() => toggleReport()}
          />
          <TouchableOpacity>
            <Icon
              name="share-social-outline"
              type="ionicon"
              size={30}
              color="#000"
              onPress={() => onShare()}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);
  // props.navigation.setParams({ toggleReport: toggleReport })
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
      .orderBy("creation", "asc")
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

  useFocusEffect(
    React.useCallback(() => {
    firebase
      .firestore()
      .collection("Comment")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        let comment = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setComment(comment);
      });
    }, [])
  );

  if (user === null) {
    return <View />;
  }

  const xxx = () => {
    console.log(24);
  };

  const sendReport = (rid) => {
    firebase
      .firestore()
      .collection("ReportedDiscussion")
      .add({
        reportedBy: userId,
        Reason: rid,
        reportedDiscussion: discussionId,
        discussionTitle: userPosts.title,
        timeReported: firebase.firestore.FieldValue.serverTimestamp(),
        discussionPostedBy: userPosts.userId,
      })
      .then(function () {
        setReportVisible(!isReportVisible);
      });
  };
  const toggleEditComment = () => {
    setEditCommentModalVisible(!isEditCommentModalVisible);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleReport = () => {
    setReportVisible(!isReportVisible);
  };

  const UploadComment = () => {
    if (!newComment.trim()) {
      alert("Please Enter Comment");
      return;
    } else {
      firebase
        .firestore()
        .collection("Comment")
        .add({
          userId,
          postedBy,
          discussionId,
          comment: newComment,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          likeBy: [],
          numOfLike: 0,
        })
        .then(function () {
          setModalVisible(!isModalVisible);
        });
      setData(57);
    }
  };

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

  const EditComment = (cid) => {
    setCommentId(cid);
    firebase
      .firestore()
      .collection("Comment")
      .doc(cid)
      .get()
      .then((snapshot) => {
        setEditComment(snapshot.data().comment);
      });
    setEditCommentModalVisible(!isEditCommentModalVisible);
  };

  const uploadUpdatedComment = () => {
    if (!editComment.trim()) {
      alert("Please Enter Comment");
      return;
    } else {
      firebase
        .firestore()
        .collection("Comment")
        .doc(commentId)
        .update({
          comment: editComment,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          console.log("save");
        });
      setEditCommentModalVisible(!isEditCommentModalVisible);
    }

    setData(88);
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
        <View>
          <Text style={styles.title}>{userPosts.title}</Text>
        </View>

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

      {userPosts.downloadURL && (
        <View style={{ flexDirection: "row", paddingBottom: 10, justifyContent:"center"}}>
          {/* <Image style={styles.image} source={{ uri: userPosts.downloadURL }} /> */}
          <Images
            width={Dimensions.get("window").width} // height will be calculated automatically
            source={{ uri: userPosts.downloadURL }}
          />
        </View>
      )}

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
          item.discussionId === discussionId ? (
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
                  <View
                    style={{
                      marginRight: 10,
                      paddingTop: 10,
                    }}
                  >
                    {item.verify ? (
                      <Icon
                        name="checkmark-circle"
                        type="ionicon"
                        size={25}
                        color="#140F38"
                      />
                    ) : null}
                  </View>
                </View>
                <View style={styles.commentCon}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.userT}>{item.postedBy} </Text>
                    {item.creation === null ? (
                      <Text style={(styles.userC, { marginRight: 20 })}>
                        Now
                      </Text>
                    ) : (
                      <Text style={(styles.userC, { marginRight: 20 })}>
                        {timeDifference(new Date(), item.creation.toDate())}
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.userC}>{item.comment}</Text>
                  </View>

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

                      {item.userId === userId ? (
                        <View style={{ flexDirection: "row" }}>
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
                            onPress={() => EditComment(item.id)}
                          />
                        </View>
                      ) : null}
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
                      {item.userId === userId ? (
                        <View style={{ flexDirection: "row" }}>
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
                            onPress={() => EditComment(item.id)}
                          />
                        </View>
                      ) : null}
                    </View>
                  )}
                </View>
              </View>
            </View>
          ) : null
        }
      />
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity style={styles.blogout} onPress={toggleModal}>
          <Text style={styles.Ltext}>Add Comment</Text>
        </TouchableOpacity>

        <Modal isVisible={isModalVisible}>
          <View style={{ justifyContent: "center" }}>
            <View style={{ marginLeft: 8 }}>
              <TextInput
                style={styles.input}
                placeholder="Add comments here"
                placeholderTextColor="#000"
                multiline={true}
                onChangeText={(newComment) => setNewComment(newComment)}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "space-between",
              }}
            >
              <View
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <TouchableOpacity
                  style={styles.blogout}
                  onPress={() => UploadComment()}
                >
                  <Text style={styles.Ltext}>Add Comment</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <TouchableOpacity style={styles.blogout} onPress={toggleModal}>
                  <Text style={styles.Ltext}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal isVisible={isEditCommentModalVisible}>
          <View style={{ justifyContent: "center" }}>
            <View style={{ marginLeft: 8 }}>
              <TextInput
                style={styles.input}
                value={editComment}
                placeholderTextColor="#000"
                multiline={true}
                onChangeText={(editComment) => setEditComment(editComment)}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "space-between",
              }}
            >
              <View
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <TouchableOpacity
                  style={styles.blogout}
                  onPress={() => uploadUpdatedComment()}
                >
                  <Text style={styles.Ltext}>Update Comment</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <TouchableOpacity
                  style={styles.blogout}
                  onPress={toggleEditComment}
                >
                  <Text style={styles.Ltext}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal isVisible={isReportVisible}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.titley}>Why are you reporting this post</Text>
            <FlatList
              horizontal={false}
              extraData={newOption}
              data={newOption}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => sendReport(item.Option)}
                >
                  <View style={styles.card}>
                    <View style={styles.cardContent}>
                      <Text style={styles.titlex}>{item.Option}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={styles.blogout} onPress={toggleReport}>
              <Text style={styles.Ltext}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    // marginTop: 20,
    marginBottom: 5,
    // marginLeft: 20,
    // marginLeft:20
  },
  container3: {
    justifyContent: "center",
    alignItems: "center",
  },
  titlex: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Poppins",
    paddingVertical: 0,
    //  marginVertical: -5,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  titley: {
    color: "#fff",
    fontSize: 25,
    fontFamily: "Poppins",
    paddingVertical: 0,
    //  marginVertical: -5,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    fontWeight: "700",
    marginBottom: 20,
  },

  card: {
    borderRadius: 16,
    elevation: 5,
    backgroundColor: "#140F38",
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

  input: {
    height: 60,
    borderColor: "#E3562A",
    borderWidth: 1,
    backgroundColor: "#FFF",
    width: 340,
    borderRadius: 12,
    padding: 10,
    fontFamily: "Poppins",
  },

  logo: {
    width: 300,
    height: 400,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins",
    lineHeight: 20,
    fontWeight: "700",
    marginBottom: 5,
  },
  image: {
    flex: 1,
    //aspectRatio: 3 / 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
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
    lineHeight: 25,
    fontFamily: "Poppins",
    marginTop: 10,
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
    width: 140,
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
  options: store.userState.option,
});

export default connect(mapStateToProps, null)(ViewDiscussion);
