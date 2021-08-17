import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";
import firebase from "firebase";

function AddInGroup(props) {
  const [data, setData] = useState(0);
  const [info, setInfo] = useState([]);
  const { discussionroom } = props;
  const [post, setPost] = useState(discussionroom);
  const userId = firebase.auth().currentUser.uid;
  const infoId = props.route.params.did;

  useFocusEffect(
    React.useCallback(() => {
      firebase
        .firestore()
        .collection("DiscussionRoom")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          const newArray = posts.filter(
            (element) => element.createrId === userId
          );
          setPost(newArray);
        });
    }, [])
  );

  useEffect(() => {
    firebase
      .firestore()
      .collection("DiscussionRoom")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        const newArray = posts.filter(
          (element) => element.createrId === userId
        );
        setPost(newArray);
      });

    firebase
      .firestore()
      .collection("RequestForMentor")
      .doc(infoId)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setInfo(snapshot.data());
        } else {
          console.log("does not exist");
        }
      });
  }, [data]);

  const AddInGroup = (gid, mid) => {
    if (mid.includes(info.userId)) {
    } else {
      mid.push(info.userId);
    }

    firebase
      .firestore()
      .collection("DiscussionRoom")
      .doc(gid)
      .collection("Mentee")
      .add({
        name: info.name,
        userId: info.userId,
        image: "dp.image",
      });

    firebase.firestore().collection("DiscussionRoom").doc(gid).update({
      memberId: mid,
    });
    setData(2);
  };

  const RemoveInGroup = (gid, mid) => {
    const indexx = mid.indexOf(info.userId);
    if (indexx > -1) {
      mid.splice(indexx, 1);
    }

    firebase.firestore().collection("DiscussionRoom").doc(gid).update({
      memberId: mid,
    });

    firebase
      .firestore()
      .collection("DiscussionRoom")
      .doc(gid)
      .collection("Mentee")
      .get()
      .then((snapshot) => {
        let mentee = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });

        const newArray2 = mentee.filter((e) => e.userId === info.userId);
        console.log(newArray2);

        const secArray2 = newArray2.map((element) => element.id);
        console.log(secArray2[0]);

        firebase
          .firestore()
          .collection("DiscussionRoom")
          .doc(gid)
          .collection("Mentee")
          .doc(secArray2[0])
          .delete();
      });

    setData(1);
  };

  return (
    <View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <FlatList
          horizontal={false}
          extraData={post}
          data={post}
          keyExtractor={(post) => post.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={2} style={styles.title}>
                    {item.title}
                  </Text>
                  <Text style={styles.faculty}>{item.description}</Text>
                </View>
              </View>
              {item.memberId.includes(info.userId) ? (
                <TouchableOpacity
                  onPress={() => RemoveInGroup(item.id, item.memberId)}
                >
                  <Icon
                    name="remove-circle-outline"
                    type="ionicon"
                    size={30}
                    color="#fff"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => AddInGroup(item.id, item.memberId)}
                >
                  <Icon
                    name="add-outline"
                    type="ionicon"
                    size={30}
                    color="#fff"
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#140F38",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    borderRadius: 16,
    elevation: 5,
    backgroundColor: "#003565",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    width: 340,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 6,
  },

  cardContent: {
    marginVertical: 10,
    marginHorizontal: 18,
  },

  faculty: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins",
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Poppins",
    paddingVertical: 0,
    //  marginVertical: -5,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    lineHeight: 25,
  },
});

const mapStateToProps = (store) => ({
  discussionroom: store.userState.discussionroom,
});

export default connect(mapStateToProps, null)(AddInGroup);
