import "./MemberCardStyle.scss";
import * as React from "react";
import Contex from "../../store/Context";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { BsThreeDots } from "react-icons/bs";
import conversationApi from "../../api/conversationApi";
import friendApi from "../../api/friendApi";
import { SetListFriend } from "../../store/Actions";
import aleartHook from "../../hooks/aleartHook";
import useFriendHook from "../../hooks/useFriendHook";
const CardFriend = ({ u, handleCloseModel, socket }) => {
  //custom hook
  const { notifyAddFriend } = aleartHook();
  const { featchAddFriend, featchStatusFriend } = useFriendHook();
  const { state, depatch } = React.useContext(Contex);

  const { listFriend, user } = state;

  //status is friend
  const [isFriend, setIsFriend] = React.useState("");

  React.useEffect(() => {
    const featchListMember = async (userId) => {
      try {
        const response = await friendApi.getListFriend(userId);

        //set value global
        depatch(SetListFriend(response));
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };
    featchListMember(user.uid);

    socket?.current.on("update-inviteFr",idFriend=>{
      featchListMember(user.uid);
    });
    socket?.current.on("update-invite",idUser=>{
      featchListMember(user.uid);
    });


  }, [user]);

  React.useEffect(() => {
    //call api check statue friend
    const featchStatusFriend = async (userId, freId) => {
      try {
        const response = await friendApi.checkStatus(userId, freId);
        // const {senderId, receiverId} = response

        //check trang thai gui
        //la friend -> reponse === friend
        if (response === "friend") {
          console.log("la ban be");
          setIsFriend("Bạn bè");
        } else if (response === "none") {
          console.log("chua la ban be");
          setIsFriend("Kết bạn");
        } else {
          const { senderId, receiverId } = response;
          if (senderId === user.uid) {
            setIsFriend("Bạn đã gửi");
          } else {
            setIsFriend("Chấp nhận");
          }
        }
        // console.log(response);
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };

    featchStatusFriend(user.uid, u.uid);
    socket?.current.on("update-inviteFr",idFriend=>{
      featchStatusFriend(user.uid, u.uid);
    });
    socket?.current.on("update-invite",idUser=>{
      featchStatusFriend(user.uid, u.uid);
    });
  });

  //xu ly ket ban in here
  const handeOnClick = async() => {
    console.log("click trong form kb", isFriend);
    console.log(isFriend);
    //neu da la ban -> return
    if (isFriend === "friend" || isFriend === "Bạn đã gửi") {
      console.log(" la ban or da gui");
      return;
    }

    //chua la ban
    if (isFriend === "Kết bạn") {
      console.log("chua la ban");
      //call api add friend
      notifyAddFriend();

      const idCon = await conversationApi.getConversation(user.uid, u.uid);
      console.log("idCon::", idCon);

      //call api save into db
      featchAddFriend(user.uid, u.uid).then((res) => {
        console.log("res::", res);
        socket?.current.emit("handle-request-friend", {
          idUser: user.uid,
          idFriend: u.uid,
          idCon: idCon,
        });
      });

      //close model
      handleCloseModel();
      //add socket
    } else if (isFriend === "Chấp nhận") {
      console.log("chap nhan ket ban");
      //ng khac gui yeu cau kb
      //click de accept friend
      const handleAccept = async (id) => {

        const featchAcceptInvite = async (userId, freId) => {
          try {
            return await friendApi.acceptFriend(user.uid, id);
            // console.log("re:::",response);
          } catch (error) {
            console.log("Failed to fetch conversation list: ", error);
          }
        };
    
        featchAcceptInvite(user.uid,id).then((res)=>{
          console.log("res:::",res);
          socket?.current.emit("handle-request-friend", {
            idUser: user.uid,
            idFriend: id,
            idCon: res.conversationId,
            message:res.message
          });
        })
      };

      handleAccept(u.uid)
      //close model
      handleCloseModel();
    }
  };
  return (
    <div
      className="users_member"
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
          marginTop: "8px",
          cursor: "pointer",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {u?.avaUser ? (
            <Avatar
              className="avatar"
              src={u?.avatar}
              alt={u?.last_name}
              style={{ width: "36px", height: "36px" }}
            />
          ) : (
            <Avatar
              className="avatar"
              style={{
                textTransform: "capitalize",
                width: "36px",
                height: "36px",
              }}
              src={u?.avatar}
            >
              {u?.last_name[0]}
            </Avatar>
          )}
          <div style={{ marginLeft: "8px", textAlign: "start" }}>
            <p
              style={{
                textTransform: "capitalize",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {u?.first_name + " " + u?.last_name}
            </p>
          </div>
        </div>

        <Button
          variant="outlined"
          style={{ fontSize: "12px" }}
          onClick={() => handeOnClick()}
        >
          {isFriend}
        </Button>
      </div>
    </div>
  );
};

export default CardFriend;
