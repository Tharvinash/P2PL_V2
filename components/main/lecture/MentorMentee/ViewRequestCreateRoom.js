import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import firebase from "firebase";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";
import DiscussinCard from "../../component/discussionCard";
import ViewAvailableGroup from "../../component/viewAvailableGroup";
import Modal from "react-native-modal";

function ViewRequestCreateRoom(props) {
  const { requestForAMentor, requestToBeAMentor, currentUser } = props;
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(5);
  const [mentee, setMentee] = useState([]);
  const [mentor, setMentor] = useState([]);
  const [update, setUpdate] = useState(0);
  const [studentId, setStudentId] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userId = firebase.auth().currentUser.uid;
  const title = props.route.params.title;
  const desc = props.route.params.desc;

  const list = [
    {
      title: "View Request To Be Mentor",
      id: 5,
    },
    {
      title: "View Request For Mentor",
      id: 6,
    },
    {
      title: "Year 1",
      id: 1,
    },
    {
      title: "Year 2",
      id: 2,
    },
    {
      title: "Year 3",
      id: 3,
    },
    {
      title: "Year 4",
      id: 4,
    },
  ];

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", paddingRight: 15 }}>
          <TouchableOpacity>
            <Icon
              name="add-circle-outline"
              type="ionicon"
              size={30}
              color="#000"
              onPress={() => {
                createRoom();
              }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [data]);

  useEffect(() => {
    setUpdate(3);
    if (filter == 5) {
      setData(requestToBeAMentor);
    } else if (filter == 6) {
      setData(requestForAMentor);
    } else {
      firebase
        .firestore()
        .collection("users")
        .where("year", "==", filter)
        .get()
        .then((snapshot) => {
          let user = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setData(user);
        });
    }
  }, [filter, update]);

  const createRoom = () => {
    let a = mentee;
    a.push({
      userId: userId,
      name: currentUser.name,
      mc: "mc",
      image: "image",
      status: 0
    });


    firebase
      .firestore()
      .collection("DiscussionRoom")
      .add({
        title: title,
        description: desc,
        groupMember: a,
        createdBy: currentUser.name,
        createrId: userId,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        props.navigation.navigate("Room");
      });
  };

  const chageList = (id) => {
    setFilter(id);
  };
  const removeMember = (id) => {
    mentor.splice(
      mentor.findIndex((v) => v.userId === id),
      1
    );
    mentee.splice(
      mentee.findIndex((v) => v.userId === id),
      1
    );
    setUpdate(1);
  };

  const addAsMentor = () => {
    let a = mentee;
    a.push({ ...studentId, status: 1 });
    setMentee(a);
    setIsModalVisible(!isModalVisible);
  };

  const addAsMentee = () => {
    let b = mentee;
    b.push({ ...studentId, status: 2 });
    setMentee(b);
    setIsModalVisible(!isModalVisible);
  };

  const addInGroup = (id) => {
    setIsModalVisible(!isModalVisible);
    setStudentId(id);
  };

  return (
    <View>
      <FlatList
        data={list}
        horizontal
        keyExtractor={(list) => list.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ height: 30, marginVertical: 10 }}>
            <TouchableOpacity
              onPress={() => chageList(item.id)}
              style={{ backgroundColor: "blue", marginHorizontal: 10 }}
            >
              <Text>{item.title}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <FlatList
        horizontal={false}
        extraData={data}
        data={data}
        keyExtractor={(data) => data.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={{ flex: 1 }}>
                <Text numberOfLines={2} style={styles.title}>
                  {item.name}
                </Text>
                <Text style={styles.faculty}>mc</Text>
              </View>
            </View>
            {filter == 5 || filter == 6 ? (
              <View>
                {mentor.some((el) => el.userId === item.userId) ||
                mentee.some((el) => el.userId === item.userId) ? (
                  <TouchableOpacity
                    onPress={() =>
                      addInGroup({
                        userId: item.userId,
                        name: item.name,
                        mc: "mc",
                        image: "image",
                      })
                    }
                  >
                    <Icon
                      name="remove-outline"
                      type="ionicon"
                      size={30}
                      color="#fff"
                      onPress={() => removeMember(item.userId)}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      addInGroup({
                        userId: item.userId,
                        name: item.name,
                        mc: "mc",
                        image: "image",
                      })
                    }
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
            ) : (
              <View>
                {mentor.some((el) => el.userId === item.id) ||
                mentee.some((el) => el.userId === item.id) ? (
                  <TouchableOpacity
                    onPress={() =>
                      addInGroup({
                        userId: item.id,
                        name: item.name,
                        mc: "mc",
                        image: "image",
                      })
                    }
                  >
                    <Icon
                      name="remove-outline"
                      type="ionicon"
                      size={30}
                      color="#fff"
                      onPress={() => removeMember(item.id)}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      addInGroup({
                        userId: item.id,
                        name: item.name,
                        mc: "mc",
                        image: "image",
                      })
                    }
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
          </View>
        )}
      />
      <Modal isVisible={isModalVisible}>
        <View>
          <TouchableOpacity onPress={() => addAsMentor()}>
            <Text style={{ color: "white" }}>add as mentor</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => addAsMentee()}>
            <Text style={{ color: "white" }}>add as mentee</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => addInGroup()}>
            <Text style={{ color: "white" }}>cancle</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  requestForAMentor: store.userState.requestForAMentor,
  requestToBeAMentor: store.userState.requestToBeAMentor,
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(ViewRequestCreateRoom);
