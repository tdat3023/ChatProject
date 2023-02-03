import * as React from "react";
import "./TabInfomation.scss";
import Avatar from "@mui/material/Avatar";
import { AiOutlineBell } from "react-icons/ai";
import { MdGroupAdd } from "react-icons/md";
import { RiDeleteBin3Line } from "react-icons/ri";
import { IoExitOutline } from "react-icons/io5";
import { AiOutlineDeleteColumn } from "react-icons/ai";

import { TiAttachmentOutline } from "react-icons/ti";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import "simplebar/dist/simplebar.css";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import love from "../../images/love.jpg";
import Contex from "../../store/Context";
import { useContext } from "react";
import conversationApi from "../../api/conversationApi";
import messageApi from "../../api/messageApi";
import { useState } from "react";
import WordsComponent from "../filecomponent/WordsComponent";
import {
  SetGroupChatting,
  SetIdConversation,
  SetUserSearched,
} from "../../store/Actions";
import Chip from "@mui/material/Chip";

import MemberCard from "../card/MemberCard";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import { AiOutlineSearch } from "react-icons/ai";
import UserService from "../../services/UserService";

import conversationHook from "../../hooks/conversationHook";
import aleartHook from "../../hooks/aleartHook";
import avtGroup from "../../images/avtgroup.jpg";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "33%",
  bgcolor: "background.paper",

  boxShadow: 24,
  p: 2,
};
const TabInfomation = ({ socket }) => {
  const { state, depatch } = useContext(Contex);
  const [listImage, setListImage] = useState([]);
  const [files, setFiles] = useState([]);
  const [members, setMembers] = useState([]);
  const [leaderId, setLeaderId] = useState("");

  //material ui
  const [open, setOpen] = React.useState(false);
  //statue search in model create group
  const [textSearchMember, setTextSeachMember] = useState("");
  const [usersAddMember, setUserAddMember] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleCloseModel = () => {
    setOpen(false);
    depatch(SetUserSearched([]));
    setTextSeachMember("");
    setUserAddMember([]);
  };

  //detructering...
  const {
    userChatting,
    groupChatting,
    user,
    idConversation,
    userSearched,
    idLeaderGroup,
  } = state;

  //console.log("tabInfo: ", userChatting);

  //import costom hook
  const { addMemberIntoGroup } = conversationHook();
  const { notify } = aleartHook();

  React.useEffect(() => {
    //get list image in the conversation
    const featchFile = async (idConversation, type) => {
      try {
        const response = await messageApi.getMessWithType(idConversation, type);
        if (type === "IMAGE") {
          setListImage(response);
        } else if (type === "APPLICATION") {
          setFiles(response);
        }
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };

    featchFile(idConversation, "IMAGE");
    featchFile(idConversation, "APPLICATION");
  }, [idConversation]);

  React.useEffect(() => {
    const featchListMember = async (idConversation) => {
      try {
        return await conversationApi.getListMember(idConversation);
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };
    featchListMember(idConversation).then((response) => {
      console.log("list member: ", response);
      setMembers(response.members);
      setLeaderId(response.leaderId)
    });

    if(socket.current){
      socket.current.on("notifi-kickUser", (data) => {
        featchListMember(data);
      })
    }

  }, [user,idConversation,members,leaderId]);
  console.log("leaderId:: ", leaderId);

  // React.useEffect(() => {
  //   //socket call api get list member when kick, add member into the group
  //   if (socket.current) {
  //     socket.current.on("notifi-kickUser", (data) => {
  //       if (data) {
  //         //console.log("kick");
  //         const featchListMember = async (data) => {
  //           try {
  //             const response = await conversationApi.getListMember(data);
  //             setMembers(response.members);
  //           } catch (error) {
  //             console.log("Failed to fetch conversation list: ", error);
  //           }
  //         };
  //         featchListMember(data);
  //       }
  //     });
  //   }
  // }, [idConversation]);

  const handleLeaveGroup = async () => {
    try {
      const response = await conversationApi.leaveGroup(
        idConversation,
        user.uid
      );
      if (response) {
        console.log("leave");
        depatch(SetGroupChatting(null));
        depatch(SetIdConversation(null));

        if (socket.current) {
          socket.current.emit("kickUser", {
            idConversation: idConversation,
            // idLeader:user.uid,
            idUserKick: user.uid,
          });
        }
      }
    } catch (error) {
      console.log("Failed to fetch conversation list: ", error);
    }
  };

  const handleDeleteAllMess = async () => {
    try {
      const response = await conversationApi.deleteAllMess(
        idConversation,
        user.uid
      );
      if (response) {
        console.log("delete");
        //render list mess
      }
    } catch (error) {
      console.log("Failed to fetch conversation list: ", error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      const response = await conversationApi.deleteGroup(idConversation);
      if (response) {
        console.log("delete");
        depatch(SetGroupChatting(null));
        depatch(SetIdConversation(null));

        if (socket.current) {
          socket.current.emit("kickUser", {
            idConversation: idConversation,
            // idLeader:user.uid,
            // idUserKick:user.uid
          });
        }
      }
    } catch (error) {
      console.log("Failed to fetch conversation list: ", error);
    }
  };

  const handleOpenModelAddMember = () => {
    handleOpen();
  };
  //xoa user khoi danh sach user tao nhom
  const handleDeleteUser = (u) => {
    const newArr = usersAddMember.filter((val) => {
      return val.uid !== u.uid;
    });
    setUserAddMember(newArr);
  };

  //chuyen user sang trang thai danh sach user chuan bi tao nhom
  const handleMove = (u) => {
    let status = 0;
    // console.log(u);
    // //neu user muon them da la thanh vien trong group => return
    members.forEach((val) => {
      console.log(val);
      if (u.uid === val.userId) {
        console.log("user da co trong group --> k add dc nha");
        notify();
        status = 1;
      }
    });
    console.log(status);
    if (status === 0) {
      if (usersAddMember.length === 0) {
        if (user.uid !== u.uid) {
          setUserAddMember([u]);
        }
      } else {
        //user muon them chinh la ban
        if (user.uid === u.uid) {
          return;
        }

        // console.log("dung");
        const newArr = [...usersAddMember, u];

        //loc ra cac id k trung nhau
        const newUsers = newArr.filter((val, idx) => {
          return idx === newArr.findIndex((v) => val === v);
        });

        setUserAddMember(newUsers);
      }
    }
  };

  //handle search in model create group
  const handleSearchInCreateGroup = (e) => {
    setTextSeachMember(e.target.value.trim());

    //get key search
    const text = e.target.value.trim();

    //check isGmail
    // let res = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // if (res.test(text)) {
    //   //search by email

    //   UserService.getUserByEmail(text)
    //     .then((querySnapshot) => {
    //       querySnapshot.forEach((doc) => {
    //         //console.log(doc.data());
    //         depatch(SetUserSearched(doc.data()));
    //       });
    //     })
    //     .catch((error) => {
    //       console.log("Error getting documents: ", error);
    //     });
    // } else {
    //   depatch(SetUserSearched(null));
    // }

    UserService.getUserByEmail(text)
      .then((querySnapshot) => {
        //neu khong tim thay user can tim va userSearched != null
        //=> set userSearched = null
        if (querySnapshot.empty && userSearched) {
          depatch(SetUserSearched([]));
        }
        const arrUsers = [];
        querySnapshot.forEach((doc) => {
          arrUsers.push(doc.data());

          depatch(SetUserSearched(arrUsers));
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  //handle add member into group
  const handleAddMember = () => {
    //close model
    handleCloseModel();

    //get list id in users will add to group
    const idList = usersAddMember.map((val) => {
      return val.uid;
    });

    //console.log(idList);
    // //call api save data
    // const addMemberIntoGroup = async () => {
    //   try {
    //     const response = await conversationApi.addMember(
    //       idConversation,
    //       user.uid,
    //       idList
    //     );

    //     console.log("add member thanh cong" + response);
    //   } catch (error) {
    //     console.log("Failed to add member: ", error);
    //   }
    // };

    //call custom hook
    addMemberIntoGroup(idConversation, user.uid, idList);
    if (socket.current) {
      socket.current.emit("kickUser", {
        idConversation: idConversation,
        // idLeader:user.uid,
        idUserKick: user.uid,
      });
    }
  };

  return (
    <div data-simplebar className="tab_infomation">
      <div>
        <div className="tab_info-header">
          <p>Thông tin hội thoại</p>
        </div>
        <div className="tab_info-content">
          <div className="content_top">
            {userChatting?.avatar ? (
              <Avatar
                className="avatarCustom"
                src={userChatting?.avatar}
                alt={userChatting?.first_name}
              />
            ) : (
              <Avatar
                className="avatarCustom"
                style={{
                  textTransform: "capitalize",
                  backgroundColor: "#055E68",
                }}
                src={avtGroup}
              >
                {userChatting?.last_name[0]}
              </Avatar>
            )}

            {groupChatting ? (
              <p style={{ textTransform: "capitalize" }}>
                {groupChatting.name}
              </p>
            ) : (
              <p style={{ textTransform: "capitalize" }}>
                {userChatting?.last_name + " " + userChatting?.first_name}
              </p>
            )}
          </div>
          <div className="content_icons">
            <div className="block_icon">
              <span>
                <AiOutlineBell />
              </span>
              <p>Tắt thông báo</p>
            </div>
            <div className="block_icon">
              <span>
                <TiAttachmentOutline />
              </span>
              <p>Ghim hội thoại</p>
            </div>
            {groupChatting ? (
              <div
                className="block_icon"
                onClick={() => {
                  handleOpenModelAddMember();
                }}
              >
                <span>
                  <MdGroupAdd />
                </span>
                <p>Thêm thành viên</p>
              </div>
            ) : (
              <div className="block_icon">
                <span>
                  <MdGroupAdd />
                </span>
                <p>Tạo nhóm trò chuyện</p>
              </div>
            )}
          </div>
        </div>
        <div className="divide"></div>
        {groupChatting ? (
          <React.Fragment>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Thành viên nhóm ({members.length})</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {members.map((u, idx) => {
                  return <MemberCard u={u} socket={socket} leaderId={leaderId} />;
                })}
              </AccordionDetails>
            </Accordion>
            <div className="divide"></div>
          </React.Fragment>
        ) : null}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Ảnh/ Video</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <p
              style={{
                fontWeight: "500",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              ngay 30 thang 10
            </p>
            <ImageList
              sx={{ width: "auto", height: 450 }}
              cols={3}
              rowHeight={150}
              className="imageList"
            >
              {listImage.map((item) => (
                <ImageListItem key={item.content}>
                  <img
                    src={`${item.content}?w=150&h=150&fit=crop&auto=format`}
                    srcSet={`${item.content}?w=150&h=150&fit=crop&auto=format&dpr=2 2x`}
                    alt="erro"
                    loading="lazy"
                    style={{ cursor: "pointer", borderRadius: "6px" }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </AccordionDetails>
        </Accordion>
        <div className="divide"></div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>File</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <p
              style={{
                fontWeight: "500",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              ngay 30 thang 10
            </p>
            <ImageList
              sx={{ width: "auto", height: 700 }}
              cols={1}
              rowHeight={150}
            >
              {files.map((item) => (
                <ImageListItem key={item.content}>
                  <WordsComponent mess={item} />
                </ImageListItem>
              ))}
            </ImageList>
          </AccordionDetails>
        </Accordion>
        <div className="divide"></div>
      </div>
      <div className="tab_info-footer">
        <div className="deleteChat" onClick={handleDeleteAllMess}>
          <span>
            <RiDeleteBin3Line />
          </span>
          <p>Xóa lịch xử trò chuyện</p>
        </div>

        {userChatting ? null : (
          <div className="leaveChat" onClick={handleLeaveGroup}>
            <span>
              <IoExitOutline />
            </span>
            <p>Rời Nhóm</p>
          </div>
        )}

        {/* <div className="deleteGroup" onClick={handleDeleteGroup}>
        <span>
          <AiOutlineDeleteColumn />
        </span>
        <p>Giả tán Nhóm</p>
      </div> */}
        {user.uid === leaderId ? (
          <div className="deleteGroup" onClick={handleDeleteGroup}>
            <span>
              <AiOutlineDeleteColumn />
            </span>
            <p>Giả tán Nhóm</p>
          </div>
        ) : null}
      </div>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleCloseModel}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className="model_group"
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="model_header">
              <p>Thêm thành viên</p>
              <span>x</span>
            </div>

            <div className="model_search">
              <div className="group_input" style={{ marginTop: "1rem" }}>
                <span>
                  <AiOutlineSearch />
                </span>
                <input
                  placeholder="Tìm kiếm"
                  type="text"
                  value={textSearchMember}
                  // onFocus={(e) => handleCilckCreateGroup(e)}
                  // // onBlur={(e) => handleBlur(e)}
                  onChange={(e) => handleSearchInCreateGroup(e)}
                  style={{ width: "100%" }}
                  // onChange={(e) => set(e.target.vallue)}
                />
              </div>
            </div>

            <div className="list_user">
              <div className="list_user-willChoise">
                {userSearched.length > 0
                  ? userSearched?.map((u) => {
                      return (
                        <div
                          className="user_search_model_group"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleMove(u)}
                        >
                          {u?.avatar ? (
                            <Avatar
                              className="avatar"
                              src={u?.avatar}
                              alt={u?.first_name}
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
                          <p
                            style={{
                              textTransform: "capitalize",
                              marginLeft: "8px",
                            }}
                          >
                            {u?.last_name + " " + u?.first_name}
                          </p>
                        </div>
                      );
                    })
                  : members?.map((u) => {
                      return <MemberCard u={u} modelAdd />;
                    })}
              </div>
              {usersAddMember.length > 0 ? (
                <div className="user_choise">
                  <p>
                    Đã chọn : <span>{usersAddMember.length}/100</span>
                  </p>
                  {usersAddMember?.map((val) => {
                    return (
                      <Chip
                        avatar={<Avatar alt="Natacha" src={val.avatar} />}
                        label={val?.last_name + " " + val?.first_name}
                        variant="outlined"
                        onDelete={() => handleDeleteUser(val)}
                        key={val.uid}
                        style={{ marginTop: "0.5rem" }}
                      />
                    );
                  })}
                </div>
              ) : null}
            </div>
            <div className="group_button">
              <Button
                variant="outlined"
                style={{ marginRight: "6px" }}
                onClick={handleCloseModel}
              >
                Hủy
              </Button>
              {usersAddMember.length > 0 ? (
                <Button onClick={handleAddMember} variant="contained">
                  Xác nhận
                </Button>
              ) : (
                <Button
                  onClick={() => handleAddMember()}
                  variant="contained"
                  disabled
                >
                  Xác nhận
                </Button>
              )}
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default TabInfomation;
