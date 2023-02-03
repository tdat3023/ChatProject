import LoginForm from "../components/form/LoginForm";
import "./LoginPageStyle.scss";
import CircularProgress from "@mui/material/CircularProgress";

const PageLoading = () => {
  return (
    <div className="chat_loading">
      <h1>ZenChat</h1>
      <div className="loading_group">
        <CircularProgress />
        <p>Đang đăng nhập...</p>
      </div>
    </div>
  );
};

export default PageLoading;
