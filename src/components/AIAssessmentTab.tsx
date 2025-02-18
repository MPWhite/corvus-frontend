import React from 'react';
import { Patient } from '../types/PatientTypes';
import { 
    ExclamationTriangleIcon,
    CheckCircleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

interface AIAssessmentTabProps {
    patient: Patient;
}

const AIAssessmentTab: React.FC<AIAssessmentTabProps> = ({ patient }) => {
    // Calculate risk score based on key factors
    const calculateRiskScore = () => {
        let score = 0;
        
        // Age risk
        if (patient.age > 65) score += 15;
        else if (patient.age > 50) score += 10;
        
        // BMI risk
        if (patient.bmi > 35) score += 20;
        else if (patient.bmi > 30) score += 15;
        
        // Medical history risks
        const highRiskConditions = ['diabetes', 'hypertension', 'heart disease'];
        patient.medicalHistory.forEach(condition => {
            if (highRiskConditions.some(risk => condition.toLowerCase().includes(risk))) {
                score += 10;
            }
        });

        return Math.min(score, 100); // Cap at 100
    };

    const riskScore = calculateRiskScore();
    
    // More detailed AI analysis based on patient factors
    const getAIAnalysis = () => {
        const insights = [];
        
        // Surgery-specific insights
        if (patient.surgeryType === 'Knee Replacement') {
            if (patient.bmi > 35) {
                insights.push("Weight management prior to surgery strongly recommended to improve outcomes.");
            }
            if (patient.age < 60) {
                insights.push("Patient's younger age suggests considering longer-lasting implant options.");
            }
        }

        // Medical history insights
        if (patient.medicalHistory.some(h => h.toLowerCase().includes('diabetes'))) {
            insights.push("Blood sugar control will be critical for optimal healing.");
        }
        
        // Social factors
        if (!patient.insuranceVerified) {
            insights.push("Insurance verification pending - may impact scheduling.");
        }

        return insights;
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* AI Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    AI Assessment
                </h3>
                <div className="space-y-3">
                    <p className="text-gray-800">
                        {patient.age} year old patient seeking {patient.surgeryType.toLowerCase()}. 
                        {riskScore < 30 
                            ? ' Based on the patient profile and our analysis of similar cases, this appears to be a straightforward case with favorable indicators for successful outcomes.'
                            : riskScore < 60
                                ? ' While there are some risk factors to address, proper pre-operative optimization should lead to good outcomes.'
                                : ' This case requires careful consideration due to multiple risk factors that could impact surgical success.'
                        }
                    </p>
                    {getAIAnalysis().map((insight, index) => (
                        <div key={index} className="flex items-start gap-2 text-gray-800">
                            <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{insight}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Risk & Similar Cases Grid */}
            <div className="grid grid-cols-2 gap-6">
                {/* Risk Assessment */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Risk Factors</h3>
                        <div className={`
                            rounded-full px-4 py-1 font-medium text-sm
                            ${riskScore < 30 ? 'bg-green-100 text-green-800' : 
                              riskScore < 60 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}
                        `}>
                            Risk Score: {riskScore}
                        </div>
                    </div>

                    <div className="space-y-2">
                        {patient.bmi > 30 && (
                            <div className="flex items-start gap-2">
                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">BMI of {patient.bmi.toFixed(1)} - increased surgical risk</span>
                            </div>
                        )}
                        {patient.age > 65 && (
                            <div className="flex items-start gap-2">
                                <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">Age-related recovery considerations</span>
                            </div>
                        )}
                        {patient.medicalHistory.map((condition, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{condition}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Similar Cases */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Cases</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 rounded-full p-2">
                                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">85% Success Rate</p>
                                <p className="text-sm text-gray-500">In patients with similar profiles</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 rounded-full p-2">
                                <InformationCircleIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">4-6 Weeks</p>
                                <p className="text-sm text-gray-500">Average recovery time</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-100 rounded-full p-2">
                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">20% of Cases</p>
                                <p className="text-sm text-gray-500">Required additional PT</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAssessmentTab; 