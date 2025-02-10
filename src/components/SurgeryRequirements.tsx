import React from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface RequirementProps {
    requirement: {
        name: string;
        value: any;
        required: any;
        met: boolean;
        description: string;
        critical: boolean;
    };
}

const Requirement: React.FC<RequirementProps> = ({ requirement }) => {
    const bgColor = requirement.met ? 'bg-green-50' : 'bg-red-50';
    const textColor = requirement.met ? 'text-green-700' : 'text-red-700';
    const borderColor = requirement.met ? 'border-green-200' : 'border-red-200';

    const formatValue = (value: any) => {
        if (typeof value === 'number') {
            return value.toFixed(1);
        }
        return value;
    };

    const formatRequirement = () => {
        const value = formatValue(requirement.value);
        const required = requirement.required;

        switch (requirement.name) {
            case 'BMI Requirement':
                return `${value} ${required}`;
            case 'A1C Level':
                return `${value} ${required}`;
            case 'Physical Therapy':
            case 'Smoking Status':
            case 'Swelling':
                return `${value} / ${required}`;
            case 'Cardiac Clearance':
                return `${value}`;
            case 'Range of Motion':
                return `${value} / ${required}`;
            case 'Bone Density':
                return `T-score: ${value} ${required}`;
            default:
                return `${value} / ${required}`;
        }
    };

    return (
        <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center">
                        <h4 className="text-gray-900 font-medium">{requirement.name}</h4>
                        {requirement.critical && (
                            <ExclamationTriangleIcon className="h-4 w-4 text-amber-500 ml-2" />
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{requirement.description}</p>
                    <div className={`mt-2 text-sm ${textColor}`}>
                        {formatRequirement()}
                    </div>
                </div>
                <div className="ml-4">
                    {requirement.met ? (
                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    ) : (
                        <XCircleIcon className="h-6 w-6 text-red-500" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Requirement; 