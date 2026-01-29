// src/components/RequireAuth.tsx
import { Navigate, Outlet, useLocation } from "react-router";
import useCurrentUser from "../features/auth/hooks/useCurrentUser";
import { Skeleton, Flex } from "@chakra-ui/react";

const RequireAuth = () => {
  const { data: currentUser, isLoading } = useCurrentUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <Flex
        width="full"
        height="95vh"
        direction="column"
        justify="center"
        align="center"
        gap={4}
        p={4}
      >
        <Skeleton width="full" height="100px" />
        <Skeleton width="full" flex={1} borderRadius="md" />
      </Flex>
    );
  }

  // If not authenticated, redirect to signin with the original location saved
  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
