import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements';

const viewAvailableGroup = (props) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={2} style={styles.title}>
            {props.title}
          </Text>
          <Text style={styles.faculty}>{props.description}</Text>
        </View>
        {props.added ? (
          <TouchableOpacity onPress={props.RemoveInGroup}>
            <Icon
              name='remove-circle-outline'
              type='ionicon'
              size={30}
              color='#fff'
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={props.AddInGroup}>
            <Icon name='add-outline' type='ionicon' size={30} color='#fff' />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140F38',
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    borderRadius: 16,
    elevation: 5,
    backgroundColor: '#003565',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    width: Dimensions.get('window').width * 0.95,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 6,
  },

  cardContent: {
    marginVertical: 10,
    marginHorizontal: 18,
  },

  faculty: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Poppins',
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Poppins',
    paddingVertical: 0,
    //  marginVertical: -5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    lineHeight: 25,
  },
});

export default viewAvailableGroup;
