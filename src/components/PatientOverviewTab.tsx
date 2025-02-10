import React from 'react';
import { Patient, AIAssessment } from '../types/PatientTypes';
import MAReviewOverview from './MAReviewOverview';
import AIAssessmentSection from './AIAssessmentSection';
import { generateAIAnalysis } from '../utils/aiAnalysis';

interface PatientOverviewTabProps {
    patient: Patient;
}

const PatientOverviewTab: React.FC<PatientOverviewTabProps> = ({ patient }) => {
    const analysis = generateAIAnalysis(patient);

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
                                <p className="text-base font-medium">{patient.age} years</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Gender</p>
                                <p className="text-base font-medium">{patient.gender}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">BMI</p>
                                <p className="text-base font-medium">{patient.bmi}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Surgery Type</p>
                                <p className="text-base font-medium">{patient.surgeryType}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Reason for Referral</p>
                            <p className="text-base">{patient.reason}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Referring Provider</p>
                            <p className="text-base font-medium">{patient.referringProvider}</p>
                        </div>
                    </div>
                </div>

                {/* AI Assessment - Now using mockAIAssessment */}
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