'use client';

import React, {
    createContext,
    ReactNode,
    useContext
} from 'react';
import { AuthContextType, User } from "@/types/user"
import { capabilitiesForPositions } from '@/lib/permissions';

const mockUser: User = {
    id: "mock-user",
    email: "mockuser@example.com",
    name: "Mock User for Testing Permissions",
    positions: ["nothing!"],
    capabilities: capabilitiesForPositions(["nothing!"]),
}

const mockAuthContextType = {
    user: mockUser,
    pendingRegistration: null,
    noAccess: null,
    loadError: false,
    login: () => {},
    logout: () => {},
    refresh: async () => {},
    isLoading: false,
}

const AuthContext = createContext<AuthContextType | undefined>(mockAuthContextType);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}