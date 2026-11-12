import React from "react";
import Icon from "./common/Icon";

export default function ErrorHandler({ message = "Error", onRetry }) {
  return (
    <div className="error-handler" role="alert">
      <Icon name="alert" />
      <div>
        <strong>Error</strong>
        <p>
          {message && message !== "Error"
            ? message
            : "An unexpected error occurred."}
        </p>
      </div>
      {onRetry && (
        <button
          type="button"
          className="btn secondary small"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
}