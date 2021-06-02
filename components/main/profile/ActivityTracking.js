import React, {useState} from 'react'
import Modal from 'react-native-modal';
import {View, Text, Button, TextInput, Image, Dimensions} from 'react-native'
export default function Cd() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [comment, setComments] = useState("")

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };

    const xxx = () => {
       console.log(comment)
       setModalVisible(!isModalVisible);
      };
    
  
    return (
      <View style={{flex: 1}}>
        <Button title="Show modal" onPress={toggleModal} />
  
        <Modal isVisible={isModalVisible} >
          <View style={{flex: 1}}>
          <View style={{paddingTop:10}}>
                <TextInput
                    placeholder="Add comments here"
                    placeholderTextColor="#000"
                    multiline={true}
                    onChangeText={(comment)=> setComments(comment)}
                />
            </View>
  
            <Button title="Hide modal" onPress={xxx} />
          </View>
        </Modal>
      </View>
    );
}
