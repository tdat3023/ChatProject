//validate email
export const isValidEmail = (stringEmail) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(stringEmail);
};

//validate password
export const isValidPassword = (stringPassword) => stringPassword.length >= 3;

export const checkUrlIsImage = (url) => {
  return /\.(jpg|jpeg|png|webp|avif|svg)$/.test(url);
};
export const checkUrlIsSticker = (url) => {
  return /\.(gif|avif|jpg|png)$/.test(url);
};

export const checkUrlIsDocx = (url) => {
  // console.log(url.includes(".docx"));
  // return url.includes(".docx");
  return /\.(docx|pdf|zip)$/.test(url);
};

export const checkUrlIsVideo = (url) => {
  // console.log(url.includes(".docx"));
  // return url.includes(".docx");
  //return /\.(mp4)$/.test(url);
  return url.includes(".mp4");
};
