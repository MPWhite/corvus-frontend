import React, { useState } from 'react';
import TriageDashboard from './components/TriageDashboard';
import AIAssistantPanel from './components/AIAssistantPanel';
import { User, Patient } from './types/PatientTypes';

// Mock user for development
const mockUser: User = {
    id: '1',
    name: '',
    role: 'MA', // or 'SURGEON' to test different views
    email: ''
};

function App() {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    return (
        <div className="min-h-screen bg-gray-50">
            <TriageDashboard 
                currentUser={mockUser}
                onPatientSelect={setSelectedPatient}
            />
            <AIAssistantPanel 
                patient={selectedPatient}
            />
        </div>
    );
}

export default App;
