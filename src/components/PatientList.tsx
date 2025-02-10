// PatientList.tsx
import React from 'react';
import { Patient } from '../types/PatientTypes';
import PatientCard from './PatientCard';
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

const PatientList: React.FC<PatientListProps> = ({ title, patients, onPatientSelect }) => {
    return (
        <div>
            {/* Header */}
            <div className="bg-blue-50/50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5 text-blue-600" />
                    <h2 className="text-blue-900 font-medium">
                        Needs Review
                    </h2>
                    <span className="text-blue-600">
                        {patients.length} patients
                    </span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    View All
                    <ChevronRightIcon className="h-4 w-4" />
                </button>
            </div>

            {/* Cards */}
            <div className="space-y-2 mt-2">
                {patients.map((patient) => (
                    <PatientCard
                        key={patient.id || patient._id}
                        patient={patient}
                        onClick={onPatientSelect}
                    >
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{patient.name}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getReferralTypeStyles(patient.referralType)}`}>
                                {getReferralTypeDisplay(patient.referralType)}
                            </span>
                        </div>
                    </PatientCard>
                ))}
            </div>
        </div>
    );
};

export default PatientList;
