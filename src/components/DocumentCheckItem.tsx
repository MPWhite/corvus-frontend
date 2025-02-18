import React from 'react';
import { Document } from '../types/PatientTypes';
import { CheckCircleIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { Button } from '@mui/material';

interface DocumentCheckItemProps {
    document: Document;
    onRequest: () => void;
}

const DocumentCheckItem: React.FC<DocumentCheckItemProps> = ({ document, onRequest }) => {
    const formatDate = (date: Date | undefined) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="flex items-start p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
                <p className="font-medium">{document.type}</p>
                <p className="text-sm text-gray-500">
                    {document.received ? 
                        `Received on ${formatDate(document.dateReceived)}` : 
                        `Requested on ${formatDate(document.requestedDate)}`}
                </p>
            </div>
            {document.received ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
                <Button 
                    size="small" 
                    startIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
                    onClick={onRequest}
                >
                    Request
                </Button>
            )}
        </div>
    );
};

export default DocumentCheckItem; 