import React from 'react';
import { 
    BeakerIcon, 
    ScissorsIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { Patient, Surgery, Medication, LabResult } from '../types/PatientTypes';

interface TimelineEvent {
    date: Date | undefined;
    type: 'surgery' | 'medication' | 'lab' | 'allergy' | 'note';
    title: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    status?: 'normal' | 'warning' | 'critical';
}

interface TimelineProps {
    patient: Patient;
}

const TimelineEvent: React.FC<{ event: TimelineEvent }> = ({ event }) => (
    <div className="relative pl-6 pb-4">
        {/* Vertical line */}
        <div className="absolute left-2 top-0 h-full w-px bg-gray-200" />
        
        {/* Event dot */}
        <div className={`absolute left-0 p-1 rounded-full border border-white shadow-sm ${
            event.status === 'critical' ? 'bg-red-100' :
            event.status === 'warning' ? 'bg-yellow-100' :
            'bg-blue-100'
        }`}>
            <event.icon className={`h-3 w-3 ${
                event.status === 'critical' ? 'text-red-500' :
                event.status === 'warning' ? 'text-yellow-500' :
                'text-blue-500'
            }`} />
        </div>

        {/* Event content */}
        <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
            <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                <time className="text-xs text-gray-500">
                    {event.date?.toLocaleDateString()}
                </time>
            </div>
            <p className="text-xs text-gray-600 mt-1">{event.description}</p>
        </div>
    </div>
);

const MedicalTimeline: React.FC<TimelineProps> = ({ patient }) => {
    const generateTimelineEvents = (): TimelineEvent[] => {
        const events: TimelineEvent[] = [];

        patient.surgicalHistory?.forEach(surgery => {
            events.push({
                date: surgery.date,
                type: 'surgery',
                title: surgery.procedure,
                description: `Performed by ${surgery.surgeon ?? 'Unknown'} ${surgery.facility ? `at ${surgery.facility}` : ''}`,
                icon: ScissorsIcon,
                status: surgery.complications ? 'warning' : 'normal'
            });
        });

        // Add medications with optional chaining
        patient.medications?.forEach(med => {
            events.push({
                date: med.startDate,
                type: 'medication',
                title: med.name,
                description: `${med.dosage} • ${med.frequency} • Prescribed by ${med.prescribedBy}`,
                icon: BeakerIcon
            });
        });

        // Add lab results with optional chaining
        patient.labResults?.forEach(result => {
            events.push({
                date: result.date,
                type: 'lab',
                title: result.testName,
                description: `Result: ${result.result} ${result.unit} (${result.isAbnormal ? 'Abnormal' : 'Normal'})`,
                icon: DocumentTextIcon,
                status: result.isAbnormal ? 'warning' : 'normal'
            });
        });

        // Sort events by date with null check
        return events.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
    };

    const events = generateTimelineEvents();

    return (
        <div className="space-y-1">
            {events.map((event, index) => (
                <TimelineEvent key={index} event={event} />
            ))}
        </div>
    );
};

export default MedicalTimeline; 