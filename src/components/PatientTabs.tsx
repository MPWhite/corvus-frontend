import React from 'react';
import { Tab } from '@headlessui/react';
import { Patient } from '../types/PatientTypes';
import { ClipboardDocumentListIcon, DocumentTextIcon, ClockIcon, BeakerIcon, ChatBubbleBottomCenterTextIcon, SparklesIcon } from '@heroicons/react/24/outline';
import PatientOverviewTab from './PatientOverviewTab';
import PatientMedicalHistoryTab from './PatientMedicalHistoryTab';
import PatientDocumentsTab from './PatientDocumentsTab';
import { AIChat } from './AIChatComponent';
import AIAssessmentTab from './AIAssessmentTab';

interface PatientTabsProps {
    patient: Patient;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const PatientTabs: React.FC<PatientTabsProps> = ({ patient }) => {
    console.log('PatientTabs - Patient Data:', {
        name: patient.name,
        medicalHistory: patient.medicalHistory,
        medications: patient.medications
    });

    const tabs = [
        { name: 'Overview', icon: ClipboardDocumentListIcon },
        { name: 'Medical History', icon: BeakerIcon },
        { name: 'Documents', icon: DocumentTextIcon },
        { name: 'AI Workflow', icon: SparklesIcon },
    ];

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
                    <Tab.Panel>
                        <PatientOverviewTab patient={patient} />
                    </Tab.Panel>
                    <Tab.Panel>
                        <PatientMedicalHistoryTab patient={patient} />
                    </Tab.Panel>
                    <Tab.Panel>
                        <PatientDocumentsTab patient={patient} />
                    </Tab.Panel>
                    <Tab.Panel>
                        <AIAssessmentTab patient={patient} />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default PatientTabs; 