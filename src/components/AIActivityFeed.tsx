import React from 'react';
import { 
    PhoneIcon, 
    EnvelopeIcon, 
    DocumentArrowDownIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

interface ActivityItem {
    id: string;
    type: 'call' | 'email' | 'fax' | 'document' | 'portal';
    status: 'in_progress' | 'waiting' | 'completed' | 'failed';
    action: string;
    target: string;
    timestamp: Date;
    details?: string;
    nextAction?: string;
}

const getStatusStyles = (status: ActivityItem['status']) => {
    switch (status) {
        case 'in_progress':
            return 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white';
        case 'waiting':
            return 'border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white';
        case 'completed':
            return 'border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white';
        case 'failed':
            return 'border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white';
    }
};

const getActionIcon = (type: ActivityItem['type']) => {
    switch (type) {
        case 'call':
            return PhoneIcon;
        case 'email':
            return EnvelopeIcon;
        case 'document':
            return DocumentArrowDownIcon;
        default:
            return ClockIcon;
    }
};

const getStatusIndicator = (status: ActivityItem['status']) => {
    switch (status) {
        case 'in_progress':
            return (
                <div className="relative">
                    <div className="absolute -left-1 -top-1 w-2 h-2">
                        <div className="absolute w-full h-full rounded-full bg-blue-400 animate-ping" />
                        <div className="relative w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                </div>
            );
        case 'waiting':
            return <div className="w-2 h-2 rounded-full bg-yellow-500" />;
        case 'completed':
            return <div className="w-2 h-2 rounded-full bg-green-500" />;
        case 'failed':
            return <div className="w-2 h-2 rounded-full bg-red-500" />;
    }
};

const mockActivities: ActivityItem[] = [
    {
        id: '1',
        type: 'call',
        status: 'in_progress',
        action: 'Contacting',
        target: 'Central Imaging',
        timestamp: new Date(),
        details: 'Requesting MRI records from previous visit',
        nextAction: 'Escalate to department head if no response'
    },
    {
        id: '2',
        type: 'portal',
        status: 'in_progress',
        action: 'Retrieving records from',
        target: 'Epic CareEverywhere',
        timestamp: new Date(Date.now() - 120000),
        details: 'Downloading surgical history and recent imaging',
        nextAction: 'Processing and organizing documentation'
    },
    {
        id: '3',
        type: 'email',
        status: 'waiting',
        action: 'Awaiting response from',
        target: 'Dr. Miller',
        timestamp: new Date(Date.now() - 3600000),
        details: 'Requested clarification on recent evaluation',
        nextAction: 'Follow-up call scheduled for 2:15 PM'
    },
    {
        id: '4',
        type: 'fax',
        status: 'failed',
        action: 'Failed to reach',
        target: 'City Medical Records',
        timestamp: new Date(Date.now() - 1800000),
        details: 'Connection failed after 3 attempts. Line appears to be disconnected.',
        nextAction: 'Switching to secure email delivery'
    },
    {
        id: '5',
        type: 'document',
        status: 'completed',
        action: 'Successfully processed',
        target: 'Lab Results',
        timestamp: new Date(Date.now() - 7200000),
        details: 'Retrieved and processed: CBC, Metabolic Panel, Coagulation Studies',
        nextAction: 'Results ready for MA review'
    }
];

const AIActivityFeed: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
            <div className="flex-none border-b border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <SparklesIcon className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Data Collection</h3>
                            <p className="text-sm text-gray-500">Automatically gathering required information</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            2 In Progress
                        </span>
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-100 whitespace-nowrap">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            1 Failed
                        </span>
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-100 whitespace-nowrap">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            1 Complete
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-gray-100">
                    {mockActivities.map((activity) => {
                        const Icon = getActionIcon(activity.type);
                        const statusStyle = getStatusStyles(activity.status);

                        return (
                            <div 
                                key={activity.id}
                                className={`p-6 ${statusStyle}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="relative flex-shrink-0">
                                        <div className="p-3 bg-white rounded-lg shadow-sm">
                                            <Icon className="h-5 w-5 text-gray-700" />
                                        </div>
                                        <div className="absolute -right-1 -top-1">
                                            {getStatusIndicator(activity.status)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <p className="text-sm font-medium text-gray-900 break-words">
                                                {activity.action} {activity.target}
                                            </p>
                                            <span className="text-xs font-medium text-gray-500 bg-white px-2.5 py-1.5 rounded-md shadow-sm whitespace-nowrap">
                                                {new Date(activity.timestamp).toLocaleTimeString([], { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit',
                                                    hour12: true 
                                                })}
                                            </span>
                                        </div>
                                        {activity.details && (
                                            <p className="mt-2 text-sm text-gray-600 leading-relaxed break-words">
                                                {activity.details}
                                            </p>
                                        )}
                                        {activity.nextAction && (
                                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-white p-2.5 rounded-md shadow-sm">
                                                <ClockIcon className="h-4 w-4 flex-shrink-0" />
                                                <span className="font-medium break-words">{activity.nextAction}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AIActivityFeed; 