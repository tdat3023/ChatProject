import * as React from "react";
import Avatar from "@mui/material/Avatar";
import { AiOutlineLike, AiOutlineDelete } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { FaRegCopy } from "react-icons/fa";
import { IoReloadOutline } from "react-icons/io5";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { MdFormatQuote } from "react-icons/md";
import avt from "../../images/av.jpg";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import copy from "copy-to-clipboard";

import { iconsTouch } from "../../data/Data";
import Contex from "../../store/Context";
import messageApi from "../../api/messageApi";
import { useState } from "react";
import { SetIdMessageDeletedWithMe, SetReplyMess } from "../../store/Actions";
import WordsComponent from "../filecomponent/WordsComponent";
import useCheckFile from "../../hooks/useCheckFile";
import UserService from "../../services/UserService";
import { useEffect } from "react";

//status : 0 binh thuong, 1 thu hoi, 2 bi xoa
const Message = ({
  isLastMessage,
  status,
  mess,
  socket,
  preMessage,
  userId,
}) => {
  const { state, depatch } = React.useContext(Contex);
  //detructering...
  const {
    userChatting,
    idConversation,
    user,
    statusMessage,
    groupChatting,
    replyMess,
  } = state;
  const [showIcons, setShowIcons] = React.useState(false);

  const [me, setMe] = React.useState(false);

  const [userCurrentMess, setUserCurrentMess] = React.useState(null);

  const { checkUrlIsDocx, checkUrlIsVideo } = useCheckFile();

  //thong tin user tren tin nhan dc reply
  const [userReply, setUserReply] = useState(null);

  // console.log("pre messs ----->");
  // console.log(preMessage);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [copyText, setCopyText] = React.useState("");

  const copyToClipboard = () => {
    copy(copyText);
    handleClose();
  };

  React.useEffect(() => {
    if (user.uid === mess.userId) {
      setMe(true);
    } else {
      setMe(false);
    }

    //if user.id co trong mang deletedByUserIds -> khong render this message
    // if(mess.deletedByUserIds.includes(user.uid)){
    //   setDeleted(true)
    // }
  }, []);

  //click hide/show list icon
  const handleToggle = () => {
    setShowIcons(!showIcons);
  };
  //console.log("id meesss --->" + mess._id);
  const handleReMessage = () => {
    handleClose();
    // console.log("id meesss --->" + mess._id);
    //call api thu hoi tin nhan
    const reMessage = async () => {
      try {
        const response = await messageApi.reMess(mess._id);
        console.log("thu hoi id meesss --->" + mess._id);
        socket.current.emit("reMessage", {
          idMessage: mess._id,
          idCon: idConversation,
        });

        //

        // const { data, info, friendStatus, size, totalPages } = response;
        // //console.log(response);

        // if (response) {
        //   setMessages(data[0].messages);
        // }
        // setStatusLoadMessage(false)
      } catch (error) {
        console.log("Failed to remove message: ", error);
      }
    };

    reMessage();
  };

  const deleteMessageWithMe = () => {
    handleClose();
    const deleteMess = async () => {
      try {
        console.log("delete with me id meesss --->" + mess._id);
        depatch(SetIdMessageDeletedWithMe(mess._id));
        const response = await messageApi.deleteMessage(mess._id, user.uid);
      } catch (error) {
        console.log("Failed to remove message: ", error);
      }
    };

    deleteMess();
  };

  //handle reaction message while this message had used icons
  const handleClickReaction = () => {
    setShowIcons(!showIcons);
  };

  //dem so luong reaction trong 1 tin nhan
  const countReaction = () => {
    if (mess.reacts.length > 0) {
      console.log("count reaction message");
      console.log(mess.reacts[0].react);
      return mess.reacts.reduce((total, item) => {
        return (
          total +
          item.react.reduce((sum, val) => {
            return sum + val.quantity;
          }, 0)
        );
      }, 0);
    }
    return null;
  };

  //handle reaction message
  const handleReaction = (icon) => {
    //close icon array
    setShowIcons(false);

    //update ui (react)
    const reactionTmpMess = {
      url: icon.url,
      idMessage: mess._id,
      userId: user.uid,
      nameUser: user.lastName,
    };

    socket.current.emit("reaction", {
      isReaction: true,
      idConversation: idConversation,
    });

    //gui qua socket in here

    //call api reaction here
    const addReactionMessage = async () => {
      try {
        const response = await messageApi.addReaction(
          mess._id,
          icon.url,
          user.uid,
          user.lastName
        );
        console.log("reaction  id meesss --->" + mess._id);
      } catch (error) {
        console.log("Failed to reaction message: ", error);
      }
    };

    addReactionMessage();
  };

  React.useEffect(() => {
    //load user with id
    //featch user from firebase
    UserService.getById(userId).then(function (snapshot) {
      ////const userTemp = { uid: u.uid, ...snapshot.data() };
      console.log(snapshot.data());
      setUserCurrentMess(snapshot.data());
      //  depatch(SetUser(userTemp));
    });

    //get user by user id for render user name of message reply
    if (mess?.replyMessageId?.length > 0) {
      UserService.getById(mess?.replyMessageId[0]?.userId).then(function (
        snapshot
      ) {
        ////const userTemp = { uid: u.uid, ...snapshot.data() };
        console.log(snapshot.data());
        setUserReply(snapshot.data());
      });
    }
  }, []);

  //click -> open ui for reply
  const handleReply = () => {
    depatch(SetReplyMess(mess));
  };

  return (
    <>
      {!mess?.deletedByUserIds?.includes(user?.uid) ? (
        <>
          <div
            className="message"
            style={!me ? { flexDirection: "row-reverse" } : null}
          >
            {status === 1 ? null : (
              <>
                <div className="option">
                  <span
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    title="Thêm"
                  >
                    <BiDotsHorizontalRounded />
                  </span>
                  <span title="Trả lời" onClick={() => handleReply()}>
                    <MdFormatQuote />
                  </span>
                </div>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem onClick={copyToClipboard}>
                    <span style={{ fontSize: "16px", marginRight: "6px" }}>
                      <FaRegCopy />
                    </span>
                    Copy tin nhắn
                  </MenuItem>
                  <Divider />
                  {me ? (
                    <MenuItem
                      style={{ color: "#E64848" }}
                      onClick={() => handleReMessage()}
                    >
                      <span style={{ fontSize: "16px", marginRight: "6px" }}>
                        <IoReloadOutline />
                      </span>
                      Thu hồi tin nhắn
                    </MenuItem>
                  ) : null}

                  <MenuItem onClick={() => deleteMessageWithMe()}>
                    <span style={{ color: "#E64848" }}>
                      <span style={{ fontSize: "16px", marginRight: "6px" }}>
                        <AiOutlineDelete />
                      </span>
                      Xóa ở phía tôi
                    </span>
                  </MenuItem>
                </Menu>
              </>
            )}
            {mess.isDeleted ? (
              <div
                className="message_text"
                style={me ? { backgroundColor: "#e5efff" } : {}}
              >
                <p className="textMess" style={{ color: "#abb4bc" }}>
                  Tin nhắn đã được thu hồi
                </p>
                <p className="timeMess">
                  {" "}
                  {new Date(mess.createdAt)
                    .toLocaleString("en-US", {
                      timeZone: "Asia/Ho_Chi_Minh",
                    })
                    .slice(11, 23)}
                </p>
              </div>
            ) : (
              <>
                {mess?.type === "IMAGE" ? (
                  <div className="messImg">
                    <img src={mess.content} alt="image" />
                  </div>
                ) : (
                  <>
                    {mess?.type === "VIDEO" ? (
                      <video
                        src={mess.content}
                        width="300"
                        height="200"
                        controls="controls"
                        autoplay="true"
                      />
                    ) : (
                      <div
                        className={
                          mess.content.includes("https://img.stipop.io")
                            ? "message_text bg-trans"
                            : `${
                                mess.type === "APPLICATION"
                                  ? "message_text cssFileDocx"
                                  : `${
                                      mess.content.length > 50
                                        ? "message_text message_text__overFlow"
                                        : "message_text"
                                    }`
                              }`
                        }
                        style={me ? { backgroundColor: "#e5efff" } : {}}
                      >
                        {mess.content.includes("https://img.stipop.io") ? (
                          <div className="row">
                            <div className="col-4">
                              <div className="messSticker">
                                <img src={mess.content} alt="image" />
                                <p className="timeMessSticker">
                                  {new Date(mess.createdAt)
                                    .toLocaleString("en-US", {
                                      timeZone: "Asia/Ho_Chi_Minh",
                                    })
                                    .slice(11, 23)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* <p className="textMess">{mess.content}</p> */}

                            {mess?.type === "APPLICATION" ? (
                              <WordsComponent mess={mess} />
                            ) : (
                              <>
                                {groupChatting ? (
                                  <p className="nameChatting">
                                    {userCurrentMess?.last_name +
                                      " " +
                                      userCurrentMess?.first_name}
                                  </p>
                                ) : null}

                                {mess?.replyMessageId?.length > 0 ? (
                                  <div
                                    className="reply_block"
                                    style={{
                                      marginBottom: "6px",
                                      display: "flex",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <div
                                      style={{
                                        height: "40px",
                                        width: "2px",
                                        backgroundColor: "#0091ff",
                                        marginRight: "8px",
                                      }}
                                    ></div>
                                    <div>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <p>
                                            <span
                                              style={{
                                                fontWeight: 500,
                                                textTransform: "capitalize",
                                                marginLeft: "2px",
                                              }}
                                            >
                                              {userReply?.first_name +
                                                " " +
                                                userReply?.last_name}
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                      <p
                                        className="text_reply"
                                        style={{ color: "#434242" }}
                                      >
                                        {mess.replyMessageId[0].content}
                                      </p>
                                    </div>
                                  </div>
                                ) : null}
                                <p className="textMess">{mess?.content}</p>
                              </>
                            )}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p className="timeMess">
                                {new Date(mess.createdAt)
                                  .toLocaleString("en-US", {
                                    timeZone: "Asia/Ho_Chi_Minh",
                                  })
                                  .slice(11, 23)}
                              </p>
                              {isLastMessage && mess?.userId === user?.uid ? (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    textTransform: "capitalize",
                                    marginLeft: "8px",
                                  }}
                                  className="timeMess"
                                >
                                  {statusMessage}
                                </p>
                              ) : null}
                            </div>
                            {mess?.reacts?.length > 0 ? (
                              <div className="reactionIcons">
                                <div className="arr_icons">
                                  {mess.reacts[0].react.length > 2
                                    ? mess.reacts[0].react
                                        .slice(
                                          mess.reacts[0].react.length - 2,
                                          mess.reacts[0].react.length
                                        )
                                        .map((item) => {
                                          return (
                                            <div
                                              className="icon_face"
                                              key={Math.random()}
                                            >
                                              <img src={item.name} />
                                            </div>
                                          );
                                        })
                                    : mess.reacts[0].react.map((item) => {
                                        return (
                                          <div
                                            className="icon_face"
                                            key={Math.random()}
                                          >
                                            <img src={item.name} />
                                          </div>
                                        );
                                      })}

                                  {/* <div className="icon_face">
                                    <img src="https://firebasestorage.googleapis.com/v0/b/chatapp-react-17ab5.appspot.com/o/images%2Ficons%2Fheart.png?alt=media&token=215d6174-ff8a-4eec-8f32-11a22aff9297" />
                                  </div>
                                  <div className="icon_face">
                                    <img src="https://firebasestorage.googleapis.com/v0/b/chatapp-react-17ab5.appspot.com/o/images%2Ficons%2Flaughing.png?alt=media&token=69f6f404-63a9-4675-ae23-888bd8f16c02" />
                                  </div> */}

                                  <span>{countReaction()}</span>
                                </div>
                                <div
                                  className="nowIcon"
                                  onClick={handleClickReaction}
                                >
                                  <div
                                    className="icon_face"
                                    style={{ margin: 0 }}
                                  >
                                    <img src={mess.reacts[0].react[0].name} />
                                  </div>
                                </div>
                              </div>
                            ) : null}
                            <div className="icon_list">
                              {showIcons ? (
                                <div
                                  className="icons_react"
                                  style={
                                    me ? { right: "50%" } : { left: "50%" }
                                  }
                                >
                                  {iconsTouch.map((icon) => {
                                    return (
                                      <img
                                        key={icon.id}
                                        src={icon.url}
                                        alt="icon.name"
                                        className="icon_face"
                                        onClick={() => handleReaction(icon)}
                                      />
                                    );
                                  })}
                                </div>
                              ) : null}

                              {mess?.reacts?.length === 0 ? (
                                <span
                                  className="icon_react"
                                  style={!me ? { right: "20px" } : {}}
                                  onClick={() => handleToggle()}
                                >
                                  <AiOutlineLike />
                                </span>
                              ) : null}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {me ? (
              <>
                {preMessage && preMessage[0]?.userId === mess?.userId ? (
                  <Avatar className="avatar" style={{ opacity: 0 }} />
                ) : (
                  <React.Fragment>
                    {user?.avatar ? (
                      <Avatar
                        className="avatar"
                        src={user?.avatar}
                        alt={user?.first_name}
                      />
                    ) : (
                      <Avatar
                        className="avatar"
                        style={{
                          textTransform: "capitalize",
                          backgroundColor: "#055E68",
                        }}
                        src={user?.avatar}
                      >
                        {user?.last_name[0]}
                      </Avatar>
                    )}
                  </React.Fragment>
                )}
              </>
            ) : (
              <>
                {preMessage && preMessage[0]?.userId === mess?.userId ? (
                  <Avatar className="avatar" style={{ opacity: 0 }} />
                ) : (
                  <React.Fragment>
                    {userChatting?.avatar ? (
                      <Avatar
                        className="avatar"
                        src={userChatting?.avatar}
                        alt={userChatting?.first_name}
                      />
                    ) : (
                      <Avatar
                        className="avatar"
                        style={{
                          textTransform: "capitalize",
                          backgroundColor: "#e7f0ce",
                        }}
                        src={userChatting?.avatar}
                      >
                        {userChatting?.last_name[0]}
                      </Avatar>
                    )}
                  </React.Fragment>
                )}
              </>
            )}
          </div>
        </>
      ) : null}{" "}
    </>
  );
};

export default Message;
