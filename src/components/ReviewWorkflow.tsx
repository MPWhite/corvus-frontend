import React from 'react';
import { Patient, User, ReviewStatus } from '../types/PatientTypes';
import ReviewProgress from './ReviewProgress';
import MAReviewSection from './MAReviewSection';
import SurgeonReviewSection from './SurgeonReviewSection';
import ReviewNotesThread from './ReviewNotesThread';
import RequiredActionsPanel from './RequiredActionsPanel';

interface ReviewWorkflowProps {
    patient: Patient;
    currentUser: User;
    onUpdateStatus: (status: ReviewStatus) => void;
}

const ReviewWorkflow: React.FC<ReviewWorkflowProps> = ({ 
    patient, 
    currentUser,
    onUpdateStatus 
}) => {
    const isMA = currentUser.role === 'MA';
    const isSurgeon = currentUser.role === 'SURGEON';

    const actions = patient.requiredActions ?? [];

    return (
        <div className="space-y-4">
            {/* Review Progress */}
            <div className="bg-white rounded-lg p-4">
                <ReviewProgress status={patient.reviewStatus} />
            </div>

            {/* MA Review Section */}
            {isMA && patient.reviewStatus === 'PENDING_MA_REVIEW' && (
                <MAReviewSection 
                    patient={patient}
                    onComplete={(review) => {
                        // Handle MA review submission
                    }}
                />
            )}

            {/* Surgeon Review Section */}
            {isSurgeon && patient.reviewStatus === 'READY_FOR_SURGEON' && (
                <SurgeonReviewSection 
                    patient={patient}
                    onApprove={(notes) => {
                        // Handle surgeon approval
                    }}
                    onRequestMoreInfo={(actions) => {
                        // Handle request for more info
                    }}
                />
            )}

            {/* Review Notes Thread */}
            <ReviewNotesThread 
                notes={patient.reviewNotes}
                currentUser={currentUser}
                onAddNote={(note) => {
                    // Handle adding new note
                }}
            />

            {/* Required Actions */}
            <RequiredActionsPanel 
                actions={actions}
                currentUser={currentUser}
                onActionComplete={(actionId) => {
                    // Handle completing action
                }}
                onAddAction={(action) => {
                    // Handle adding new action
                }}
            />
        </div>
    );
};

export default ReviewWorkflow; 