import React from "react";
import { View, Text, StyleSheet } from "react-native";
import moment from "moment";


const PointsList = (props) => {

    let time;
    if (props.time) {
        time = moment(props.time).format("MMMM Do, YYYY")
    }



    return (
        <View style={styles.list}>
            <View style={styles.points}>
                <Text style={styles.pointsText}>{props.points}</Text>
            </View>
            <View style={styles.details}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>{props.title}</Text>
                </View>
                <View style={styles.description}>
                    <Text numberOfLines={2} style={styles.descriptionText}>{props.description}</Text>
                </View>
                {props.time ? (<View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                    <Text style={{ fontStyle: "italic", ...styles.descriptionText }}>Awarded: {time}</Text>
                </View>) : null }

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    list: {
        flexDirection: "row",
        flex: 1,
        height: 100,
        borderBottomWidth: 2,
        borderBottomColor: "black",
    },
    points: {
        backgroundColor: "#694fad",
        width: "20%",
        justifyContent: "center",
        alignItems: "center"

    },
    pointsText: {
        fontFamily: "Poppins",
        fontSize: 18,
        fontWeight: "bold",
        color: "white"
    },
    details: {
        width: "80%",
        flexDirection: "column",
        justifyContent: "center",
        padding: 5,
        backgroundColor: "#003565"
    },
    titleText: {
        fontFamily: "Poppins",
        fontSize: 17,
        fontWeight: "600",
        color: "white"
    },
    descriptionText: {
        fontFamily: "Poppins",
        fontSize: 12,
        fontWeight: "200",
        color: "white"
    },



});

export default PointsList;