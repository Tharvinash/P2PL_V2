import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Icon } from "react-native-elements";
import { timeDifference } from "../../utils";

const commentCard = (props) => {
  const a = props.verify;
  return (
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
              uri: props.picture,
            }}
          />

          <View
            style={{
              marginRight: 10,
              paddingTop: 10,
            }}
          >
            {props.status == 0 ? (
              props.verify ? (
                <Icon
                  name="checkmark-circle"
                  type="ionicon"
                  size={25}
                  color="#140F38"
                />
              ) : null
            ) : null}

            {props.status == 1 ? (
              props.verify ? (
                <Icon
                  name="checkmark-circle"
                  type="ionicon"
                  size={25}
                  color="#140F38"
                  onPress={props.removeVerifyComment}
                />
              ) : (
                <Icon
                  name="checkmark-circle-outline"
                  type="ionicon"
                  size={25}
                  color="#140F38"
                  onPress={props.verifyComment}
                />
              )
            ) : null}
          </View>
        </View>
        <View style={styles.commentCon}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.userT}>{props.postedBy} </Text>
            {props.creation === null ? (
              <Text style={(styles.userC, { marginRight: 20 })}>Now</Text>
            ) : (
              <Text style={(styles.userC, { marginRight: 20 })}>
                {timeDifference(new Date(), props.creation.toDate())}
              </Text>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.userC}>{props.comment}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: 15,
                marginRight: 3,
                fontFamily: "Poppins",
              }}
            >
              {props.numOfLike}
            </Text>
            {props.likeBy ? (
              <Icon
                style={{
                  paddingLeft: 10,
                }}
                name="heart"
                type="ionicon"
                size={20}
                color="#000"
                onPress={props.removeLike}
              />
            ) : (
              <Icon
                style={{
                  paddingLeft: 10,
                }}
                name="heart-outline"
                type="ionicon"
                size={20}
                color="#000"
                onPress={props.addLike}
              />
            )}
            {props.firstUserId === props.secondUserId ? (
              <View style={{ flexDirection: "row" }}>
                <Icon
                  style={{
                    paddingLeft: 10,
                  }}
                  name="trash-outline"
                  type="ionicon"
                  size={20}
                  color="#000"
                  onPress={props.delete}
                />
                <Icon
                  style={{
                    paddingLeft: 10,
                  }}
                  name="create-outline"
                  type="ionicon"
                  size={20}
                  color="#000"
                  onPress={props.editComment}
                />
              </View>
            ) : null}
            <Icon
              style={{
                paddingLeft: 10,
              }}
              name="chatbubble-ellipses-outline"
              type="ionicon"
              size={20}
              color="#000"
              a
              onPress={props.onSelect}
            />
            <Text
              style={{
                fontSize: 15,
                marginRight: 3,
                fontFamily: "Poppins",
              }}
            >
              ({props.numberOfReply})
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentCon: {
    borderColor: "#E3562A",
    borderBottomWidth: 5,
    width: 300,
    paddingVertical: 3,
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
});

export default commentCard;
