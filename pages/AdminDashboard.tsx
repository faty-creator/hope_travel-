
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Trip } from '../types';
import { Plus, Edit, Trash2, LogOut, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTrips(data || []);
        } catch (error) {
            console.error('Error fetching trips:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this trip?')) return;

        try {
            const { error } = await supabase
                .from('trips')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setTrips(trips.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting trip:', error);
            alert('Error deleting trip');
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-500">Welcome back, {user?.email}</p>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate('/admin/trips/new')}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Trip
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                            <LogOut className="h-5 w-5 mr-2" />
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading trips...</div>
                    ) : trips.length === 0 ? (
                        <div className="p-12 text-center">
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No trips</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new trip.</p>
                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/trips/new')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                >
                                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                    New Trip
                                </button>
                            </div>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {trips.map((trip) => (
                                <li key={trip.id}>
                                    <div className="px-4 py-4 flex items-center sm:px-6">
                                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-16 w-16">
                                                    <img
                                                        className="h-16 w-16 rounded object-cover"
                                                        src={trip.image}
                                                        alt={trip.title.en}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-medium text-yellow-600 truncate">{trip.title.en}</h3>
                                                    <div className="mt-1 flex text-sm text-gray-500">
                                                        <p className="mr-4">Price: {trip.price} MAD</p>
                                                        <p>Destination: {trip.destination}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-5 flex-shrink-0 flex space-x-2">
                                            <button
                                                onClick={() => navigate(`/admin/trips/${trip.id}/edit`)}
                                                className="p-2 text-gray-400 hover:text-gray-500"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(trip.id)}
                                                className="p-2 text-red-400 hover:text-red-500"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
