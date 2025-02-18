// src/services/api.ts
import { Patient } from '../types/PatientTypes';

const API_URL = '/api'

const mockPatient: Patient = {
    id: '1',
    name: 'John Doe',
    age: 45,
    gender: 'male',
    bmi: 24.5,
    reason: 'Knee replacement evaluation',
    needsReview: true,
    isCandidate: true,
    assignedTo: 'Dr. Smith',
    referringProvider: 'Dr. Jones',
    referralNotes: 'Patient has severe osteoarthritis',
    surgeryType: 'Knee Replacement',
    surgeryRequirements: [],
    medicalHistory: [],
    medications: [],
    requiredDocuments: [],
    lastUpdated: new Date(),
    notes: [],
    consultDate: new Date(),
    urgencyLevel: 'medium',
    priorityScore: 75,
    ehrId: '12345',
    referralType: 'external',
    reviewStatus: 'PENDING_MA_REVIEW',
    reviewNotes: [],
    surgicalHistory: [],
    labResults: []
};

// Add RequiredAction type if it's used
export interface RequiredAction {
    id: string;
    type: string;
    description: string;
    dueDate: Date;
    assignedTo: string;
    status: 'pending' | 'completed';
}

export interface DataSync {
    id: string;
    patientId: string;
    category: 'insurance' | 'medical_records' | 'lab_work' | 'imaging' | 'documentation' | 'coordination';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'failed';
    progress: number;
    dueDate: Date;
    assignedTo?: string;
    steps: Array<{
        id: string;
        title: string;
        description: string;
        status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'failed';
        timestamp: Date;
        details: string;
        blockers?: string[];
        nextAction?: string;
    }>;
    source: {
        system: string;
        organization: string;
        contact?: {
            name: string;
            role: string;
            phone?: string;
            email?: string;
            fax?: string;
        };
    };
    metadata: {
        attempts: number;
        lastAttempt?: Date;
        nextAttempt?: Date;
        method: 'fax' | 'phone' | 'email' | 'portal' | 'mail';
        urgency: 'routine' | 'expedited' | 'stat';
        notes?: string[];
    };
    lastUpdated: Date;
}

export const fetchPatients = async () => {
    try {
        const response = await fetch(`${API_URL}/patients`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching patients:', error);
        throw error;
    }
};

export const updatePatientStatus = async (patientId: string, status: string) => {
    try {
        const response = await fetch(`${API_URL}/patients/${patientId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating patient status:', error);
        throw error;
    }
};

export const getChatCompletion = async (chat: string, patient: Patient): Promise<any> => {
    try {
        const response = await fetch(`${API_URL}/chat-completion`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chat, patient }),
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const fetchDataSyncs = async (patientId: string): Promise<DataSync[]> => {
    try {
        console.log('Making request to:', `/api/patients/${patientId}/datasyncs`);
        const response = await fetch(`/api/patients/${patientId}/datasyncs`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data syncs: ${response.status}`);
        }
        const data = await response.json();
        console.log('Response data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching data syncs:', error);
        throw error;
    }
};