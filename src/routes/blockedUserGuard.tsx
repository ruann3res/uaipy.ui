import { Outlet } from "react-router-dom";
import { useBlockedUser } from "@/hooks/useBlockedUser";
import { BlockedUserMessage } from "@/components/BlockedUserMessage";

interface BlockedUserGuardProps {
    children?: React.ReactNode;
}

export const BlockedUserGuard = ({ children }: BlockedUserGuardProps) => {
    const { isBlocked } = useBlockedUser();

    if (isBlocked) {
        return <BlockedUserMessage />;
    }

    return children ? <>{children}</> : <Outlet />;
}; 