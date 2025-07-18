import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import {
  XCircle,
  CheckCircle,
  ExclamationTriangle,
} from "react-bootstrap-icons";

import "./Alert.css";
import { useDispatch, useSelector } from "react-redux";
import { hideAlert } from "../features/ui/alertSlice";

export default function CustomAlert() {
  const dispatch = useDispatch();
  const { show, type, title, message } = useSelector((state) => state.alert);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="me-2 text-success" size={24} />;
      case "danger":
        return <XCircle className="me-2 text-danger" size={24} />;
      case "warning":
        return <ExclamationTriangle className="me-2 text-warning" size={24} />;
      default:
        return null;
    }
  };

  return show ? (
    <Alert
      variant={type}
      onClose={() => dispatch(hideAlert())}
      dismissible
      className="custom-alert shadow-sm p-3"
    >
      <div className="d-flex align-items-center mb-2">
        {getIcon()}
        <h5 className="mb-0">{title}</h5>
      </div>
      <p className="mb-0">{message}</p>
    </Alert>
  ) : null;
}
