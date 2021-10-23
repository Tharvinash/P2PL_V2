import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
require('firebase/firestore');
import { Icon } from 'react-native-elements';
import PointsList from '../../component/PointList';

const ContributionPoints = (props) => {
  const [awards, setAwards] = useState([]);
  const [currentUserData, setCurrentUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const title = props.route.params.title;

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', paddingRight: 15 }}>
          <TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ paddingHorizontal: 10 }}>
                <Icon
                  name='trophy-outline'
                  type='ionicon'
                  size={30}
                  color='#000'
                  onPress={() => {
                    props.navigation.navigate('AvailableAwards');
                  }}
                />
              </View>

              <Icon
                name='podium-outline'
                type='ionicon'
                size={30}
                color='#000'
                onPress={() => {
                  props.navigation.navigate('LeaderBoard');
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      ),
    });

    const loadAwards = async () => {
      setIsLoading(true);
      await firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          let awards = [];
          let awardList = snapshot.data().awards;
          for (let i = 0; i < awardList.length; i++) {
            awards.push({
              id: i.toString(),
              ...awardList[i],
            });
          }
          setAwards(awards);
        });

      await firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          setCurrentUserData(snapshot.data());
        });
      setIsLoading(false);
    };

    loadAwards();
  }, []);

  // if (isLoading) {
  //     return (
  //         <View style={styles.spinner}>
  //             <ActivityIndicator size="large" color="orange" />
  //         </View>
  //     )
  // }

  return (
    <View style={styles.screen}>
      <View style={styles.title}>
        <Text style={styles.titleText}>{title}</Text>
				<View></View>
      </View>
      <View style={styles.listContainer}>
        {isLoading ? (
          <View style={styles.spinner}>
            <ActivityIndicator size='large' color='orange' />
          </View>
        ) : awards.length === 0 ? (
          <View style={styles.fallBack}>
            <Text style={styles.fallbackText}>
              No awards received. Click the button below to know more
            </Text>
          </View>
        ) : (
          <FlatList
            data={awards}
            renderItem={(itemData) => (
              <PointsList
                points={itemData.item.pointsToBeAdded}
                title={itemData.item.title}
                description={itemData.item.description}
                time={itemData.item.creation}
              />
            )}
          />
        )}
      </View>
      <View style={styles.points}>
        <Text style={styles.pointsText}>
          Total Points:{' '}
          {isLoading ? (
            <View style={styles.spinner}>
              <ActivityIndicator size='small' color='orange' />
            </View>
          ) : (
            <Text
              numberOfLines={2}
              style={{ fontSize: 18, fontWeight: 'bold' }}
            >
              {currentUserData.totalPoints}
            </Text>
          )}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
    backgroundColor: '#140F38',
  },
  title: {
    marginBottom: 15,
    marginTop: 10,
    backgroundColor: '#694fad',
    paddingHorizontal: 15,
    paddingBottom: 3,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    textDecorationLine: 'underline',
  },
  text: {
    fontFamily: 'Poppins',
    fontSize: 15,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#E3562A',
    padding: 5,
    borderRadius: 20,
    width: 170,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '700',
  },
  points: {
    paddingHorizontal: 10,
    marginBottom: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#694fad',
  },
  pointsText: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
  listContainer: {
    height: '70%',
    width: '100%',
    borderRadius: 40,
    overflow: 'hidden',
    elevation: 20,
    backgroundColor: '#003565',
    marginHorizontal: 5,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  fallbackText: {
    textAlign: 'center',
    fontFamily: 'Poppins',
    color: 'white',
    padding: 30,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(ContributionPoints);
