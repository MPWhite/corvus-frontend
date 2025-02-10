import React, { useState } from 'react';
import { Patient, RequiredAction } from '../types/PatientTypes';
import { CheckCircleIcon, PlusIcon } from '@heroicons/react/24/outline';

interface MAReviewSectionProps {
    patient: Patient;
    onComplete: (review: {
        notes: string;
        completedActions: string[];
        newActions?: RequiredAction[];
        readyForSurgeon: boolean;
    }) => void;
}

const MAReviewSection: React.FC<MAReviewSectionProps> = ({ patient, onComplete }) => {
    const [notes, setNotes] = useState('');
    const [completedActions, setCompletedActions] = useState<string[]>([]);
    const [newAction, setNewAction] = useState('');
    const [readyForSurgeon, setReadyForSurgeon] = useState(false);

    const handleSubmit = () => {
        onComplete({
            notes,
            completedActions,
            readyForSurgeon
        });
    };

    return (
        <div className="bg-white rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Medical Assistant Review</h3>
            
            {/* Review Notes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Notes
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-32 p-2 border border-gray-300 rounded-md"
                    placeholder="Enter your review notes..."
                />
            </div>

            {/* Required Actions */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Actions
                </label>
                <div className="space-y-2">
                    {patient.requiredActions?.map(action => (
                        <div key={action.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={completedActions.includes(action.id)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setCompletedActions([...completedActions, action.id]);
                                    } else {
                                        setCompletedActions(completedActions.filter(id => id !== action.id));
                                    }
                                }}
                                className="h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{action.description}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ready for Surgeon */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={readyForSurgeon}
                    onChange={(e) => setReadyForSurgeon(e.target.checked)}
                    className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">
                    Ready for Surgeon Review
                </span>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={!notes || !readyForSurgeon}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
                Complete Review
            </button>
        </div>
    );
};

export default MAReviewSection; 