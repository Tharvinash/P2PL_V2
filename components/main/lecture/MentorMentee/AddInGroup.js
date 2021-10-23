import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, StyleSheet, FlatList, Dimensions, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";
import firebase from "firebase";
import ViewAvailableGroup from "../../component/viewAvailableGroup";
function AddInGroupV2(props) {
  const [data, setData] = useState(0);
  const [info, setInfo] = useState([]);
  const { discussionroom } = props;
  const [post, setPost] = useState([]);
  const [added, setAdded] = useState(false);
  const userId = firebase.auth().currentUser.uid;
  const infoId = props.route.params.did;

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", paddingRight: 15 }}>

          <TouchableOpacity>
            <Icon
              name="save-outline"
              type="ionicon"
              size={30}
              color="#000"
              onPress={() => {
                checkOut();
              }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [data]);

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
  }, [data]);

  const checkOut = () =>{
    if(added){
      return Alert.alert(
        "Save changes",
        "Changes are saved !",
        [
          // The "Yes" button
          {
            text: "Yes",
            onPress: () => {
              firebase.firestore().collection("RequestForMentor").doc(infoId).delete();
              props.navigation.navigate("ViewRequest")
            },
          },
          // The "No" button
          // Does nothing but dismiss the dialog when tapped
          {
            text: "No",
          },
        ]
      );
    }else{
      props.navigation.navigate("ViewRequest")
    }
  }

  const AddInGroup = (gid, gm) => {
    setAdded(true)
    gm.push({
      userId: info.userId,
      name: info.name,
      mc: "mc",
      image: "image",
      status: 1,
    });

    firebase.firestore().collection("DiscussionRoom").doc(gid).update({
      groupMember: gm,
    });
    setData(2);
  };

  const RemoveInGroup = (gid, gm) => {
    setAdded(false)
    gm.splice(
      gm.findIndex((v) => v.userId === info.id),
      1
    );

    firebase.firestore().collection("DiscussionRoom").doc(gid).update({
      groupMember: gm,
    });

    setData(1);
  };
  function yyy(member) {
    let x = member.some((el) => el.userId === info.userId);
    return x;
  }

  return (
    <View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <FlatList
          horizontal={false}
          extraData={post}
          data={post}
          keyExtractor={(post) => post.id}
          renderItem={({ item }) => (
            <ViewAvailableGroup
              title={item.title}
              description={item.description}
              added={yyy(item.groupMember)}
              RemoveInGroup={() => RemoveInGroup(item.id, item.groupMember)}
              AddInGroup={() => AddInGroup(item.id, item.groupMember)}
            />
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
    width: Dimensions.get("window").width * 0.95,
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

export default connect(mapStateToProps, null)(AddInGroupV2);
