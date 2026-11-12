import React, { useState, useEffect } from "react";

const EMPTY = [];

export default function NotificationStack({ notifications = EMPTY, onDismiss }) {
  const [activeList, setActiveList] = useState(notifications);

  useEffect(() => {
    setActiveList(notifications);
  }, [notifications]);

  useEffect(() => {
    if (!activeList.length) return undefined;

    const timer = setTimeout(() => {
      const first = activeList[0];
      setActiveList((list) => list.filter((item) => item !== first));
      onDismiss?.(first);
    }, 6000);

    return () => clearTimeout(timer);
  }, [activeList, onDismiss]);

  return (
    <div className="notification-stack" aria-live="polite">
      {activeList.map((item, index) => (
        <div className={`toast ${item?.type || "info"}`} key={item?.id ?? index}>
          <span>{typeof item === "string" ? item : item?.message}</span>
          <button
            type="button"
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => {
              setActiveList((list) => list.filter((_, i) => i !== index));
              onDismiss?.(item);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}