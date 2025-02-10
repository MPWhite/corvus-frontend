import React from 'react';
import { Patient } from '../types/PatientTypes';

interface MedicalHistorySectionProps {
    patient: Patient;
}

const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({ patient }) => {
    return (
        <div className="bg-white rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Medical History</h3>
            
            <div className="space-y-6">
                {/* Medical Conditions */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Medical Conditions</h4>
                    <ul className="space-y-1">
                        {patient.medicalHistory.map((condition, index) => (
                            <li key={index} className="text-sm text-gray-600">• {condition}</li>
                        ))}
                    </ul>
                </div>

                {/* Medications */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Medications</h4>
                    <div className="space-y-2">
                        {patient.medications.map((med, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-900">{med.name}</p>
                                <p className="text-sm text-gray-600">
                                    {med.dosage} - {med.frequency}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalHistorySection; 