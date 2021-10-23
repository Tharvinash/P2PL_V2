import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';
import { Tab, TabView } from 'react-native-elements';
import { connect } from 'react-redux';
import firebase from 'firebase';
import DiscussinCard from '../../component/discussionCard';

function ViewRequest(props) {
  const { requestForAMentor, requestToBeAMentor, currentUser } = props;
  const [index, setIndex] = React.useState(0);
  const [menteeArray, setMenteeArray] = useState([]);
  const [mentorArray, setMentorArray] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      firebase
        .firestore()
        .collection('RequestForMentor')
        .get()
        .then((snapshot) => {
          let rfam = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          const menteeArray = [...rfam].filter(
            (el) => el.faculty === currentUser.faculty
          ); // CHANGES
          setMenteeArray(menteeArray);
        });
      firebase
        .firestore()
        .collection('RequestToBeMentor')
        .get()
        .then((snapshot) => {
          let rtbam = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          const mentorArray = [...rtbam].filter(
            (el) => el.faculty === currentUser.faculty
          ); // CHANGES
          setMentorArray(mentorArray);
        });
    }, [])
  );

  useEffect(() => {
    firebase
      .firestore()
      .collection('RequestForMentor')
      .get()
      .then((snapshot) => {
        let rfam = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        const menteeArray = [...rfam].filter(
          (el) => el.faculty === currentUser.faculty
        ); // CHANGES
        setMenteeArray(menteeArray);
      });
    firebase
      .firestore()
      .collection('RequestToBeMentor')
      .get()
      .then((snapshot) => {
        let rtbam = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        const mentorArray = [...rtbam].filter(
          (el) => el.faculty === currentUser.faculty
        ); // CHANGES
        setMentorArray(mentorArray);
      });
  }, []);

  const renderItem = ({ item }) => <Item title={item.title} />;
  return (
    <>
      <Tab value={index} onChange={setIndex}>
        <Tab.Item title='Request for a mentor' />
        <Tab.Item title='Request to be a mentor' />
      </Tab>

      <TabView value={index} onChange={setIndex}>
        <TabView.Item style={{ width: '100%' }}>
          <View style={{ alignItems: 'center' }}>
            <FlatList
              horizontal={false}
              extraData={menteeArray}
              data={menteeArray}
              keyExtractor={(requestForAMentor) => requestForAMentor.id}
              renderItem={
                ({ item }) => (
                  // item.favBy.includes(userId) ? (
                  <DiscussinCard
                    title={item.name}
                    faculty={item.description}
                    onSelect={() =>
                      props.navigation.navigate('ViewDetailMentee', {
                        did: item.id,
                      })
                    }
                  />
                )
                //  ) : null
              }
            />
          </View>
        </TabView.Item>
        <TabView.Item style={{ width: '100%' }}>
          <View style={{ alignItems: 'center' }}>
            <FlatList
              horizontal={false}
              extraData={mentorArray}
              data={mentorArray}
              keyExtractor={(requestToBeAMentor) => requestToBeAMentor.id}
              renderItem={
                ({ item }) => (
                  // item.favBy.includes(userId) ? (
                  <DiscussinCard
                    title={item.name}
                    faculty={item.description}
                    onSelect={() =>
                      props.navigation.navigate('ViewDetailMentor', {
                        did: item.id,
                      })
                    }
                  />
                )
                //  ) : null
              }
            />
          </View>
        </TabView.Item>
      </TabView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

const mapStateToProps = (store) => ({
  requestForAMentor: store.userState.requestForAMentor,
  requestToBeAMentor: store.userState.requestToBeAMentor,
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(ViewRequest);
