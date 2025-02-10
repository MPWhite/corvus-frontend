import React from 'react';
import { Patient } from '../types/PatientTypes';
import { ChevronRightIcon, ClockIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface PatientCardProps {
    patient: Patient;
    onClick: (patient: Patient) => void;
    children?: React.ReactNode;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'PENDING_MA_REVIEW':
            return 'bg-yellow-100 text-yellow-800';
        case 'READY_FOR_SURGEON':
            return 'bg-blue-100 text-blue-800';
        case 'NEEDS_MORE_INFO':
            return 'bg-orange-100 text-orange-800';
        case 'SURGEON_APPROVED':
            return 'bg-green-100 text-green-800';
        case 'SCHEDULED':
            return 'bg-purple-100 text-purple-800';
        case 'REJECTED':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getStatusDisplay = (status: string) => {
    return status.split('_').map(word => 
        word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
};

const PatientCard: React.FC<PatientCardProps> = ({ 
    patient, 
    onClick,
    children
}) => {
    const documentsReceived = patient.requiredDocuments.filter(doc => doc.received).length;
    const totalDocuments = patient.requiredDocuments.length;
    const requirementsMet = patient.surgeryRequirements.filter(req => req.met).length;
    const totalRequirements = patient.surgeryRequirements.length;

    return (
        <div 
            onClick={() => onClick(patient)}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
            {children}
            {/* Main Content */}
            <div className="p-4">
                {/* Top Row */}
                <div className="flex items-start justify-between mb-6">
                    {/* Left - Initial and Name */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xl font-medium text-blue-700">
                                {patient.name?.charAt(0) || '?'}
                            </span>
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {patient.name || 'Unknown Patient'}
                                </h3>
                                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(patient.reviewStatus)}`}>
                                    {getStatusDisplay(patient.reviewStatus)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                {patient.surgeryType || 'Surgery type not specified'}
                            </p>
                        </div>
                    </div>

                    {/* Right - Other Badges */}
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                            Priority: {patient.priorityScore}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                            documentsReceived === totalDocuments 
                                ? 'bg-green-50 text-green-700'
                                : 'bg-blue-50 text-blue-700'
                        }`}>
                            Docs: {documentsReceived}/{totalDocuments}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                            requirementsMet === totalRequirements 
                                ? 'bg-green-50 text-green-700'
                                : 'bg-blue-50 text-blue-700'
                        }`}>
                            Reqs: {requirementsMet}/{totalRequirements}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-500 ml-2">
                            <ClockIcon className="h-4 w-4" />
                            <span>{new Date(patient.consultDate).toLocaleDateString()}</span>
                        </div>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-12">
                    <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="text-base text-gray-900">
                            {patient.age ? `${patient.age} years` : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Provider</p>
                        <p className="text-base text-gray-900">
                            {patient.assignedTo || 'Unassigned'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Referring</p>
                        <div className="flex items-center justify-between">
                            <p className="text-base text-gray-900">
                                {patient.referringProvider || 'None'}
                            </p>
                            <span className="text-sm text-gray-500">
                                Referred: {new Date(patient.referralDate || patient.consultDate || Date.now()).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientCard; 