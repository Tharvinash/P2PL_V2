import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
  FlatList,
  TouchableHighlight,
} from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";
import { Icon } from "react-native-elements";
import { RefreshControlBase } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

function ReportedDiscussion(props) {
  const { reportedDiscussion } = props;
  const [data, setData] = useState(reportedDiscussion);
  const [x, setX] = useState(0);

  useEffect(() => {
    firebase
      .firestore()
      .collection("ReportedDiscussion")
      .get()
      .then((snapshot) => {
        let reportedDiscussion = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setData(reportedDiscussion);
      });

    setX(1);
  }, [x]);

  const renderItem = (data) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("LectureDiscussionView", {
              did: data.item.reportedDiscussion,
            })
          }
        >
          <Text numberOfLines={2} style={styles.title}>
            {data.item.discussionTitle}
          </Text>
          <Text style={styles.faculty}>{data.item.Reason}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const closeRow = (rowKey) => {
    firebase.
    firestore().
    collection("ReportedDiscussion").
    doc(rowKey).
    delete();
    setX(2);
  };

  const deleteRow = (x,y) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove this Discussion ?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            firebase.firestore().collection("Discussion").doc(y).delete();
            firebase.
            firestore().
            collection("ReportedDiscussion").
            doc(x).
            delete();
            setX(3);
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

  const renderHiddenItem = (data) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => closeRow(data.item.id)}
      >
        <Text style={styles.backTextWhite}>Ignore</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(data.item.id, data.item.reportedDiscussion)}
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <SwipeListView
        disableRightSwipe
        data={data}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        previewRowKey={"0"}
        rightOpenValue={-150}
        previewRowKey={"0"}
        previewOpenValue={-40}
        previewOpenDelay={3000}
      />
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
  backTextWhite: {
    color: "#FFF",
    fontFamily: "Poppins",
  },

  backRightBtnLeft: {
    backgroundColor: "blue",
    right: 75,
  },

  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
    borderRadius: 16,
  },

  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
  },

  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    marginHorizontal: 4,
    marginVertical: 6,
    width: 340,
    borderRadius: 16,
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
  },
});

const mapStateToProps = (store) => ({
  reportedDiscussion: store.userState.reportedDiscussion,
});

export default connect(mapStateToProps, null)(ReportedDiscussion);
