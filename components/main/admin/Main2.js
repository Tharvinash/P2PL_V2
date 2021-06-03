import React, { Component } from "react";
import { View, Text } from "react-native";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import firebase from 'firebase'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  fetchUser,
  fetchUserPosts,
  fetchUserComment,
} from "../../../redux/actions/index";

import LectureFeed from "../admin/lectureMain/LectureFeed";
import LectureProfile from "../admin/lectureMain/LectureProfile";
import Room from "../admin/lectureMain/Room";


const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
  return null;
};

export class Main extends Component {
  componentDidMount() {
    //this.props.clearData();
    this.props.fetchUser();
    this.props.fetchUserPosts();
    this.props.fetchUserComment();
    //  this.props.fetchUserFeed();
  }
  render() {
    // const { currentUser } = this.props;
    // console.log(currentUser)
    //current user data
    return (
      <Tab.Navigator
        initialRouteName="Feed"
        activeColor="#f0edf6"
        inactiveColor="#3e2465"
        labeled={false}
        barStyle={{
          backgroundColor: "#694fad",
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
        }}
      >
        <Tab.Screen
          name="Room"
          component={Room}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-group" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="Feed"
          component={LectureFeed}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="LectureProfile"
          component={LectureProfile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-circle"
                color={color}
                size={26}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

//map to reducer
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUser, fetchUserPosts, fetchUserComment }, dispatch);
//, fetchUserPosts, fetchUserFollowing, clearData

export default connect(mapStateToProps, mapDispatchProps)(Main);
