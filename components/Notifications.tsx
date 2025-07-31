"use client";

import { useSelector } from "react-redux";
import { RootState } from "../store";
import Toast from "./Toast";

const NotificationContainer = () => {
  const notifications = useSelector(
    (state: RootState) => state.ui.notifications
  );

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {notifications.map((n) => (
        <Toast key={n.id} {...n} />
      ))}
    </div>
  );
};

export default NotificationContainer;
