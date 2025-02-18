// PatientList.tsx
import React from 'react';
import { Patient } from '../types/PatientTypes';
import { ClockIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PatientListProps {
    title: string;
    patients: Patient[];
    onPatientSelect: (patient: Patient) => void;
}

const getReferralTypeDisplay = (type: 'self' | 'external' | 'internal') => {
    const displays = {
        'self': 'Self',
        'external': 'External',
        'internal': 'Internal'
    };
    return displays[type] || 'Unknown';
};

const getReferralTypeStyles = (type: 'self' | 'external' | 'internal') => {
    const styles = {
        'internal': 'bg-blue-100 text-blue-800',
        'external': 'bg-purple-100 text-purple-800',
        'self': 'bg-green-100 text-green-800'
    };
    return styles[type] || 'bg-gray-100 text-gray-800';
};

const getPriorityStyles = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    if (score >= 20) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-700';
};

const PatientList: React.FC<PatientListProps> = ({ title, patients, onPatientSelect }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Header */}
            <div className="bg-blue-50/50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5 text-blue-600" />
                    <h2 className="text-blue-900 font-medium">{title}</h2>
                    <span className="text-blue-600">
                        {patients.length} patients
                    </span>
                </div>
            </div>

            {/* Patient Cards */}
            <div className="divide-y divide-gray-100">
                {patients.map((patient) => (
                    <div
                        key={patient.id || patient._id}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => onPatientSelect(patient)}
                    >
                        <div className="flex justify-between items-start">
                            {/* Left side - Patient Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {patient.name}
                                    </h3>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${getReferralTypeStyles(patient.referralType)}`}>
                                        {getReferralTypeDisplay(patient.referralType)}
                                    </span>
                                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getPriorityStyles(patient.priorityScore || 0)}`}>
                                        Priority: {patient.priorityScore || 0}
                                    </span>
                                </div>
                                <div className="mt-1 text-sm text-gray-500 space-y-1">
                                    <p>
                                        <span className="font-medium">Surgery: </span>
                                        {patient.surgeryType}
                                    </p>
                                    <p>
                                        <span className="font-medium">Provider: </span>
                                        {patient.referringProvider}
                                    </p>
                                </div>
                            </div>

                            {/* Right side - Status & Date */}
                            <div className="text-right">
                                <div className="text-sm text-gray-500">
                                    {patient.scheduledDate ? (
                                        <p>
                                            Scheduled for{' '}
                                            {new Date(patient.scheduledDate).toLocaleDateString()}
                                        </p>
                                    ) : (
                                        <p>Not yet scheduled</p>
                                    )}
                                </div>
                                {patient.priority === 'HIGH' && (
                                    <div className="mt-1">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            🔴 High Priority
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientList;
