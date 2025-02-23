import React from 'react';
import { Tab } from '@headlessui/react';
import { Patient, User } from '../types/PatientTypes';
import { ClipboardDocumentListIcon, DocumentTextIcon, ClockIcon, BeakerIcon, ChatBubbleBottomCenterTextIcon, SparklesIcon, UserCircleIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import PatientOverviewTab from './PatientOverviewTab';
import PatientMedicalHistoryTab from './PatientMedicalHistoryTab';
import PatientDocumentsTab from './PatientDocumentsTab';
import { AIChat } from './AIChatComponent';
import AIAssessmentTab from './AIAssessmentTab';
import MAReviewForm from './MAReviewForm';
import SurgeonReviewForm from './SurgeonReviewForm';
import AIActivityFeed from './AIActivityFeed';

interface PatientTabsProps {
    patient: Patient;
    currentUser: User;
    onUpdateStatus: (status: string) => void;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const PatientTabs: React.FC<PatientTabsProps> = ({ patient, currentUser, onUpdateStatus }) => {
    console.log('PatientTabs - Raw Props:', {
        currentUser,
        patientStatus: patient.reviewStatus,
        patientId: patient.id,
        patientName: patient.name
    });

    // Show review tabs based on patient status, not user role
    const showMAReviewTab = patient.reviewStatus === 'PENDING_MA_REVIEW';
    const showSurgeonReviewTab = patient.reviewStatus === 'READY_FOR_SURGEON';

    console.log('PatientTabs - Visibility:', {
        patientStatus: patient.reviewStatus,
        showMAReviewTab,
        showSurgeonReviewTab
    });

    // Filter out the AI Assistant tab
    const tabs = [
        {
            name: 'Overview',
            icon: ClipboardDocumentListIcon,
            component: <PatientOverviewTab patient={patient} />
        },
        {
            name: 'Medical History',
            icon: BeakerIcon,
            component: <PatientMedicalHistoryTab patient={patient} />
        },
        {
            name: 'Documents',
            icon: DocumentTextIcon,
            component: <PatientDocumentsTab patient={patient} />
        },
        { 
            name: 'AI Assessment',
            icon: SparklesIcon,
            component: <AIAssessmentTab patient={patient} />
        }
    ];

    // Show review tabs based on patient status, not user role
    if (showMAReviewTab) {
        tabs.push({
            name: 'MA Review',
            icon: UserCircleIcon,
            component: <MAReviewForm patient={patient} onSubmit={onUpdateStatus} />
        });
    }

    if (showSurgeonReviewTab) {
        tabs.push({
            name: 'Surgeon Review',
            icon: UserCircleIcon,
            component: <SurgeonReviewForm patient={patient} onSubmit={onUpdateStatus} />
        });
    }

    return (
        <div className="w-full">
            <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.name}
                            className={({ selected }) =>
                                classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                    selected
                                        ? 'bg-blue-600 text-white shadow'
                                        : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                                )
                            }
                        >
                            <div className="flex items-center justify-center gap-2">
                                <tab.icon className="h-5 w-5" />
                                {tab.name}
                            </div>
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels className="mt-2">
                    {tabs.map((tab, idx) => (
                        <Tab.Panel
                            key={idx}
                            className={classNames(
                                'rounded-xl bg-white p-3',
                                'ring-white/60 ring-offset-2 focus:outline-none focus:ring-2'
                            )}
                        >
                            {tab.component}
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default PatientTabs; 