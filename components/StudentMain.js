
import React, { Component } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import firebase from 'firebase'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  fetchUser,
  fetchUserPosts,
  fetchUserComment,
  fetchOption,
  fetchReportedDiscussion,
  fetchDiscussionRoom
} from "../redux/actions/index";
import { Icon } from "react-native-elements";
import firebase from "firebase";
require("firebase/firestore");

import FeedScreen from "./main/student/feed/Feed";
import ProfileScreen from "./main/student/profile/Profile";
import InventoryScreen from "./main/student/inventory/Inventory";
import MainScreen from "./main/student/mentorMentee/MainScreen";
import { useNavigation } from "@react-navigation/native";

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
  return null;
};

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  const navigation = useNavigation();
  return (
    <HomeStack.Navigator initialRouteName="Feed">
      <HomeStack.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          headerTitle: "P2PL",
          headerRight: () => (
            <View style={{ flexDirection: "row", paddingRight: 15 }}>
              <TouchableOpacity>
                <Icon
                  name="ios-search"
                  type="ionicon"
                  size={30}
                  color="#000"
                  onPress={() => navigation.navigate("Search Results")}
                />
              </TouchableOpacity>

              <TouchableOpacity>
                <Icon
                  name="notifications-outline"
                  type="ionicon"
                  size={30}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
    </HomeStack.Navigator>
  );
}

function InventoryStackScreen() {
  return (
    <HomeStack.Navigator initialRouteName="Inventory">
      <HomeStack.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{ headerTitle: "Inventory" }}
      />
    </HomeStack.Navigator>
  );
}

function MentorMenteeStackScreen() {
  const navigation = useNavigation();
  return (
    <HomeStack.Navigator initialRouteName="MainScreen">
      <HomeStack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{
          headerTitle: "Mentor Mentee Rooms",
        }}
      />
    </HomeStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <HomeStack.Navigator initialRouteName="Profile">
      <HomeStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: "Profile",
          headerRight: () => (
            <View style={{ flexDirection: "row", paddingRight: 15 }}>
              <TouchableOpacity>
                <Icon
                  name="exit-outline"
                  type="ionicon"
                  size={30}
                  color="#000"
                  onPress={() => LogOut()}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </HomeStack.Navigator>
  );
}

function LogOut() {
  return Alert.alert("Log Out", "Are you sure you want to log out ?", [
    // The "Yes" button
    {
      text: "Yes",
      onPress: () => {
        firebase.auth().signOut();
      },
    },
    // The "No" button
    // Does nothing but dismiss the dialog when tapped
    {
      text: "No",
    },
  ]);
}

export class Main extends Component {
  componentDidMount() {
    //this.props.clearData();
    this.props.fetchUser();
    this.props.fetchUserPosts();
    this.props.fetchUserComment();
    this.props.fetchOption();
    this.props.fetchReportedDiscussion();
    this.props.fetchDiscussionRoom();
  }
  render() {
    return (
      <Tab.Navigator
        initialRouteName="Feed"
        activeColor="#f0edf6"
        inactiveColor="#3e2465"
        labeled={false}
        barStyle={{
          backgroundColor: "#694fad",
        }}
      >
        <Tab.Screen
          name="Inventory"
          component={InventoryStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="database" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="MainScreen"
          component={MentorMenteeStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="school" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="Feed"
          component={HomeStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="AddContainer"
          component={EmptyScreen}
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault();
              navigation.navigate("Add Discussion");
            },
          })}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="plus-box" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileStackScreen}
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
  bindActionCreators(
    {
      fetchUser,
      fetchUserPosts,
      fetchUserComment,
      fetchOption,
      fetchReportedDiscussion,
      fetchDiscussionRoom
    },
    dispatch
  );
//, fetchUserPosts, fetchUserFollowing, clearData

export default connect(mapStateToProps, mapDispatchProps)(Main);
