import React, { useState, useEffect, useMemo } from 'react';
import { Patient } from '../types/PatientTypes';
import { 
    SparklesIcon, 
    ChevronRightIcon,
    ChatBubbleLeftRightIcon,
    BoltIcon,
    ClockIcon,
    DocumentMagnifyingGlassIcon,
    ArrowPathIcon,
    BeakerIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    CheckBadgeIcon,
    ChevronDownIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { WorkflowAction, ActionStep } from '../types/AIWorkflowTypes';

interface AIAssistantPanelProps {
    patient: Patient | null;
    onAction?: (action: string) => void;
}

type TaskType = 'data_collection' | 'verification' | 'analysis';

interface EnhancedWorkflowAction extends WorkflowAction {
    patientId?: string;
    patientName?: string;
    taskType: TaskType;
    category: string;
}

// Sample task showing required fields for filtering
const INITIAL_TASKS: EnhancedWorkflowAction[] = [
    {
        id: '1',
        taskType: 'data_collection',
        category: 'Medical Records',
        title: 'Primary Care Records Collection',
        priority: 'high',
        status: 'in_progress',
        patientId: '67a94d866250bbbf0cba69e3', // Patient 11
        patientName: 'Patient 11',
        steps: [
            {
                id: 's1',
                description: 'Calling Dr. Smith\'s Office',
                status: 'in_progress',
                timestamp: new Date(),
                details: 'On hold with records department (Position: 3)'
            },
            {
                id: 's2',
                description: 'Faxing Records Request',
                status: 'pending',
                timestamp: new Date(),
                details: 'Request form prepared, waiting for office response'
            },
            {
                id: 's3',
                description: 'HIE Database Query',
                status: 'completed',
                timestamp: new Date(),
                details: 'Found 3 recent visits, downloading records'
            }
        ],
        expanded: true
    },
    {
        id: '2',
        taskType: 'data_collection',
        category: 'Imaging Records',
        title: 'Radiology Records Collection',
        priority: 'high',
        status: 'in_progress',
        patientId: '67a94d866250bbbf0cba69e4', // Patient 12
        patientName: 'Patient 12',
        steps: [
            {
                id: 's4',
                description: 'Querying Regional Imaging Network',
                status: 'completed',
                timestamp: new Date(),
                details: 'Found MRI from Memorial Hospital (2 months ago)'
            },
            {
                id: 's5',
                description: 'Emailing City Radiology',
                status: 'in_progress',
                timestamp: new Date(),
                details: 'Following up on X-rays from last year'
            },
            {
                id: 's6',
                description: 'Downloading DICOM files',
                status: 'pending',
                timestamp: new Date(),
                details: 'Waiting for secure transfer link'
            }
        ],
        expanded: false
    },
    {
        id: '3',
        taskType: 'data_collection',
        category: 'Lab Results',
        title: 'Laboratory Results Collection',
        priority: 'medium',
        status: 'in_progress',
        patientId: '67a94d866250bbbf0cba69e5', // Patient 13
        patientName: 'Patient 13',
        steps: [
            {
                id: 's7',
                description: 'Quest Diagnostics Portal Query',
                status: 'completed',
                timestamp: new Date(),
                details: 'Retrieved CBC and metabolic panel'
            },
            {
                id: 's8',
                description: 'LabCorp Results Request',
                status: 'in_progress',
                timestamp: new Date(),
                details: 'Submitted patient authorization form'
            },
            {
                id: 's9',
                description: 'Following up with PCP office',
                status: 'pending',
                timestamp: new Date(),
                details: 'Requesting recent thyroid panel results'
            }
        ],
        expanded: false
    },
    {
        id: '4',
        taskType: 'data_collection',
        category: 'Insurance Verification',
        title: 'Insurance Records Collection',
        priority: 'high',
        status: 'in_progress',
        patientId: '67a94d866250bbbf0cba69e3', // Patient 11
        patientName: 'Patient 11',
        steps: [
            {
                id: 's10',
                description: 'UnitedHealth Portal Access',
                status: 'in_progress',
                timestamp: new Date(),
                details: 'Verifying coverage details'
            },
            {
                id: 's11',
                description: 'Prior Authorization Check',
                status: 'pending',
                timestamp: new Date(),
                details: 'Submitting procedure codes'
            }
        ],
        expanded: false
    }
];

const GLOBAL_TASKS: EnhancedWorkflowAction[] = [
    {
        id: 'g1',
        taskType: 'data_collection',
        category: 'System Data',
        title: 'System-wide Data Sync',
        type: 'data_collection',
        priority: 'high',
        status: 'in_progress',
        steps: [
            {
                id: 'gs1',
                description: 'Syncing with EHR system',
                status: 'completed',
                timestamp: new Date(),
                details: 'Successfully synced with Epic'
            },
            {
                id: 'gs2',
                description: 'Updating lab results database',
                status: 'in_progress',
                timestamp: new Date(),
                details: 'Processing new results'
            }
        ],
        expanded: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'g2',
        taskType: 'analysis',
        category: 'Insurance Verification',
        title: 'Insurance Verification',
        type: 'analysis',
        priority: 'medium',
        status: 'in_progress',
        steps: [
            {
                id: 'gs3',
                description: 'Checking policy updates',
                status: 'completed',
                timestamp: new Date(),
                details: 'New policies detected for UnitedHealth'
            },
            {
                id: 'gs4',
                description: 'Updating coverage requirements',
                status: 'in_progress',
                timestamp: new Date()
            }
        ],
        expanded: false,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'g3',
        taskType: 'analysis',
        category: 'Scheduling Optimization',
        title: 'Scheduling Optimization',
        type: 'analysis',
        priority: 'low',
        status: 'in_progress',
        steps: [
            {
                id: 'gs5',
                description: 'Analyzing surgeon availability',
                status: 'completed',
                timestamp: new Date()
            },
            {
                id: 'gs6',
                description: 'Optimizing OR schedules',
                status: 'in_progress',
                timestamp: new Date(),
                details: 'Reviewing next 30 days'
            }
        ],
        expanded: false,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

const generateTasksForPatient = (patient: Patient): EnhancedWorkflowAction[] => {
    const tasks: EnhancedWorkflowAction[] = [];

    // Data Collection Tasks based on patient status
    if (patient.reviewStatus === 'PENDING_MA_REVIEW') {
        tasks.push({
            id: `${patient.id}-data-collection`,
            taskType: 'data_collection',
            category: 'External Data',
            title: `Collecting Data for ${patient.name}`,
            priority: 'high',
            status: 'in_progress',
            patientId: patient.id,
            patientName: patient.name,
            steps: [
                {
                    id: `${patient.id}-dc1`,
                    description: `Calling ${patient.referringProvider}`,
                    status: 'in_progress',
                    timestamp: new Date(),
                    details: 'On hold - Position 3 in queue'
                },
                {
                    id: `${patient.id}-dc2`,
                    description: 'Requesting surgical history',
                    status: 'pending',
                    timestamp: new Date(),
                    details: 'Email sent to Memorial Hospital'
                }
            ],
            expanded: false,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    // Add verification tasks based on requirements
    if (patient.surgeryRequirements?.some(req => !req.met)) {
        tasks.push({
            id: `${patient.id}-verification`,
            taskType: 'verification',
            category: 'Requirements',
            title: `Verifying Requirements for ${patient.name}`,
            priority: 'high',
            status: 'in_progress',
            patientId: patient.id,
            patientName: patient.name,
            steps: patient.surgeryRequirements
                .filter(req => !req.met)
                .map(req => ({
                    id: `${patient.id}-req-${req.name}`,
                    description: `Checking ${req.name}`,
                    status: 'in_progress',
                    timestamp: new Date(),
                    details: `Required: ${req.required}, Current: ${req.value}`
                })),
            expanded: false,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    return tasks;
};

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ patient, onAction }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [allTasks, setAllTasks] = useState<EnhancedWorkflowAction[]>([]);
    const [insights, setInsights] = useState<string[]>([]);
    const [isThinking, setIsThinking] = useState(false);

    // Initialize all tasks on mount
    useEffect(() => {
        const initialTasks = [...GLOBAL_TASKS, ...INITIAL_TASKS];
        console.log('Setting initial tasks:', initialTasks);
        setAllTasks(initialTasks);
    }, []);

    // Filter tasks for current view
    const currentTasks = useMemo(() => {
        console.log('Filtering for patient:', patient?._id);
        console.log('Available tasks:', allTasks);
        
        if (patient) {
            const filtered = allTasks.filter(task => 
                // Include tasks specifically for this patient
                task.patientId === patient._id || 
                // Also include global tasks (those without a patientId)
                !task.patientId
            );
            console.log('Filtered tasks:', filtered);
            return filtered;
        }
        return allTasks;
    }, [patient, allTasks]);

    // Group tasks by type
    const groupedTasks = useMemo(() => {
        return currentTasks.reduce((groups, task) => {
            const group = groups[task.taskType] || [];
            group.push(task);
            groups[task.taskType] = group;
            return groups;
        }, {} as Record<TaskType, EnhancedWorkflowAction[]>);
    }, [currentTasks]);

    // Update insights when patient changes
    useEffect(() => {
        if (patient) {
            setIsThinking(true);
            setTimeout(() => {
                setInsights([
                    `Analyzing data for ${patient.name}`,
                    'Surgery requirements 70% complete',
                    'Potential medication interaction detected'
                ]);
                setIsThinking(false);
            }, 500);
        } else {
            setInsights([
                'Monitoring system-wide updates',
                'Processing incoming lab results',
                'Checking insurance requirements'
            ]);
        }
    }, [patient]);

    const toggleActionExpanded = (actionId: string) => {
        if (patient) {
            setAllTasks(actions => 
                actions.map(action => 
                    action.id === actionId 
                        ? { ...action, expanded: !action.expanded }
                        : action
                )
            );
        } else {
            setAllTasks(actions => 
                actions.map(action => 
                    action.id === actionId 
                        ? { ...action, expanded: !action.expanded }
                        : action
                )
            );
        }
    };

    // Modify the action card rendering to show patient info when no patient is selected
    const renderActionCard = (action: EnhancedWorkflowAction) => (
        <div key={action.id} 
            className="rounded-lg border border-gray-200 hover:border-blue-200 
                transition-colors bg-white"
        >
            <button 
                onClick={() => toggleActionExpanded(action.id)}
                className="w-full p-3 flex items-center justify-between group"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg 
                        ${action.priority === 'high' ? 'bg-red-50' : 
                          action.priority === 'medium' ? 'bg-yellow-50' : 'bg-blue-50'}`}
                    >
                        <DocumentMagnifyingGlassIcon className={`h-5 w-5
                            ${action.priority === 'high' ? 'text-red-500' :
                              action.priority === 'medium' ? 'text-yellow-600' : 'text-blue-500'}`} 
                        />
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-sm text-gray-900 group-hover:text-blue-600">
                            {action.title}
                        </p>
                        {!patient && action.patientName && (
                            <p className="text-xs text-gray-500">
                                Patient: {action.patientName}
                            </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-500 transition-all duration-500"
                                    style={{ 
                                        width: `${(action.steps.filter(s => s.status === 'completed').length / 
                                            action.steps.length) * 100}%` 
                                    }}
                                />
                            </div>
                            <span className="text-xs text-gray-500">
                                {action.steps.filter(s => s.status === 'completed').length}/{action.steps.length}
                            </span>
                        </div>
                    </div>
                </div>
                <ChevronDownIcon 
                    className={`h-5 w-5 text-gray-400 transition-transform
                        ${action.expanded ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Steps Timeline */}
            {action.expanded && (
                <div className="border-t bg-gray-50 p-4">
                    <div className="space-y-4">
                        {action.steps.map((step, index) => (
                            <div key={step.id} className="relative">
                                {index !== action.steps.length - 1 && (
                                    <div className="absolute left-[0.9375rem] top-6 w-px h-full bg-gray-200" />
                                )}
                                <div className="flex gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center
                                        ${step.status === 'completed' ? 'bg-green-100' :
                                          step.status === 'in_progress' ? 'bg-blue-100' : 'bg-gray-100'}`}
                                    >
                                        {step.status === 'completed' ? (
                                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                                        ) : step.status === 'in_progress' ? (
                                            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                                        ) : (
                                            <div className="h-2 w-2 rounded-full bg-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {step.description}
                                        </p>
                                        {step.details && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {step.details}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">
                                            {step.timestamp.toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    // Add this function before renderActionCard
    const renderTaskGroup = (type: TaskType, tasks: EnhancedWorkflowAction[]) => (
        <div key={type} className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900 capitalize flex items-center gap-2">
                <span className="flex items-center gap-2">
                    {type === 'data_collection' && <DocumentMagnifyingGlassIcon className="h-4 w-4 text-blue-500" />}
                    {type === 'verification' && <CheckBadgeIcon className="h-4 w-4 text-green-500" />}
                    {type === 'analysis' && <BeakerIcon className="h-4 w-4 text-yellow-500" />}
                    {type.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-500 font-normal">
                    ({tasks.length})
                </span>
            </h4>
            <div className="space-y-2">
                {tasks.map(renderActionCard)}
            </div>
        </div>
    );

    // Show content for both global and patient contexts
    const renderContent = () => {
        return (
            <>
                {/* Quick Insights */}
                <div className="flex-none px-4 py-3 bg-gradient-to-b from-blue-50 to-white border-b">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <BoltIcon className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">
                                {patient ? 'Patient Insights' : 'System Insights'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-blue-600">
                                {isThinking ? 'Analyzing...' : 'Updated just now'}
                            </span>
                            <button 
                                className={`text-blue-600 hover:text-blue-700 transition-colors
                                    ${isThinking ? 'animate-spin' : ''}`}
                                onClick={() => {
                                    setIsThinking(true);
                                    setTimeout(() => setIsThinking(false), 1000);
                                }}
                            >
                                <ArrowPathIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {insights.map((insight, index) => (
                            <div key={index} 
                                className="flex items-start gap-2 p-2 rounded-lg bg-white border border-blue-100
                                    hover:border-blue-200 transition-colors cursor-pointer"
                            >
                                <ExclamationTriangleIcon className="h-4 w-4 text-amber-500 mt-0.5" />
                                <span className="text-sm text-gray-700">{insight}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tasks Section */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 space-y-6">
                        {patient ? (
                            // Patient-specific view
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-900">
                                    Tasks for {patient.name}
                                </h3>
                                {currentTasks.map(renderActionCard)}
                            </div>
                        ) : (
                            // Global view grouped by task type
                            <div className="space-y-6">
                                {Object.entries(groupedTasks || {}).map(([type, tasks]) => 
                                    renderTaskGroup(type as TaskType, tasks)
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="flex-none border-t bg-white p-4">
                    <button 
                        className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 
                            text-white flex items-center justify-center gap-2 transition-colors
                            shadow-sm hover:shadow"
                    >
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                        <span>Ask the Assistant</span>
                    </button>
                </div>
            </>
        );
    };

    return (
        <div 
            className={`fixed right-0 top-0 h-screen bg-white border-l border-gray-200 shadow-lg 
                transition-all duration-300 ease-in-out z-40 flex flex-col ${isCollapsed ? 'w-16' : 'w-96'}`}
        >
            {/* Header */}
            <div className="flex-none h-16 border-b flex items-center justify-between px-4 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full 
                        ${isThinking ? 'bg-white/20 animate-pulse' : 'bg-white/10'}`}>
                        <SparklesIcon className="h-5 w-5 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div>
                            <h3 className="font-medium text-white">AI Assistant</h3>
                            <p className="text-xs text-blue-100">
                                {patient 
                                    ? `Analyzing ${patient.name}'s case...`
                                    : 'Monitoring system activities'}
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

            {!isCollapsed && (
                <div className="flex flex-col flex-1 overflow-hidden">
                    {renderContent()}
                </div>
            )}
        </div>
    );
};

export default AIAssistantPanel; 