import * as React from "react";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

const ButtonCustom = () => {
  // It is a hook imported from 'react-i18next'
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);

  return (
    <Button
      style={{
        width: "100%",
        marginBottom: "1rem",
        marginTop: "1rem",
        padding: "10px 12px",
      }}
      variant="contained"
      onClick={() => handleRegister()}
      disabled={loading ? true : false}
    >
      {loading ? (
        <span>
          {" "}
          <CircularProgress />
        </span>
      ) : null}
      {t("register")}
    </Button>
  );
};

export default ButtonCustom;
