'use client';

import React, {
    createContext,
    useContext
} from 'react';
import { AuthContextType } from "@/types/user"

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}