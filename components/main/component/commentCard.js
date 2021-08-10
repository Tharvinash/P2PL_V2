import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { timeDifference } from "../../utils";

const commentCard = (props) => {
  const a = props.verify;
  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flexDirection: "column" }}>
          <Image
            style={{
              marginRight: 10,
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
        {props.firstUserId === props.secondUserId ? (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.mainBubble}
            onLongPress={props.xxx}
            delayLongPress={500}
          >
            <View style={{ marginLeft: 5 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.userName}>{props.postedBy} </Text>
                {props.creation === null ? (
                  <Text style={(styles.time, { marginRight: 20 })}>Now</Text>
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
          </TouchableOpacity>
        ) : (
          <View style={styles.mainBubble}>
            <View style={{ marginLeft: 5 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.userName}>{props.postedBy} </Text>
                {props.creation === null ? (
                  <Text style={(styles.time, { marginRight: 20 })}>Now</Text>
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
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainBubble: {
    borderColor: "#E3562A",
    borderBottomWidth: 5,
    width: "85 %",
    paddingVertical: 3,
    backgroundColor: "#D3D3D3",
    borderRadius: 10,
    marginBottom: 5,
  },

  userName: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontSize: 17,
  },

  userC: {
    fontFamily: "Poppins",
    lineHeight: 20,
    fontSize: 15,
  },
});

export default commentCard;
