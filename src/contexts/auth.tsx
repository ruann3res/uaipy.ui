import { AuthService } from "@/services/api/v1/AuthService";
import { storageKeys } from "@/configs";
import { createContext, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface IAuthContextValue {
    signedIn: boolean;
    signIn(username: string, password: string): Promise<void>;
    signOut(): void;
}

export const AuthContext = createContext({} as IAuthContextValue)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();

    const [signedIn, setSignedIn] = useState(() => {
        return !!localStorage.getItem(storageKeys.accessToken)
    })

    const signIn = useCallback(async (username: string, password: string) => {
        const { access_token} = await AuthService.signIn({ username, password })

        localStorage.setItem(storageKeys.accessToken, access_token)
        queryClient.clear();
        setSignedIn(true)
    }, [queryClient])

    const signOut = useCallback(() => {
        localStorage.removeItem(storageKeys.accessToken)
        queryClient.clear();
        setSignedIn(false)
    }, [])

    const value: IAuthContextValue = {
        signedIn,
        signIn,
        signOut,
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )
}