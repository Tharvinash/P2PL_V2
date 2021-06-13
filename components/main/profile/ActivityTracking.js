import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import ImageView from "react-native-image-view";

export default function FavDiscussion(props) {

const images = [
  {
    uri: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4",
  },

];

  const [visible, setIsVisible] = useState(false);
  const xxx = () => {
    setIsVisible(!visible);
  };

  return (
    <ImageView
    images={images}
    visible={true}
    onRequestClose={() => setIsVisible(false)}
  />
    // <View>
    //   {visible ? (
    //     <TouchableOpacity onPress={() => xxx()}>
    //       <Image
    //         style={styles.tinyLogo}
    //         source={{
    //           uri: "https://reactnative.dev/img/tiny_logo.png",
    //         }}
    //       />
    //     </TouchableOpacity>
    //   ) : (
    //     <ImageView
    //       images={images}
    //       imageIndex={0}
    //       visible={visible}
    //       onRequestClose={() => setIsVisible(true)}
    //     />
    //   )}
    //   <View></View>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },
});
