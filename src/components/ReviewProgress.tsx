import React from 'react';
import { ReviewStatus } from '../types/PatientTypes';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ReviewProgressProps {
    status: ReviewStatus;
}

const ReviewProgress: React.FC<ReviewProgressProps> = ({ status }) => {
    const steps = [
        { id: 'PENDING_MA_REVIEW', label: 'MA Review' },
        { id: 'READY_FOR_SURGEON', label: 'Surgeon Review' },
        { id: 'SURGEON_APPROVED', label: 'Approved' },
        { id: 'SCHEDULED', label: 'Scheduled' }
    ];

    const currentStepIndex = steps.findIndex(step => step.id === status);

    return (
        <div className="flex items-center justify-between">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            index <= currentStepIndex 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-100 text-gray-400'
                        }`}>
                            {index < currentStepIndex ? (
                                <CheckCircleIcon className="w-5 h-5" />
                            ) : index === currentStepIndex ? (
                                <ClockIcon className="w-5 h-5" />
                            ) : (
                                <span className="text-sm">{index + 1}</span>
                            )}
                        </div>
                        <span className={`ml-2 text-sm font-medium ${
                            index <= currentStepIndex ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                            {step.label}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`w-24 h-0.5 mx-4 ${
                            index < currentStepIndex ? 'bg-blue-500' : 'bg-gray-200'
                        }`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default ReviewProgress; 