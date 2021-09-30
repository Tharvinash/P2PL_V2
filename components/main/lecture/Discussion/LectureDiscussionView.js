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
  Dimensions,
} from "react-native";
//---------reusable component-----------//
import Report from "../../component/report";
import AddComment from "../../component/addComment";
import EditCommentCom from "../../component/editComment";

import { FAB, ListItem, BottomSheet } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import firebase from "firebase";
import * as Linking from "expo-linking";
import Images from "react-native-scalable-image";
import { timeDifference } from "../../../utils";
import CommentCard from "../../component/commentCard";
require("firebase/firestore");

function LectureDiscussionView(props) {
  const { currentUser, options } = props;
  const [commentId, setCommentId] = useState(null);
  const [newOption, setOption] = useState(options);
  const [isEditCommentModalVisible, setEditCommentModalVisible] =
    useState(false);
  const [isReportVisible, setReportVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState(null);
  const [data, setData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [temporaryId, setTemporaryId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [cu, setCu] = useState(currentUser);
  const [discussionId, setDiscussionId] = useState(props.route.params.did);
  // const discussionId = props.route.params.did;
  const userId = firebase.auth().currentUser.uid;
  const postedBy = currentUser.name;

  const list = [
    {
      title: "Edit",
      onPress: () => EditComment(temporaryId),
    },
    {
      title: "Delete",
      onPress: () => Delete(temporaryId),
    },
    {
      title: "Cancel",
      containerStyle: { backgroundColor: "red" },
      titleStyle: { color: "white" },
      onPress: () => setIsVisible(false),
    },
  ];

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", paddingRight: 15 }}>
          <TouchableOpacity>
            <Icon
              name="alert-circle-outline"
              type="ionicon"
              size={30}
              color="#000"
              onPress={() => {
                toggleReport();
              }}
            />
          </TouchableOpacity>
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
        Alert.alert(
          "Done",
          "Your report has been received and will be reviewed",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      });
  };

  const xxx = () => {
    console.log(24);
  };

  const toggleEditComment = () => {
    setEditCommentModalVisible(!isEditCommentModalVisible);
  };

  const toggleReport = () => {
    setReportVisible(!isReportVisible);
  };

  const toggleVisibility = (cid) => {
    setIsVisible(true);
    setTemporaryId(cid);
  };

  useEffect(() => {
    const { currentUser, comments } = props;
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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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
          postedBy: cu.name,
          discussionId,
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

  const verifyComment = (cid) => {
    firebase
      .firestore()
      .collection("Comment")
      .doc(cid)
      .update({
        verify: true,
      })
      .then(() => {
        console.log("done");
      });
    setData(5);
  };

  const EditComment = (cid) => {
    setIsVisible(false)
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

  const removeVerifyComment = (cid) => {
    firebase
      .firestore()
      .collection("Comment")
      .doc(cid)
      .update({
        verify: false,
      })
      .then(() => {
        console.log("done");
      });
    setData(6);
  };

  const Delete = (cid) => {
    // firebase.firestore().collection("Comment").doc(cid).delete();
    // console.log("delete");
    // props.navigation.goBack();
    setIsVisible(false)
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
    <View style={{ flex: 1, margin: 10, marginBottom: 5 }}>
      <FlatList
        horizontal={false}
        extraData={comment}
        data={comment}
        renderItem={({ item }) =>
          item.discussionId === discussionId ? (
            <CommentCard
              picture={item.image}
              status={1}
              verify={item.verify}
              postedBy={item.postedBy}
              creation={item.creation}
              comment={item.comment}
              attachedDocument={item.attachedDocument}
              attachedImage={item.attachedImage}
              numOfLike={item.numOfLike}
              likeBy={item.likeBy.includes(userId)}
              removeLike={() =>
                removeLike(item.id, item.numOfLike, item.likeBy)
              }
              xxx={() => toggleVisibility(item.id)}
              addLike={() => addLike(item.id, item.numOfLike, item.likeBy)}
              firstUserId={item.userId}
              secondUserId={userId}
              delete={() => Delete(item.id)}
              downlaodDoc={() => downlaodDoc()}
              editComment={() => EditComment(item.id)}
              numberOfReply={item.numberOfReply}
              removeVerifyComment={() => removeVerifyComment(item.id)}
              verifyComment={() => verifyComment(item.id)}
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
        ListHeaderComponent={
          <View>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <View style={{ flex: 1, justifyContent: "flex-start" }}>
                <View style={{ width: "100%" }}>
                  <Text style={styles.title}>{userPosts.title}</Text>
                </View>
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
          </View>
        }
        ListFooterComponent={
          <View>
      <BottomSheet
        isVisible={isVisible}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
      >
        {list.map((l, i) => (
          <ListItem
            key={i}
            containerStyle={l.containerStyle}
            onPress={l.onPress}
          >
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Modal isVisible={isEditCommentModalVisible}>
          <EditCommentCom
            editComment={editComment}
            setEditComment={(editComment) => setEditComment(editComment)}
            uploadUpdatedComment={() => uploadUpdatedComment()}
            toggleEditComment={() => toggleEditComment()}
          />
        </Modal>

        <Modal isVisible={isReportVisible}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.titley}>Why are you reporting this post</Text>
            <FlatList
              horizontal={false}
              extraData={newOption}
              data={newOption}
              renderItem={({ item }) => (
                <Report
                  Option={item.Option}
                  sendReport={() => sendReport(item.Option)}
                />
              )}
            />
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={styles.blogout} onPress={toggleReport}>
              <Text style={styles.Ltext}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal isVisible={isModalVisible}>
          <AddComment
            setNewComment={(newComment) => setNewComment(newComment)}
            pickDocument={() => pickDocument()}
            pickImage={() => pickImage()}
            UploadComment={() => UploadComment()}
            toggleModal={() => toggleModal()}
          />
        </Modal>
      </View>
          </View>
        }
      />
      <FAB
        placement="right"
        color="#E3562A"
        onPress={toggleModal}
        icon={<Icon name="add-outline" type="ionicon" size={30} color="#fff" />}
      />
    </View>
  );
}

////(credits < 30) ? "freshman" : (credits >= 30 && credits < 60) ?"sophomore" : (credits >= 60 && credits < 90) ? "junior" : "senior"
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

export default connect(mapStateToProps, null)(LectureDiscussionView);
