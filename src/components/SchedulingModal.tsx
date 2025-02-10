import React from 'react';
import { Dialog } from '@headlessui/react';
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TimeSlot {
    id: string;
    date: Date;
    provider: string;
    available: boolean;
}

interface SchedulingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (slot: TimeSlot) => void;
    patientName: string;
    selectedSlot: TimeSlot | null;
    setSelectedSlot: (slot: TimeSlot | null) => void;
}

// Mock available time slots
const availableSlots: TimeSlot[] = [
    {
        id: '1',
        date: new Date('2024-01-15T09:00:00'),
        provider: 'Dr. Smith',
        available: true
    },
    {
        id: '2',
        date: new Date('2024-01-15T14:00:00'),
        provider: 'Dr. Johnson',
        available: true
    },
    {
        id: '3',
        date: new Date('2024-01-16T10:30:00'),
        provider: 'Dr. Smith',
        available: true
    },
    // Add more slots as needed
];

const SchedulingModal: React.FC<SchedulingModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    patientName,
    selectedSlot,
    setSelectedSlot
}) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-xl shadow-lg w-full max-w-md">
                    <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <Dialog.Title className="text-lg font-semibold text-gray-900">
                                Schedule Consultation
                            </Dialog.Title>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500">
                            Scheduling consultation for {patientName}
                        </p>
                    </div>

                    <div className="p-4">
                        <div className="space-y-4">
                            {availableSlots.map((slot) => (
                                <button
                                    key={slot.id}
                                    className={`w-full p-3 rounded-lg border ${
                                        selectedSlot?.id === slot.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                    } transition-colors`}
                                    onClick={() => setSelectedSlot(slot)}
                                >
                                    <div className="flex items-center gap-3">
                                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-gray-900">
                                                {slot.date.toLocaleDateString()} at {slot.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {slot.provider}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => selectedSlot && onConfirm(selectedSlot)}
                            disabled={!selectedSlot}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Confirm
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default SchedulingModal; 