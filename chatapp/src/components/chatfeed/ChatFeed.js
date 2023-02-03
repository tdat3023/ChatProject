import "./ChatFeedStyle.scss";
import * as React from "react";
import { useRef, useState, useEffect } from "react";

import ChatHeader from "./ChatHeader";
import NewMessageForm from "./NewMessageForm";
import Message from "./Message";
import Avatar from "@mui/material/Avatar";
import "./MessageStyle.scss";
import TimeLine from "./TimeLine";
import { IoIosArrowDown } from "react-icons/io";

import "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import "simplebar/dist/simplebar.css";
import Contex from "../../store/Context";
import messageApi from "../../api/messageApi";
import CircularProgress from "@mui/material/CircularProgress";
import {
  SetIdConversation,
  SetIdMessageDeletedWithMe,
  SetMessageSent,
  SetStatusMessage,
} from "../../store/Actions";
import WordsComponent from "../filecomponent/WordsComponent";
import NotifyComponent from "./NotifyComponent";
// import {socket} from '../../store/socketClient';

const ChatFeed = ({ socket }) => {
  const { state, depatch } = React.useContext(Contex);
  const [messages, setMessages] = useState([]);
  // console.log(messages);
  const [idReMessage, setIdReMessage] = useState("");
  const [statusLoadMessage, setStatusLoadMessage] = useState(true);
  const [statusLoadOldMessage, setStatusLoadOldMessage] = useState(false);
  // const [arrivalMess, setArrivalMess] = useState(null);
  const [arrivalMess, setArrivalMess] = useState("");
  const [isFriend, setIsFriend] = useState(false);

  //console.log(isFriend);
  //detructering...
  const {
    userChatting,
    idConversation,
    user,
    messageSent,
    idMessageDeletedWithMe,
  } = state;
  // console.log(" message ---->");

  const messagesEnd = useRef();

  //console.log(idConversation);

  const [panigation, setPanigation] = React.useState({ page: 0, size: 50 });
  const [page, setPage] = React.useState(0);

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  };

  // const handleScroll = () => {
  //   console.log("scroll");
  // };

  // useEffect(() => {
  //   if (socket.current) {
  //     socket.current.emit("seen-message", {
  //       isSeen:true,
  //       conversationId: idConversation,
  //       userId: user.uid,
  //     });
  //   }
  // }, []);

  //khi tin nhan duoc gui thi them tin nhan do vao messages -> render
  useEffect(() => {
    // console.log("useEffect --->");
    // console.log(messageSent);
    if (messageSent != "" && idConversation === messageSent.conversationId) {
      setMessages((prev) => [...prev, messageSent]);
    }
    // messageSent &&
    //   idConversation === messageSent.conversationId &&
  }, [messageSent]);

  useEffect(() => {
    socket.current?.emit("join-room", {
      idCon: idConversation,
      // isNew:false
    });

    socket.current?.on("get-message", ({ message }) => {
      //console.log("get");
      console.log("mess nhan dc ---> ");
      console.log(message);
      setArrivalMess(message);
    });

    socket.current?.on("reaction", (idC) => {
      console.log("reaction" + idC);
      const featchMessages = async (idC) => {
        try {
          //cal api get total page
          const response = await messageApi.getMess(
            idC,
            user.uid,
            panigation.page,
            panigation.size
          );
          const { totalPages } = response;
          console.log(totalPages);

          //th1: so luong tin nhan < 30, page = 1
          if (totalPages <= 1) {
            setMessages(response.data[0].messages);
            //update page current
            setPage(totalPages);
          } else {
            const newPage = totalPages - 1;
            //get 30 tin moi nhat
            const currnetResponse = await messageApi.getMess(
              idC,
              user.uid,
              newPage,
              panigation.size
            );

            const { data, info, friendStatus, size } = currnetResponse;
            //neu khong tra ve du 30 tin nhan -> lui 1 page
            if (data[0].messages.length < 20) {
              const cPage = newPage - 1;
              //get 30 tin moi nhat
              const newResponse = await messageApi.getMess(
                idC,
                user.uid,
                cPage,
                panigation.size + data[0].messages.length
              );
              if (newResponse) {
                setMessages(newResponse.data[0].messages);
                setPage(cPage);
              }
            } else {
              setMessages(data[0].messages);
              setPage(newPage);
            }
          }

          // //update page current
          // setPage(newPage);
          setStatusLoadMessage(false);
        } catch (error) {
          setMessages([]);
          setStatusLoadMessage(false);
          console.log("Failed to fetch conversation list: ", error);
        }
      };

      featchMessages(idC);
    });

    socket.current?.on("reMessage", (data) => {
      setIdReMessage(data);
    });
  }, []);

  // }, [userChatting]);

  useEffect(() => {
    socket?.current.on("updateListInvite", (idFriend) => {
      if (idFriend) {
        setIsFriend(true);
        socket.current.emit("kickUser", {
          idConversation: idConversation,
        });
      }
    });
  }, [idConversation]);

  //cap nhat mess da thu hoi len giao dien
  useEffect(() => {
    if (idReMessage) {
      const newMess = messages.map((mess) => {
        if (mess._id === idReMessage) {
          return { ...mess, isDeleted: true };
        }
        return mess;
      });
      //console.log(newMess);
      setMessages(newMess);
    }
  }, [idReMessage]);

  //cap nhat mess da xoa phia toi len giao dien
  useEffect(() => {
    if (idMessageDeletedWithMe) {
      console.log("useEffcet delete message start");
      const newMess = messages.filter((mess) => {
        return mess._id != idMessageDeletedWithMe;
      });
      console.log(newMess);
      setMessages(newMess);
      depatch(SetIdMessageDeletedWithMe(""));
    }
  }, [idMessageDeletedWithMe]);

  useEffect(() => {
    // socket.current.emit("seen-message", {
    //   conversationId: idConversation,
    //   userId: user.uid,
    // });

    //xoa di message cuoi cung cua array (message mẫu)
    if (messageSent != "") {
      const messagesCurrent = messages.filter((val, idx) => {
        return idx !== messages.length - 1;
      });
      depatch(SetMessageSent(""));
      // console.log(messagesCurrent);
      arrivalMess &&
        idConversation === arrivalMess.conversationId &&
        setMessages((prev) => [...messagesCurrent, arrivalMess]);
    } else {
      arrivalMess &&
        idConversation === arrivalMess.conversationId &&
        setMessages((prev) => [...prev, arrivalMess]);
    }
  }, [arrivalMess, idConversation]);

  // console.log(arrivalMess);

  useEffect(() => {
    //scroll last message
    scrollToBottom();
  });

  useEffect(() => {
    setStatusLoadMessage(true);
    console.log("useEffect load message");
    //call api get all message
    //set state
    const featchMessages = async () => {
      try {
        //cal api get total page
        const response = await messageApi.getMess(
          idConversation,
          user.uid,
          panigation.page,
          panigation.size
        );
        const { totalPages } = response;
        // console.log(totalPages);
        const { friendStatus } = response;
        setIsFriend(friendStatus);

        //th1: so luong tin nhan < 30, page = 1
        if (totalPages <= 1) {
          setMessages(response.data[0].messages);
          //update page current
          setPage(totalPages);
        } else {
          const newPage = totalPages - 1;
          //get 30 tin moi nhat
          const currnetResponse = await messageApi.getMess(
            idConversation,
            user.uid,
            newPage,
            panigation.size
          );

          const { data, info, friendStatus, size } = currnetResponse;
          setIsFriend(friendStatus);
          //neu khong tra ve du 30 tin nhan -> lui 1 page
          if (data[0].messages.length < 20) {
            const cPage = newPage - 1;
            //get 30 tin moi nhat
            const newResponse = await messageApi.getMess(
              idConversation,
              user.uid,
              cPage,
              panigation.size + data[0].messages.length
            );
            if (newResponse) {
              setMessages(newResponse.data[0].messages);
              setPage(cPage);
            }
          } else {
            setMessages(data[0].messages);
            setPage(newPage);
          }
        }

        // //update page current
        // setPage(newPage);
        setStatusLoadMessage(false);
      } catch (error) {
        setMessages([]);
        setStatusLoadMessage(false);
        console.log("Failed to fetch conversation list: ", error);
      }
    };

    featchMessages();
  }, [userChatting, idConversation]);

  //scroll to top -> load old message
  const handelScroll = (e) => {
    let element = e.target;

    if (element.scrollTop === 0) {
      console.log("current page " + page);
      setStatusLoadOldMessage(true);
      if (page > 0) {
        //lui page ve 1 bac
        const newPage = page - 1;
        //featch data theo newPage
        const featchMessages = async () => {
          try {
            //cal api get total page
            const response = await messageApi.getMess(
              idConversation,
              user.uid,
              newPage,
              panigation.size
            );
            //add data vao messages( truoc nhung tin nhan cu)
            const { data, info, friendStatus, size } = response;
            setPage(newPage);
            setStatusLoadOldMessage(false);
            setMessages((prev) => [...data[0].messages, ...prev]);
          } catch (error) {
            setStatusLoadOldMessage(false);
            console.log("Failed to fetch conversation list: ", error);
          }
        };
        featchMessages();
      }
      setStatusLoadOldMessage(false);
    }
  };
  return (
    <div className="chat_feed">
      <ChatHeader
        userChatting={userChatting}
        socket={socket}
        isFriend={isFriend}
      />
      <div
        // data-simplebar
        className="message_content"
        onScroll={(e) => handelScroll(e)}
      >
        <div className="card_title">
          <div className="title_top">
            {userChatting?.avatar ? (
              <Avatar
                className=""
                src={userChatting?.avatar}
                alt={userChatting?.first_name}
              />
            ) : (
              <Avatar
                className=""
                style={{ textTransform: "capitalize" }}
                src={userChatting?.avatar}
              >
                {userChatting?.last_name[0]}
              </Avatar>
            )}

            <div className="topContent">
              <p style={{ textTransform: "capitalize" }}>
                {userChatting?.last_name + " " + userChatting?.first_name}
              </p>
              <p>Hãy bắt đầu cùng nhau chia sẻ những...</p>
            </div>
          </div>
          <div className="title_image"></div>
        </div>
        {statusLoadOldMessage ? (
          <div className="messageLoadingOldMessage">
            <CircularProgress className="circle_loading" />
            <p>Đang tải tin nhắn</p>
          </div>
        ) : null}

        {messages.map((mess, idx) => {
          //neu message co "type": "NOTIFY"
          if (mess.type === "NOTIFY") {
            return <NotifyComponent text={mess.content} />;
          }
          //neu la tin nhan cuoi cung
          //truyen 1 trang thai la isLastMessage
          if (idx === messages?.length - 1) {
            return (
              <Message
                key={mess._id}
                mess={mess}
                socket={socket}
                isLastMessage
                preMessage={[messages[idx - 1]]}
              />
            );
          }

          //truyen vao prevent meassage bat dau tu idx = 1 : messages[idx - 1]
          //neu idx = 0 thi khong truyen prevent message
          if (idx === 0) {
            return <Message key={mess._id} mess={mess} socket={socket} />;
          } else {
            return (
              <Message
                key={mess._id}
                mess={mess}
                socket={socket}
                preMessage={[messages[idx - 1]]}
              />
            );
          }
        })}
        {/* <video
          src="https://chatapp-bucket.s3.ap-southeast-1.amazonaws.com/zale_1666892497792_test.mp4"
          width="300"
          height="200"
          controls="controls"
          autoplay="true"
        /> */}
        {/* <WordsComponent /> */}
        {/* <TimeLine />
        <Message />
        <Message me />

        <Message type="image" />
        <Message />
        <Message me />
        

        <Message me />
        <Message me />
        <Message me />
        <Message />
        <TimeLine />
        <Message />
        <Message me />
        <Message me /> */}

        <div style={{ float: "left", clear: "both" }} ref={messagesEnd}></div>
      </div>

      <span className="goToBottom" onClick={scrollToBottom}>
        <IoIosArrowDown />
      </span>
      {statusLoadMessage ? (
        <div className="meassage_loadingStatus">
          <CircularProgress className="circle_loading" />
          <p>Đang tải tin nhắn</p>
        </div>
      ) : null}
      <NewMessageForm
        userChatting={userChatting}
        idConversation={idConversation}
        messages={messages}
        setMessages={setMessages}
        socket={socket}
      />
    </div>
  );
};
export default ChatFeed;
