import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import avt from "../../images/av.jpg";
import Avatar from "@mui/material/Avatar";
import "./ModelDetailUser.scss";
import ButtonGroup from "@mui/material/ButtonGroup";
import Contex from "../../store/Context";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { storageRef } from "../../firebase";
import { BsFillCameraFill } from "react-icons/bs";
import "firebase/compat/firestore";
import UserService from "../../services/UserService";
import { SetShowALert, SetShowUpdateForm } from "../../store/Actions";
import AlertNotification from "./AlertNotification";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  height: "85vh",
  borderRadius: "8px",
  boxShadow: 24,
  paddingTop: 1,
  paddingBottom: 1,
};

const ModelDetailUser = () => {
  const inputFileAvatar = React.useRef();

  const { state, depatch } = React.useContext(Contex);

  //detructering...
  const { user, showUpdateForm, showAlert } = state;
  // const [userTemp, setUserTemp] = React.useState(null);
  // console.log(userTemp);

  const handleClose = () => {
    depatch(SetShowUpdateForm(false));
  };
  const [avt, setAvt] = React.useState();
  const [checkedGender, setCheckedGender] = React.useState(1);
  const [image, setImage] = React.useState(null);

  //kiem tra co su thay doi ve avatar, gender khong
  const [changeAvt, setChangeAvt] = React.useState(false);
  const [changeUser, setChangeUser] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  // console.log(checkedGender);
  // console.log(avt?.preview);

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
    setChangeAvt(true);
  };

  React.useEffect(() => {
    //clean fnc
    return () => {
      avt && URL.revokeObjectURL(avt.preview);
    };
  }, [avt]);

  React.useEffect(() => {
    // console.log("e :" + user?.sex);
    setCheckedGender(user?.sex);
  }, [user]);

  //handle status checkbox
  const handleChangeGender = (e) => {
    setCheckedGender(+e.target.value);
    setChangeUser(true);
  };

  //request change user info
  const handleSubmitChange = () => {
    //handle image => url img
    //upload from imgage local to fire storage
    // 'file' comes from the Blob or File API
    //check ng dung co thay doi avatar khong?
    handleClose();
    //avatar thay doi
    if (changeAvt) {
      storageRef
        .child(`images/users/${user.email}`)
        .put(image)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
          // Getting Download Link -> update url avatar
          storageRef
            .child(`images/users/${user.email}`)
            .getDownloadURL()
            .then((url) => {
              // //update firebase store
              UserService.update(user.uid, {
                sex: checkedGender,
                avatar: url,
              }).then(function (snapshot) {
                //thanh cong
                //close update form

                depatch(SetShowALert(true));
                const timeout = setTimeout(() => {
                  console.log("This will be called after 2 seconds");
                  depatch(SetShowALert(false));
                }, 2000);
                console.log("secced");
                return;
              });
            });
        });
    }

    //reqest firebase -> update
    if (changeUser) {
      UserService.update(user.uid, {
        sex: checkedGender,
      }).then(function (snapshot) {
        //thanh cong

        depatch(SetShowALert(true));
        const timeout = setTimeout(() => {
          console.log("This will be called after 2 seconds");
          depatch(SetShowALert(false));
        }, 2000);
        console.log("secced");
      });
    }
  };

  //cancel -> close this form
  const handleCancel = () => {
    //co su thay doi : avatar, gender -> show confim dialog
    if (changeUser || changeAvt) {
      //show dialog
      setOpenAlert(true);
      return;
    }
    //neu khong co su thay doi nao -> close
    handleClose();
  };

  const closeOpenAlert = () => {
    setOpenAlert(false);
    handleClose();
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={showUpdateForm}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showUpdateForm}>
          <Box sx={style}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingLeft: 2,
                paddingRight: 2,
                paddingBottom: 1,
              }}
            >
              <p style={{ fontSize: "18px" }}>Cập nhật tài khoản</p>
              <Box component="span" display="inline">
                <CloseIcon onClick={handleClose} />
              </Box>
            </Box>

            <div className="bg">
              <input
                type="file"
                ref={inputFileAvatar}
                hidden
                onChange={handlePreviewAvatar}
              ></input>
              <div className="bg-info">
                <Avatar
                  alt={user?.first_name}
                  src={avt ? avt?.preview : user?.avatar}
                  className="avatar"
                  onClick={() => handlChoiseFile()}
                />
                <span>
                  <BsFillCameraFill />
                </span>
              </div>
            </div>

            <div className="edit_name">
              <p>Tên hiển thị</p>
              <TextField
                id="outlined-basic"
                value={user?.first_name + " " + user?.last_name}
                variant="outlined"
              />
              <p className="title">
                Sử dụng tên thật để bạn bè tìm kiếm dễ dàng hơn
              </p>
            </div>

            <div className="line"></div>

            <div className="info-personupdate">
              <h5>Thông tin cá nhân</h5>

              <FormControl style={{ marginTop: "1rem" }}>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Giới tính:
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel
                    control={<Radio value={1} onClick={handleChangeGender} />}
                    label="Nam"
                    checked={checkedGender === 1 ? true : false}
                  />
                  <FormControlLabel
                    control={<Radio value={0} onClick={handleChangeGender} />}
                    label="Nữ"
                    checked={checkedGender === 0 ? true : false}
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <div className="group_btn">
              <Button
                variant="outlined"
                style={{ marginRight: "10px" }}
                onClick={() => handleCancel()}
              >
                Hủy
              </Button>
              <Button
                disabled={changeAvt || changeUser ? false : true}
                variant="contained"
                onClick={() => handleSubmitChange()}
              >
                Cập nhật
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
      {openAlert ? (
        <AlertNotification
          openAlert={openAlert}
          closeOpenAlert={closeOpenAlert}
          handleSubmitChange={handleSubmitChange}
          title={{ text: "Bạn có muốn lưu thay đổi?", status: "update" }}
        />
      ) : null}
    </div>
  );
};

export default ModelDetailUser;
