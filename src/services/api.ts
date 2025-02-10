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