import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface Step {
    label: string;
    description: string;
    completed?: boolean;
}

interface ReviewStepperProps {
    steps: Step[];
    activeStep: number;
    onStepClick: (step: number) => void;
}

const ReviewStepper: React.FC<ReviewStepperProps> = ({ steps, activeStep, onStepClick }) => {
    const completedSteps = steps.filter(step => step.completed).length;
    const progress = (completedSteps / steps.length) * 100;
    const criticalPending = steps.filter(step => !step.completed && step.critical).length;

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between mb-6">
                {steps.map((step, index) => (
                    <div 
                        key={index}
                        className={`flex-1 ${index !== steps.length - 1 ? 'border-r border-gray-200 mr-4 pr-4' : ''}`}
                        onClick={() => onStepClick(index)}
                    >
                        <div className={`
                            cursor-pointer transition-colors
                            ${index === activeStep ? 'text-blue-600' : 'text-gray-500'}
                        `}>
                            <div className="flex items-center mb-2">
                                <div className={`
                                    h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium mr-2
                                    ${index === activeStep ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}
                                `}>
                                    {index + 1}
                                </div>
                                <span className="font-medium">{step.label}</span>
                            </div>
                            <p className="text-sm text-gray-500 ml-10">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewStepper; 