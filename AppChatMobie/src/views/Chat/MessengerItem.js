import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useEffect, useRef } from "react";
import { differenceInCalendarDays, set } from "date-fns";
import AutoDimensionImage, {
  imageDimensionTypes,
} from "react-native-auto-dimensions-image";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import Contex from "../../store/Context";
import { checkUrlIsImage, checkUrlIsSticker } from "../../utilies/Validations";
import { convertDateTimeToString, handleDate } from "../../utilies/DateTime";
// import ActionModal from "./actionmodal";
function MessengerItem({ messend, props, route, setOpacity, opacity }) {
  const { state, depatch } = React.useContext(Contex);
  const { user, userSearched, idConversation, userChatting } = state;
  // console.log(userChatting);
  const [pressOn, setPressOnPin] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const onPressRenderTime = () => {
    setPressOnPin(!pressOn);
    console.log("type", messend.content);
    setModalVisible(!modalVisible);
    setOpacity(0.1);
  };

  const Time = () => {
    return (
      <Text
        style={[pressOn ? { marginRight: 20, marginTop: 10 } : { margin: 0 }]}
      >
        {/* check time mess send  with current time ? set time is hours or date */}
        {pressOn ? (
          // >1 is date
          differenceInCalendarDays(
            new Date(),
            new Date(
              `${messend.createdAt}`.toLocaleString("en-US", {
                timeZone: "Asia/Ho_Chi_Minh",
              })
            )
          ) >= 1 ? (
            convertDateTimeToString(
              new Date(
                `${messend.createdAt}`.toLocaleString("en-US", {
                  timeZone: "Asia/Ho_Chi_Minh",
                })
              ),
              "DD-MM-YYYY"
            )
          ) : (
            convertDateTimeToString(
              new Date(
                `${messend.createdAt}`.toLocaleString("en-US", {
                  timeZone: "Asia/Ho_Chi_Minh",
                })
              ),
              "HH:mm:ss"
            )
          )
        ) : (
          <View style={{ marginTop: -20 }}></View>
        )}
      </Text>
    );
  };

  const [reactListIcon, setReactListcon] = useState([]);
  // const reactListIcon = [];
  const [count, setCount] = useState(0);

  const ReactIcons = () => {
    // function RenderImage(reactListIcon) {
    //   return (
    //     <Image
    //       source={require(reactListIcon)}
    //     ></Image>
    //   );
    // }
    // var newArr = reactListIcon.map(RenderImage);

    if (opacity == 1 && count >= 1) {
      return (
        <View style={styles.listReaction}>
          {/* {reactListIcon.length > 3 ? (
            RenderImage();
          ) : (
            <Image source={require(reactListIcon[1])} />
          )} */}
          <Text style={{ alignSelf: "flex-end" }}>{count}</Text>
        </View>
      );
    } else return null;
  };

  const Messenger = () => {
    return (
      <View style={styles.chatBox}>
        <View style={styles.bodyContainer}>
          {/* thong bao trnag thai them xoa sua */}
          {messend.type === "NOTIFY" || typeof messend.type === "undefined" ? (
            <View style={{ alignItems: "center" }}>
              <Text>{messend.content}</Text>
            </View>
          ) : user.uid != messend.userId ? (
            //  take mess
            <View style={styles.yourMess}>
              {userChatting?.avatar ? (
                <Image
                  style={styles.imaAvatar}
                  source={{
                    //  uri: userChatting?.avatar,
                    uri: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/908.jpg",
                  }}
                ></Image>
              ) : (
                <Image
                  style={styles.imaAvatar}
                  source={{
                    uri: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/908.jpg",
                  }}
                ></Image>
              )}
              <View>
                <View
                  style={[
                    //check type message when press and change view  message receive
                    checkUrlIsImage(messend.content) ||
                    checkUrlIsSticker(messend.content)
                      ? {
                          marginLeft: 10,
                        }
                      : pressOn
                      ? {
                          padding: 10,
                          marginLeft: 10,
                          fontSize: 15,
                          borderRadius: 15,
                          borderColor: "white",
                          backgroundColor: "#A0A0A0",
                          shadowOffset: {
                            width: 0,
                            height: 6,
                          },
                          shadowOpacity: 0.37,
                          shadowRadius: 7.49,

                          elevation: 8,
                        }
                      : styles.textyourMes,

                    {
                      width: messend.content.length > 40 ? "80%" : "auto",
                    },
                    { position: "relative" },
                  ]}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    {idConversation.type ? (
                      userChatting.userInfo.map((user) => {
                        if (messend.userId === user.userId) {
                          return user.userFistName + " " + user.userLastName;
                        }
                      })
                    ) : (
                      <View style={{ marginTop: -10 }}></View>
                    )}
                  </Text>

                  {/* check is image, sticker ? changes view */}
                  <View>
                    {checkUrlIsImage(messend.content) &&
                    messend.type === "IMAGE" ? (
                      <AutoDimensionImage
                        source={{
                          uri: messend.content,
                          cache: "default", //  default || reload || force-cache || only-if-cached
                        }}
                        dimensionType={imageDimensionTypes.HEIGHT}
                        dimensionValue={200}
                      />
                    ) : checkUrlIsSticker(messend.content) ? (
                      <AutoDimensionImage
                        source={{
                          uri: messend.content,
                          cache: "default", //  default || reload || force-cache || only-if-cached
                        }}
                        dimensionType={imageDimensionTypes.HEIGHT}
                        dimensionValue={100}
                      />
                    ) : (
                      <Text>{messend.content}</Text>
                    )}
                  </View>
                  <ReactIcons />
                </View>

                <Time />
              </View>
            </View>
          ) : (
            // send mess
            <View style={[styles.myMess]}>
              {/* check is image, sticker ? changes view mess send */}
              <View>
                {checkUrlIsImage(messend.content) &&
                messend.type === "IMAGE" ? (
                  <AutoDimensionImage
                    source={{
                      uri: messend.content,
                      cache: "default", //  default || reload || force-cache || only-if-cached
                    }}
                    dimensionType={imageDimensionTypes.HEIGHT}
                    dimensionValue={200}
                  />
                ) : checkUrlIsSticker(messend.content) ? (
                  <AutoDimensionImage
                    source={{
                      uri: messend.content,
                      cache: "default", //  default || reload || force-cache || only-if-cached
                    }}
                    dimensionType={imageDimensionTypes.HEIGHT}
                    dimensionValue={100}
                  />
                ) : (
                  <View
                    style={[
                      // change view  message send when press
                      pressOn
                        ? {
                            padding: 10,

                            fontSize: 15,
                            borderRadius: 8,
                            backgroundColor: "#CCCCCC",
                            borderColor: "white",
                            borderWidth: 0.1,
                            shadowOffset: {
                              width: 0,
                              height: 3,
                            },
                            shadowOpacity: 0.29,
                            shadowRadius: 4.65,
                            elevation: 7,
                          }
                        : styles.textmyMes,
                      {
                        width: messend.content.length > 30 ? "80%" : "auto",
                        backgroundColor: "#d8f1fd",
                        color: "black",
                      },
                    ]}
                  >
                    <Text> {messend.content}</Text>
                    <ReactIcons />
                  </View>
                )}
              </View>

              <Time />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.viewOne}>
      <TouchableOpacity onPress={onPressRenderTime}>
        <Messenger />
      </TouchableOpacity>
      {/* Modal reaction */}
      <View style={styles.container}>
        <Modal transparent={true} visible={modalVisible}>
          <Pressable
            style={styles.centeredView}
            onPress={() => {
              setModalVisible(!modalVisible);
              setOpacity(1);

              console.log(reactListIcon);
            }}
          >
            <View style={{ flexDirection: "row", width: "100%" }}>
              {/* mess */}
              <Messenger />
            </View>

            {/* view icons */}
            <View style={styles.reactList}>
              <TouchableOpacity
                style={styles.reactItem}
                onPress={() => {
                  setCount(count + 1);
                  let myset = new Set(reactListIcon);
                  let result = Array.from(myset);
                  setReactListcon(result);
                }}
              >
                <Image
                  source={require("../../images/love.png")}
                  style={styles.reactIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reactItem}
                onPress={() => {
                  setCount(count + 1);
                  reactListIcon.push("../../images/like.png");
                }}
              >
                <Image
                  source={require("../../images/like.png")}
                  style={styles.reactIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reactItem}
                onPress={() => {
                  setCount(count + 1);
                  reactListIcon.push("../../images/haha.png");
                }}
              >
                <Image
                  source={require("../../images/haha.png")}
                  style={styles.reactIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reactItem}
                onPress={() => {
                  setCount(count + 1);
                  reactListIcon.push("../../images/wow.png");
                }}
              >
                <Image
                  source={require("../../images/wow.png")}
                  style={styles.reactIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reactItem}
                onPress={() => {
                  setCount(count + 1);
                  reactListIcon.push("../../images/sad.png");
                }}
              >
                <Image
                  source={require("../../images/sad.png")}
                  style={styles.reactIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reactItem}
                onPress={() => {
                  setCount(count + 1);
                  reactListIcon.push("../../images/angry.png");
                }}
              >
                <Image
                  source={require("../../images/angry.png")}
                  style={styles.reactIcon}
                />
              </TouchableOpacity>
            </View>
            {/* chọn */}
            <View style={styles.options}>
              <TouchableOpacity style={styles.optionItem}>
                <AntDesign
                  style={styles.optionIcon}
                  name="pushpino"
                  size={32}
                  color="#d534eb"
                />
                <Text style={styles.optionName}>Ghim</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionItem}>
                <Feather
                  name="trash"
                  size={32}
                  style={styles.optionIcon}
                  color="#f22424"
                />
                <Text style={styles.optionName}>Xóa</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionItem}>
                <MaterialCommunityIcons
                  name="backup-restore"
                  style={styles.optionIcon}
                  size={32}
                  color="#d41542"
                />
                <Text style={styles.optionName}>Thu hồi</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionItem}>
                <Feather
                  style={styles.optionIcon}
                  name="copy"
                  size={32}
                  color="black"
                />
                <Text style={styles.optionName}>Copy</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  bodyListChat: {
    flex: 1,
    alignItems: "center",
  },

  viewOne: {
    width: "100%",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  yourMess: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },

  imaAvatar: {
    height: 30,
    width: 30,
    borderRadius: 100,
    alignItems: "center",
    marginLeft: 10,
  },

  bodyContainer: {
    flex: 1,
    justifyContent: "center",
  },

  textyourMes: [
    {
      padding: 10,
      marginLeft: 10,
      fontSize: 15,
      borderRadius: 15,
      borderWidth: 1.5,
      borderColor: "#A0A0A0",
    },
  ],
  myMess: {
    marginRight: 10,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },

  textmyMes: {
    padding: 10,
    marginLeft: 10,
    fontSize: 15,
    borderRadius: 15,
    backgroundColor: "#CCCCCC",
  },

  chatBox: {
    width: "100%",
    flexDirection: "row",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    height: 40,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },

  body: {
    paddingHorizontal: 12,
    paddingVertical: 32,
  },

  avatar: {
    paddingRight: 12,
  },

  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: "red",
  },
  message: {
    backgroundColor: "white",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
    maxWidth: "80%",
    borderWidth: 1,
    borderColor: "#1a69d9",
    marginBottom: 12,
  },
  myMessage: {
    backgroundColor: "#e5efff",
    marginLeft: "auto",
  },
  senderName: {
    color: "#bd6d29",
  },
  content: {
    fontSize: 17,
    textAlign: "justify",
  },
  time: {
    paddingTop: 8,
    color: "#666",
  },

  reactList: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 14,
    marginTop: 10,
    marginHorizontal: 15,
  },
  reactItem: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  reactIcon: {
    width: 32,
    height: 32,
  },
  options: {
    backgroundColor: "white",
    flexDirection: "row",
    borderRadius: 14,
    marginTop: 5,
    // flexWrap: "wrap",
    marginHorizontal: 15,
  },
  optionItem: {
    padding: 12,
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
  },

  optionName: {
    paddingTop: 8,
  },

  listReaction: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 5,
    alignSelf: "flex-end",
  },

  listReactionIcons: {
    width: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MessengerItem;
