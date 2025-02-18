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
    onPatientSelect: (patient: Patient | null) => void;
}

const TriageDashboard: React.FC<TriageDashboardProps> = ({ currentUser, onPatientSelect }) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        reviewStatus: 'all',
        surgeryType: 'all',
        provider: 'all'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSurgeonView, setIsSurgeonView] = useState(false);

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
        console.log('Opening patient modal:', {
            patientId: patient.id,
            patientName: patient.name,
            patientStatus: patient.reviewStatus,
            currentUser
        });
        setSelectedPatient(patient);
        setIsModalOpen(true);
        onPatientSelect(patient);
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

    // Replace the dynamic surgery types with a fixed list
    const surgeryTypes = [
        'Knee Replacement',
        'Hip Replacement',
        'Spinal Fusion',
        'Shoulder Surgery',
        'ACL Reconstruction'
    ];

    // Keep the providers dynamic
    const providers = [...new Set(patients.map(p => p.referringProvider))];

    // Update status options to show all statuses
    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'PENDING_MA_REVIEW', label: 'Pending MA Review' },
        { value: 'NEEDS_MORE_INFO', label: 'Needs More Info' },
        { value: 'READY_FOR_SURGEON', label: 'Ready for Surgeon' },
        { value: 'APPROVED_FOR_SCHEDULING', label: 'Approved for Scheduling' },
        { value: 'SCHEDULED', label: 'Scheduled' }
    ];

    // Single filtering function to be used everywhere
    const filterPatients = (patients: Patient[]) => {
        console.log('Starting filter with:', {
            currentFilters: filters,
            totalPatients: patients.length
        });

        const filtered = patients.filter(patient => {
            const matchesReviewStatus = filters.reviewStatus === 'all' || patient.reviewStatus === filters.reviewStatus;
            const matchesSurgeryType = filters.surgeryType === 'all' || patient.surgeryType === filters.surgeryType;
            const matchesProvider = filters.provider === 'all' || patient.referringProvider === filters.provider;
            const matchesSearch = !searchTerm || patient.name.toLowerCase().includes(searchTerm.toLowerCase());

            console.log('Patient filter check:', {
                patient: patient.name,
                patientSurgeryType: patient.surgeryType,
                filterSurgeryType: filters.surgeryType,
                matchesSurgeryType,
                matchesReviewStatus,
                matchesProvider,
                matchesSearch,
                overallMatch: matchesReviewStatus && matchesSurgeryType && matchesProvider && matchesSearch
            });

            return matchesReviewStatus && matchesSurgeryType && matchesProvider && matchesSearch;
        });

        console.log('Filter results:', {
            beforeCount: patients.length,
            afterCount: filtered.length,
            surgeryTypeFilter: filters.surgeryType
        });

        return filtered;
    };

    const getFilteredLists = () => {
        const filteredPatients = filterPatients(patients);
        
        // Helper function to sort by priority
        const sortByPriority = (patients: Patient[]) => {
            return [...patients].sort((a, b) => {
                // Sort by priority score (high to low)
                const scoreA = a.priorityScore || 0;
                const scoreB = b.priorityScore || 0;
                if (scoreB !== scoreA) {
                    return scoreB - scoreA;
                }
                // If scores are equal, sort by creation date (newest first)
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
        };
        
        // Filter and sort each list
        const pendingList = sortByPriority(
            filteredPatients.filter(p => p.reviewStatus === 'PENDING_MA_REVIEW')
        );
        const needsInfoList = sortByPriority(
            filteredPatients.filter(p => p.reviewStatus === 'NEEDS_MORE_INFO')
        );
        const readyList = sortByPriority(
            filteredPatients.filter(p => p.reviewStatus === 'READY_FOR_SURGEON')
        );
        const approvedList = sortByPriority(
            filteredPatients.filter(p => p.reviewStatus === 'APPROVED_FOR_SCHEDULING')
        );
        const scheduledList = sortByPriority(
            filteredPatients.filter(p => p.reviewStatus === 'SCHEDULED')
        );
        
        return {
            surgeon: filters.provider,
            total: filteredPatients.length,
            ready: readyList.length,
            pending: pendingList.length,
            needsInfo: needsInfoList.length,
            approved: approvedList.length,
            pendingList,
            readyList,
            needsInfoList,
            approvedList,
            scheduledList
        };
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
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-30 bg-blue-600 text-white shadow-md">
                {/* ... navbar content ... */}
            </nav>

            {/* Main Content - Add padding-right to account for AI Assistant */}
            <div className="pt-0 pr-96">
                <div className="container mx-auto">
                    {/* Header */}
                    <div className="bg-white border-b  sticky top-0 z-50">
                        <div className="px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 items-center justify-between">
                                <div className="flex items-center">
                                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        Surgical Triage
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <UserCircleIcon className="h-5 w-5" />
                                        <span>{currentUser?.name || 'Guest'}</span>
                                    </div>
                                    <button 
                                        onClick={loadPatients}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                                    >
                                        <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                                        Refresh
                                    </button>
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
                                        <p className="text-2xl font-bold text-blue-900">{patients.length}</p>
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
                                        <p className="text-2xl font-bold text-yellow-900">
                                            {patients.filter(p => 
                                                p.reviewStatus !== 'APPROVED_FOR_SCHEDULING' && 
                                                p.reviewStatus !== 'SCHEDULED'
                                            ).length}
                                        </p>
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
                                        <p className="text-2xl font-bold text-green-900">
                                            {patients.filter(p => 
                                                p.reviewStatus === 'APPROVED_FOR_SCHEDULING' || 
                                                p.reviewStatus === 'SCHEDULED'
                                            ).length}
                                        </p>
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
                                            {statusOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        
                                        <select
                                            className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                                            value={filters.surgeryType}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                console.log('Surgery type select changed:', {
                                                    oldValue: filters.surgeryType,
                                                    newValue,
                                                    availableTypes: surgeryTypes
                                                });
                                                setFilters(prev => {
                                                    const newFilters = {...prev, surgeryType: newValue};
                                                    console.log('Updated filters:', newFilters);
                                                    return newFilters;
                                                });
                                            }}
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
                                // Surgeon View - only show patients ready for surgeon review
                                <>
                                    {getFilteredLists().readyList?.length > 0 && (
                                        <PatientList
                                            title="Ready for Surgeon Review"
                                            patients={getFilteredLists().readyList}
                                            onPatientSelect={handlePatientClick}
                                        />
                                    )}
                                </>
                            ) : (
                                // MA View - show all other statuses
                                <>
                                    {getFilteredLists().pendingList?.length > 0 && (
                                        <PatientList
                                            title="Pending MA Review"
                                            patients={getFilteredLists().pendingList}
                                            onPatientSelect={handlePatientClick}
                                        />
                                    )}
                                    {getFilteredLists().needsInfoList.length > 0 && (
                                        <PatientList
                                            title="Needs More Info"
                                            patients={getFilteredLists().needsInfoList}
                                            onPatientSelect={handlePatientClick}
                                        />
                                    )}
                                    {getFilteredLists().approvedList?.length > 0 && (
                                        <PatientList
                                            title="Surgeon Reviewed"
                                            patients={getFilteredLists().approvedList}
                                            onPatientSelect={handlePatientClick}
                                        />
                                    )}
                                    {getFilteredLists().scheduledList?.length > 0 && (
                                        <PatientList
                                            title="Scheduled"
                                            patients={getFilteredLists().scheduledList}
                                            onPatientSelect={handlePatientClick}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Patient Detail Modal */}
            {selectedPatient && (
                <PatientDetailModal
                    patient={selectedPatient}
                    currentUser={currentUser || {
                        id: '1',
                        name: 'Default User',
                        role: 'MA',
                        email: 'default@example.com'
                    }}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onUpdateStatus={handleStatusUpdate}
                />
            )}
        </div>
    );
};

export default TriageDashboard;

