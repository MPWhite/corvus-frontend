import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface ProtocolComplianceChartProps {
    required: string[];
    completed: string[];
    missing: string[];
}

const ProtocolComplianceChart: React.FC<ProtocolComplianceChartProps> = ({
    required,
    completed,
    missing
}) => {
    const completionPercentage = (completed.length / required.length) * 100;

    return (
        <div className="space-y-4">
            {/* Progress Bar */}
            <div className="relative pt-1">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold inline-block text-blue-600">
                            Protocol Compliance
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                            {completionPercentage.toFixed(0)}%
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                    <div
                        style={{ width: `${completionPercentage}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    />
                </div>
            </div>

            {/* Requirements Lists */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Completed</h4>
                    <ul className="space-y-2">
                        {completed.map((item, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Missing</h4>
                    <ul className="space-y-2">
                        {missing.map((item, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProtocolComplianceChart; 