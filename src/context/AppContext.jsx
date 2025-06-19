import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [visible, setVisible] = useState(true);
  const [buttonText, setButtonText] = useState(false);

  const value = {
    visible,
    setVisible,
    buttonText,
    setButtonText,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
