import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import Modal from "react-native-modal";
import firebase from "firebase";
require("firebase/firestore");
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { timeDifference } from "../../../utils";

function Reply(props) {
  const { currentUser } = props;
  const [currentUserName, setCurrentUserName] = useState(currentUser.name);
  const [loginCurrentUser, setLoginCurrentUser] = useState(currentUser);
  const [mainCommentId, setMainCommentId] = useState(props.route.params.cid);
  const [mainComment, setMainComment] = useState([]);
  const [data, setData] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [editReplyComment, setEditReplyComment] = useState("");
  const [editReplyCommentId, setEditReplyCommentId] = useState("");
  const [authorOfRepliedSubComment, setAuthorOfRepliedSubComment] =
    useState("");
  const [idOfRepliedSubComment, setIdOfRepliedSubComment] = useState("");
  const [replyOfSubComment, setReplyOfSubComment] = useState("");
  const [newReply, setNewReply] = useState("");
  const [replyComment, setReplyComment] = useState([]);
  const [likeBy, setLikeBy] = useState(props.route.params.xxx);
  const [mainCommentAuthorName, setMainCommentAuthorName] = useState(
    props.route.params.mainCommentAuthorName
  );

  const [isEditCommentModalVisible, setEditCommentModalVisible] =
    useState(false);
  const [isEditReplyCommentModalVisible, setEditReplyCommentModalVisible] =
    useState(false);
  const [isReplyCommentModalVisible, setReplyCommentModalVisible] =
    useState(false);
  const [isReplySubCommentModalVisible, setReplySubCommentModalVisible] =
    useState(false);

  const userId = firebase.auth().currentUser.uid;
  const time = props.route.params.time;

  useEffect(() => {
    firebase
      .firestore()
      .collection("Comment")
      .doc(mainCommentId)
      .get()
      .then((snapshot) => {
        setMainComment(snapshot.data());
      });

    firebase
      .firestore()
      .collection("Comment")
      .doc(mainCommentId)
      .collection("Reply")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        let replyComment = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setReplyComment(replyComment);
      });
  }, [data]);

  useFocusEffect(
    React.useCallback(() => {
      firebase
        .firestore()
        .collection("Comment")
        .doc(mainCommentId)
        .get()
        .then((snapshot) => {
          setMainComment(snapshot.data());
        });

      firebase
        .firestore()
        .collection("Comment")
        .doc(mainCommentId)
        .collection("Reply")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let replyComment = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setReplyComment(replyComment);
        });

      setData(24);
    }, [data])
  );

  const addLike = (nol) => {
    const x = nol + 1;
    if (mainComment.likeBy.includes(userId)) {
    } else {
      mainComment.likeBy.push(userId);
    }

    firebase
      .firestore()
      .collection("Comment")
      .doc(mainCommentId)
      .update({
        numOfLike: x,
        likeBy: mainComment.likeBy,
      })
      .then(() => {
        setLikeBy(!likeBy);
      });
    setData(2);
  };

  const removeLike = (nol) => {
    const x = nol - 1;
    const indexx = mainComment.likeBy.indexOf(userId);
    if (indexx > -1) {
      mainComment.likeBy.splice(indexx, 1);
    }

    firebase
      .firestore()
      .collection("Comment")
      .doc(mainCommentId)
      .update({
        numOfLike: x,
        likeBy: mainComment.likeBy,
      })
      .then(() => {
        setLikeBy(!likeBy);
      });
    setData(3);
  };

  const Delete = () => {
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
            firebase
              .firestore()
              .collection("Comment")
              .doc(mainCommentId)
              .delete();

            props.navigation.goBack();
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

  const EditComment = () => {
    setEditComment(mainComment.comment);
    setEditCommentModalVisible(!isEditCommentModalVisible);
  };

  const EditReplyComment = (rcid) => {
    setEditReplyCommentId(rcid);
    firebase
      .firestore()
      .collection("Comment")
      .doc(mainCommentId)
      .collection("Reply")
      .doc(rcid)
      .get()
      .then((snapshot) => {
        setEditReplyComment(snapshot.data().comment);
      });
    setEditReplyCommentModalVisible(!isEditReplyCommentModalVisible);
    console.log(rcid);
  };

  const toggleEditComment = () => {
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
        .doc(mainCommentId)
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

  const toggleReplyComment = () => {
    setReplyCommentModalVisible(!isReplyCommentModalVisible);
  };

  const toggleReplyEditComment = () => {
    setEditReplyCommentModalVisible(!isEditReplyCommentModalVisible);
  };

  const toggleSubReplyComment = (id, posted) => {
    setIdOfRepliedSubComment(id);
    setAuthorOfRepliedSubComment(posted);
    setReplySubCommentModalVisible(!isReplySubCommentModalVisible);
  };

  const ReplySubComment = () => {
    if (!replyOfSubComment.trim()) {
      alert("Please Enter Comment");
      return;
    } else {
      firebase
        .firestore()
        .collection("Comment")
        .doc(mainCommentId)
        .collection("Reply")
        .add({
          comment: replyOfSubComment,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          image: loginCurrentUser.image, //current user
          likeBy: [],
          numOfLike: 0,
          postedBy: loginCurrentUser.name, // current user
          userId, // current user
          repliedTo: authorOfRepliedSubComment, // author of comment being replied
          mainCommentId: idOfRepliedSubComment, // id of comment being replied
        });

      const totalReply = mainComment.numberOfReply + 1;
      firebase.firestore().collection("Comment").doc(mainCommentId).update({
        numberOfReply: totalReply,
      });
      setReplySubCommentModalVisible(!isReplySubCommentModalVisible);
    }

    setData(55);
  };

  const ReplyComment = () => {
    if (!newReply.trim()) {
      alert("Please Enter Comment");
      return;
    } else {
      firebase
        .firestore()
        .collection("Comment")
        .doc(mainCommentId)
        .collection("Reply")
        .add({
          comment: newReply,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          image: loginCurrentUser.image,
          likeBy: [],
          numOfLike: 0,
          postedBy: loginCurrentUser.name,
          userId,
          repliedTo: mainCommentAuthorName,
          mainCommentId,
        });

      const totalReply = mainComment.numberOfReply + 1;
      firebase.firestore().collection("Comment").doc(mainCommentId).update({
        numberOfReply: totalReply,
      });
      setReplyCommentModalVisible(!isReplyCommentModalVisible);
    }

    setData(55);
  };

  const DeleteReplyComment = (rcid) => {
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
              .collection("Comment")
              .doc(mainCommentId)
              .collection("Reply")
              .doc(rcid)
              .delete();

            const totalReply = mainComment.numberOfReply - 1;
            firebase
              .firestore()
              .collection("Comment")
              .doc(mainCommentId)
              .update({
                numberOfReply: totalReply,
              });

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

  const AddLikeToReplyComment = (rcid, nol, lb) => {
    const x = nol + 1;
    if (lb.includes(userId)) {
    } else {
      lb.push(userId);
    }

    firebase
      .firestore()
      .collection("Comment")
      .doc(mainCommentId)
      .collection("Reply")
      .doc(rcid)
      .update({
        numOfLike: x,
        likeBy: lb,
      })
      .then(() => {
        console.log("done");
      });
    setData(2);
  };

  const RemoveLikeToReplyComment = (rcid, nol, lb) => {
    const x = nol - 1;
    const indexx = lb.indexOf(userId);
    if (indexx > -1) {
      lb.splice(indexx, 1);
    }

    firebase
      .firestore()
      .collection("Comment")
      .doc(mainCommentId)
      .collection("Reply")
      .doc(rcid)
      .update({
        numOfLike: x,
        likeBy: lb,
      })
      .then(() => {
        console.log("done");
      });
    setData(3);
  };

  const UploadEditSubComment = () => {
    if (!editReplyComment.trim()) {
      alert("Please Enter Comment");
      return;
    } else {
      firebase
        .firestore()
        .collection("Comment")
        .doc(mainCommentId)
        .collection("Reply")
        .doc(editReplyCommentId)
        .update({
          comment: editReplyComment,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          console.log("save");
        });

      setEditReplyCommentModalVisible(!isEditReplyCommentModalVisible);
    }

    setData(44);
  };

  const removeVerifyComment = () => {
    firebase
      .firestore()
      .collection("Comment")
      .doc(mainCommentId)
      .update({
        verify: false,
      })
      .then(() => {
        console.log("done");
      });
    setData(6);
  };

  const verifyComment = () => {
    firebase
      .firestore()
      .collection("Comment")
      .doc(mainCommentId)
      .update({
        verify: true,
      })
      .then(() => {
        console.log("done");
      });
    setData(5);
  };

  const removeVerifyReplyComment = (rcid) => {
    firebase
      .firestore()
      .collection("Comment")
      .doc(mainCommentId)
      .collection("Reply")
      .doc(rcid)
      .update({
        verify: false,
      })
      .then(() => {
        console.log("done");
      });

    setData(73);
  };

  const verifyReplyComment = (rcid) => {
    firebase
      .firestore()
      .collection("Comment")
      .doc(mainCommentId)
      .collection("Reply")
      .doc(rcid)
      .update({
        verify: true,
      })
      .then(() => {
        console.log("done");
      });
    setData(70);
  };

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
    >
      <View style={styles.container}>
        <View>
          <View style={{ flexDirection: "row" }}>
            <View>
              <Image
                style={{
                  marginRight: 15,
                  width: 35,
                  height: 35,
                  borderRadius: 35 / 2,
                }}
                source={{
                  uri: mainComment.image,
                }}
              />

              <View
                style={{
                  marginRight: 10,
                  paddingTop: 10,
                }}
              >
                {loginCurrentUser.status == 1 ? (
                  <View>
                    {mainComment.verify ? (
                      <Icon
                        name="checkmark-circle"
                        type="ionicon"
                        size={25}
                        color="#140F38"
                        onPress={() => removeVerifyComment()}
                      />
                    ) : (
                      <Icon
                        name="checkmark-circle-outline"
                        type="ionicon"
                        size={25}
                        color="#140F38"
                        onPress={() => verifyComment()}
                      />
                    )}
                  </View>
                ) : null}

                {loginCurrentUser.status == 0 ? (
                  <View>
                    {mainComment.verify ? (
                      <Icon
                        name="checkmark-circle"
                        type="ionicon"
                        size={20}
                        color="#140F38"
                      />
                    ) : null}
                  </View>
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
                <Text style={styles.userT}>{mainComment.postedBy} </Text>
                {mainComment.creation === null ? (
                  <Text style={(styles.userC, { marginRight: 20 })}>Now</Text>
                ) : (
                  <Text style={(styles.userC, { marginRight: 20 })}>
                    {time}
                  </Text>
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.userC}>{mainComment.comment}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* ------------------------------------  reply comment  ------------------------- */}
        <View style={{ marginLeft: 30, marginTop: 5 }}>
          <FlatList
            horizontal={false}
            extraData={replyComment}
            data={replyComment}
            renderItem={({ item }) => (
              <View>
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <Image
                      style={{
                        marginRight: 15,
                        width: 28,
                        height: 28,
                        borderRadius: 28 / 2,
                      }}
                      source={{
                        uri: item.image,
                      }}
                    />

                  </View>
                  <View style={styles.commentCon}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                        }}
                      >
                        <Text style={styles.userT}>{item.postedBy} </Text>
                        {item.mainCommentId !== mainCommentId &&
                        item.repliedTo !== currentUserName ? (
                          <View
                            style={{
                              flexDirection: "row",
                            }}
                          >
                            <Icon
                              style={{
                                paddingTop: 4,
                              }}
                              name="caret-forward-outline"
                              type="ionicon"
                              size={13}
                              color="#000"
                            />
                            <Text style={styles.userT}>{item.repliedTo} </Text>
                          </View>
                        ) : null}
                      </View>

                      {item.creation === null ? (
                        <Text style={(styles.userC, { marginRight: 20 })}>
                          Now
                        </Text>
                      ) : (
                        <Text
                          style={
                            (styles.userC, { marginRight: 20, paddingRight: 8 })
                          }
                        >
                          {timeDifference(new Date(), item.creation.toDate())}
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingRight: 8,
                      }}
                    >
                      <Text style={styles.userC}>{item.comment}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          />
        </View>

        {/* Edit Reply Modal */}
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

        {/* Reply Comment Modal */}
        <Modal isVisible={isReplyCommentModalVisible}>
          <View style={{ justifyContent: "center" }}>
            <View style={{ marginLeft: 8 }}>
              <TextInput
                style={styles.input}
                value={newReply}
                placeholderTextColor="#000"
                multiline={true}
                onChangeText={(newReply) => setNewReply(newReply)}
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
                  onPress={() => ReplyComment()}
                >
                  <Text style={styles.Ltext}>Reply Comment</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <TouchableOpacity
                  style={styles.blogout}
                  onPress={toggleReplyComment}
                >
                  <Text style={styles.Ltext}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Reply to Reply Comment Modal */}

        <Modal isVisible={isReplySubCommentModalVisible}>
          <View style={{ justifyContent: "center" }}>
            <View style={{ marginLeft: 8 }}>
              <TextInput
                style={styles.input}
                value={replyOfSubComment}
                placeholderTextColor="#000"
                multiline={true}
                onChangeText={(replyOfSubComment) =>
                  setReplyOfSubComment(replyOfSubComment)
                }
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
                  onPress={() => ReplySubComment()}
                >
                  <Text style={styles.Ltext}>Post Reply</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <TouchableOpacity
                  style={styles.blogout}
                  onPress={toggleSubReplyComment}
                >
                  <Text style={styles.Ltext}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Reply Comment */}

        <Modal isVisible={isEditReplyCommentModalVisible}>
          <View style={{ justifyContent: "center" }}>
            <View style={{ marginLeft: 8 }}>
              <TextInput
                style={styles.input}
                value={editReplyComment}
                placeholderTextColor="#000"
                multiline={true}
                onChangeText={(editReplyComment) =>
                  setEditReplyComment(editReplyComment)
                }
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
                  onPress={() => UploadEditSubComment()}
                >
                  <Text style={styles.Ltext}>Update Reply</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <TouchableOpacity
                  style={styles.blogout}
                  onPress={toggleReplyEditComment}
                >
                  <Text style={styles.Ltext}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
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

  title: {
    fontSize: 20,
    fontFamily: "Poppins",
    lineHeight: 20,
    fontWeight: "700",
    marginBottom: 5,
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
    fontWeight: "600",
    fontSize: 15,
  },

  userC: {
    fontFamily: "Poppins",
    lineHeight: 20,
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
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(Reply);
