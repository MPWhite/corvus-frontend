import React, { useState } from 'react';
import { Patient } from '../types/PatientTypes';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface MAReviewFormProps {
    patient: Patient;
    onSubmit: (status: string) => void;
}

const MAReviewForm: React.FC<MAReviewFormProps> = ({ patient, onSubmit }) => {
    const [notes, setNotes] = useState('');
    const [checklist, setChecklist] = useState({
        insuranceVerified: false,
        documentsComplete: false,
        medicalHistoryReviewed: false,
        medicationsReviewed: false,
        allergiesReviewed: false
    });
    const [notCandidateReason, setNotCandidateReason] = useState('');
    const [showNotCandidateInput, setShowNotCandidateInput] = useState(false);

    const allChecked = Object.values(checklist).every(value => value);

    const handleSubmit = (status: string) => {
        onSubmit(status);
    };

    const generateEmailDraft = () => {
        // Get just the provider's name, assuming it's in the format "Dr. LastName"
        const providerName = patient.referringProvider || '';
        const lastName = providerName.replace(/^(Dr\.|Dr|Doctor)\s+/i, '').trim();
        
        const emailTemplate = `Dear Dr. ${lastName},

I am writing regarding your patient ${patient.name}. We need the following additional information to proceed with their surgical evaluation:

[List specific information needed]

Please provide this information at your earliest convenience.

Best regards,
[Your name]`;

        console.log('Generated email template:', emailTemplate); // Debug log
        return emailTemplate;
    };

    return (
        <div className="space-y-6">
            {/* Review Checklist */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Review Checklist</h3>
                <div className="space-y-3">
                    {Object.entries(checklist).map(([key, value]) => (
                        <label key={key} className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={e => setChecklist({...checklist, [key]: e.target.checked})}
                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Review Notes</h3>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={6}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Add any notes about the review..."
                />
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
                {showNotCandidateInput && (
                    <div className="bg-red-50 p-4 rounded-md border border-red-200">
                        <textarea
                            value={notCandidateReason}
                            onChange={e => setNotCandidateReason(e.target.value)}
                            placeholder="Please explain why the patient is not a candidate..."
                            rows={3}
                            className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        />
                    </div>
                )}
                <div className="flex gap-4">
                    <button
                        onClick={() => handleSubmit('READY_FOR_SURGEON')}
                        disabled={!allChecked}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white
                            ${allChecked ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        <CheckCircleIcon className="h-5 w-5" />
                        Ready for Surgeon
                    </button>
                    <button
                        onClick={() => {
                            const emailBody = encodeURIComponent(generateEmailDraft());
                            console.log('Sending email with body:', generateEmailDraft());
                            window.location.href = `mailto:${patient.referringProviderEmail}?subject=Additional Information Needed - ${patient.name}&body=${emailBody}`;
                            handleSubmit('NEEDS_MORE_INFO');
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
                    >
                        <ExclamationTriangleIcon className="h-5 w-5" />
                        Needs More Info
                    </button>
                    <button
                        onClick={() => {
                            if (showNotCandidateInput && notCandidateReason.trim()) {
                                handleSubmit('NOT_A_CANDIDATE');
                            } else {
                                setShowNotCandidateInput(true);
                            }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                    >
                        <XCircleIcon className="h-5 w-5" />
                        Not a Candidate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MAReviewForm; 