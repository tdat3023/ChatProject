import "./ListRequestStyle.scss";
import friend from "../../images/friend.png";
import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import "simplebar/dist/simplebar.css";
import avt from "../../images/av.jpg";
import Contex from "../../store/Context";
import { useContext } from "react";
import friendApi from "../../api/friendApi";

const ListRequestComponent = ({socket}) => {
  const { state, depatch } = useContext(Contex);
  const [listRequest, setListRequest] = React.useState([]);
  const {
    user,
    idConversation,
    } = state
  React.useEffect(() => {
    const featchListRequestFriend = async (userId) => {
      try {
        const response = await friendApi.getListRequest(userId);
        setListRequest(response);
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };
    featchListRequestFriend(user.uid);
  }, [user]);

  React.useEffect(() => {
    if(socket.current){
      socket.current.on("update-inviteFr",idFriend=>{
        if(idFriend){
          console.log("idFriend");
          const featchListRequestFriend = async (userId) => {
            try {
              const response = await friendApi.getListRequest(userId);
              setListRequest(response);
            } catch (error) {
              console.log("Failed to fetch conversation list: ", error);
            }
          };
          featchListRequestFriend(user.uid);
        }
      });

      socket.current.on("update-invite",idUser=>{
          const featchListRequestFriend = async (userId) => {
            try {
              const response = await friendApi.getListRequest(userId);
              setListRequest(response);
            } catch (error) {
              console.log("Failed to fetch conversation list: ", error);
            }
          };
          featchListRequestFriend(user.uid);
      })


    }
  }, [user]);

  const handleAccept = async (id) => {
    // console.log("con:::",idCon);
    const featchAcceptInvite = async (userId, freId) => {
      try {
        return await friendApi.acceptFriend(userId, freId);
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
      
    console.log("accept friend"); 

  };

  const handleCancle = async (id,idCon) => {
    console.log("cancle friend"); 
    const featchDeleteInvite = async (userId, freId) => {
      try {
        const response = await friendApi.deleteInvite(userId, freId);
        console.log("re:::",response);
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };

    featchDeleteInvite(id, user.uid).then(()=>{
      socket?.current.emit("handle-request-friend", {
        idUser: id,
        idFriend: user.uid,
        idCon: idCon,
      });
    })
    
  }



  return (
    <div className="list_request">
      <div className="list_top">
        <img
          src={friend}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
        <p>Danh sách kết bạn</p>
      </div>
      <div className="list_content" >
        <p className="content_title">Lời mời kết bạn ({listRequest.length})</p>
        <div className="cards">
          {listRequest.map((item) => (
            <div className="card">
            <div className="card_left">
              <img src={item.avaUser} />
              <div className="card_text">
                <p>{item.userFistName+item.userLastName}</p>
                <p>Muốn kết bạn</p>
                <p className="rep">Trả lời</p>
              </div>
            </div>
            <Stack spacing={2} direction="row">
              <Button variant="text" onClick={()=> handleCancle(item.inviteId,item?.idConver?._id)} >Bỏ qua</Button>
              <Button variant="contained" onClick={()=> handleAccept(item.inviteId)}>Đồng ý</Button>
            </Stack>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListRequestComponent;
