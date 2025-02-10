import React from 'react';
import { User, ReviewNote } from '../types/PatientTypes';

interface ReviewNotesThreadProps {
    notes: ReviewNote[];
    currentUser: User;
    onAddNote: (note: string) => void;
}

const ReviewNotesThread: React.FC<ReviewNotesThreadProps> = () => {
    return <div>Review Notes Thread</div>;
};

export default ReviewNotesThread; 