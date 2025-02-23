import React, { useState, useEffect } from 'react';

interface DataCollectionTask {
    id: string;
    type: 'lab_results' | 'medical_history' | 'insurance' | 'referrals';
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    progress?: number;
    message?: string;
    startTime: Date;
    estimatedCompletion?: Date;
}

const DataCollectionStatus: React.FC<{ patientId: string }> = ({ patientId }) => {
    const [tasks, setTasks] = useState<DataCollectionTask[]>([]);
    
    useEffect(() => {
        // Set up WebSocket or polling for real-time updates
        const ws = new WebSocket('ws://your-api/data-collection-status');
        
        ws.onmessage = (event) => {
            const update = JSON.parse(event.data);
            setTasks(currentTasks => 
                currentTasks.map(task => 
                    task.id === update.taskId ? { ...task, ...update } : task
                )
            );
        };

        return () => ws.close();
    }, [patientId]);

    return (
        <div className="space-y-3">
            {tasks.map(task => (
                <div key={task.id} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-medium">{getTaskTitle(task.type)}</h4>
                            <p className="text-sm text-gray-500">{task.message}</p>
                        </div>
                        <StatusIndicator status={task.status} progress={task.progress} />
                    </div>
                    {task.status === 'failed' && (
                        <button 
                            onClick={() => retryTask(task.id)}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                        >
                            Retry
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DataCollectionStatus; 