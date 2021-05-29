import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView  } from 'react-native'
import firebase from 'firebase'
require('firebase/firestore')
function EditDiscussion(props) {

    const [userPosts, setUserPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        
            firebase.firestore()
                .collection("Discussion")
                .doc(props.route.params.did)
                .get()
                .then((snapshot) => {
                 //   console.log(snapshot.data().description)
                    setDescription(snapshot.data().description)
                    setTitle(snapshot.data().title)
                })

    }, [])

    const Save = (title,description) => {
          firebase.firestore()
            .collection('Discussion')
            .doc(props.route.params.did)
            .update({
                title,
                description,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then(()=> {
                props.navigation.goBack()
                console.log("save")
            })
    }


    // const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
    // const [imageUrl, setImageUrl] = useState(
    //     editedProduct ? editedProduct.imageUrl : ''
    // );
    // const [price, setPrice] = useState('');
    // const [description, setDescription] = useState(
    //     editedProduct ? editedProduct.description : ''
    // );

    // const submitHandler = useCallback(() => {
    //     console.log('Submitting!');
    // }, []);

    // useEffect(() => {
    //     props.navigation.setParams({ submit: submitHandler });
    // }, [submitHandler]);
        
    
    return (
        <View>
            <View style={styles.form}>
                <View style={styles.formControl}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={title => setTitle(title)}
                />
                </View>
                <View style={styles.formControl}>
                <Text style={styles.label}>Image URL</Text>
                <TextInput
                    style={styles.input}
                //  value={imageUrl}
                // onChangeText={text => setImageUrl(text)}
                />
                </View>

                <View style={styles.formControl}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={description => setDescription(description)}
                />
                </View>
            </View>
            <View style={{justifyContent:"center", alignItems:"center"}}>
                <TouchableOpacity style={styles.logout} onPress={() => Save(title,description)}>
                    <Text style={styles.Ltext}>
                    Save Changes
                    </Text>
            </TouchableOpacity>
            </View>
            
        </View>
    )
}


const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  formControl: {
    width: '100%'
  },
  label: {
        fontFamily: 'Poppins',
        fontSize: 20,
        marginVertical: 8
  },
    input: {
      fontFamily: 'Poppins',
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
    },
    
    logout: {
        width: 160,
        height: 40,
        backgroundColor: "#E3562A",
        borderColor: "#E3562A",
        borderRadius: 16,
        marginTop: 20,
        justifyContent: "center",
        alignItems:"center",
        
    },

    Ltext: {
        color: "#fff",
        textAlign: "center",
        fontFamily: 'Poppins',
        fontWeight: ('700'),
        fontSize: 15,
        justifyContent: "space-between",

    },
});

export default EditDiscussion