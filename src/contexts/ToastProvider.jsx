/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";
import ToastManager from "../components/ToastManager/ToastManager";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toastConfig, setToastConfig] = useState({
    message: "",
    variant: "primary",
    position: "bottom-end",
    text: "white",
    show: false,
  });

  const triggerToast = (message, variant = "primary", text = "white", position = "bottom-end") => {
    setToastConfig({ message, variant, show: true, text, position });
  };

  const handleClose = () =>
    setToastConfig((prev) => ({ ...prev, show: false }));

  return (
    <ToastContext.Provider value={{ triggerToast }}>
      {children}
      <ToastManager
        // triggerToast={triggerToast}
        message={toastConfig.message}
        variant={toastConfig.variant}
        text={toastConfig.text}
        position={toastConfig.position}
        show={toastConfig.show}
        onClose={handleClose}
      />
    </ToastContext.Provider>
  );
};
