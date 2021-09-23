import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-elements";

const addComment = (props) => {
  return (
    <View style={{ justifyContent: "center" }}>
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Add comments here"
          placeholderTextColor="#000"
          multiline={true}
          //onChangeText={(newComment) => setNewComment(newComment)}
          onChangeText={props.setNewComment}
        />
        <Icon
          style={styles.searchIcon}
          name="attach-outline"
          type="ionicon"
          size={30}
          color="#000"
          // onPress={() => {
          //   pickDocument();
          // }}
          onPress={props.pickDocument}
        />
        <Icon
          style={styles.searchIcon}
          name="image-outline"
          type="ionicon"
          size={30}
          color="#000"
          // onPress={() => {
          //   pickImage();
          // }}
          onPress={props.pickImage}
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
            //onPress={() => UploadComment()}
            onPress={props.UploadComment}
          >
            {props.loading ? (
              <ActivityIndicator size="large" color="#140F38" />
            ) : (
              <Text style={styles.Ltext}>Add Comment</Text>
            )}
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={styles.blogout}
            //onPress={toggleModal}
            onPress={props.toggleModal}
          >
            <Text style={styles.Ltext}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#E3562A",
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
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

export default addComment;
