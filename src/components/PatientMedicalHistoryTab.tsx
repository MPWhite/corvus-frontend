import React from 'react';
import { Patient, Medication } from '../types/PatientTypes';
import { 
    HeartIcon, 
    ExclamationTriangleIcon,
    BeakerIcon,
    ScissorsIcon,
    DocumentTextIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClipboardDocumentListIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

interface PatientMedicalHistoryTabProps {
    patient: Patient;
}

const SectionHeader: React.FC<{
    icon: React.FC<{ className?: string }>;
    title: string;
}> = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-2">
        <Icon className="h-5 w-5 text-gray-500" />
        <h2 className="text-sm font-medium text-gray-900">{title}</h2>
    </div>
);

const SourceCitation: React.FC<{ source: string, date: Date | string }> = ({ source, date }) => {
    const formatDate = (date: Date | string) => {
        try {
            const dateObj = date instanceof Date ? date : new Date(date);
            return dateObj.toLocaleDateString();
        } catch (error) {
            return 'Date not available';
        }
    };

    return (
        <div className="group relative inline-block">
            <InformationCircleIcon className="h-4 w-4 text-gray-400 hover:text-blue-500 cursor-help inline-block ml-1" />
            <div className="hidden group-hover:block absolute z-10 bg-gray-900 text-white p-2 rounded text-xs -translate-x-1/2 left-1/2 mt-1">
                Source: {source}<br />
                Last Updated: {formatDate(date)}
            </div>
        </div>
    );
};

const PatientMedicalHistoryTab: React.FC<PatientMedicalHistoryTabProps> = ({ patient }) => {
    // Add debug logging
    console.log('Medical History Tab - Patient Data:', {
        medicalHistory: patient.medicalHistory,
        medications: patient.medications,
        labResults: patient.labResults,
        surgicalHistory: patient.surgicalHistory
    });

    return (
        <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
                {/* Surgery Requirements */}
                <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-900">Surgery Requirements</h3>
                    </div>
                    <div className="mt-2 space-y-2">
                        {patient.surgeryRequirements?.map((requirement, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded flex justify-between items-center">
                                <div>
                                    <div className="flex items-center">
                                        <p className="font-medium text-gray-900">{requirement.name}</p>
                                        <SourceCitation 
                                            source="Pre-Op Assessment"
                                            date={new Date(2024, 2, 15)}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600">{requirement.value} {requirement.required}</p>
                                    <p className="text-xs text-gray-500">{requirement.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {requirement.met ? (
                                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircleIcon className="h-5 w-5 text-red-500" />
                                    )}
                                    {requirement.critical && (
                                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" title="Critical Requirement" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Medical Conditions */}
                <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <HeartIcon className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-900">Medical Conditions</h3>
                    </div>
                    <div className="space-y-2">
                        {patient.medicalHistory?.map((condition, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <span className="text-base text-gray-900">{condition}</span>
                                <InformationCircleIcon className="h-4 w-4 text-gray-400" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Current Medications */}
                <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <BeakerIcon className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-900">Current Medications</h3>
                    </div>
                    <div className="space-y-2">
                        {patient.medications?.map((medication, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-base font-medium text-gray-900">{medication.name} - {medication.dosage}</p>
                                        <p className="text-sm text-gray-500">{medication.frequency} • Prescribed by {medication.prescribedBy}</p>
                                    </div>
                                    <InformationCircleIcon className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
                {/* Lab Results */}
                <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-900">Lab Results</h3>
                    </div>
                    <div className="mt-2 space-y-2">
                        {patient.labResults?.map((result, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded flex justify-between items-center">
                                <div>
                                    <div className="flex items-center">
                                        <p className="font-medium text-gray-900">{result.testName}</p>
                                        <SourceCitation 
                                            source={`${result.isAbnormal ? 'Quest Diagnostics' : 'LabCorp'}`}
                                            date={result.date}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {result.result} {result.unit}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {result.isAbnormal ? (
                                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                                    ) : (
                                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                    )}
                                    <time className="text-sm text-gray-500">
                                        {new Date(result.date).toLocaleDateString()}
                                    </time>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Surgical History */}
                <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <ScissorsIcon className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-900">Surgical History</h3>
                    </div>
                    <div className="mt-2 space-y-2">
                        {patient.surgicalHistory?.map((surgery, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded">
                                <div className="flex items-center">
                                    <p className="font-medium text-gray-900">{surgery.procedure}</p>
                                    <SourceCitation 
                                        source={surgery.facility!}
                                        date={surgery.date!}
                                    />
                                </div>
                                <div className="mt-1 text-sm text-gray-600">
                                    <p>Surgeon: {surgery.surgeon}</p>
                                    <p>Facility: {surgery.facility}</p>
                                    <p>Date: {new Date(surgery.date!).toLocaleDateString()}</p>
                                    {surgery.complications && (
                                        <p className="text-red-600">Complications: {surgery.complications}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientMedicalHistoryTab; 