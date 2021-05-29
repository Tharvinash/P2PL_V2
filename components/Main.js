import React, { Component } from 'react'
import { View, Text } from 'react-native'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import firebase from 'firebase'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, fetchUserComment} from '../redux/actions/index'

//, fetchUserPosts, fetchUserFollowing, clearData
import FeedScreen from './main/feed/Feed'
import ProfileScreen from './main/profile/Profile'
import InventoryScreen from './main/inventory/Inventory'

// import SearchScreen from './main/Search'

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return (null)
}

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
                barStyle={{ backgroundColor: '#694fad',  borderTopLeftRadius: 50,
                            borderTopRightRadius: 50, }}
            >
                  <Tab.Screen name="Inventory" component={InventoryScreen}
                    options={{
                        
                        tabBarIcon: ({ color, size }) => (
                         <MaterialCommunityIcons name="database" color={color} size={26} />
                    ),
                    }} />
                
                
                <Tab.Screen name="Feed" component={FeedScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                         <MaterialCommunityIcons name="home" color={color} size={26} />
                    ),
                    }} />
                
                <Tab.Screen name="AddContainer" component={EmptyScreen}
                     listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Add Discussion")
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                         <MaterialCommunityIcons name="plus-box" color={color} size={26} />
                    ),
                    }} /> 
               
                 <Tab.Screen name="Profile" component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                         <MaterialCommunityIcons name="account-circle" color={color} size={26} />
                    ),
                }}/>
            </Tab.Navigator>

            
        
        )
    }
}

//map to reducer
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts, fetchUserComment}, dispatch);
//, fetchUserPosts, fetchUserFollowing, clearData 

export default connect(mapStateToProps, mapDispatchProps)(Main);

