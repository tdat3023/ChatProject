import * as React from "react";
import words from "../../images/word.png";
import pdf from "../../images/pdf.png";
import file from "../../images/folder-icon.png";
import { BsDownload } from "react-icons/bs";
import "./WordsComponentStyle.scss";

const WordsComponent = ({ mess }) => {
  const [content, setContent] = React.useState("");
 
  React.useEffect(() => {
    //ckeck do dai
    const newContent = mess.content.slice(
      findString("_", mess.content, 2) + 1,
      mess.content.length
    );

    if (newContent.length > 30) {
      const cContent = newContent.slice(
        newContent.length - 26,
        newContent.length
      );
      setContent(cContent);
      return;
    }
    setContent(newContent);
  }, []);
  function findString(sub, str, n) {
    let count = 0;
    for (let i = 0; i < str.length; ++i) {
      //Cắt chuỗi con từ chuỗi ban đầu có cùng độ dài với chuỗi cần thay thế.
      //Sau đó so sánh chuỗi con này với chuỗi cần thay thế để tìm ra vị trí chuỗi cần thay thế
      if (str.substring(i, i + sub.length) == sub) {
        count += 1;
        if (count == n) {
          count = i;
          break;
        }
      }
    }
    console.log(count);
    return count;
  }

  const handleDowload = () => {
    window.location = mess.content;
  };

  return (
    <div className="wordsComponent">
      <div className="wordsComponent_top">
        <div className="top_left">
          {mess.content.includes(".docx") ? (
            <img src={words} />
          ) : mess.content.includes(".pdf") ? (
            <img src={pdf} />
          ) : (
            <img src={file} />
          )}

          <div className="top_content">
            <p>{content}</p>
            <p className="mb">400 mb</p>
          </div>
        </div>
        <div
          className="btnDowload"
          title="lưu về máy"
          onClick={() => handleDowload()}
        >
          <span>
            <BsDownload />
          </span>
        </div>
      </div>
      {/* <div className="wordsComponent_bottom">
        <p style={{marginLeft:"4px"}}>9:20</p>
        <p>da nhan</p>
      </div> */}
    </div>
  );
};

export default WordsComponent;
