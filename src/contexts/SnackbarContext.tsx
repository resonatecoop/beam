import React from "react";

const SnackbarContext = React.createContext({
  msg: "",
  isDisplayed: false,
  displayMessage: (msg: string) => {},
  onClose: () => {},
});

export default SnackbarContext;

export const SnackBarContextProvider: React.FC = (props) => {
  const [msg, setMsg] = React.useState("");
  const [isDisplayed, setIsDisplayed] = React.useState(false);
  const timer = React.useRef<NodeJS.Timeout>();

  const displayHandler = (msg: string) => {
    setMsg(msg);
    setIsDisplayed(true);
    timer.current = setTimeout(() => {
      closeHandler();
    }, 3000); // close snackbar after 3 seconds
  };

  const closeHandler = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setIsDisplayed(false);
  };

  return (
    <SnackbarContext.Provider
      value={{
        msg,
        isDisplayed,
        displayMessage: displayHandler,
        onClose: closeHandler,
      }}
    >
      {props.children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const { displayMessage } = React.useContext(SnackbarContext);
  return displayMessage;
};
