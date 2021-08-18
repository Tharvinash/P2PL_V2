import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import { ListItem, Avatar } from "react-native-elements";
import { Icon } from "react-native-elements";
import firebase from "firebase";

function GroupDetail(props) {
  const { currentUser } = props;
  const [userStatus, setUserStatus] = useState(currentUser.status);
  const [groupMembers, setGroupMembers] = useState([]);
  const [data, setData] = useState(0);
  const roomId = props.route.params.did;
  const mid = props.route.params.mid;

  useEffect(() => {
    firebase
      .firestore()
      .collection("DiscussionRoom")
      .doc(roomId)
      .collection("Mentee")
      .orderBy("status", "asc")
      .get()
      .then((snapshot) => {
        let groupmembers = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setGroupMembers(groupmembers);
      });

    setData(1);
  }, [data]);

  const removeMember = (id, uid) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete this group ?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            firebase
              .firestore()
              .collection("DiscussionRoom")
              .doc(roomId)
              .collection("Mentee")
              .doc(id)
              .delete();

            removeId(uid);
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

  const removeId = (uid) => {
    const indexx = mid.indexOf(uid);
    if (indexx > -1) {
      mid.splice(indexx, 1);
    }

    firebase.firestore().collection("DiscussionRoom").doc(roomId).update({
      memberId: mid,
    });
    setData(2);
  };

  const deleteGroup = () => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete this group ?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            firebase
              .firestore()
              .collection("DiscussionRoomComment")
              .doc(roomId)
              .delete();
            props.navigation.navigate("Room");
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

  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <Avatar source={{ uri: item.image }} />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        {item.status == 1 ? (
          <ListItem.Subtitle>Mentor</ListItem.Subtitle>
        ) : item.status == 2 ? (
          <ListItem.Subtitle>Mentee</ListItem.Subtitle>
        ) : (
          <ListItem.Subtitle>Admin</ListItem.Subtitle>
        )}
      </ListItem.Content>

      {item.status == 0 || userStatus == 0 ? null : (
        <TouchableOpacity onPress={() => removeMember(item.id, item.userId)}>
          <Icon
            name="person-remove-outline"
            type="ionicon"
            size={25}
            color="#000"
          />
        </TouchableOpacity>
      )}
    </ListItem>
  );

  return (
    <View>
      <View style={styles.back}>
        <Text style={styles.descT}>Group Members : </Text>
      </View>

      <FlatList
        keyExtractor={(item) => item.id}
        data={groupMembers}
        renderItem={renderItem}
      />
      {userStatus != 0 ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            style={styles.blogout}
            onPress={() => deleteGroup()}
          >
            <Text style={styles.Ltext}>Delete Group</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  descT: {
    fontSize: 20,
    lineHeight: 25,
    fontFamily: "Poppins",
    marginTop: 10,
    marginLeft: 10,
    marginTop: 10,
  },

  back: {
    backgroundColor: "#fff",
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
});

export default connect(mapStateToProps, null)(GroupDetail);
