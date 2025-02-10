import React from 'react';
import { Patient } from '../types/PatientTypes';

interface SurgeonReviewSectionProps {
    patient: Patient;
    onApprove: (notes: string) => void;
    onRequestMoreInfo: (actions: string[]) => void;
}

const SurgeonReviewSection: React.FC<SurgeonReviewSectionProps> = () => {
    return <div>Surgeon Review Section</div>;
};

export default SurgeonReviewSection; 