// src/components/PatientDetailModal.tsx
import React, { useState } from 'react';
import { Patient, SurgeryRequirements, User } from '../types/PatientTypes';
import { 
    XMarkIcon, 
    UserCircleIcon,
    ClockIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    DocumentArrowDownIcon,
    PlusCircleIcon,
    ArrowTopRightOnSquareIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import DocumentRequestGenerator from './DocumentRequestGenerator';
import SchedulingModal from './SchedulingModal';
import ReviewStepper from './ReviewStepper';
import {AIChat} from "./AIChatComponent";
import { Dialog } from '@headlessui/react';
import PatientTabs from './PatientTabs';
import MAReviewForm from './MAReviewForm';

interface PatientDetailModalProps {
    patient: Patient;
    currentUser: User;
    isOpen: boolean;
    onClose: () => void;
    onUpdateStatus: (status: string) => void;
}

interface TimeSlot {
    id: string;
    date: Date;
    provider: string;
    available: boolean;
}

interface RequirementStatus {
    label: string;
    met: boolean;
    critical: boolean;
}

const RequirementStatus: React.FC<{ requirement: SurgeryRequirements }> = ({ requirement }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg ${
        requirement.met ? 'bg-green-50' : 'bg-red-50'
    }`}>
        <div>
            <p className="font-medium text-gray-900">{requirement.name}</p>
            <p className="text-sm text-gray-500">
                Current: {requirement.value} (Required: {requirement.required})
            </p>
        </div>
        {requirement.met ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
        ) : (
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
        )}
    </div>
);

const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString();
};

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
    patient,
    currentUser,
    isOpen,
    onClose,
    onUpdateStatus
}) => {
    console.log('PatientDetailModal - Full Patient Data:', patient);
    const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isScheduled, setIsScheduled] = useState(!!patient.scheduledDate);
    const [isReviewed, setIsReviewed] = useState(!!patient.reviewedAt);

    const openEHR = () => {
        if (!patient?.ehrId) return;
        const ehrBaseUrl = 'https://ehr.example.com/patient/';
        window.open(`${ehrBaseUrl}${patient.ehrId}`, '_blank');
    };

    if (!patient) return null;

    const getReferralTypeDisplay = (type: 'self' | 'external' | 'internal') => {
        const displays = {
            'self': 'Self',
            'external': 'External',
            'internal': 'Internal'
        };
        return displays[type] || 'Unknown';
    };

    const getReferralTypeStyles = (type: 'self' | 'external' | 'internal') => {
        const styles = {
            'internal': 'bg-blue-100 text-blue-800',
            'external': 'bg-purple-100 text-purple-800',
            'self': 'bg-green-100 text-green-800'
        };
        return styles[type] || 'bg-gray-100 text-gray-800';
    };

    const referralTypeDisplay = patient.referralType
        ? patient.referralType.charAt(0).toUpperCase() + patient.referralType.slice(1)
        : 'Unknown';

    const scheduledDateDisplay = patient.scheduledDate
        ? new Date(patient.scheduledDate).toLocaleDateString()
        : 'Not scheduled';

    const reviewedDateDisplay = patient.reviewedAt
        ? new Date(patient.reviewedAt).toLocaleDateString()
        : 'Not reviewed';

    const handleScheduleConfirm = (slot: TimeSlot) => {
        console.log('Scheduling appointment:', {
            patientId: patient.id,
            patientName: patient.name,
            slot
        });
        
        setIsSchedulingOpen(false);
        setSelectedSlot(null);
        setIsScheduled(true);
        // In real app, you'd make an API call here
    };

    const handleReviewClick = () => {
        onUpdateStatus('reviewed');
        setIsReviewed(true);
    };

    const getReviewSteps = () => {
        return [
            {
                label: 'Documents Received',
                completed: patient.requiredDocuments.every(doc => doc.received),
                critical: true
            },
            {
                label: 'Medical Requirements Met',
                completed: patient.surgeryRequirements.every(req => req.met),
                critical: true
            },
            {
                label: 'Provider Assigned',
                completed: !!patient.assignedTo,
                critical: false
            },
            {
                label: 'Initial Assessment',
                completed: patient.notes.some(note => note.type === 'medical'),
                critical: false
            }
        ];
    };

    const canSubmitMAReview = currentUser.role === 'MA' && 
        patient.reviewStatus === 'PENDING_MA_REVIEW';

    const renderActionButtons = () => {
        if (currentUser.role === 'SURGEON' && patient.reviewStatus === 'READY_FOR_SURGEON') {
            return (
                <div className="flex gap-4">
                    <button
                        onClick={() => onUpdateStatus('SURGEON_APPROVED')}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Approve Patient
                    </button>
                    <button
                        onClick={() => onUpdateStatus('NEEDS_MORE_INFO')}
                        className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                        Request More Info
                    </button>
                </div>
            );
        }

        if (currentUser.role === 'MA' && patient.reviewStatus === 'PENDING_MA_REVIEW') {
            return (
                <div className="flex gap-4">
                    <button
                        onClick={() => onUpdateStatus('READY_FOR_SURGEON')}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Send to Surgeon
                    </button>
                    <button
                        onClick={() => onUpdateStatus('NEEDS_MORE_INFO')}
                        className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                        Request More Info
                    </button>
                </div>
            );
        }

        return null;
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-gray-50 rounded-xl shadow-lg w-[1024px] h-[768px]">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 bg-blue-500 rounded-t-xl">
                        <div>
                            <Dialog.Title className="text-xl font-semibold text-white">
                                {patient.name}
                            </Dialog.Title>
                            <p className="text-sm text-blue-100">
                                {patient.surgeryType} • {patient.age} years old
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => !isScheduled && setIsSchedulingOpen(true)}
                                disabled={isScheduled}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                                    isScheduled 
                                        ? 'bg-green-400 text-white cursor-default'
                                        : 'bg-white text-blue-600 hover:bg-blue-50'
                                }`}
                            >
                                <CalendarIcon className="h-4 w-4" />
                                <span className="text-sm">
                                    {isScheduled ? 'Scheduled' : 'Schedule'}
                                </span>
                            </button>

                            <button
                                onClick={handleReviewClick}
                                disabled={isReviewed}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                                    isReviewed
                                        ? 'bg-green-400 text-white cursor-default'
                                        : 'bg-white text-green-600 hover:bg-green-50'
                                }`}
                            >
                                <CheckCircleIcon className="h-4 w-4" />
                                <span className="text-sm">
                                    {isReviewed ? 'Reviewed' : 'Mark as Reviewed'}
                                </span>
                            </button>

                            <button
                                onClick={openEHR}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                <span className="text-sm">Open EHR</span>
                            </button>

                            <button
                                onClick={onClose}
                                className="ml-2 text-white hover:text-blue-100"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 h-[calc(768px-80px)] overflow-y-auto">
                        <div className="space-y-6">
                            <PatientTabs patient={patient} />
                            
                            {/* Add MA Review Form */}
                            {canSubmitMAReview && (
                                <MAReviewForm 
                                    patient={patient}
                                    onSubmit={async (data) => {
                                        // Handle the MA review submission
                                        await onUpdateStatus(data.status);
                                        // You might want to handle the note separately
                                        console.log('Review note:', data.note);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </Dialog.Panel>
            </div>

            {/* Scheduling Modal */}
            <SchedulingModal
                isOpen={isSchedulingOpen}
                onClose={() => setIsSchedulingOpen(false)}
                onConfirm={handleScheduleConfirm}
                patientName={patient.name}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
            />
        </Dialog>
    );
};

export default PatientDetailModal;
