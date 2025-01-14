// src/services/api.ts
import { Patient } from '../types/PatientTypes';

const API_URL = 'http://localhost:4001/api';

export const fetchPatients = async (): Promise<Patient[]> => {
    try {
        console.log('Fetching patients...');
        const response = await fetch(`${API_URL}/patients`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched patients:', data);
        return data;
    } catch (error) {
        console.error('Error fetching patients:', error);
        throw error;
    }
};

export const updatePatientStatus = async (patientId: string, status: string): Promise<void> => {
    try {
        // TODO: Replace with actual API call
        console.log(`Updating patient ${patientId} status to ${status}`);
        return Promise.resolve();
    } catch (error) {
        console.error('Error updating patient status:', error);
        throw error;
    }
};

export const generateDocumentRequest = async (
    patientName: string,
    documentType: string,
    referringProvider: string
): Promise<string> => {
    const prompt = `Generate a professional, concise email to request medical documents.
    Context:
    - Patient Name: ${patientName}
    - Document Needed: ${documentType}
    - Referring Provider: ${referringProvider}
    
    The email should:
    1. Be professional and courteous
    2. Clearly state which document is needed
    3. Reference the patient by name
    4. Include a polite urgency
    5. Thank the provider
    
    Email:`;

    // TODO: Replace with your actual LLM API call
    return Promise.resolve(
        `Dear ${referringProvider},\n\nI hope this email finds you well...`
    );
};
