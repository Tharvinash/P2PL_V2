import { StatusBar } from "expo-status-bar";
import React, { Component, useState } from "react";
import { View, Text, Button } from "react-native";
import { Icon } from "react-native-elements";
import * as Font from "expo-font";
import * as Linking from "expo-linking";
import AppLoading from "expo-app-loading";
//import AppLoading from 'expo-app-loading';
//-----------------REDUX---------------//
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";
const store = createStore(rootReducer, applyMiddleware(thunk));
//-----------------REDUX---------------//

//-----------------FIREBASE---------------//
import * as firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyDPYOE3Lff7hHBqmOUxFp18JwONipAVPEg",
  authDomain: "p2pl-bcbbd.firebaseapp.com",
  projectId: "p2pl-bcbbd",
  storageBucket: "p2pl-bcbbd.appspot.com",
  messagingSenderId: "363868767911",
  appId: "1:363868767911:web:e3cc40d0d5ea10527f3d82",
  measurementId: "G-HHLLCS1WDW",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
//-----------------FIREBASE---------------//

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

//Student Profile
import CreatedDiscussion from "./components/main/student/profile/CreatedDiscussion";
import ActivityTracking from "./components/main/student/profile/ActivityTracking";
import FilterFeed from "./components/main/student/profile/FilterFeed";
import FavoriteDiscussion from "./components/main/student/profile/FavoriteDiscussion";
import EditProfile from "./components/main/student/profile/EditProfile";
import EditDeleteDiscussion from "./components/main/student/profile/EditDeleteDiscussion";
import EditPassword from "./components/main/student/profile/EditPassword";

//Auth
import LandingScreen from "./components/auth/Landing";
import RegisterScreen from "./components/auth/Register";
import LoginScreen from "./components/auth/Login";

//Main Screen
import MainScreen from "./components/StudentMain";

//Add Discussion    
import AddScreen from "./components/main/student/addDiscussion/Add";
import EditDiscussion from "./components/main/student/addDiscussion/EditDiscussion";
import EditComment from "./components/main/student/addDiscussion/EditComment";

//Lecture
import LectureMainScreen from "./components/LectureMain";
import ReportedDiscussion from "./components/main/lecture/profile/ReportedDiscussion";
import LectureDiscussionView from "./components/main/lecture/Discussion/LectureDiscussionView";

//feed
import DiscussionTitle from "./components/main/student/feed/ViewDiscussion";
import PostComment from "./components/main/student/addDiscussion/PostComment";
import Search from "./components/main/student/feed/Search";
import Reply from "./components/main/student/feed/Reply";


export class App extends Component {
  constructor(props) {
    super();
    this.state = {
      loaded: false,
    };
  }

  async componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              this.setState({
                email: snapshot.data().email,
              });
            } else {
              console.log("does not exist");
            }
          });
      }
    });

    await Font.loadAsync({
      Poppins: require("./assets/fonts/Poppins.ttf"),
      "Poppins-MediumItalic": require("./assets/fonts/Poppins-MediumItalic.ttf"),
    });
    this.setState({ loading: false });
  }
  render() {
    const { loggedIn, loaded, email } = this.state;
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <AppLoading />
        </View>
      );
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    //Lecture1
    if (email === "lecture1@um.edu.my" || email === "lecture2@um.edu.my") {
      return (
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Main2">
              <Stack.Screen
                name="Main2"
                component={LectureMainScreen}
                options={{ headerShown: false }}
                navigation={this.props.navigation}
              />

              <Stack.Screen
                name="LectureDiscussionView"
                component={LectureDiscussionView}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name="ReportedDiscussion"
                component={ReportedDiscussion}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name="EditProfile"
                component={EditProfile}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name="Change Password"
                component={EditPassword}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name="Filter Feed"
                component={FilterFeed}
                navigation={this.props.navigation}
              />
              <Stack.Screen
                name="Search Results"
                component={Search}
                navigation={this.props.navigation}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      );
    }
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="StudentMain">
            <Stack.Screen
              name="StudentMain"
              component={MainScreen}
              options={{ headerShown: false }}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Add Discussion"
              component={AddScreen}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Created Discussions"
              component={CreatedDiscussion}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Activity Tracking"
              component={ActivityTracking}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Filter Feed"
              component={FilterFeed}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Favorite Discussion"
              component={FavoriteDiscussion}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Discussion"
              component={DiscussionTitle}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Created Discussion"
              component={EditDeleteDiscussion}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Edit Discussion"
              component={EditDiscussion}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="EditComment"
              component={EditComment}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Post Comment"
              component={PostComment}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Search Results"
              component={Search}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Change Password"
              component={EditPassword}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Reply Discussion"
              component={Reply}
              navigation={this.props.navigation}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
