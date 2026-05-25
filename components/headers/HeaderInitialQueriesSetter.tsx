import useQueryGet from "@/helpers/queryGet";
import { useAuthQueriesStore, useAuthStore } from "@/store";
import { useEffect, useState } from "react";

const HeaderInitialQueriesSetter = () => {
  const queries = useQueryGet();
  const { isLogin } = useAuthStore();
  const [preventer, setPreventer] = useState(false);

  useEffect(() => {
    if (!!queries && !preventer && !isLogin) {
      useAuthQueriesStore.setState({ auth_queries: queries });
      setPreventer(true);
    }
  }, [queries, preventer, isLogin]);

  return <></>;
};

export default HeaderInitialQueriesSetter;
