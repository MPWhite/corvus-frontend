import React, { useState } from 'react';
import { Patient } from '../types/PatientTypes';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface SurgeonReviewFormProps {
    patient: Patient;
    onSubmit: (status: string) => void;
}

const SurgeonReviewForm: React.FC<SurgeonReviewFormProps> = ({ patient, onSubmit }) => {
    const [consultNotes, setConsultNotes] = useState('');
    const [consultPriority, setConsultPriority] = useState('NORMAL');
    const [specialConsiderations, setSpecialConsiderations] = useState('');
    const [notCandidateReason, setNotCandidateReason] = useState('');
    const [showNotCandidateInput, setShowNotCandidateInput] = useState(false);

    const handleSubmit = (status: string) => {
        onSubmit(status);
    };

    return (
        <div className="space-y-6">
            {/* Initial Assessment */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Initial Assessment</h3>
                <textarea
                    value={consultNotes}
                    onChange={e => setConsultNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Initial thoughts based on patient records and imaging..."
                />
            </div>

            {/* Consultation Priority */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Consultation Priority</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority Level
                    </label>
                    <select
                        value={consultPriority}
                        onChange={e => setConsultPriority(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="LOW">Routine Consultation</option>
                        <option value="NORMAL">Standard Priority</option>
                        <option value="HIGH">Urgent Consultation</option>
                        <option value="IMMEDIATE">Immediate Attention Required</option>
                    </select>
                </div>
            </div>

            {/* Special Considerations */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Special Considerations</h3>
                <textarea
                    value={specialConsiderations}
                    onChange={e => setSpecialConsiderations(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Any special considerations for the consultation (e.g., mobility issues, interpreter needed)..."
                />
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
                {showNotCandidateInput && (
                    <div className="bg-red-50 p-4 rounded-md border border-red-200">
                        <label className="block text-sm font-medium text-red-700 mb-2">
                            Reason for Not Being a Candidate
                        </label>
                        <textarea
                            value={notCandidateReason}
                            onChange={e => setNotCandidateReason(e.target.value)}
                            placeholder="Please explain why the patient is not a candidate for consultation..."
                            rows={3}
                            className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        />
                    </div>
                )}
                <div className="flex gap-4">
                    <button
                        onClick={() => handleSubmit('APPROVED_FOR_SCHEDULING')}
                        disabled={!consultNotes}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white
                            ${consultNotes ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        <CheckCircleIcon className="h-5 w-5" />
                        Schedule Consultation
                    </button>
                    <button
                        onClick={() => handleSubmit('NEEDS_MORE_INFO')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
                    >
                        <ClockIcon className="h-5 w-5" />
                        Need More Information
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

export default SurgeonReviewForm; 