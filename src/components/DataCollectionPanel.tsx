import React, { useState, useEffect } from 'react';
import { LightBulbIcon } from '@heroicons/react/24/outline';

const DataCollectionPanel: React.FC<{ patient: Patient }> = ({ patient }) => {
    const [suggestions, setSuggestions] = useState<DataCollectionSuggestion[]>([]);
    
    useEffect(() => {
        const newSuggestions = generateSuggestions(patient);
        setSuggestions(newSuggestions);
    }, [patient]);

    // Example suggestion
    const generateSuggestions = (patient: Patient) => {
        const newSuggestions: DataCollectionSuggestion[] = [];
        
        // If lab results are old, suggest new ones
        if (isLabResultsOld(patient.labResults)) {
            newSuggestions.push({
                type: 'follow_up',
                priority: 'high',
                message: 'Lab results are over 6 months old. Request new CBC and A1C?',
                action: {
                    label: 'Request Labs',
                    handler: () => requestNewLabResults(patient.id)
                }
            });
        }

        // If data source is unavailable, suggest alternative
        if (patient.insuranceProvider === 'UnitedHealth' && !patient.labResults) {
            newSuggestions.push({
                type: 'alternative_source',
                priority: 'medium',
                message: 'Unable to fetch from UnitedHealth. Try Quest Diagnostics portal?',
                context: {
                    field: 'labResults',
                    suggestedValue: 'Quest Diagnostics Portal'
                }
            });
        }

        return newSuggestions;
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                    <div key={index} className={`p-3 rounded-lg ${getPriorityColor(suggestion.priority)}`}>
                        <div className="flex items-center gap-2">
                            <LightBulbIcon className="h-5 w-5 text-amber-500" />
                            <p className="text-sm font-medium">{suggestion.message}</p>
                        </div>
                        {suggestion.action && (
                            <button 
                                onClick={suggestion.action.handler}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                            >
                                {suggestion.action.label}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DataCollectionPanel; 