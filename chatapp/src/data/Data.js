import { BiMessageRoundedDetail } from "react-icons/bi";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { RiContactsBook2Line } from "react-icons/ri";
import bn3 from "../images/bn3.jpg";
import bn2 from "../images/bn2.jpg";
import bn1 from "../images/bn1.jpg";

import fake1 from "../images/av.jpg";
export const fakeImages = [
  {
    id: "fakeimage1",
    image: fake1,
  },
];
export const arrIconOption = [
  {
    id: "iconOption1",
    name: "Tin nhắn",
    icon: <BiMessageRoundedDetail className="icon" />,
  },
  {
    id: "iconOption2",
    name: "Danh bạ",
    icon: <RiContactsBook2Line className="icon" />,
  },
  // {
  //   id: "iconOption3",
  //   name: "To-do",
  //   icon: <AiOutlineCheckSquare className="icon" />,
  // },
];

export const silderData = [
  {
    id: "slider01",
    img: bn3,
    title: "tin nhăn tự xóa",
    content: "từ giờ tin nhắn có thể tự xóa theo thời gian nhất định",
  },
  {
    id: "slider02",
    img: bn2,
    title: "trải nhiệm xuyên suốt",
    content: "mọi dữ liệu sẽ được đồng bộ",
  },
  {
    id: "slider03",
    img: bn1,
    title: "Gọi nhóm và làm việc hiệu quả với video zalo call",
    content: "trao đổi công việc mọi lúc mọi nơi",
  },
];

export const iconsTouch = [
  {
    id: "icons01",
    url: "https://firebasestorage.googleapis.com/v0/b/chatapp-react-17ab5.appspot.com/o/images%2Ficons%2Flike_yellow.png?alt=media&token=7510f7cd-336e-4687-a05c-95510f7732ac",
    name: "like icon",
  },
  {
    id: "icons02",
    url: "https://firebasestorage.googleapis.com/v0/b/chatapp-react-17ab5.appspot.com/o/images%2Ficons%2Fheart.png?alt=media&token=215d6174-ff8a-4eec-8f32-11a22aff9297",
    name: "heart icon",
  },
  {
    id: "icons03",
    url: "https://firebasestorage.googleapis.com/v0/b/chatapp-react-17ab5.appspot.com/o/images%2Ficons%2Flaughing.png?alt=media&token=69f6f404-63a9-4675-ae23-888bd8f16c02",
    name: "lauch icon",
  },
  {
    id: "icons04",
    url: "https://firebasestorage.googleapis.com/v0/b/chatapp-react-17ab5.appspot.com/o/images%2Ficons%2FsFace.png?alt=media&token=aa0c0e11-b5ba-4cba-838a-5506ea0308f0",
    name: "supprice icon",
  },
  {
    id: "icons05",
    url: "https://firebasestorage.googleapis.com/v0/b/chatapp-react-17ab5.appspot.com/o/images%2Ficons%2Femoji.png?alt=media&token=2511748c-5388-4737-b8e0-807461c4da1a",
    name: "cry icon",
  },
  {
    id: "icons06",
    url: "https://firebasestorage.googleapis.com/v0/b/chatapp-react-17ab5.appspot.com/o/images%2Ficons%2Fangry.png?alt=media&token=1849bffe-76d9-4bcc-b1be-a9dd4d9c7e14",
    name: "angry icon",
  },
];
