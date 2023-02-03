import React, { Component, useContext } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import {
  Button,
  Container,
  Icon,
  ScreenContainer,
  Touchable,
  withTheme,
} from "@draftbit/ui";
import Contex from "../store/Context";
import bg from "../images/bg.jpg";

const WinWidth = Dimensions.get("window").width;
const WinHeight = Dimensions.get("window").height;

export default Profile = ({ navigation }) => {
  const { state, depatch } = useContext(Contex);
  const { user } = state;
  const handleLogout = () => {
    console.log("logout");
    //handle logout in here

    //  navigation.navigate("Login");
  };
  return (
    <View style={{ flex: 1 }}>
      <ScreenContainer
        style={styles.screenContainerJb}
        scrollable={true}
        hasSafeArea={false}
      >
        <ImageBackground
          style={styles.imageBackgroundNb}
          source={bg}
          resizeMode="cover"
        />
        <Container
          style={styles.containerEA}
          elevation={0}
          useThemeGutterPadding={true}
        >
          {user?.avatar ? (
            <Image
              style={StyleSheet.flatten([styles.imageA3])}
              resizeMode="cover"
              source={{
                uri: user?.avatar,
              }}
            />
          ) : (
            <Image
              style={StyleSheet.flatten([styles.imageA3])}
              resizeMode="cover"
              source={{
                uri: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/908.jpg",
              }}
            />
          )}
          <Text style={StyleSheet.flatten([styles.textPr])}>
            {user?.first_name + " " + user?.last_name}
          </Text>
          <TouchableOpacity style={styles.buttonP2}>
            <Text style={{ color: "#8438f9", fontWeight: "600" }}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </Container>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "500", fontSize: 18, marginBottom: 12 }}>
            {`Hôm nay ${user?.first_name + " " + user?.last_name} có gì vui ?`}
          </Text>
          <Text style={{ textAlign: "center", paddingHorizontal: 30 }}>
            Hãy chia sẻ cảm súc với bạn bè và lưu lại những khoảng khắc đáng nhớ
            nhé
          </Text>
        </View>
        <TouchableOpacity style={styles.viewAl}>
          <Text onPress={() => handleLogout()}>Logout</Text>
        </TouchableOpacity>

        {/* <Container useThemeGutterPadding={true} elevation={0}>
          <Touchable style={StyleSheet.flatten([styles.touchableJg])}>
            <View style={styles.viewAl}>
              <Text
                style={{ position: "absolute", bottom: 0 }}
                onPress={() => handleLogout()}
              >
                Logout
              </Text>
              <Icon
                style={styles.iconZb}
                size={24}
                name="MaterialIcons/logout"
                color={"black"}
              />
            </View>
          </Touchable>
        </Container> */}
      </ScreenContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainerJb: {
    height: 50,
  },
  viewKs: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  viewYR: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  viewS1: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  viewAl: {
    backgroundColor: "#A5F1E9",
    paddingHorizontal: 12,
    paddingVertical: 12,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: 12,
  },
  imageBackgroundNb: {
    width: "100%",
    height: 200,
  },
  imageA3: {
    height: 100,
    width: 100,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "white",
  },
  containerEA: {
    alignItems: "center",
    marginTop: -65,
  },
  textPr: {
    width: "100%",
    textAlign: "center",
    marginTop: 16,
    fontSize: 25,
    fontWeight: "bold",
    lineHeight: 25,
    color: "black",
    textTransform: "capitalize",
  },
  touchableOk: {
    borderTopWidth: 1,
    borderColor: "#c4c4ca",
    paddingTop: 12,
    paddingBottom: 12,
    marginTop: 32,
  },
  iconFE: {
    height: 24,
    width: 24,
  },
  iconCl: {
    width: 24,
    height: 24,
  },
  iconZz: {
    width: 24,
    height: 24,
  },
  iconZb: {
    height: 24,
    width: 24,
  },
  buttonP2: {
    marginTop: 16,
    alignSelf: "center",
    width: 150,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#c4c4ca",
    backgroundColor: "white",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  touchableOm: {
    borderColor: "#c4c4ca",
    paddingBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  touchableBp: {
    borderColor: "#c4c4ca",
    paddingBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  touchableJg: {
    borderColor: "#c4c4ca",
    paddingBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
