import React from 'react';
import { Patient, AIAssessment } from '../types/PatientTypes';
import MAReviewOverview from './MAReviewOverview';
import AIAssessmentSection from './AIAssessmentSection';
import { generateAIAnalysis } from '../utils/aiAnalysis';
import { HeartIcon, InformationCircleIcon, BeakerIcon } from '@heroicons/react/24/outline';

// Add the helper function
const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

interface PatientOverviewTabProps {
    patient: Patient;
}

const PatientOverviewTab: React.FC<PatientOverviewTabProps> = ({ patient }) => {
    const analysis = generateAIAnalysis(patient);
    const conditions = patient.conditions || [];
    const medications = patient.medications || [];

    return (
        <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
                {/* Patient Info */}
                <div className="bg-white rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Age</p>
                                <p className="text-base font-medium text-gray-900">{patient.age} years</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Gender</p>
                                <p className="text-base font-medium text-gray-900">
                                    {capitalizeFirstLetter(patient.gender)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">BMI</p>
                                <p className="text-base font-medium text-gray-900">
                                    {patient.bmi ? patient.bmi.toFixed(2) : 'Not calculated'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Surgery Type</p>
                                <p className="text-base font-medium text-gray-900">{patient.surgeryType}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Reason for Referral</p>
                            <p className="text-base font-medium text-gray-900">{patient.reason}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Referring Provider</p>
                            <p className="text-base font-medium text-gray-900">{patient.referringProvider}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Current Medications</p>
                            <div className="mt-2 space-y-2">
                                {medications.map((med, index) => (
                                    <div key={index} className="text-base font-medium text-gray-900">
                                        {med.name} - {med.dosage} • {med.frequency} • Prescribed by {med.prescribedBy}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Assessment */}
                <AIAssessmentSection patient={patient} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                {/* MA Review Overview */}
                <MAReviewOverview patient={patient} />
            </div>
        </div>
    );
};

export default PatientOverviewTab; 