import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import UploadFile from '../../component/UploadFile';
import firebase from 'firebase';
import InventoryList from '../../component/InventoryList';
import { FAB } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import { getStorage, ref, deleteObject } from 'firebase/storage';
require('firebase/firestore');

let name2;
const Inventory = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Doc, setDoc] = useState(null); //save local uri
  const [name, setName] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [data, setData] = useState(null);
  const [docList, setDocList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDoc(null);
    const loadDocs = async () => {
      setIsLoading(true);
      await firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('Inventory')
        .get()
        .then((snapshot) => {
          let list = snapshot.docs.map((doc) => {
            let id = doc.id;
            let title = doc.data().title;
            let link = doc.data().docLink;
            let path = doc.data().path;
            return { id, title, link, path };
          });
          setDocList(list);
        });

      setIsLoading(false);
      setData(3);
    };
    loadDocs();
  }, [data]);

  useFocusEffect(
    React.useCallback(() => {
      setDoc(null);
      const loadDocs = async () => {
        setIsLoading(true);
        await firebase
          .firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .collection('Inventory')
          .orderBy('creation', 'desc')
          .get()
          .then((snapshot) => {
            let list = snapshot.docs.map((doc) => {
              let id = doc.id;
              let title = doc.data().title;
              let link = doc.data().docLink;
              let path = doc.data().path;
              return { id, title, link, path };
            });
            setDocList(list);
          });
        setIsLoading(false);
      };

      loadDocs();
    }, [data])
  );

  const uploadDoc = async () => {
    setCanEdit(false);
    if (name2 == undefined || Doc == null) {
      Alert.alert('No document selected', 'Please select a document', [
        {
          text: 'Ok',
        },
      ]);
    } else {
      setIsLoading(true);
      console.log('else block');
      const childPath = `inventory/${
        firebase.auth().currentUser.uid
      }/${Math.random().toString(36)}`;
      console.log(childPath);
      const response = await fetch(Doc);
      console.log('Doc ' + Doc);
      const blob = await response.blob();
      const task = firebase.storage().ref().child(childPath).put(blob);

      const taskProgress = (snapshot) => {
        console.log(`transferred: ${snapshot.bytesTransferred}`);
      };

      const taskCompleted = () => {
        task.snapshot.ref.getDownloadURL().then((snapshot) => {
          firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('Inventory')
            .add({
              title: name,
              creation: firebase.firestore.FieldValue.serverTimestamp(),
              docLink: snapshot,
              path: childPath,
            });
          console.log(snapshot);
          setData(2);
        });
      };

      const taskError = (snapshot) => {
        console.log(snapshot);
      };

      task.on('state_changed', taskProgress, taskError, taskCompleted);

      setIsModalVisible(!isModalVisible);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setName('');
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.cancelled) {
      setDoc(result.uri);
      setName(result.name);
      setCanEdit(true);
      console.log(result.name);
      console.log(result.uri);
      name2 = result.name;
      console.log(name2);
    }
  };

  const deleteDoc = (id, path) => {
    Alert.alert(
      'Are your sure?',
      'Are you sure you want to delete this comment ?',
      [
        {
          text: 'Yes',
          onPress: () => {
            console.log('delete');
            firebase
              .firestore()
              .collection('users')
              .doc(firebase.auth().currentUser.uid)
              .collection('Inventory')
              .doc(id)
              .delete();
            setData(1);

            // var storageRef = getStorage.ref();
            // // Create a reference to the file to delete
            // var desertRef = storageRef.child(path);

            // // Delete the file
            // desertRef.delete().then(() => {
            //   // File deleted successfully
            // }).catch((error) => {
            //   // Uh-oh, an error occurred!
            // });
          },
        },
        {
          text: 'No',
        },
      ]
    );
  };

  return (
    <View style={{ backgroundColor: '#140F38', flex: 1 }}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ marginTop:70, marginBottom:10}}>
          <Text style={styles.title}>
            A place where you can store your personal files
          </Text>
        </View>

        <View>
          {isLoading ? (
            <View style={styles.spinner}>
              <ActivityIndicator size='large' color='orange' />
            </View>
          ) : docList.length === 0 ? (
            <View style={styles.fallBack}>
              <Text style={styles.fallbackText}>No documents uploaded</Text>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <FlatList
                data={docList}
                renderItem={(itemData) => (
                  <InventoryList
                    docTitle={itemData.item.title}
                    delete={() =>
                      deleteDoc(itemData.item.id, itemData.item.path)
                    }
                    link={itemData.item.link}
                  />
                )}
              />
            </View>
          )}
        </View>
      </View>
      <View>
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType='slide'
        >
          <UploadFile
            toggleModal={() => toggleModal()}
            pickDocument={() => pickDocument()}
            docName={name}
            editable={canEdit}
            setNewDocName={(newDocName) => setName(newDocName)}
            uploadDoc={() => uploadDoc()}
          />
        </Modal>
      </View>
      <FAB
        placement='right'
        color='#E3562A'
        onPress={toggleModal}
        size='large'
        icon={
          <Icon reverse name='upload' type='font-awesome-5' color='#E3562A' />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  blogout: {
    width: 160,
    height: 40,
    backgroundColor: '#E3562A',
    borderColor: '#E3562A',
    borderRadius: 16,
    marginTop: 25,
  },
  Ltext: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 18,
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  listContainer: {
    height: '80%',
    width: '96%',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 20,
    backgroundColor: '#003565',
    marginTop: 30,
  },
  spinner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallBack: {
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
  title: {
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 20,
  },
});

export default Inventory;
