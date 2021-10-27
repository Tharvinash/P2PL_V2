import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const Ranking = (props) => {
  return (
    <View style={styles.screen}>
      <View style={styles.details}>
        <View style={styles.imageBox}>
          <Image style={styles.image} source={{ uri: props.image }} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{props.name}</Text>
          <Text style={styles.userTitle}>{props.title}</Text>
          <Text numberOfLines={2} style={styles.userFaculty}>{props.faculty}</Text>
        </View>
      </View>
      <View style={styles.points}>
        <Text style={styles.pointsText}>{props.points}</Text>
        <Text style={styles.pointsText2}>points</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop:5,
    flexDirection: 'row',
   // height: Dimensions.get('window').width * 0.3,
    margin: 5,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#003565',
  },
  details: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#003565',
  },
  imageBox: {
    width: '30%',
    marginHorizontal: 5,
  },
  image: {
    width: Dimensions.get('window').width * 0.2,
    height: Dimensions.get('window').width * 0.2,
    borderRadius: 45,
    marginLeft: 5,
  },
  userInfo: {
    padding: 5,
    paddingLeft: 5,
    width: '68%',
    // backgroundColor:"red"
  },
  userName: {
    fontFamily: 'Poppins',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 3,
    color: 'white',
  },
  userTitle: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  userFaculty: {
    fontFamily: 'Poppins',
    fontSize: 15,
    color: 'white',
    lineHeight: 20,
  },
  points: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#694fad',
  },
  pointsText: {
    fontFamily: 'Poppins',
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  pointsText2: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Ranking;
