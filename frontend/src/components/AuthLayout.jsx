import React, { useEffect, useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector(
    (state) => state.auth.isActive,
    shallowEqual // Prevent unnecessary re-renders
  );

  const shouldRedirect = useMemo(() => {
    if (authentication && !authStatus) return "/login";
    if (!authentication && authStatus) return "/";
    return null;
  }, [authStatus, authentication]);

  useEffect(() => {
    if (shouldRedirect) navigate(shouldRedirect);
  }, [shouldRedirect, navigate]);

  return <>{children}</>;
}
