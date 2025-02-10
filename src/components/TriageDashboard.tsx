// TriageDashboard.tsx
import React, { useState, useEffect } from 'react';
import PatientList from './PatientList';
import PatientDetailModal from './PatientDetailModal';
import { fetchPatients, updatePatientStatus } from '../services/api';
import { Patient, User } from '../types/PatientTypes';
import { 
    FunnelIcon, 
    ArrowPathIcon, 
    ChartBarIcon,
    UserGroupIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    UserCircleIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';

interface TriageDashboardProps {
    currentUser?: User;
}

interface SurgeonOption {
    id: string;
    name: string;
    role: 'SURGEON';
    email: string;
}

const TriageDashboard: React.FC<TriageDashboardProps> = ({ currentUser }) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        reviewStatus: 'all', // 'all' | 'needs-review' | 'reviewed'
        surgeryType: 'all',
        provider: 'all'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSurgeonView, setIsSurgeonView] = useState(currentUser?.role === 'SURGEON');
    const [selectedSurgeon, setSelectedSurgeon] = useState<SurgeonOption | null>(
        currentUser?.role === 'SURGEON' ? currentUser as SurgeonOption : null
    );

    const surgeons: SurgeonOption[] = [
        { id: '1', name: 'Dr. Smith', role: 'SURGEON', email: 'dr.smith@hospital.com' },
        { id: '2', name: 'Dr. Palmer', role: 'SURGEON', email: 'dr.palmer@hospital.com' },
        { id: '3', name: 'Dr. Wilson', role: 'SURGEON', email: 'dr.wilson@hospital.com' },
        { id: '4', name: 'Dr. Chen', role: 'SURGEON', email: 'dr.chen@hospital.com' }
    ];

    const loadPatients = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('🔄 Loading patients...');
            const data = await fetchPatients();
            console.log('📊 Loaded patients:', data.length);
            setPatients(data);
        } catch (error) {
            console.error('❌ Error in loadPatients:', error);
            setError(error instanceof Error ? error.message : 'Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPatients();
        const interval = setInterval(loadPatients, 3000000);
        return () => clearInterval(interval);
    }, []);

    const handlePatientClick = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPatient(null);
    };

    const handleStatusUpdate = async (status: string) => {
        if (!selectedPatient) return;
        try {
            await updatePatientStatus(selectedPatient.id, status);
            await loadPatients();
            setSelectedPatient(null);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    // Get unique values for filters
    const surgeryTypes = [...new Set(patients.map(p => p.surgeryType))];
    const providers = [...new Set(patients.map(p => p.assignedTo))];

    // Update the status options based on role
    const getStatusOptions = () => {
        if (isSurgeonView) {
            return [
                { value: 'all', label: 'All Statuses' },
                { value: 'READY_FOR_SURGEON', label: 'Ready for Review' },
                { value: 'SURGEON_APPROVED', label: 'Approved' },
                { value: 'SCHEDULED', label: 'Scheduled' }
            ];
        }
        return [
            { value: 'all', label: 'All Statuses' },
            { value: 'PENDING_MA_REVIEW', label: 'Pending MA Review' },
            { value: 'NEEDS_MORE_INFO', label: 'Needs More Info' },
            { value: 'READY_FOR_SURGEON', label: 'Ready for Surgeon' },
            { value: 'SURGEON_APPROVED', label: 'Surgeon Approved' },
            { value: 'SCHEDULED', label: 'Scheduled' }
        ];
    };

    // Update the filtering logic
    const filteredPatients = patients.filter(patient => {
        console.log('Filtering patient:', {
            name: patient.name,
            referringProvider: patient.referringProvider,
            selectedProvider: filters.provider,
            matches: filters.provider === 'all' || patient.referringProvider === filters.provider
        });

        const matchesReviewStatus = 
            filters.reviewStatus === 'all' || patient.reviewStatus === filters.reviewStatus;

        const matchesSurgeryType = 
            filters.surgeryType === 'all' || patient.surgeryType === filters.surgeryType;

        const matchesProvider = 
            filters.provider === 'all' || patient.referringProvider === filters.provider;

        const matchesSearch = searchTerm === '' || (
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.surgeryType.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return matchesReviewStatus && matchesSurgeryType && matchesProvider && matchesSearch;
    });

    // Calculate statistics
    const stats = {
        total: patients.length,
        needsReview: patients.filter(p => p.needsReview).length,
        reviewed: patients.filter(p => !p.needsReview).length
    };

    // Update the patient filtering logic based on view
    const getFilteredLists = () => {
        // Step 1: Apply surgeon filter first
        let filteredPatients = patients;
        if (filters.provider !== 'all') {
            filteredPatients = patients.filter(p => p.assignedTo === filters.provider);
            console.log(`Filtering for surgeon ${filters.provider}:`, filteredPatients.length);
        }

        // Step 2: Create lists by status
        const lists = {
            pendingMAReview: filteredPatients.filter(p => p.reviewStatus === 'PENDING_MA_REVIEW'),
            readyForSurgeon: filteredPatients.filter(p => p.reviewStatus === 'READY_FOR_SURGEON'),
            needsMoreInfo: filteredPatients.filter(p => p.reviewStatus === 'NEEDS_MORE_INFO'),
            surgeonApproved: filteredPatients.filter(p => p.reviewStatus === 'SURGEON_APPROVED'),
            scheduled: filteredPatients.filter(p => p.reviewStatus === 'SCHEDULED')
        };

        // Step 3: Additional document check for ready for surgeon
        lists.readyForSurgeon = lists.readyForSurgeon.filter(p => 
            p.requiredDocuments?.every(d => d.received)
        );

        // Debug logging
        console.log('=== Filtered Lists ===', {
            surgeon: filters.provider,
            total: filteredPatients.length,
            ready: lists.readyForSurgeon.length,
            pending: lists.pendingMAReview.length,
            needsInfo: lists.needsMoreInfo.length,
            approved: lists.surgeonApproved.length,
            scheduled: lists.scheduled.length
        });

        return lists;
    };

    const formatScheduledDate = (dateString: string | Date) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    // Update filters to match ReviewStatus type
    const pendingReview = patients?.filter(p => p.reviewStatus === 'PENDING_MA_REVIEW') ?? [];
    const readyForSurgeon = patients?.filter(p => p.reviewStatus === 'READY_FOR_SURGEON') ?? [];
    const needsMoreInfo = patients?.filter(p => p.reviewStatus === 'NEEDS_MORE_INFO') ?? [];
    const scheduled = patients?.filter(p => p.reviewStatus === 'SCHEDULED') ?? [];

    // Add type safety for dates
    const sortByDate = (a: Patient, b: Patient) => {
        const dateA = a.scheduledDate?.getTime() ?? 0;
        const dateB = b.scheduledDate?.getTime() ?? 0;
        return dateB - dateA;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading patients...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p className="text-xl font-semibold mb-2">Error loading patients</p>
                    <p className="text-gray-600">{error}</p>
                    <button 
                        onClick={loadPatients}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Surgical Triage
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <span className={`text-sm ${!isSurgeonView ? 'font-medium text-blue-600' : 'text-gray-500'}`}>
                                    MA View
                                </span>
                                <Switch
                                    checked={isSurgeonView}
                                    onChange={setIsSurgeonView}
                                    className={`${
                                        isSurgeonView ? 'bg-blue-600' : 'bg-gray-200'
                                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                >
                                    <span className="sr-only">Toggle view</span>
                                    <span
                                        className={`${
                                            isSurgeonView ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                    />
                                </Switch>
                                <span className={`text-sm ${isSurgeonView ? 'font-medium text-blue-600' : 'text-gray-500'}`}>
                                    Surgeon View
                                </span>
                            </div>
                            <div className="relative">
                                {currentUser?.role !== 'SURGEON' && (
                                    <select
                                        value={selectedSurgeon?.id || ''}
                                        onChange={(e) => {
                                            const surgeon = surgeons.find(s => s.id === e.target.value);
                                            setSelectedSurgeon(surgeon || null);
                                        }}
                                        className="appearance-none bg-white pl-3 pr-10 py-2 text-sm text-gray-700 rounded-md border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Surgeons</option>
                                        {surgeons.map(surgeon => (
                                            <option key={surgeon.id} value={surgeon.id}>
                                                {surgeon.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <UserCircleIcon className="h-5 w-5" />
                                <span>{currentUser?.name}</span>
                            </div>
                            <button 
                                onClick={loadPatients}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-blue-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <UserGroupIcon className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-blue-600">Total Patients</p>
                                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                                <p className="text-xs text-blue-500 mt-1">+12% from last week</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-sm p-6 border border-yellow-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <ClockIcon className="h-8 w-8 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-yellow-600">Needs Review</p>
                                <p className="text-2xl font-bold text-yellow-900">{stats.needsReview}</p>
                                <p className="text-xs text-yellow-500 mt-1">4 urgent cases</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm p-6 border border-green-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <ChartBarIcon className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-green-600">Reviewed</p>
                                <p className="text-2xl font-bold text-green-900">{stats.reviewed}</p>
                                <p className="text-xs text-green-500 mt-1">On track this week</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
                    <div className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Search patients..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <select
                                    className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                                    value={filters.reviewStatus}
                                    onChange={(e) => setFilters({...filters, reviewStatus: e.target.value})}
                                >
                                    {getStatusOptions().map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                
                                <select
                                    className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                                    value={filters.surgeryType}
                                    onChange={(e) => setFilters({...filters, surgeryType: e.target.value})}
                                >
                                    <option value="all">All Types</option>
                                    {surgeryTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patient Lists */}
                <div className="space-y-6">
                    {isSurgeonView ? (
                        // Surgeon View
                        <>
                            {getFilteredLists().readyForSurgeon?.length > 0 && (
                                <PatientList
                                    title="Ready for Review"
                                    patients={getFilteredLists().readyForSurgeon}
                                    onPatientSelect={handlePatientClick}
                                />
                            )}
                        </>
                    ) : (
                        // MA View
                        <>
                            {getFilteredLists().pendingMAReview?.length > 0 && (
                                <PatientList
                                    title="Pending MA Review"
                                    patients={getFilteredLists().pendingMAReview}
                                    onPatientSelect={handlePatientClick}
                                />
                            )}
                            {getFilteredLists().readyForSurgeon.length > 0 && (
                                <PatientList
                                    title="READY_FOR_SURGEON"
                                    patients={getFilteredLists().readyForSurgeon}
                                    onPatientSelect={handlePatientClick}
                                />
                            )}
                            {getFilteredLists().needsMoreInfo.length > 0 && (
                                <PatientList
                                    title="NEEDS_MORE_INFO"
                                    patients={getFilteredLists().needsMoreInfo}
                                    onPatientSelect={handlePatientClick}
                                />
                            )}
                            {getFilteredLists().surgeonApproved.length > 0 && (
                                <PatientList
                                    title="SURGEON_APPROVED"
                                    patients={getFilteredLists().surgeonApproved}
                                    onPatientSelect={handlePatientClick}
                                />
                            )}
                            {getFilteredLists().scheduled.length > 0 && (
                                <PatientList
                                    title="SCHEDULED"
                                    patients={getFilteredLists().scheduled}
                                    onPatientSelect={handlePatientClick}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modal */}
            {selectedPatient && (
                <PatientDetailModal
                    patient={selectedPatient}
                    currentUser={currentUser!}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onUpdateStatus={handleStatusUpdate}
                />
            )}
        </div>
    );
};

export default TriageDashboard;

