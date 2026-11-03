"use client";

import { useAuthQueriesStore, useAuthStore } from "@/store";
import { useEffect, useRef } from "react";

import useQueryGet from "@/helpers/queryGet";

const AuthQueriesSetter = () => {
  const queries = useQueryGet();
  const { isLogin } = useAuthStore();
  const captured = useRef(false);

  useEffect(() => {
    if (!queries || captured.current || isLogin) return;
    captured.current = true;
    useAuthQueriesStore.setState({ auth_queries: queries });
  }, [isLogin, queries]);

  return null;
};

export default AuthQueriesSetter;
