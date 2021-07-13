import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import firebase from "firebase";
import * as Linking from "expo-linking";
import Images from "react-native-scalable-image";
import { timeDifference } from "../../../utils";
import { version } from "react-dom";
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
  const [editComment, setEditComment] = useState("");
  const [cu, setCu] = useState(currentUser);
  const [discussionId, setDiscussionId] = useState(props.route.params.did);
  const [ReportedDiscussionId, setReportedDiscussionId] = useState(
    props.route.params.rid
  );
  const userId = firebase.auth().currentUser.uid;
  const postedBy = currentUser.name;

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

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", paddingRight: 15 }}>
          <TouchableOpacity>
            <Icon
              name="remove-circle-outline"
              type="ionicon"
              size={30}
              color="#000"
              onPress={() => {
                Ignore();
              }}
            />
          </TouchableOpacity>
          <Icon
            name="trash-outline"
            type="ionicon"
            size={30}
            color="#000"
            onPress={() => Delete()}
          />
        </View>
      ),
    });
  }, [data]);

  const Delete = () => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove this Discussion ?",
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
            firebase
              .firestore()
              .collection("ReportedDiscussion")
              .doc(ReportedDiscussionId)
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

  const Ignore = () => {
    firebase
      .firestore()
      .collection("ReportedDiscussion")
      .doc(ReportedDiscussionId)
      .delete();
      props.navigation.goBack();
  };

  if (user === null) {
    return <View />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{userPosts.title}</Text>

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
          item.discussionId === discussionId ? (
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
                  ></View>
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
                    <Icon
                      style={{
                        paddingLeft: 10,
                      }}
                      name="chatbubble-ellipses-outline"
                      type="ionicon"
                      size={20}
                      color="#000"
                      onPress={() =>
                        props.navigation.navigate("ViewReply", {
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
      <View style={{ justifyContent: "center", alignItems: "center" }}></View>
    </ScrollView>
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
