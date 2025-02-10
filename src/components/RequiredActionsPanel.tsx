import React from 'react';
import { User, RequiredAction } from '../types/PatientTypes';

interface RequiredActionsPanelProps {
    actions: RequiredAction[];
    currentUser: User;
    onActionComplete: (actionId: string) => void;
    onAddAction: (action: RequiredAction) => void;
}

const RequiredActionsPanel: React.FC<RequiredActionsPanelProps> = () => {
    return <div>Required Actions Panel</div>;
};

export default RequiredActionsPanel; 