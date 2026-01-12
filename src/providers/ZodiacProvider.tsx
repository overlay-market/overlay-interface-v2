import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { useAccount as useAccountWagmi } from 'wagmi';
import { RolesModifier, useZodiacRoles } from '../hooks/useZodiacRoles';

interface ZodiacContextType {
    isAvatarTradingActive: boolean;
    activeAvatar: RolesModifier | null;
    status: 'active' | 'inactive' | null;
    setStatus: (status: 'active' | 'inactive' | null) => void;
    setActiveAvatar: (avatar: RolesModifier | null) => void;
    memberships: any[];
}

const ZodiacContext = createContext<ZodiacContextType | undefined>(undefined);

export const ZodiacProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { address, chainId } = useAccountWagmi();
    const { data: rolesData } = useZodiacRoles(address);

    const storageKey = useMemo(() => (address && chainId) ? `wallet-avatar-status:${address.toLowerCase()}:${chainId}` : null, [address, chainId]);
    const activeAvatarStorageKey = useMemo(() => (address && chainId) ? `active-avatar:${address.toLowerCase()}:${chainId}` : null, [address, chainId]);

    const [status, setStatusState] = useState<'active' | 'inactive' | null>(null);
    const [activeAvatar, setActiveAvatarState] = useState<RolesModifier | null>(null);

    // Initial load
    useEffect(() => {
        if (!storageKey) {
            setStatusState(null);
            return;
        }
        setStatusState(localStorage.getItem(storageKey) as 'active' | 'inactive' | null);
    }, [storageKey]);

    useEffect(() => {
        if (!activeAvatarStorageKey) {
            setActiveAvatarState(null);
            return;
        }
        const stored = localStorage.getItem(activeAvatarStorageKey);
        try { setActiveAvatarState(stored ? JSON.parse(stored) : null); } catch { setActiveAvatarState(null); }
    }, [activeAvatarStorageKey]);

    const setStatus = useCallback((newStatus: 'active' | 'inactive' | null) => {
        if (!storageKey) return;
        if (newStatus === null) {
            localStorage.removeItem(storageKey);
        } else {
            localStorage.setItem(storageKey, newStatus);
        }
        setStatusState(newStatus);
    }, [storageKey]);

    const setActiveAvatar = useCallback((avatar: RolesModifier | null) => {
        if (!activeAvatarStorageKey) return;
        if (avatar === null) {
            localStorage.removeItem(activeAvatarStorageKey);
        } else {
            localStorage.setItem(activeAvatarStorageKey, JSON.stringify(avatar));
        }
        setActiveAvatarState(avatar);
    }, [activeAvatarStorageKey]);

    const value = useMemo(() => ({
        isAvatarTradingActive: status === 'active' && !!activeAvatar,
        activeAvatar,
        status,
        setStatus,
        setActiveAvatar,
        memberships: rolesData?.memberOf || []
    }), [status, activeAvatar, rolesData, setStatus, setActiveAvatar]);

    return <ZodiacContext.Provider value={value}>{children}</ZodiacContext.Provider>;
};

export const useZodiacContext = () => {
    const context = useContext(ZodiacContext);
    if (context === undefined) {
        throw new Error('useZodiacContext must be used within a ZodiacProvider');
    }
    return context;
};
