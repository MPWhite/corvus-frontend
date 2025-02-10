import React from 'react';
import { Patient, Document } from '../types/PatientTypes';
import { 
    DocumentArrowDownIcon, 
    DocumentArrowUpIcon,
    CheckCircleIcon, 
    ClockIcon,
    ExclamationCircleIcon 
} from '@heroicons/react/24/outline';
import DocumentRequestGenerator from './DocumentRequestGenerator';

interface PatientDocumentsTabProps {
    patient: Patient;
}

const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const DocumentCard: React.FC<{ document: Document }> = ({ document }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    {document.received ? (
                        <div className="p-2 bg-green-100 rounded-lg">
                            <DocumentArrowDownIcon className="h-6 w-6 text-green-600" />
                        </div>
                    ) : (
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <DocumentArrowUpIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                    )}
                    <div>
                        <h3 className="font-medium text-gray-900">{document.type}</h3>
                        <p className="text-sm text-gray-500">
                            {document.received 
                                ? `Received ${formatDate(document.dateReceived)}`
                                : 'Pending'
                            }
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {document.received && document.url && (
                        <button
                            onClick={() => window.open(document.url, '_blank')}
                            className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                        >
                            View Document
                        </button>
                    )}
                    {document.received ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                        <ClockIcon className="h-5 w-5 text-yellow-500" />
                    )}
                </div>
            </div>
            
            {!document.received && (
                <div className="mt-4 border-t pt-4">
                    <DocumentRequestGenerator
                        patientName={document.type}
                        documentType={document.type}
                        referringProvider={document.type}
                    />
                </div>
            )}
        </div>
    );
};

const PatientDocumentsTab: React.FC<PatientDocumentsTabProps> = ({ patient }) => {
    const receivedDocs = patient.requiredDocuments.filter(doc => doc.received);
    const pendingDocs = patient.requiredDocuments.filter(doc => !doc.received);

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <DocumentArrowDownIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Documents</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {patient.requiredDocuments.length}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Received</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {receivedDocs.length}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <ExclamationCircleIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {pendingDocs.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Documents */}
            {pendingDocs.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Documents</h2>
                    <div className="space-y-4">
                        {pendingDocs.map((doc, index) => (
                            <DocumentCard key={index} document={doc} />
                        ))}
                    </div>
                </div>
            )}

            {/* Received Documents */}
            {receivedDocs.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Received Documents</h2>
                    <div className="space-y-4">
                        {receivedDocs.map((doc, index) => (
                            <DocumentCard key={index} document={doc} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDocumentsTab; 