import { useMemo } from 'react';
import { decodeToken } from '@/utils';

const BLOCKED_USER_ID = "6fd72573-e28d-422d-9fd6-b01871c3a303";

export const useBlockedUser = () => {
    const isBlocked = useMemo(() => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) return false;
            
            const decoded = decodeToken(token) as any;
            const userId = decoded?.sub || decoded?.userId;
            
            return userId === BLOCKED_USER_ID;
        } catch (error) {
            console.warn('Erro ao verificar usuário bloqueado:', error);
            return false;
        }
    }, []);

    return { isBlocked };
}; 