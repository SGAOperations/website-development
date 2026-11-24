import type { Capability } from '@/lib/permissions.ts';
import { createContext, useContext } from 'react';

export type { Capability };

export interface User {
    id: string | null;
    email: string;
    name: string;
    positions: string[];
    capabilities: Capability[];
    avatar?: string;
}

export function userCan(
    user: User | null | undefined,
    capability: Capability,
): boolean {
    return user?.capabilities.includes(capability) ?? false;
}

export interface PendingRegistration {
    email: string;
    name: string;
}

export interface AuthContextType {
    user: User | null;
    pendingRegistration: PendingRegistration | null;
    noAccess: PendingRegistration | null;
    loadError: boolean;
    login: () => void;
    logout: () => void;
    refresh: () => Promise<void>;
    isLoading: boolean;
}

