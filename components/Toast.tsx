import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeNotification } from "../store/uiSlice";

interface ToastProps {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

const Toast: React.FC<ToastProps> = ({ id, message, type }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeNotification(id));
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, dispatch]);

  return (
    <div className={`toast ${type} shadow-md p-4 mb-2 rounded text-white`}>
      {message}
    </div>
  );
};

export default Toast;
