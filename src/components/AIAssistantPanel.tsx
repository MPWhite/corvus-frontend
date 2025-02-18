import React, { useState, useEffect } from 'react';
import { Patient } from '../types/PatientTypes';
import { DataSync, fetchDataSyncs } from '../services/api';
import { 
    SparklesIcon, 
    ChevronRightIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

interface AIAssistantPanelProps {
    patient: Patient | null;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ patient }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [dataSyncs, setDataSyncs] = useState<DataSync[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log('Patient in AIAssistantPanel:', {
            fullPatient: patient,
            id: patient?._id,
            hasId: Boolean(patient?._id)
        });
        if (patient?._id) {
            console.log('Fetching data syncs for patient:', patient._id);
            setLoading(true);
            fetchDataSyncs(patient._id)
                .then(syncs => {
                    console.log('Received data syncs:', syncs);
                    setDataSyncs(syncs);
                })
                .catch(error => {
                    console.error('Failed to fetch data syncs:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [patient]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'in_progress':
                return <ClockIcon className="h-5 w-5 text-blue-500" />;
            case 'failed':
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
            default:
                return <ClockIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    const renderContent = () => (
        <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
                <h3 className="text-sm font-medium text-gray-900">
                    Data Collection ({dataSyncs.length})
                </h3>
                
                {loading ? (
                    <div className="text-center py-4 text-gray-500">Loading...</div>
                ) : (
                    dataSyncs.map(sync => (
                        <div key={sync.id} className="rounded-lg border border-gray-200 bg-white p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="font-medium">{sync.title}</h4>
                                    <p className="text-sm text-gray-500">{sync.description}</p>
                                </div>
                                {getStatusIcon(sync.status)}
                            </div>
                            
                            {/* Progress bar */}
                            <div className="mt-2">
                                <div className="bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-blue-500 h-full rounded-full"
                                        style={{ width: `${sync.progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Steps */}
                            <div className="mt-3 space-y-2">
                                {sync.steps.map(step => (
                                    <div key={step.id} className="flex items-start gap-2">
                                        {getStatusIcon(step.status)}
                                        <div>
                                            <p className="text-sm font-medium">{step.title}</p>
                                            <p className="text-xs text-gray-500">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    return (
        <div className={`fixed right-0 top-0 h-screen bg-white border-l border-gray-200 shadow-lg 
            transition-all duration-300 ease-in-out z-40 flex flex-col ${isCollapsed ? 'w-16' : 'w-96'}`}
        >
            {/* Header */}
            <div className="flex-none h-16 border-b flex items-center justify-between px-4 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10">
                        <SparklesIcon className="h-5 w-5 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div>
                            <h3 className="font-medium text-white">Data Collection</h3>
                            <p className="text-xs text-blue-100">
                                {patient ? `Collecting data for ${patient.name}` : 'Select a patient'}
                            </p>
                        </div>
                    )}
                </div>
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-white/80 hover:text-white transition-colors"
                >
                    <ChevronRightIcon className={`h-5 w-5 transition-transform duration-200 
                        ${isCollapsed ? 'rotate-180' : ''}`} 
                    />
                </button>
            </div>

            {!isCollapsed && renderContent()}
        </div>
    );
};

export default AIAssistantPanel; 