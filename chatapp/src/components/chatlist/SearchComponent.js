import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { MdPersonAddAlt } from "react-icons/md";
import { BsPeople, BsCameraFill } from "react-icons/bs";
import "./SearchComponentStyle.scss";
import React, { useRef, useState } from "react";
import Context from "../../store/Context";
import {
  SetLoadingSearchFunc,
  SetSearchingStatus,
  SetShowTabHistorySearch,
  SetUserSearched,
  SetIdConversation,
} from "../../store/Actions";
import UserService from "../../services/UserService";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import conversationApi from "../../api/conversationApi";
import { storageRef } from "../../firebase";
import CardFriend from "../card/CardFriend";
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

const SearchComponent = ({ socket }) => {
  const inputFileAvatar = React.useRef();
  const groupSearchRef = useRef();
  const creatGroupInput = useRef();

  const [active, setActive] = useState(false);
  const [nameGroup, setNameGroup] = useState("");
  const [searchText, setSerachText] = useState("");
  const [usersCreateGroup, setUsesrCreateGroup] = useState([]);

  //state model is add friend or create group
  //0: model add firend;
  //1: model create group
  const [statusModel, setStatusModel] = useState(null);

  //statue search in model create group
  const [textSearchInCreateGroup, setTextSearchInCreateGroup] = useState("");

  const { state, depatch } = React.useContext(Context);
  //detructering...
  const {
    user,
    showUpdateForm,
    showAlert,
    showTabHistorySearch,
    userSearched,
    searchingStatus,
    idConversation,
  } = state;

  //mang danh sach cac user duoc search
  const [arrayUser, setArrayUser] = useState([]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleCloseModel = () => {
    console.log("call method close model");
    setOpen(false);
    setTextSearchInCreateGroup("");
    depatch(SetUserSearched([]));
  };
  const [image, setImage] = React.useState(null);
  const [avt, setAvt] = React.useState(null);

  const handleOnClick = (e) => {
    //add clss active
    groupSearchRef.current.classList.add("active");
    setActive(true);
    depatch(SetShowTabHistorySearch(true));
  };

  const handleCilckCreateGroup = () => {
    //add clss active
    creatGroupInput.current.classList.add("active");
  };

  const handleClose = () => {
    groupSearchRef.current.classList.remove("active");
    setActive(false);
    depatch(SetShowTabHistorySearch(false));
    setSerachText("");
    depatch(SetLoadingSearchFunc(true));
    depatch(SetUserSearched(null));
    depatch(SetSearchingStatus(false));
  };

  //search func
  const handleSearch = (e) => {
    setSerachText(e.target.value.trim());

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

    // is searching => set status search
    depatch(SetSearchingStatus(true));

    //loading component show
    depatch(SetLoadingSearchFunc(true));
    UserService.getUserByEmail(text)
      .then((querySnapshot) => {
        depatch(SetLoadingSearchFunc(false));

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

  //delete text in input search
  const handleDelete = (e) => {
    setSerachText("");

    depatch(SetUserSearched([]));
    depatch(SetSearchingStatus(false));
  };

  //handle search in model create group
  const handleSearchInCreateGroup = (e) => {
    setTextSearchInCreateGroup(e.target.value.trim());

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

  //chuyen user sang trang thai danh sach user chuan bi tao nhom
  const handleMove = (u) => {
    console.log(u);
    if (usersCreateGroup.length === 0) {
      if (user.uid !== u.uid) {
        setUsesrCreateGroup([u]);
      }
    } else {
      console.log(user.uid);
      console.log(u.uid);
      if (user.uid === u.uid) {
        console.log("sai");
        return;
      }
      console.log("dung");
      const newArr = [...usersCreateGroup, u];

      //loc ra cac id k trung nhau
      const newUsers = newArr.filter((val, idx) => {
        return idx === newArr.findIndex((v) => val === v);
      });
      setUsesrCreateGroup(newUsers);
    }
  };

  //xoa user khoi danh sach user tao nhom
  const handleDeleteUser = (u) => {
    const newArr = usersCreateGroup.filter((val) => {
      return val.uid !== u.uid;
    });
    setUsesrCreateGroup(newArr);
  };
  //show model create group
  const handleShowCreateGroup = () => {};

  //handle create group
  const handleCreateGroup = () => {
    //close model
    handleCloseModel();

    const idList = usersCreateGroup.map((val) => {
      return val.uid;
    });
    //  console.log(idList);

    //upload image into firebase
    //co avatar
    if (avt) {
      storageRef
        .child(`images/group/${idConversation}`)
        .put(avt?.preview)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
          // Getting Download Link -> update url avatar
          storageRef
            .child(`images/group/${idConversation}`)
            .getDownloadURL()
            .then((url) => {
              console.log(url);
              //call api save data
              const createGroup = async () => {
                try {
                  const temp = {
                    userId: user.uid,
                    name: nameGroup,
                    userList: [...idList],
                    avatar: url,
                  };
                  console.log(temp);
                  const response = await conversationApi.createConversation(
                    temp
                  );
                  if (socket.current) {
                    console.log("vooo");
                    socket.current.emit("create-conversation", {
                      idConversation: response,
                      idList,
                    });
                  }
                  depatch(SetIdConversation(response));
                  setAvt(null);
                  console.log("tao nhom thanh cong" + response);
                } catch (error) {
                  console.log("Failed to fetch conversation list: ", error);
                }
              };
              createGroup();
            });
        });
    } else {
      console.log("khong co avatar ----> ");
      //call api save data
      const createGroup = async () => {
        try {
          const temp = {
            userId: user.uid,
            name: nameGroup,
            userList: [...idList],
            avatar: "",
          };
          console.log(temp);
          const response = await conversationApi.createConversation(temp);
          setAvt(null);
          if (socket.current) {
            console.log("vooo");
            socket.current.emit("create-conversation", {
              idConversation: response,
              idList,
            });
          }
          console.log("tao nhom thanh cong" + response);
        } catch (error) {
          console.log("Failed to fetch conversation list: ", error);
        }
      };
      createGroup();
    }
  };
  const handlChoiseFile = () => {
    // console.log(inputFileAvatar.current);
    inputFileAvatar.current.click();
  };

  const handlePreviewAvatar = (e) => {
    const file = e.target.files[0];
    // console.log(file);
    setImage(file);

    file.preview = URL.createObjectURL(file);

    //ckeck file .jpg, .png
    let allowedImageTypes = ["image/jpeg", "image/gif", "image/png"];
    if (!allowedImageTypes.includes(file.type)) {
      alert("Allowed file type's are: [ .jpg .png .gif ]");
      return;
    }

    setAvt(file);
  };

  const handleOpenModelAddFriend = () => {
    handleOpen();
    setStatusModel(0);
  };

  const handleOpenModleCreateGroup = () => {
    handleOpen();
    setStatusModel(1);
  };
  return (
    <React.Fragment>
      <form className="form_search">
        <div className="group_input" ref={groupSearchRef}>
          <span>
            <AiOutlineSearch />
          </span>
          <input
            placeholder="Tìm kiếm"
            type="text"
            value={searchText}
            onFocus={(e) => handleOnClick(e)}
            // onBlur={(e) => handleBlur(e)}
            onChange={(e) => handleSearch(e)}
          />

          <span
            className={`${
              searchText.length ? "iconDelete ative_delete" : "iconDelete"
            }`}
            onClick={(e) => handleDelete(e)}
          >
            <MdOutlineCancel />
          </span>
        </div>

        {active ? (
          <span className="closeSearch" onClick={(e) => handleClose(e)}>
            Đóng
          </span>
        ) : (
          <React.Fragment>
            <span className="icon" onClick={() => handleOpenModelAddFriend()}>
              <MdPersonAddAlt />
            </span>
            <span className="icon" onClick={() => handleOpenModleCreateGroup()}>
              <BsPeople />
            </span>
          </React.Fragment>
        )}
      </form>
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
              {statusModel === 1 ? <p>Tạo nhóm</p> : <p>Thêm bạn</p>}
              <span>x</span>
            </div>

            {statusModel === 1 ? (
              <div className="model_create">
                <div
                  className="choiseAvtGroup"
                  onClick={() => handlChoiseFile()}
                >
                  <input
                    type="file"
                    ref={inputFileAvatar}
                    hidden
                    onChange={handlePreviewAvatar}
                  ></input>
                  {avt ? (
                    <Avatar className="avatar" src={avt?.preview} />
                  ) : (
                    <span>
                      <BsCameraFill />
                    </span>
                  )}
                </div>
                <input
                  placeholder="Nhập tên nhóm..."
                  type="text"
                  value={nameGroup}
                  onChange={(e) => setNameGroup(e.target.value)}
                />
              </div>
            ) : null}
            <div className="model_search">
              {statusModel ? <p>Thêm bạn vào nhóm</p> : null}
              <div
                className="group_input"
                style={{ marginTop: "12px" }}
                ref={creatGroupInput}
              >
                <span>
                  <AiOutlineSearch />
                </span>
                <input
                  placeholder="Tìm kiếm"
                  type="text"
                  value={textSearchInCreateGroup}
                  onFocus={(e) => handleCilckCreateGroup(e)}
                  // onBlur={(e) => handleBlur(e)}
                  onChange={(e) => handleSearchInCreateGroup(e)}
                  style={{ width: "100%" }}
                  // onChange={(e) => set(e.target.vallue)}
                />
              </div>
            </div>

            <div className="list_user" style={{ position: "relative" }}>
              <div className="list_user-willChoise">
                {userSearched?.length === 0 ? (
                  <p
                    className="textCenter"
                    style={{
                      textAlign: "center",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                    }}
                  >
                    Không có gì!!
                  </p>
                ) : (
                  <>
                    {statusModel === 1 ? (
                      <>
                        {userSearched?.map((u) => {
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
                        })}
                      </>
                    ) : (
                      <>
                        {userSearched?.map((u) => {
                          return (
                            <CardFriend
                              u={u}
                              handleCloseModel={handleCloseModel}
                              socket={socket}
                            />
                          );
                        })}
                      </>
                    )}
                  </>
                )}
              </div>
              {usersCreateGroup.length > 0 ? (
                <div className="user_choise">
                  <p>
                    Đã chọn : <span>{usersCreateGroup.length}/100</span>
                  </p>
                  {usersCreateGroup?.map((val) => {
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
              {statusModel === 1 ? (
                <>
                  {usersCreateGroup.length > 1 && textSearchInCreateGroup ? (
                    <Button onClick={handleCreateGroup} variant="contained">
                      Tạo nhóm
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleCreateGroup()}
                      variant="contained"
                      disabled
                    >
                      Tạo nhóm
                    </Button>
                  )}
                </>
              ) : null}
            </div>
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};

export default SearchComponent;
