import React from 'react'
import { Text, View, Button, StyleSheet, TouchableOpacity, Image  } from 'react-native'

export default function Landing({ navigation }) {

    
    return (
        <View style={styles.container}>
            <Image style = {styles.img} source={require('../../assets/Logo.png')} />
             <View>
                    <Text style = {styles.title}>
                        Peer to Peer Learning Platform
                    </Text>
                </View>
            <View style={{padding: 20}}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.text}>
                        REGISTER
                    </Text>
                </TouchableOpacity>
            </View>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.text}>
                        LOGIN
                    </Text>
                </TouchableOpacity>        
            
        </View>

        
    )
}

const styles = StyleSheet.create({

    container: {
    flex: 1,
    backgroundColor: '#140F38', 
    alignItems: 'center',
    justifyContent: 'center',
    },

    button: {
    alignItems: "center",
    backgroundColor: '#E3562A',
    padding: 14,
    borderRadius: 20,
    width: 275,
    height: 56,
    
    },
    text: {
        color: "white",
        fontSize: 18,
        textAlign: "center",
        fontFamily: 'Poppins',
        fontWeight: ('700')
    },
    title: {
        color: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        color: "white",
        fontSize: 30,
        textAlign: "center",
        fontFamily: 'Poppins',
        fontWeight: ('700'),
        
    },

    img: {
        width: 147,
        height: 184,
        
    }

 
 
});