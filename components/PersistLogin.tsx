//apps/client/src/components/PersistLogin.tsx
import { Skeleton, Flex } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { Outlet } from "react-router";
import axiosInstance, { setAccessToken } from "../lib/axios";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);

  const effectRan = useRef(false);

  useEffect(() => {
    // Prevent double-invocation in React Strict Mode (Development)
    if (effectRan.current) return;
    effectRan.current = true;

    const verifySession = async () => {
      const isPersist = localStorage.getItem("persist");

      if (!isPersist) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await axiosInstance.post("/api/users/refresh-token");
        setAccessToken(data.data.accessToken);
      } catch (err) {
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, []);

  if (isLoading) {
    return (
      <Flex width="full" height="95vh" direction="column" justify="center" align="center" gap={4} p={4}>
        <Skeleton width="full" height="100px" />
        <Skeleton width="full" flex={1} borderRadius="md" />
      </Flex>
    );
  }

  return <Outlet />;
};

export default PersistLogin;
