import React, { createContext, useContext, useState } from 'react';

interface AIAssistantContextType {
    currentTask: string | null;
    suggestions: Array<{
        id: string;
        type: string;
        message: string;
        priority: 'high' | 'medium' | 'low';
    }>;
    setCurrentTask: (task: string | null) => void;
    addSuggestion: (suggestion: any) => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export const AIAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentTask, setCurrentTask] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState([]);

    const addSuggestion = (suggestion: any) => {
        setSuggestions(prev => [...prev, suggestion]);
    };

    return (
        <AIAssistantContext.Provider value={{
            currentTask,
            suggestions,
            setCurrentTask,
            addSuggestion,
        }}>
            {children}
        </AIAssistantContext.Provider>
    );
};

export const useAIAssistant = () => {
    const context = useContext(AIAssistantContext);
    if (context === undefined) {
        throw new Error('useAIAssistant must be used within an AIAssistantProvider');
    }
    return context;
}; 