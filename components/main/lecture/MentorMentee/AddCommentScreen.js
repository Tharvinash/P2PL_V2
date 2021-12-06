import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Animated,
  Dimensions,
  LogBox,
  ActivityIndicator,
} from 'react-native';

import MentionsTextInput from 'react-native-mentions';

import CommentCard from '../../component/commentCard';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import firebase from 'firebase';
import Images from 'react-native-scalable-image';
import { timeDifference } from '../../../utils';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { FAB, ListItem, BottomSheet } from 'react-native-elements';
require('firebase/firestore');

function AddCommentScreen(props) {
  const { currentUser } = props;
  const [isModalVisible, setModalVisible] = useState(false);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [isEditCommentModalVisible, setEditCommentModalVisible] =
    useState(false);
  const [commentId, setCommentId] = useState(null);
  const [isReportVisible, setReportVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editComment, setEditComment] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState('');
  const [data, setData] = useState(null);
  const [cu, setCu] = useState(currentUser);
  const [keyword, setKeyword] = useState('');
  const [caption, setCaption] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [datas, setDatas] = useState([]);
  const [mid, setMid] = useState([]);
  const [temporaryId, setTemporaryId] = useState(null);
  const [discussionId, setDiscussionId] = useState(props.route.params.did);
  const [image, setImage] = useState(null); //save local uri
  const [Doc, setDoc] = useState(null); //save local uri
  const [member, setMember] = useState([]);
  const [interactionPoint, setInteractionPoint] = useState([]);
  const [date, setDate] = useState([]);
  const [userStatus, setUserStatus] = useState(0);
  const [loadMore, setLoadMore] = useState(12);
  const [uuu, setuuu] = useState(0);
  const [totalComment, setTotalComment] = useState(0);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  //
  const [
    totalNumberOfAttachedDocument,
    setTotalNumberOfAttachedDocumenInteraction,
  ] = useState(0);
  const [totalNumberOfAttachedImage, setTotalNumberOfAttachedImage] =
    useState(0);
  const [totalNumberOfLike, setTotalNumberOfLike] = useState(0);
  const [totalNumberOfReplyComment, setTotalNumberOfReplyComment] = useState(0);
  const [totalNumberofComment, setTotalNumberofComment] = useState(0);
  //
  const userId = firebase.auth().currentUser.uid;
  const postedBy = currentUser.name;
  const [animatePress, setAnimatePress] = useState(new Animated.Value(1));

  const list = [
    {
      title: 'Edit',
      onPress: () => EditComment(temporaryId),
    },
    {
      title: 'Delete',
      onPress: () => Delete(temporaryId),
    },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: 'red' },
      titleStyle: { color: 'white' },
      onPress: () => setIsVisible(false),
    },
  ];

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          {userStatus == 1 ? (
            <TouchableOpacity style={{ marginHorizontal: 5 }}>
              <Icon
                name='stats-chart-outline'
                type='ionicon'
                size={30}
                color='#000'
                onPress={() => {
                  navtostats();
                }}
              />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity style={{ marginHorizontal: 5, marginBottom: -5 }}>
            <Icon
              name='information-circle-outline'
              type='ionicon'
              size={33}
              color='#000'
              onPress={() => {
                navtodetail();
              }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [data]);

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    const { currentUser } = props;
    if (currentUser.FavDiscussion !== null) {
      setUser(currentUser);
    }
    setUser(currentUser);
    if (props.route.params.did) {
      setDiscussionId(props.route.params.did);
    }
    setCaption('');
    setImage(null);
    firebase
      .firestore()
      .collection('DiscussionRoom')
      .doc(props.route.params.did)
      .get()
      .then((snapshot) => {
        setUserPosts(snapshot.data());
        setMember(snapshot.data().groupMember);
        setMid(snapshot.data().memberId);
        setDate(snapshot.data().date);
        setInteractionPoint(snapshot.data().interaction);
        setTotalNumberOfAttachedDocumenInteraction(
          snapshot.data().totalNumberOfAttachedDocument
        );
        setTotalNumberOfAttachedImage(
          snapshot.data().totalNumberOfAttachedImage
        );
        setTotalNumberOfLike(snapshot.data().totalNumberOfLike);
        setTotalNumberOfReplyComment(snapshot.data().totalNumberOfReplyComment);
        setTotalNumberofComment(snapshot.data().totalNumberofComment);
      });

    firebase
      .firestore()
      .collection('DiscussionRoomComment')
      .orderBy('creation', 'desc')
      .get()
      .then((snapshot) => {
        let comment = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setTotalComment(comment.length);
      });

    firebase
      .firestore()
      .collection('DiscussionRoomComment')
      .orderBy('creation', 'desc')
      .limit(loadMore)
      .get()
      .then((snapshot) => {
        let comment = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setComment(comment);
      });

    setTimeout(function () {
      setLoadMoreLoading(false);
    }, 1000);
    setUserStatus(currentUser.status);
    setData(11);
  }, [props.currentUser, props.route.params.did, data]);

  useFocusEffect(
    React.useCallback(() => {
      firebase
        .firestore()
        .collection('DiscussionRoomComment')
        .orderBy('creation', 'desc')
        .limit(loadMore)
        .get()
        .then((snapshot) => {
          let comment = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setComment(comment);
        });

      firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setCu(snapshot.data());
          } else {
            console.log('does not exist');
          }
        });
    }, [])
  );

  if (user === null) {
    return <View />;
  }

	const addImgPieChart = () => {
		let u = totalNumberOfAttachedImage + 1;
    firebase
      .firestore()
      .collection('DiscussionRoom')
      .doc(discussionId)
      .update({
        totalNumberOfAttachedImage: u,
      })
      .then(() => {
        console.log('done');
      });
  };

	const addDocPieChart = () => {
		let z = totalNumberOfAttachedDocument + 1;
    firebase
      .firestore()
      .collection('DiscussionRoom')
      .doc(discussionId)
      .update({
        totalNumberOfAttachedDocument: z,
      })
      .then(() => {
        console.log('done');
      });
    console.log('pie chart comment updated');
  };

  const addCommentPieChart = () => {
    let y = totalNumberofComment + 1;
    firebase
      .firestore()
      .collection('DiscussionRoom')
      .doc(discussionId)
      .update({
        totalNumberofComment: y,
      })
      .then(() => {
        console.log('done uploading number of comment');
      });
  };

  const addInteraction = () => {
    const today = new Date();
    const n = today.getMonth() + 1;
    const tomorrow = new Date(today);
    const createdDay = tomorrow.getDate();
    const finalDate = createdDay + '/' + n;

    if (date.includes(finalDate)) {
      const index = date.indexOf(finalDate);

      interactionPoint[index] = interactionPoint[index] + 1;

      firebase
        .firestore()
        .collection('DiscussionRoom')
        .doc(discussionId)
        .update({
          interaction: interactionPoint,
        })
        .then(() => {
          console.log('done');
        });
    } else {
      date.shift();
      interactionPoint.shift();
      date.push(finalDate);
      interactionPoint.push(0);
      const index = date.indexOf(finalDate);
      interactionPoint[index] = interactionPoint[index] + 1;
      firebase
        .firestore()
        .collection('DiscussionRoom')
        .doc(discussionId)
        .update({
          interaction: interactionPoint,
          date,
        })
        .then(() => {
          console.log('done');
        });
    }
  };

  const navtodetail = () => {
    props.navigation.navigate('GroupDetail', { did: discussionId, mid: mid });
  };

  const navtostats = () => {
    props.navigation.navigate('GroupStats', { did: discussionId });
  };

  const toggleEditComment = () => {
    setEditCommentModalVisible(!isEditCommentModalVisible);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setLoadMoreLoading(false);
  };

  const toggleVisibility = (cid) => {
    setIsVisible(true);
    setTemporaryId(cid);
  };

  const UploadComment = () => {
    addCommentPieChart();

    if (image == null && Doc == null) {
      finalCommentUpload(null, null);
    }

    if (image != null && Doc != null) {
      uploadDocV2();
      //add doc
      addImgPieChart();
      addDocPieChart();
      //add img
    }

    if (image == null && Doc != null) {
      uploadDoc();
      //add doc
      addDocPieChart();
    }

    if (image != null && Doc == null) {
      uploadImage();
      addImgPieChart();
    }

    addInteraction();
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.cancelled) {
      setDoc(result.uri);
      setName(result.name);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadDoc = async () => {
    const childPath = `attchedDoc/${1234}/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(Doc);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        finalCommentUpload(snapshot, null);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  const uploadImage = async () => {
    //const uri = props.route.params.image;
    const childPath = `attachedImage/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(image);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        finalCommentUpload(null, snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  const uploadDocV2 = async () => {
    const childPath = `attchedDoc/${1234}/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(Doc);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        uploadImageV2(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  const uploadImageV2 = async (docSnapshot) => {
    //const uri = props.route.params.image;
    const childPath = `attachedImage/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(image);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        finalCommentUpload(docSnapshot, snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  if (hasGalleryPermission === false) {
    return <View />;
  }
  if (hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const renderSuggestionsRow = ({ item }, hidePanel) => {
    return (
      <TouchableOpacity onPress={() => onSuggestionTap(item.name, hidePanel)}>
        <View style={styles.suggestionsRowContainer}>
          <View style={styles.userIconBox}>
            <Image
              style={{ aspectRatio: 1 / 1, height: 45 }}
              source={{
                uri: item.image,
              }}
            />
          </View>
          <View style={styles.userDetailsBox}>
            <Text style={styles.displayNameText}>{item.name}</Text>
            <Text style={styles.usernameText}>@{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const onSuggestionTap = (name, hidePanel) => {
    hidePanel();
    const comment = caption.slice(0, -keyword.length);
    setCaption(comment + '@' + name + ' ');
  };

  const xxx = () => {
    console.log(caption);
  };

  const callback = (keyword) => {
    setKeyword(keyword);
    let x = keyword.substring(1);
    const newArray2 = member.filter((e) => e.name >= x);
    setDatas(newArray2);
  };

  const finalCommentUpload = (doc, img) => {
    if (!caption.trim()) {
      alert('Please Enter Comment');
      return;
    } else {
      firebase
        .firestore()
        .collection('DiscussionRoomComment')
        .add({
          userId,
          postedBy: cu.name,
          discussionRoomId: discussionId,
          comment: caption,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          image: cu.image,
          likeBy: [],
          numOfLike: 0,
          numberOfReply: 0,
          attachedDocument: doc,
          attachedImage: img,
        })
        .then(function () {
          setModalVisible(!isModalVisible);
        });
      setData(57);
    }
  };

  const Delete = (cid) => {
    setIsVisible(false);
    return Alert.alert(
      'Are your sure?',
      'Are you sure you want to delete this comment ?',
      [
        // The "Yes" button
        {
          text: 'Yes',
          onPress: () => {
            firebase
              .firestore()
              .collection('DiscussionRoomComment')
              .doc(cid)
              .delete();
            setData(4);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'No',
        },
      ]
    );
  };

  const addLike = (cid, nol, lb) => {
    addLikePieChart();
    // add like
    const x = nol + 1;
    if (lb.includes(userId)) {
    } else {
      lb.push(userId);
    }

    firebase
      .firestore()
      .collection('DiscussionRoomComment')
      .doc(cid)
      .update({
        numOfLike: x,
        likeBy: lb,
      })
      .then(() => {
        console.log('done');
      });

    addInteraction();
    setData(2);
  };

  const removeLike = (cid, nol, lb) => {
    const x = nol - 1;
    const indexx = lb.indexOf(userId);
    if (indexx > -1) {
      lb.splice(indexx, 1);
    }

    firebase
      .firestore()
      .collection('DiscussionRoomComment')
      .doc(cid)
      .update({
        numOfLike: x,
        likeBy: lb,
      })
      .then(() => {
        console.log('done');
      });
    setData(3);
  };

  const EditComment = (cid) => {
    setIsVisible(false);
    setCommentId(cid);
    firebase
      .firestore()
      .collection('DiscussionRoomComment')
      .doc(cid)
      .get()
      .then((snapshot) => {
        setCaption(snapshot.data().comment);
      });
    setEditCommentModalVisible(!isEditCommentModalVisible);
  };

  const uploadUpdatedComment = () => {
    if (!editComment.trim()) {
      alert('Please Enter Comment');
      return;
    } else {
      firebase
        .firestore()
        .collection('DiscussionRoomComment')
        .doc(commentId)
        .update({
          comment: caption,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          console.log('save');
        });
      setEditCommentModalVisible(!isEditCommentModalVisible);
    }

    setData(88);
  };

  const loadMoreComment = () => {
    setLoadMoreLoading(true);
    let x = 8;
    setLoadMore(loadMore + x);
    setData(9);
  };

  return (
    <View style={{ justifyContent: 'center' }}>
      {/* style={styles.searchSection} */}
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
          <View style={{ width: '100%' }}>
            <MentionsTextInput
              textInputStyle={styles.searchSection}
              suggestionsPanelStyle={{
                backgroundColor: '#fff',
              }}
              textInputMinHeight={30}
              textInputMaxHeight={80}
              trigger={'@'}
              triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
              value={caption}
              onChangeText={setCaption}
              triggerCallback={callback}
              renderSuggestionsRow={renderSuggestionsRow}
              suggestionsData={datas}
              keyExtractor={(item, index) => item.name}
              suggestionRowHeight={45}
              horizontal={false}
              MaxVisibleRowCount={3}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Icon
            style={{ marginTop: 5 }}
            name='attach-outline'
            type='ionicon'
            size={30}
            color='#fff'
            // onPress={() => {
            //   pickDocument();
            // }}
            onPress={pickDocument}
          />
          <Icon
            style={styles.searchIcon}
            name='image-outline'
            type='ionicon'
            size={30}
            color='#fff'
            // onPress={() => {
            //   pickImage();
            // }}
            onPress={pickImage}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'space-between',
        }}
      >
        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity style={styles.blogout} onPress={UploadComment}>
            <Text style={styles.Ltext}>Add Comment</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={styles.blogout}
            //onPress={toggleModal}
            onPress={toggleModal}
          >
            <Text style={styles.Ltext}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    // marginTop: 20,
    marginBottom: 5,
    // marginLeft: 20,
    // marginLeft:20
  },

  titlex: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Poppins',
    paddingVertical: 0,
    //  marginVertical: -5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  titley: {
    color: '#fff',
    fontSize: 25,
    fontFamily: 'Poppins',
    paddingVertical: 0,
    //  marginVertical: -5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    fontWeight: '700',
    marginBottom: 20,
  },

  card: {
    borderRadius: 16,
    elevation: 5,
    backgroundColor: '#140F38',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    width: 340,
  },

  cardContent: {
    marginVertical: 10,
    marginHorizontal: 18,
  },

  input: {
    height: 60,
    borderColor: '#E3562A',
    borderWidth: 1,
    backgroundColor: '#FFF',
    width: 340,
    borderRadius: 12,
    padding: 10,
    fontFamily: 'Poppins',
  },

  title: {
    fontSize: 20,
    fontFamily: 'Poppins',
    lineHeight: 20,
    fontWeight: '700',
    marginBottom: 5,
  },

  commentCon: {
    borderColor: '#E3562A',
    borderBottomWidth: 5,
    width: 300,
    paddingVertical: 3,
  },

  desc: {
    fontSize: 14,
  },

  descT: {
    fontSize: 20,
    lineHeight: 25,
    fontFamily: 'Poppins',
    marginTop: 10,
  },

  comT: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 18,
  },

  userT: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 15,
  },

  userC: {
    fontFamily: 'Poppins',
    lineHeight: 20,
    fontSize: 15,
  },

  blogout: {
    width: 140,
    height: 40,
    backgroundColor: '#E3562A',
    borderColor: '#E3562A',
    borderRadius: 16,
    marginTop: 20,
  },

  Ltext: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 15,
    justifyContent: 'space-between',
    paddingTop: 8,
  },

  suggestionsRowContainer: {
    flexDirection: 'row',
  },
  userAvatarBox: {
    width: 35,
    paddingTop: 2,
  },
  userIconBox: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#54c19c',
  },
  usernameInitials: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  userDetailsBox: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 15,
  },
  displayNameText: {
    fontSize: 13,
    fontWeight: '500',
  },
  usernameText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  comments: store.userState.comment,
});

export default connect(mapStateToProps, null)(AddCommentScreen);