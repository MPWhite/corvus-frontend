import React from 'react';
import { Patient, Document } from '../types/PatientTypes';
import { 
    CheckCircleIcon, 
    ClockIcon, 
    ExclamationCircleIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

interface DocumentsSectionProps {
    documents: Document[];
    patient: Patient;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents, patient }) => {
    const getStatusIcon = (doc: Document) => {
        if (doc.received) {
            return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
        }
        if (doc.status === 'expired') {
            return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
        }
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    };

    const getStatusText = (doc: Document) => {
        if (doc.received) {
            return `Received on ${new Date(doc.dateReceived!).toLocaleDateString()}`;
        }
        if (doc.status === 'expired') {
            return 'Expired';
        }
        if (doc.requestedDate) {
            return `Requested on ${new Date(doc.requestedDate).toLocaleDateString()}`;
        }
        return 'Pending';
    };

    return (
        <div className="bg-white rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Required Documents</h3>
            
            <div className="space-y-3">
                {documents.map((doc, index) => (
                    <div 
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                            doc.received ? 'bg-green-50' :
                            doc.status === 'expired' ? 'bg-red-50' : 'bg-yellow-50'
                        }`}
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                {getStatusIcon(doc)}
                                <div>
                                    <p className="font-medium text-gray-900">{doc.type}</p>
                                    <p className="text-sm text-gray-600">
                                        {getStatusText(doc)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {doc.received && doc.url && (
                            <a 
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                            >
                                <ArrowDownTrayIcon className="h-4 w-4" />
                                View
                            </a>
                        )}
                    </div>
                ))}
            </div>

            {/* Request Documents Button */}
            <button
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => {
                    // Handle document request
                    console.log('Request documents for:', patient.name);
                }}
            >
                Request Missing Documents
            </button>
        </div>
    );
};

export default DocumentsSection; 