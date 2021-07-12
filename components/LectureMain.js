import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';
import { Icon } from "react-native-elements";
import firebase from 'firebase'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  fetchUser,
  fetchUserPosts,
  fetchUserComment,
  fetchReportedDiscussion
} from "../redux/actions/index";

//lecture main 
import LectureFeed from "./main/lecture/lectureMain/LectureFeed";
import LectureProfile from "./main/lecture/lectureMain/LectureProfile";
import Room from "./main/lecture/lectureMain/Room";


const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
  return null;
};

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  const navigation = useNavigation();
  return (
    <HomeStack.Navigator initialRouteName="Feed">
      <HomeStack.Screen name="Feed" component={LectureFeed}  options={{ headerTitle: "P2PL", headerRight: () => (
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
  ), headerStyle:{backgroundColor:"#fff"}}}/>
    </HomeStack.Navigator>
  );
}


function ProfileStackScreen() {
  return (
    <HomeStack.Navigator initialRouteName="Profile">
      <HomeStack.Screen name="Profile" component={LectureProfile}  options={{ headerTitle: "Profile", headerRight: () => (
  <View style={{ flexDirection: "row", paddingRight: 15 }}>
    <TouchableOpacity>
      <Icon
        name="exit-outline"
        type="ionicon"
        size={30}
        color="#000"
        onPress={() => firebase.auth().signOut()}
      />
    </TouchableOpacity>
  </View>
) }}/>
    </HomeStack.Navigator>
  );
}

function RoomStackScreen() {
  return (
    <HomeStack.Navigator initialRouteName="Room">
      <HomeStack.Screen name="Room" component={Room}  options={{ headerTitle: "Discussion Room" }}/>
    </HomeStack.Navigator>
  );
}


export class Main extends Component {
  componentDidMount() {
    //this.props.clearData();
    this.props.fetchUser();
    this.props.fetchUserPosts();
    this.props.fetchUserComment();
    this.props.fetchReportedDiscussion();
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
          component={RoomStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-group" color={color} size={26} />
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
          name="LectureProfile"
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
  bindActionCreators({ fetchUser, fetchUserPosts, fetchUserComment, fetchReportedDiscussion }, dispatch);
//, fetchUserPosts, fetchUserFollowing, clearData

export default connect(mapStateToProps, mapDispatchProps)(Main);