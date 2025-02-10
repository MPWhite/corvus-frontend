import React from 'react';
import { Patient, ReviewNote, RequiredAction } from '../types/PatientTypes';
import { ClockIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface MAReviewOverviewProps {
    patient: Patient;
}

const MAReviewOverview: React.FC<MAReviewOverviewProps> = ({ patient }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING_MA_REVIEW':
                return 'text-yellow-600';
            case 'NEEDS_MORE_INFO':
                return 'text-red-600';
            case 'READY_FOR_SURGEON':
                return 'text-blue-600';
            case 'SURGEON_APPROVED':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    const formatDate = (date: string | Date | undefined) => {
        if (!date) return 'Not set';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderRequiredActions = () => {
        if (!patient.requiredActions?.length) return null;

        return patient.requiredActions.map((action: RequiredAction) => (
            <div key={action.id} className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
                <ExclamationCircleIcon className="h-6 w-6 text-yellow-600" />
                <div>
                    <p className="font-medium text-gray-900">{action.description}</p>
                    <div className="mt-1 text-sm text-gray-500">
                        <p>Assigned to: {action.assignedTo}</p>
                        <p>Due: {formatDate(action.dueDate)}</p>
                    </div>
                </div>
            </div>
        ));
    };

    const renderReviewNotes = () => {
        if (!patient.reviewNotes?.length) return null;

        return patient.reviewNotes.map((note: ReviewNote) => (
            <div key={note.timestamp.toString()} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <ClockIcon className="h-6 w-6 text-gray-600 mt-1" />
                <div>
                    <p className="text-gray-900">{note.content}</p>
                    <div className="mt-1 text-sm text-gray-500">
                        <p>By: {note.author}</p>
                        <p>On: {formatDate(note.timestamp)}</p>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="space-y-6">
            {/* Status Overview */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Review Status</h3>
                <div className="flex items-center">
                    <div className={`text-lg font-medium ${getStatusColor(patient.reviewStatus)}`}>
                        {patient.reviewStatus.replace(/_/g, ' ')}
                    </div>
                </div>
            </div>

            {/* Required Actions */}
            {patient.requiredActions && patient.requiredActions.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Required Actions</h3>
                    <div className="space-y-4">
                        {renderRequiredActions()}
                    </div>
                </div>
            )}

            {/* Review Notes */}
            {patient.reviewNotes && patient.reviewNotes.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Review Notes</h3>
                    <div className="space-y-4">
                        {renderReviewNotes()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MAReviewOverview; 