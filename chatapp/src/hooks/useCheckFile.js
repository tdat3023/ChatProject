import { useState } from "react";

const useCheckFile = () => {
  const checkUrlIsImage = (url) => {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  };

  const checkUrlIsDocx = (url) => {
    // console.log(url.includes(".docx"));
    // return url.includes(".docx");
    return /\.(docx|pdf|zip)$/.test(url);
  };



  const checkUrlIsVideo = (url) => {
    // console.log(url.includes(".docx"));
    // return url.includes(".docx");
    //return /\.(mp4)$/.test(url);
    return url.includes(".mp4");
  };

  return {
    checkUrlIsImage: checkUrlIsImage,
    checkUrlIsDocx: checkUrlIsDocx,
    checkUrlIsVideo:checkUrlIsVideo
  };
};

export default useCheckFile;
