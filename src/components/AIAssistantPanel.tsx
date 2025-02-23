import React, { useState } from 'react';
import { SparklesIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import AIActivityFeed from './AIActivityFeed';

interface AIAssistantPanelProps {
    patient: Patient | null;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ patient }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={`fixed right-0 top-0 h-screen bg-white border-l border-gray-200 shadow-lg 
            transition-all duration-300 ease-in-out z-40 flex flex-col ${isCollapsed ? 'w-16' : 'w-96'}`}
        >
            {/* Header */}
            <div className="flex-none h-16 border-b flex items-center justify-between px-4 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10">
                        <SparklesIcon className="h-5 w-5 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div>
                            <h3 className="font-medium text-white">Data Collection</h3>
                            <p className="text-xs text-blue-100">
                                {patient ? `Processing ${patient.name}` : 'Select a patient'}
                            </p>
                        </div>
                    )}
                </div>
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-white/80 hover:text-white transition-colors"
                >
                    <ChevronRightIcon className={`h-5 w-5 transition-transform duration-200 
                        ${isCollapsed ? 'rotate-180' : ''}`} 
                    />
                </button>
            </div>

            {/* Content */}
            {!isCollapsed && (
                <div className="flex-1 overflow-y-auto p-4">
                    <AIActivityFeed />
                </div>
            )}
        </div>
    );
};

export default AIAssistantPanel; 