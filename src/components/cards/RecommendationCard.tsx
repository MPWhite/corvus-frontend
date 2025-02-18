import React from 'react';
import { 
    ExclamationTriangleIcon, 
    ExclamationCircleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

interface RecommendationCardProps {
    priority: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    action?: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
    priority,
    title,
    description,
    action
}) => {
    const getPriorityStyles = () => {
        switch (priority) {
            case 'critical':
                return {
                    icon: ExclamationTriangleIcon,
                    color: 'text-red-600',
                    bg: 'bg-red-50',
                    border: 'border-red-200'
                };
            case 'high':
                return {
                    icon: ExclamationCircleIcon,
                    color: 'text-orange-600',
                    bg: 'bg-orange-50',
                    border: 'border-orange-200'
                };
            case 'medium':
                return {
                    icon: InformationCircleIcon,
                    color: 'text-yellow-600',
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200'
                };
            default:
                return {
                    icon: InformationCircleIcon,
                    color: 'text-blue-600',
                    bg: 'bg-blue-50',
                    border: 'border-blue-200'
                };
        }
    };

    const styles = getPriorityStyles();
    const Icon = styles.icon;

    return (
        <div className={`rounded-lg border p-4 ${styles.bg} ${styles.border}`}>
            <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 ${styles.color}`} />
                <div>
                    <h4 className={`font-medium ${styles.color}`}>
                        {title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                        {description}
                    </p>
                    {action && (
                        <p className="text-sm font-medium mt-2">
                            Suggested Action: {action}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecommendationCard; 