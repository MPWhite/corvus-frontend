import React, { useState } from 'react';
import { Patient } from '../types/PatientTypes';

interface MAReviewFormProps {
    patient: Patient;
    onSubmit: (data: {
        status: 'READY_FOR_SURGEON' | 'PENDING_MA_REVIEW',
        note?: string
    }) => void;
}

const MAReviewForm: React.FC<MAReviewFormProps> = ({ patient, onSubmit }) => {
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (readyForSurgeon: boolean) => {
        setIsSubmitting(true);
        try {
            await onSubmit({
                status: readyForSurgeon ? 'READY_FOR_SURGEON' : 'PENDING_MA_REVIEW',
                note: note.trim() || undefined
            });
            setNote('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">MA Review</h3>
            
            <div className="space-y-6">
                {/* Review Notes Input */}
                <div>
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                        Review Notes
                    </label>
                    <textarea
                        id="note"
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 shadow-sm p-3 text-sm"
                        placeholder="Add your review notes here..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleSubmit(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Save Progress
                    </button>
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleSubmit(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Submit for Surgeon Review
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MAReviewForm; 