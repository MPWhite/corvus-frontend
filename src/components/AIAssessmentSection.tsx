import React from 'react';
import {AIAssessment, Patient} from '../types/PatientTypes';
import { generateAIAnalysis } from '../utils/aiAnalysis';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface AIAssessmentSectionProps {
    patient: Patient;  // Change from assessment: AIAssessment
}

const AIAssessmentSection: React.FC<AIAssessmentSectionProps> = ({ patient }) => {
    const analysis = generateAIAnalysis(patient);
    
    return (
        <div className="bg-white rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">AI Assessment</h3>
            <div className="prose max-w-none">
                <p className="text-gray-600">{analysis.summary}</p>
                
                {analysis.primaryConcerns.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900">Key Concerns:</h4>
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
            </div>
        </div>
    );
};

export default AIAssessmentSection; 