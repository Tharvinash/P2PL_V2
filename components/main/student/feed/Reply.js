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
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { connect } from "react-redux";
import Modal from "react-native-modal";
import firebase from "firebase";
require("firebase/firestore");
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import ParsedText from "react-native-parsed-text";
import * as Linking from "expo-linking";
import AddComment from "../../component/addComment";
import EditCommentCom from "../../component/editComment";
import MainCommentCard from "../../component/mainCommentCard";
import ReplyCommentCard from "../../component/replyCommentCard";
import { ListItem, BottomSheet } from "react-native-elements";

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
  const [isVisible, setIsVisible] = useState(false);
  const [temporaryId, setTemporaryId] = useState(null);
  const [isVisibleV2, setIsVisibleV2] = useState(false);
  const [image, setImage] = useState(null); //save local uri
  const [Doc, setDoc] = useState(null); //save local uri
  const [temporaryIdSubComment, setTemporaryIdSubComment] = useState(null);
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
  const userIdV2 = firebase.auth().currentUser.uid;
  const time = props.route.params.time;

  const images = [
    {
      uri: props.attachedImage,
    },
  ];

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

  const listV2 = [
    {
      title: "Edit",
      onPress: () => EditReplyComment(temporaryId),
    },
    {
      title: "Delete",
      onPress: () => DeleteReplyComment(temporaryId),
    },
    {
      title: "Cancel",
      containerStyle: { backgroundColor: "red" },
      titleStyle: { color: "white" },
      onPress: () => setIsVisibleV2(false),
    },
  ];

  const toggleVisibility = (cid) => {
    setIsVisible(true);
    setTemporaryId(cid);
  };

  const toggleVisibilityV2 = (cid) => {
    setIsVisibleV2(true);
    setTemporaryId(cid);
  };


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

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.cancelled) {
      setDoc(result.uri);
      console.log(result.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const UploadComment = () => {
    if (image == null && Doc == null) {
      ReplyComment(null, null);
    }

    if (image != null && Doc != null) {
      uploadDocV2();
    }

    if (image == null && Doc != null) {
      uploadDoc();
    }

    if (image != null && Doc == null) {
      uploadImage();
    }
  };

  const UploadCommentV2 = () => {
    if (image == null && Doc == null) {
      ReplySubComment(null, null);
    }

    if (image != null && Doc != null) {
      uploadDocV3();
    }

    if (image == null && Doc != null) {
      uploadDocV1();
    }

    if (image != null && Doc == null) {
      uploadImageV1();
    }
  };

  const uploadDoc = async () => {
    const childPath = `attchedDoc/${1234}/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(Doc);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        ReplyComment(snapshot, null);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const uploadImage = async () => {
    //const uri = props.route.params.image;
    const childPath = `attachedImage/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(image);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        ReplyComment(null, snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const uploadDocV2 = async () => {
    const childPath = `attchedDoc/${1234}/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(Doc);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        uploadImageV2(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const uploadImageV2 = async (docSnapshot) => {
    //const uri = props.route.params.image;
    const childPath = `attachedImage/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(image);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        ReplyComment(docSnapshot, snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const uploadDocV1 = async () => {
    const childPath = `attchedDoc/${1234}/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(Doc);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        ReplySubComment(snapshot, null);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const uploadImageV1 = async () => {
    //const uri = props.route.params.image;
    const childPath = `attachedImage/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(image);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        ReplySubComment(null, snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const uploadDocV3 = async () => {
    const childPath = `attchedDoc/${1234}/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(Doc);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        uploadImageV3(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const uploadImageV3 = async (docSnapshot) => {
    //const uri = props.route.params.image;
    const childPath = `attachedImage/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(image);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        ReplySubComment(docSnapshot, snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

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
    setIsVisible(false)
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
    setIsVisible(false)
    setEditComment(mainComment.comment);
    setEditCommentModalVisible(!isEditCommentModalVisible);
  };

  const EditReplyComment = (rcid) => {
    setIsVisibleV2(false)
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

  const ReplySubComment = (doc, img) => {
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
          attachedDocument: doc,
          attachedImage: img,
        });

      const totalReply = mainComment.numberOfReply + 1;
      firebase.firestore().collection("Comment").doc(mainCommentId).update({
        numberOfReply: totalReply,
      });
      setReplySubCommentModalVisible(!isReplySubCommentModalVisible);
    }

    setData(59);
  };

  const ReplyComment = (doc, img) => {
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
          attachedDocument: doc,
          attachedImage: img,
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
    setIsVisibleV2(false)
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
    <View style={styles.container}>
      <FlatList
        horizontal={false}
        extraData={replyComment}
        data={replyComment}
        renderItem={({ item }) => (
          <View style={{ marginLeft: 30, marginTop: 5 }}>
              <ReplyCommentCard
                removeVerifyReplyComment={() =>
                  removeVerifyReplyComment(item.id)
                }
                verifyReplyComment={() => verifyReplyComment(item.id)}
                image={item.image}
                status={loginCurrentUser.status}
                verify={item.verify}
                firstUserId={item.userId}
                secondUserId= {userId}
                xxx={() => toggleVisibilityV2(item.id)}
                postedBy={item.postedBy}
                maincommentIdV1={item.mainCommentId}
                mainCommentIdV2={mainCommentId}
                repliedTo={item.repliedTo}
                currentUserName={currentUserName}
                creation={item.creation}
                comment={item.comment}
                attachedImage={item.attachedImage}
                attachedDocument={item.attachedDocument}
                numOfLike={item.numOfLike}
                likeBy={item.likeBy.includes(userId)}
                RemoveLikeToReplyComment={() =>
                  RemoveLikeToReplyComment(item.id, item.numOfLike, item.likeBy)
                }
                AddLikeToReplyComment={() =>
                  AddLikeToReplyComment(item.id, item.numOfLike, item.likeBy)
                }
                toggleSubReplyComment={() =>
                  toggleSubReplyComment(item.id, item.postedBy)
                }
              />
          </View>
        )}

        ListHeaderComponent={
          <View>
        <MainCommentCard
          picture={mainComment.image}
          time={time}
          status={loginCurrentUser.status}
          verify={mainComment.verify}
          postedBy={mainComment.postedBy}
          creation={mainComment.creation}
          comment={mainComment.comment}
          attachedDocument={mainComment.attachedDocument}
          attachedImage={mainComment.attachedImage}
          numOfLike={mainComment.numOfLike}
          likeBy={likeBy}
          removeVerifyComment={() => removeVerifyComment()}
          verifyComment={() => verifyComment()}
          removeLike={() =>
            removeLike(
              mainComment.id,
              mainComment.numOfLike,
              mainComment.likeBy
            )
          }
          xxx={() => toggleVisibility(mainComment.id)}
          addLike={() =>
            addLike(mainComment.id, mainComment.numOfLike, mainComment.likeBy)
          }
          firstUserId={mainComment.userId}
          secondUserId={userId}
          delete={() => Delete(mainComment.id)}
          editComment={() => EditComment(mainComment.id)}
          toggleReplyComment={() => toggleReplyComment()}
        />
          </View>
        }


        ListFooterComponent={
          <View>
            {/* BottomSheet for main comment */}
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

            {/* BottomSheet for sub comment */}
            <BottomSheet
              isVisible={isVisibleV2}
              containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
            >
              {listV2.map((l, i) => (
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

            {/* Edit Reply Modal */}
            <Modal isVisible={isEditCommentModalVisible}>
              <EditCommentCom
                editComment={editComment}
                setEditComment={(editComment) => setEditComment(editComment)}
                uploadUpdatedComment={() => uploadUpdatedComment()}
                toggleEditComment={() => toggleEditComment()}
              />
            </Modal>

            {/* Reply Comment Modal */}
            <Modal isVisible={isReplyCommentModalVisible}>
              <AddComment
                setNewComment={(newReply) => setNewReply(newReply)}
                pickDocument={() => pickDocument()}
                pickImage={() => pickImage()}
                UploadComment={() => UploadComment()}
                toggleModal={() => toggleReplyComment()}
              />
            </Modal>

            {/* Reply to Reply Comment Modal */}
            <Modal isVisible={isReplySubCommentModalVisible}>
              <AddComment
                setNewComment={(replyOfSubComment) =>
                  setReplyOfSubComment(replyOfSubComment)
                }
                pickDocument={() => pickDocument()}
                pickImage={() => pickImage()}
                UploadComment={() => UploadCommentV2()}
                toggleModal={() => toggleSubReplyComment()}
              />
            </Modal>

            {/* Edit Reply Comment */}
            <Modal isVisible={isEditReplyCommentModalVisible}>
              <EditCommentCom
                editComment={editReplyComment}
                setEditComment={(editReplyComment) =>
                  setEditReplyComment(editReplyComment)
                }
                uploadUpdatedComment={() => UploadEditSubComment()}
                toggleEditComment={() => toggleReplyEditComment()}
              />
            </Modal>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },

  mainBubble: {
    borderColor: "#E3562A",
    borderBottomWidth: 5,
    width: "87%",
    padding: 5,
    backgroundColor: "#D3D3D3",
    borderRadius: 10,
    marginBottom: 5,
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

  url: {
    color: "red",
    textDecorationLine: "underline",
  },

  email: {
    textDecorationLine: "underline",
  },

  text: {
    color: "black",
    fontSize: 15,
  },

  phone: {
    color: "blue",
    textDecorationLine: "underline",
  },

  name: {
    color: "red",
  },

  username: {
    color: "green",
    fontWeight: "bold",
  },

  hashTag: {
    fontStyle: "italic",
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(Reply);
