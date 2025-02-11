import React, { useState } from 'react';
import TriageDashboard from './components/TriageDashboard';
import AIAssistantPanel from './components/AIAssistantPanel';
import { User, Patient } from './types/PatientTypes';

// Mock user for development
const mockUser: User = {
    id: '1',
    name: 'Dr. Smith',
    role: 'MA', // or 'SURGEON' to test different views
    email: 'dr.smith@hospital.com'
};

function App() {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    return (
        <div className="App">
            <TriageDashboard 
                currentUser={mockUser} 
                onPatientSelect={setSelectedPatient}
            />
            {/* AI Assistant Panel */}
            <AIAssistantPanel 
                patient={selectedPatient}
                onAction={(action) => {
                    console.log('AI Assistant action:', action);
                }}
            />
        </div>
    );
}

export default App;
