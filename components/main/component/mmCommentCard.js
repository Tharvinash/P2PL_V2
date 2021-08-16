import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import MentionsTextInput from "react-native-mentions";
import { Icon } from "react-native-elements";

const mmCommentCard = (props) => {
  return (
    <View style={{ justifyContent: "center" }}>
      <View style={styles.searchSection}>
        <MentionsTextInput
          textInputStyle={{
            borderColor: "#ebebeb",
            borderWidth: 1,
            padding: 5,
            fontSize: 15,
            width: "100%",
          }}
          suggestionsPanelStyle={{
            backgroundColor: "rgba(100,100,100,0.1)",
          }}
          loadingComponent={props.loadingComponent}
          textInputMinHeight={30}
          textInputMaxHeight={80}
          trigger={"@"}
          triggerLocation={"new-word-only"} // 'new-word-only', 'anywhere'
          value={props.caption}
          onChangeText={props.setCaption}
          triggerCallback={props.callback}
          renderSuggestionsRow={props.renderSuggestionsRow}
          suggestionsData={props.datas}
          keyExtractor={props.keyExtractor}
          suggestionRowHeight={45}
          horizontal={false}
          MaxVisibleRowCount={3}
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
            onPress={props.UploadComment}
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

export default mmCommentCard;
