import React from 'react';
import { Patient } from '../types/PatientTypes';
import { 
    ShieldExclamationIcon, 
    ChartBarIcon, 
    ClipboardDocumentCheckIcon,
    BeakerIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { generateAIAnalysis } from '../utils/aiAnalysis';

interface AIAssessmentTabProps {
    patient: Patient;
}

const RiskIndicator: React.FC<{ risk: number }> = ({ risk }) => {
    const getColor = (risk: number) => {
        if (risk < 30) return 'bg-green-100 text-green-800';
        if (risk < 70) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className={`rounded-full px-3 py-1 text-sm font-medium ${getColor(risk)}`}>
            Risk Score: {risk}%
        </div>
    );
};

const ProgressBar: React.FC<{ completed: number; total: number }> = ({ completed, total }) => {
    const percentage = (completed / total) * 100;
    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};

const AIAssessmentTab: React.FC<AIAssessmentTabProps> = ({ patient }) => {
    // Calculate risk scores based on patient data
    const calculateRiskScore = () => {
        let score = 50; // Base score
        
        // Adjust based on medical history
        score += patient.medicalHistory?.length * 5 || 0;
        
        // Adjust based on BMI
        if (patient.bmi > 30) score += 10;
        if (patient.bmi > 35) score += 15;
        
        // Cap at 100
        return Math.min(score, 100);
    };

    // Add this function near the top of the component
    const identifyRiskFactors = (patient: Patient) => {
        const risks = [];
        
        // BMI Risks
        if (patient.bmi > 30) risks.push({ 
            type: 'High BMI', 
            detail: `BMI of ${patient.bmi.toFixed(1)} indicates obesity`,
            severity: 'warning'
        });

        // Medical History Risks
        if (patient.medicalHistory?.includes('Hypertension')) {
            risks.push({ 
                type: 'Hypertension', 
                detail: 'History of high blood pressure may affect surgery',
                severity: 'warning'
            });
        }
        if (patient.medicalHistory?.includes('Type 2 Diabetes')) {
            risks.push({ 
                type: 'Diabetes', 
                detail: 'Blood sugar management will be critical',
                severity: 'warning'
            });
        }

        // Medication Risks
        if (patient.medications?.length > 3) {
            risks.push({ 
                type: 'Multiple Medications', 
                detail: 'Potential drug interactions need review',
                severity: 'info'
            });
        }

        return risks;
    };

    // Add this function for recommendations
    const generateRecommendations = (patient: Patient) => {
        const recommendations = [];

        // Document-based recommendations
        const missingDocs = patient.requiredDocuments?.filter(d => !d.received) || [];
        missingDocs.forEach(doc => {
            recommendations.push({
                title: `Submit ${doc.type}`,
                description: `Required document ${doc.type} has not been received yet.`,
                priority: 'high'
            });
        });

        // Requirements-based recommendations
        const unmetReqs = patient.surgeryRequirements?.filter(r => !r.met) || [];
        unmetReqs.forEach(req => {
            recommendations.push({
                title: req.name,
                description: req.description,
                priority: req.critical ? 'critical' : 'medium'
            });
        });

        // Risk-based recommendations
        if (patient.bmi > 30) {
            recommendations.push({
                title: 'Weight Management',
                description: 'Consider weight management program before surgery.',
                priority: 'medium'
            });
        }

        return recommendations;
    };

    // Use the shared analysis
    const analysis = generateAIAnalysis(patient);

    return (
        <div className="space-y-6">
            {/* Overall Assessment */}
            <section className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">AI Assessment</h2>
                    <RiskIndicator risk={calculateRiskScore()} />
                </div>
                <div className="prose max-w-none space-y-4">
                    <p className="text-gray-600">
                        {analysis.summary}
                    </p>
                    
                    {analysis.primaryConcerns.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-900">Key Concerns:</h3>
                            <ul className="mt-2 text-sm text-gray-600">
                                {analysis.primaryConcerns.map((concern, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                                        {concern}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {analysis.nextSteps.length > 0 && (
                        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-blue-900">Required Next Steps:</h3>
                            <ul className="mt-2 text-sm text-blue-800">
                                {analysis.nextSteps.map((step, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <ArrowTrendingUpIcon className="h-5 w-5 text-blue-700 flex-shrink-0" />
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>

            {/* Key Findings */}
            <section className="bg-white rounded-lg p-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Key Findings</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <BeakerIcon className="h-5 w-5 text-blue-500" />
                            <h4 className="font-medium">Medical Conditions</h4>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-2">
                            {patient.medicalHistory?.map((condition, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                    {condition}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                            <h4 className="font-medium">Risk Factors</h4>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-2">
                            {identifyRiskFactors(patient).map((risk, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <ExclamationTriangleIcon className={`h-4 w-4 ${
                                        risk.severity === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                                    }`} />
                                    <div>
                                        <span className="font-medium">{risk.type}</span>
                                        <p className="text-sm text-gray-500">{risk.detail}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AIAssessmentTab; 