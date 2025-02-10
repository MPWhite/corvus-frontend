import { Patient } from '../types/PatientTypes';

// Move these helper functions to the top
const calculateRiskScore = (patient: Patient) => {
    let score = 50; // Base score
    
    // Adjust based on medical history
    score += patient.medicalHistory?.length * 5 || 0;
    
    // Adjust based on BMI
    if (patient.bmi > 30) score += 10;
    if (patient.bmi > 35) score += 15;
    
    // Cap at 100
    return Math.min(score, 100);
};

const identifyRiskFactors = (patient: Patient) => {
    const risks = [];
    
    // BMI Risks
    if (patient.bmi > 30) risks.push({ 
        type: 'High BMI', 
        detail: `BMI of ${patient.bmi.toFixed(1)} indicates obesity`,
        severity: 'warning'
    });

    // Medical History Risks
    if (patient.medicalHistory?.includes('Hypertension')) {
        risks.push({ 
            type: 'Hypertension', 
            detail: 'History of high blood pressure may affect surgery',
            severity: 'warning'
        });
    }
    if (patient.medicalHistory?.includes('Type 2 Diabetes')) {
        risks.push({ 
            type: 'Diabetes', 
            detail: 'Blood sugar management will be critical',
            severity: 'warning'
        });
    }

    // Medication Risks
    if (patient.medications?.length > 3) {
        risks.push({ 
            type: 'Multiple Medications', 
            detail: 'Potential drug interactions need review',
            severity: 'info'
        });
    }

    return risks;
};

export const generateAIAnalysis = (patient: Patient) => {
    // Gather all data points
    const medicalRisks = identifyRiskFactors(patient);
    const unmetRequirements = patient.surgeryRequirements?.filter(r => !r.met) || [];
    const missingDocs = patient.requiredDocuments?.filter(d => !d.received) || [];
    
    const analysis = {
        summary: `Based on my analysis of ${patient.name}'s medical history and current status, `,
        riskLevel: calculateRiskScore(patient) > 70 ? 'high' : calculateRiskScore(patient) > 40 ? 'moderate' : 'low',
        primaryConcerns: [] as string[],
        nextSteps: [] as string[],
    };

    // Build natural language response
    if (medicalRisks.length > 0) {
        analysis.summary += `I've identified ${medicalRisks.length} key risk factors that need attention. `;
        analysis.primaryConcerns = medicalRisks.map(risk => 
            `${risk.type}: ${risk.detail}`
        );
    } else {
        analysis.summary += "I don't see any major risk factors that would complicate the procedure. ";
    }

    // Add surgery-specific analysis
    if (patient.surgeryType === 'Knee Replacement') {
        if (patient.bmi > 35) {
            analysis.summary += "Given the patient's BMI, special consideration for joint stress and healing time will be needed. ";
        }
        if (patient.medicalHistory?.includes('Diabetes')) {
            analysis.primaryConcerns.push(
                "Blood sugar management will be crucial for optimal healing. Consider endocrinology consultation."
            );
        }
    }

    // Add immediate next steps
    if (missingDocs.length > 0) {
        analysis.nextSteps.push(
            `Priority: Obtain ${missingDocs.map(d => d.type).join(', ')} to complete pre-surgical assessment.`
        );
    }

    if (unmetRequirements.length > 0) {
        const criticalReqs = unmetRequirements.filter(r => r.critical);
        if (criticalReqs.length > 0) {
            analysis.nextSteps.push(
                `Critical: Address ${criticalReqs.map(r => r.name).join(', ')} before proceeding.`
            );
        }
    }

    return analysis;
};

// Export these if needed elsewhere
export { calculateRiskScore, identifyRiskFactors }; 