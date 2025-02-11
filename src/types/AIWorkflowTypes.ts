export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
export type ActionType = 'document_request' | 'follow_up' | 'data_collection' | 'analysis';
export type ActionPriority = 'high' | 'medium' | 'low';

export interface ActionStep {
    id: string;
    description: string;
    status: ActionStatus;
    timestamp: Date;
    details?: string;
    error?: string;
}

export interface WorkflowAction {
    id: string;
    title: string;
    type: ActionType;
    priority: ActionPriority;
    status: ActionStatus;
    steps: ActionStep[];
    expanded?: boolean;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    assignedTo?: string;
}

export interface AIAssistantState {
    currentActions: WorkflowAction[];
    completedActions: WorkflowAction[];
    upcomingActions: WorkflowAction[];
    isActive: boolean;
    lastUpdated: Date;
} 