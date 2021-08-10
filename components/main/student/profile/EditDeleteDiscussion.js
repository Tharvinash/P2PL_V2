import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";
import firebase from "firebase";
import { timeDifference } from "../../../utils";
import Modal from "react-native-modal";
import Images from "react-native-scalable-image";
import CommentCard from "../../component/commentCard";

require("firebase/firestore");
import { useFocusEffect } from "@react-navigation/native";

function EditDeleteDiscussion(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [comment, setComment] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [postedBy, setPostedBy] = useState(null);
  const [data, setData] = useState(null);
  const [image, setImage] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editComment, setEditComment] = useState("");
  const [commentId, setCommentId] = useState(null);
  const [isEditCommentModalVisible, setEditCommentModalVisible] =
    useState(false);


  const discussionId = props.route.params.did;
  // console.log(discussionId)
  const userId = firebase.auth().currentUser.uid;

  useFocusEffect(
    React.useCallback(() => {
      const { currentUser, posts, comments } = props;
      setPostedBy(currentUser.name);
      setUser(currentUser);
      setData(88);
      firebase
        .firestore()
        .collection("Discussion")
        .doc(props.route.params.did)
        .get()
        .then((snapshot) => {
          // console.log(snapshot.data())
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
    }, [data])
  );

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", paddingRight: 15 }}>
          <TouchableOpacity>
            <Icon
              name="create-outline"
              type="ionicon"
              size={30}
              color="#000"
              onPress={() => {
                EditDiscussion();
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="trash-outline"
              type="ionicon"
              size={30}
              color="#000"
              onPress={() => Delete()}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [data]);

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

  if (user === null) {
    return <View />;
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const EditDiscussion = () => {
    props.navigation.navigate("Edit Discussion", {
      did: discussionId,
    })
  };


  const toggleEditComment = () => {
    setEditCommentModalVisible(!isEditCommentModalVisible);
  };

  const Delete = () => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete this discussion ?",
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

  const DeleteComment = (cid) => {
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

  const UploadComment = () => {
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
        image: user.image,
        numberOfReply:0
      })
      .then(function () {
        setModalVisible(!isModalVisible);
      });
    setData(57);
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

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.title}>{userPosts.title}</Text>
        </View>
        {userPosts.downloadURL && (
          <View
            style={{
              flexDirection: "row",
              paddingBottom: 10,
              justifyContent: "center",
            }}
          >
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
              <CommentCard
                picture={item.image}
                status = {0}
                verify={item.verify}
                postedBy={item.postedBy}
                creation={item.creation}
                comment={item.comment}
                numOfLike={item.numOfLike}
                likeBy={item.likeBy.includes(userId)}
                removeLike={() =>
                  removeLike(item.id, item.numOfLike, item.likeBy)
                }
                addLike={() => addLike(item.id, item.numOfLike, item.likeBy)}
                firstUserId={item.userId}
                secondUserId={userId}
                delete={() => DeleteComment(item.id)}
                editComment={() => EditComment(item.id)}
                numberOfReply={item.numberOfReply}
                onSelect={() =>
                  props.navigation.navigate("Reply Discussion", {
                    cid: item.id,
                    time: timeDifference(new Date(), item.creation.toDate()),
                    xxx: item.likeBy.includes(userId),
                    mainCommentAuthorName: item.postedBy,
                  })
                }
              />
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
                  <TouchableOpacity
                    style={styles.blogout}
                    onPress={toggleModal}
                  >
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
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
    lineHeight: 20,
    fontWeight: "700",
    marginBottom: 5,
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
    // justifyContent: "center",
    // alignItems: "center",
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
