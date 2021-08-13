import React, { useState, useEffect, useLayoutEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Animated,
  ScrollView,
  Dimensions,
  LogBox,
  ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-elements";
import MentionsTextInput from "react-native-mentions";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import firebase from "firebase";
import Images from "react-native-scalable-image";
import { timeDifference } from "../../../utils";
require("firebase/firestore");

function ViewRoom(props) {
  const { currentUser } = props;
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditCommentModalVisible, setEditCommentModalVisible] =
    useState(false);
  const [commentId, setCommentId] = useState(null);
  const [isReportVisible, setReportVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editComment, setEditComment] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState("");
  const [data, setData] = useState(null);
  const [cu, setCu] = useState(currentUser);
  const [keyword, setKeyword] = useState("");
  const [caption, setCaption] = useState("");
  const [datas, setDatas] = useState("");
  const [discussionId, setDiscussionId] = useState(props.route.params.did);
  const userId = firebase.auth().currentUser.uid;
  const postedBy = currentUser.name;
  const [animatePress, setAnimatePress] = useState(new Animated.Value(1));

  //   useLayoutEffect(() => {
  //     props.navigation.setOptions({
  //       headerRight: () => (
  //         <View style={{ flexDirection: "row", paddingRight: 15 }}>
  //           <TouchableOpacity>
  //             <Icon
  //               name="alert-circle-outline"
  //               type="ionicon"
  //               size={30}
  //               color="#000"
  //               onPress={() => {
  //                 toggleReport();
  //               }}
  //             />
  //           </TouchableOpacity>

  //           <TouchableOpacity>
  //             <Icon
  //               name="share-social-outline"
  //               type="ionicon"
  //               size={30}
  //               color="#000"
  //               onPress={() => {
  //                 onShare();
  //               }}
  //             />
  //           </TouchableOpacity>
  //         </View>
  //       ),
  //     });
  //   }, [data]);
  // props.navigation.setParams({ toggleReport: toggleReport })
  useEffect(() => {
    LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);
    const { currentUser } = props;
    if (currentUser.FavDiscussion !== null) {
      setUser(currentUser);
    }
    setUser(currentUser);
    if (props.route.params.did) {
      setDiscussionId(props.route.params.did);
    }

    firebase
      .firestore()
      .collection("DiscussionRoom")
      .doc(props.route.params.did)
      .get()
      .then((snapshot) => {
        setUserPosts(snapshot.data());
      });

    firebase
      .firestore()
      .collection("DiscussionRoomComment")
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
        .collection("DiscussionRoomComment")
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

      firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setCu(snapshot.data());
          } else {
            console.log("does not exist");
          }
        });
    }, [])
  );

  if (user === null) {
    return <View />;
  }

  const toggleEditComment = () => {
    setEditCommentModalVisible(!isEditCommentModalVisible);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const renderSuggestionsRow = ({ item }, hidePanel) => {
    return (
      <TouchableOpacity onPress={() => onSuggestionTap(item.name, hidePanel)}>
        <View style={styles.suggestionsRowContainer}>
          <View style={styles.userIconBox}>
            <Image
              style={{ aspectRatio: 1 / 1, height: 45 }}
              source={{
                uri: item.image,
              }}
            />
          </View>
          <View style={styles.userDetailsBox}>
            <Text style={styles.displayNameText}>{item.name}</Text>
            <Text style={styles.usernameText}>@{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const onSuggestionTap = (name, hidePanel) => {
    hidePanel();
    const comment = caption.slice(0, -keyword.length);
    setCaption(comment + "@" + name + " ");
  };

  const xxx = () => {
    console.log(caption)
  };

  const callback = (keyword) => {
    setKeyword(keyword);
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", keyword.substring(1))
      .limit(10)
      .get()
      .then((snapshot) => {
        let result = snapshot.docs.map((doc) => {
          const datas = doc.data();
          const id = doc.id;
          return { id, ...datas };
        });
        setDatas(result);
      });
  };

  const UploadComment = () => {
    if (!newComment.trim()) {
      alert("Please Enter Comment");
      return;
    } else {
      firebase
        .firestore()
        .collection("DiscussionRoomComment")
        .add({
          userId,
          postedBy: cu.name,
          discussionRoomId: discussionId,
          comment: newComment,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          image: cu.image,
          likeBy: [],
          numOfLike: 0,
          numberOfReply: 0,
        })
        .then(function () {
          setModalVisible(!isModalVisible);
        });
      setData(57);
    }
  };

  const Delete = (cid) => {
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
              .collection("DiscussionRoomComment")
              .doc(cid)
              .delete();
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
      .collection("DiscussionRoomComment")
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
      .collection("DiscussionRoomComment")
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
      .collection("DiscussionRoomComment")
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
        .collection("DiscussionRoomComment")
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
      </View>

      {userPosts.downloadURL && (
        <View
          style={{
            flexDirection: "row",
            paddingBottom: 10,
            justifyContent: "center",
          }}
        >
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
          item.discussionRoomId === discussionId ? (
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
                      uri: item.image,
                    }}
                  />

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
                        style={{
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
                    {item.userId === userId ? (
                      <View style={{ flexDirection: "row" }}>
                        <Icon
                          style={{
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
                    <Icon
                      style={{
                        paddingLeft: 10,
                      }}
                      name="chatbubble-ellipses-outline"
                      type="ionicon"
                      size={20}
                      color="#000"
                      onPress={() =>
                        props.navigation.navigate("RoomReplyComment", {
                          cid: item.id,
                          time: timeDifference(
                            new Date(),
                            item.creation.toDate()
                          ),
                          xxx: item.likeBy.includes(userId),
                          mainCommentAuthorName: item.postedBy,
                        })
                      }
                    />
                    <Text
                      style={{
                        fontSize: 15,
                        marginRight: 3,
                        fontFamily: "Poppins",
                      }}
                    >
                      ({item.numberOfReply})
                    </Text>
                  </View>
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
              <MentionsTextInput
                textInputStyle={{
                  borderColor: "#ebebeb",
                  borderWidth: 1,
                  padding: 5,
                  fontSize: 15,
                  width: "100%",
                }}
                suggestionsPanelStyle={{
                  backgroundColor: "rgba(100,100,100,0.1)",
                }}
                loadingComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      width: 200,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ActivityIndicator />
                  </View>
                )}
                textInputMinHeight={30}
                textInputMaxHeight={80}
                trigger={"@"}
                triggerLocation={"new-word-only"} // 'new-word-only', 'anywhere'
                value={caption}
                onChangeText={setCaption}
                triggerCallback={callback.bind(this)}
                renderSuggestionsRow={renderSuggestionsRow.bind(this)}
                suggestionsData={datas}
                keyExtractor={(item, index) => item.name}
                suggestionRowHeight={45}
                horizontal={false}
                MaxVisibleRowCount={3}
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
      </View>
      <View
        style={{ height: 300, justifyContent: "flex-end", paddingTop: 100 }}
      >
        <MentionsTextInput
        textInputStyle={{
          borderColor: "#ebebeb",
          borderWidth: 1,
          padding: 5,
          fontSize: 15,
          width: "100%",
        }}
        suggestionsPanelStyle={{ backgroundColor: "rgba(100,100,100,0.1)" }}
        loadingComponent={() => (
          <View
            style={{
              flex: 1,
              width: 200,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator />
          </View>
        )}
        textInputMinHeight={30}
        textInputMaxHeight={80}
        trigger={"@"}
        triggerLocation={"new-word-only"} // 'new-word-only', 'anywhere'
        value={caption}
        onChangeText={setCaption}
        triggerCallback={callback.bind(this)}
        renderSuggestionsRow={renderSuggestionsRow.bind(this)}
        suggestionsData={datas}
        keyExtractor={(item, index) => item.name}
        suggestionRowHeight={45}
        horizontal={false}
        MaxVisibleRowCount={3}
      />
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

  suggestionsRowContainer: {
    flexDirection: "row",
  },
  userAvatarBox: {
    width: 35,
    paddingTop: 2,
  },
  userIconBox: {
    height: 45,
    width: 45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#54c19c",
  },
  usernameInitials: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  userDetailsBox: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 15,
  },
  displayNameText: {
    fontSize: 13,
    fontWeight: "500",
  },
  usernameText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.6)",
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  comments: store.userState.comment,
});

export default connect(mapStateToProps, null)(ViewRoom);
