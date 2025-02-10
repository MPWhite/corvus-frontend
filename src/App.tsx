import React from 'react';
import TriageDashboard from './components/TriageDashboard';
import { User } from './types/PatientTypes';

// Mock user for development
const mockUser: User = {
    id: '1',
    name: 'Dr. Smith',
    role: 'MA', // or 'SURGEON' to test different views
    email: 'dr.smith@hospital.com'
};

function App() {
    return (
        <div className="App">
            <TriageDashboard currentUser={mockUser} />
        </div>
    );
}

export default App;
