// src/types/PatientTypes.ts
export interface SurgeryRequirements {
    name: string;
    value: number | string | boolean;
    required: number | string | boolean;
    met: boolean;
    description?: string;  // Optional description of the requirement
}

export interface Document {
    type: string;
    received: boolean;
    url?: string;
    dateReceived?: Date;
    status?: 'pending' | 'received' | 'expired';
    requestedDate?: Date;
}

export interface Note {
    id: string;
    content: string;
    author: string;
    timestamp: Date;
    type: 'general' | 'surgical' | 'medical' | 'requirement';
}

export type ReferralType = 'self' | 'external' | 'internal';

export interface VitalStats {
    height: number;
    weight: number;
    bmi: number;
    bloodType: string;
    bloodPressure: string;
    heartRate: number;
}

export interface Allergy {
    allergen: string;
    severity: 'mild' | 'moderate' | 'severe';
    reaction: string;
}

export interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    startDate: Date;
    prescribedBy: string;
}

export interface Surgery {
    procedure: string;
    date: Date;
    surgeon: string;
    facility: string;
    outcome: string;
    complications?: string;
}

export interface LabResult {
    testName: string;
    result: string;
    unit: string;
    isAbnormal: boolean;
    date: Date;
}

export interface SpecialistReport {
    specialty: string;
    provider: string;
    date: Date;
    summary: string;
    recommendations: string[];
    attachments?: string[];
}

export interface AIAssessment {
    overallAssessment: {
        summary: string;
        confidenceLevel: number;
        citations: Array<{
            source: string;
            type: 'note' | 'lab' | 'document' | 'history';
            reference: string;
        }>;
        riskFactors: string[];
    };
    watchPoints: {
        medicalConcerns: string[];
        potentialComplications: string[];
        requiredFollowUps: string[];
    };
    caseComparison: {
        similarCases: Array<{
            similarity: number;
            outcome: string;
            keyDifferences: string[];
        }>;
        successRate: number;
    };
}

export type UserRole = 'ADMIN' | 'SURGEON' | 'MA' | 'STAFF';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    email: string;
}

export type ReviewStatus = 
    | 'PENDING_MA_REVIEW'
    | 'READY_FOR_SURGEON'
    | 'SURGEON_APPROVED'
    | 'NEEDS_MORE_INFO'
    | 'SCHEDULED'
    | 'REJECTED';

export interface ReviewNote {
    content: string;
    author: string;
    timestamp: Date;
    type: 'general' | 'surgical' | 'medical' | 'requirement';
}

export interface RequiredAction {
    id: string;
    type: string;
    description: string;
    dueDate: Date;
    assignedTo: string;
    status: 'pending' | 'completed';
}

export interface SurgicalHistory {
    procedure: string;
    date?: Date;
    surgeon?: string;
    facility?: string;
    complications?: string;
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: 'male' | 'female';
    bmi: number;
    reason: string;
    needsReview: boolean;
    isCandidate: boolean;
    assignedTo: string;
    referringProvider: string;
    referralNotes: string;
    surgeryType: string;
    surgeryRequirements: SurgeryRequirement[];
    medicalHistory: string[];
    medications: Medication[];
    requiredDocuments: Document[];
    lastUpdated: Date;
    notes: ReviewNote[];
    consultDate: Date;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    priorityScore: number;
    ehrId: string;
    referralType: 'self' | 'external' | 'internal';
    reviewStatus: ReviewStatus;
    referralDate?: Date;
    scheduledDate?: Date;
    reviewedAt?: Date;
    reviewNotes: ReviewNote[];
    requiredActions?: RequiredAction[];
    surgicalHistory: SurgicalHistory[];
    labResults: LabResult[];
    aiAssessment?: AIAssessment;
}

export interface SurgeryRequirement {
    name: string;
    value: string | number | boolean;  // Allow multiple types
    required: string | boolean;
    met: boolean;
    description: string;
    critical: boolean;
}
