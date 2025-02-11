import React, { useState, useEffect } from 'react';
import { Patient } from '../types/PatientTypes';
import { SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface WorkflowSuggestion {
    type: 'document_request' | 'follow_up' | 'alert' | 'action_item';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    action?: () => void;
}

const AIWorkflowAssistant: React.FC<{ patient: Patient }> = ({ patient }) => {
    const [suggestions, setSuggestions] = useState<WorkflowSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTask, setActiveTask] = useState<string | null>(null);

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-900">AI Workflow Assistant</h3>
                </div>
                <button 
                    onClick={() => refreshSuggestions()}
                    className="text-blue-600 hover:text-blue-700"
                >
                    <ArrowPathIcon className="h-5 w-5" />
                </button>
            </div>

            {/* Active Tasks */}
            {activeTask && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">In Progress</h4>
                    <div className="flex items-center gap-2">
                        <div className="animate-pulse">
                            <SparklesIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-sm text-blue-700">{activeTask}</span>
                    </div>
                </div>
            )}

            {/* Suggestions List */}
            <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                    <SuggestionCard 
                        key={index}
                        suggestion={suggestion}
                        onAction={() => handleSuggestionAction(suggestion)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AIWorkflowAssistant; 