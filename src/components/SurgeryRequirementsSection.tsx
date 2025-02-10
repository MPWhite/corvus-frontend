import React from 'react';
import { SurgeryRequirements } from '../types/PatientTypes';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface SurgeryRequirementsSectionProps {
    requirements: SurgeryRequirements[];
}

const SurgeryRequirementsSection: React.FC<SurgeryRequirementsSectionProps> = ({ requirements }) => {
    return (
        <div className="bg-white rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Surgery Requirements</h3>
            
            <div className="space-y-2">
                {requirements.map((req, index) => (
                    <div 
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                            req.met ? 'bg-green-50' : 'bg-red-50'
                        }`}
                    >
                        <div>
                            <p className="font-medium text-gray-900">{req.name}</p>
                            <p className="text-sm text-gray-600">
                                Current: {req.value} (Required: {req.required})
                            </p>
                        </div>
                        {req.met ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                            <XCircleIcon className="h-5 w-5 text-red-500" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SurgeryRequirementsSection; 