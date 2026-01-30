
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Trip } from '../types';
import { Save, ArrowLeft, Plus, Trash, Upload, X } from 'lucide-react';

const initialTrip: Omit<Trip, 'id'> = {
    price: 0,
    destination: '',
    image: '',
    title: { fr: '', ar: '', en: '' },
    duration: { fr: '', ar: '', en: '' },
    description: { fr: '', ar: '', en: '' },
    program: [],
    included: [],
    not_included: [],
    departure: '',
    departure_location: { fr: '', ar: '', en: '' },
    arrival_location: { fr: '', ar: '', en: '' },
    map_embed: '',
    price_currency: 'MAD',
    duration_value: 1,
};

const AdminTripForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!id);
    const [trip, setTrip] = useState<Omit<Trip, 'id'>>({ ...initialTrip });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (id) {
            fetchTrip(id);
        }
    }, [id]);

    const fetchTrip = async (tripId: string) => {
        try {
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .eq('id', tripId)
                .single();

            if (error) throw error;

            // Ensure arrays exist
            setTrip({
                ...data,
                program: data.program || [],
                included: data.included || [],
                not_included: data.not_included || [],
                departure_location: data.departure_location || { fr: '', ar: '', en: '' },
                arrival_location: data.arrival_location || { fr: '', ar: '', en: '' },
                map_embed: data.map_embed || '',
                price_currency: data.price_currency || 'MAD',
                duration_value: data.duration_value || 1,
            });
        } catch (error) {
            console.error('Error fetching trip:', error);
            alert('Error loading trip');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (field: keyof Trip, value: any) => {
        setTrip(prev => ({ ...prev, [field]: value }));
    };

    const handleLangChange = (field: 'title' | 'duration' | 'description', lang: 'fr' | 'ar' | 'en', value: string) => {
        setTrip(prev => ({
            ...prev,
            [field]: { ...prev[field], [lang]: value }
        }));
    };

    const handleLocationChange = (lang: 'fr' | 'ar' | 'en', value: string) => {
        setTrip(prev => ({
            ...prev,
            departure_location: { ...prev.departure_location, [lang]: value }
        }));
    };

    const handleArrivalChange = (lang: 'fr' | 'ar' | 'en', value: string) => {
        setTrip(prev => ({
            ...prev,
            arrival_location: { ...prev.arrival_location, [lang]: value }
        }));
    };

    // Program Management
    const addProgramDay = () => {
        setTrip(prev => ({
            ...prev,
            program: [
                ...prev.program,
                {
                    day: prev.program.length + 1,
                    title: { fr: '', ar: '', en: '' },
                    desc: { fr: '', ar: '', en: '' }
                }
            ]
        }));
    };

    const removeProgramDay = (index: number) => {
        setTrip(prev => ({
            ...prev,
            program: prev.program.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }))
        }));
    };

    const handleProgramChange = (index: number, field: 'title' | 'desc', lang: 'fr' | 'ar' | 'en', value: string) => {
        setTrip(prev => {
            const newProgram = [...prev.program];
            newProgram[index] = {
                ...newProgram[index],
                [field]: {
                    ...newProgram[index][field],
                    [lang]: value
                }
            };
            return { ...prev, program: newProgram };
        });
    };

    // List Management (Included/Not Included)
    const addListItem = (field: 'included' | 'not_included') => {
        setTrip(prev => ({
            ...prev,
            [field]: [...prev[field], { fr: '', ar: '', en: '' }]
        }));
    };

    const removeListItem = (field: 'included' | 'not_included', index: number) => {
        setTrip(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleListItemChange = (field: 'included' | 'not_included', index: number, lang: 'fr' | 'ar' | 'en', value: string) => {
        setTrip(prev => {
            const newList = [...prev[field]];
            newList[index] = { ...newList[index], [lang]: value };
            return { ...prev, [field]: newList };
        });
    };

    const handleImageUpload = async () => {
        if (!imageFile) return trip.image;

        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('trip-images')
            .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('trip-images').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const imageUrl = await handleImageUpload();
            const tripData = { ...trip, image: imageUrl };

            if (id) {
                const { error } = await supabase
                    .from('trips')
                    .update(tripData)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('trips')
                    .insert([tripData]);
                if (error) throw error;
            }

            navigate('/admin');
        } catch (error: any) {
            console.error('Error saving trip:', error);
            alert(`Error saving trip: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <button onClick={() => navigate('/admin')} className="mr-4 text-gray-400 hover:text-gray-500">
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">{id ? 'Edit Trip' : 'New Trip'}</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white shadow rounded-lg p-6 space-y-6">
                        <h2 className="text-lg font-medium text-gray-900">Basic Info</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Destination</label>
                                <input
                                    type="text"
                                    required
                                    value={trip.destination}
                                    onChange={e => handleChange('destination', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <div className="flex space-x-2 mt-1">
                                    <input
                                        type="number"
                                        required
                                        value={trip.price}
                                        onChange={e => handleChange('price', Number(e.target.value))}
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 flex-grow"
                                    />
                                    <select
                                        value={trip.price_currency || 'MAD'}
                                        onChange={e => handleChange('price_currency', e.target.value)}
                                        className="block w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white"
                                    >
                                        <option value="MAD">MAD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Departure Date</label>
                                <input
                                    type="datetime-local"
                                    value={trip.departure ? new Date(trip.departure).toISOString().slice(0, 16) : ''}
                                    onChange={e => handleChange('departure', new Date(e.target.value).toISOString())}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                <div className="mt-1 flex items-center space-x-4">
                                    {trip.image && <img src={trip.image} alt="Preview" className="h-20 w-20 object-cover rounded" />}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setImageFile(e.target.files?.[0] || null)}
                                        className="block w-full text-sm text-gray-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Localized Title/Desc */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['fr', 'en', 'ar'].map((lang: any) => (
                                <div key={lang} className="space-y-3 p-4 border rounded-md bg-gray-50">
                                    <h4 className="font-semibold uppercase text-gray-500 text-xs">{lang}</h4>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={(trip.title as any)[lang]}
                                            onChange={e => handleLangChange('title', lang, e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Description</label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={(trip.description as any)[lang]}
                                            onChange={e => handleLangChange('description', lang, e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <h3 className="font-semibold text-gray-700 mb-2">Duration (Days)</h3>
                            <input
                                type="number"
                                min="1"
                                required
                                value={trip.duration_value || 1}
                                onChange={e => handleChange('duration_value', parseInt(e.target.value))}
                                className="mt-1 block w-full md:w-1/3 border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            />
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-gray-700 mb-2">Departure Location</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                {['fr', 'en', 'ar'].map((lang: any) => (
                                    <div key={lang}>
                                        <label className="block text-xs font-medium text-gray-700 uppercase">{lang}</label>
                                        <input
                                            type="text"
                                            required
                                            value={(trip.departure_location as any)[lang]}
                                            onChange={e => handleLocationChange(lang, e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm"
                                        />
                                    </div>
                                ))}
                            </div>

                            <h3 className="font-semibold text-gray-700 mb-2">Arrival Location</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                {['fr', 'en', 'ar'].map((lang: any) => (
                                    <div key={lang}>
                                        <label className="block text-xs font-medium text-gray-700 uppercase">{lang}</label>
                                        <input
                                            type="text"
                                            value={(trip.arrival_location as any)[lang]}
                                            onChange={e => handleArrivalChange(lang, e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-gray-700">Google Maps Embed Code</h3>
                                <a
                                    href="https://www.google.com/maps"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 flex items-center transition"
                                >
                                    Open Google Maps ↗
                                </a>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">Go to Google Maps &rarr; Select Route &rarr; Share &rarr; Embed a map &rarr; Copy HTML</p>
                            <textarea
                                rows={3}
                                value={trip.map_embed || ''}
                                onChange={e => handleChange('map_embed', e.target.value)}
                                placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm font-mono"
                            />
                        </div>
                    </div>

                    {/* Program Itinerary */}
                    <div className="bg-white shadow rounded-lg p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900">Program Itinerary</h2>
                            <button type="button" onClick={addProgramDay} className="text-sm text-yellow-600 font-medium hover:text-yellow-500 flex items-center">
                                <Plus className="h-4 w-4 mr-1" /> Add Day
                            </button>
                        </div>
                        <div className="space-y-4">
                            {trip.program.map((day, idx) => (
                                <div key={idx} className="border rounded-md p-4 relative">
                                    <button type="button" onClick={() => removeProgramDay(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-500">
                                        <X className="h-5 w-5" />
                                    </button>
                                    <h3 className="font-medium text-gray-900 mb-2">Day {day.day}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {['fr', 'en', 'ar'].map((lang: any) => (
                                            <div key={lang} className="space-y-2">
                                                <input
                                                    type="text"
                                                    placeholder={`${lang} Title`}
                                                    value={(day.title as any)[lang]}
                                                    onChange={e => handleProgramChange(idx, 'title', lang, e.target.value)}
                                                    className="block w-full text-sm border-gray-300 rounded-md"
                                                />
                                                <textarea
                                                    rows={2}
                                                    placeholder={`${lang} Description`}
                                                    value={(day.desc as any)[lang]}
                                                    onChange={e => handleProgramChange(idx, 'desc', lang, e.target.value)}
                                                    className="block w-full text-sm border-gray-300 rounded-md"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Included / Not Included */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900">Included</h2>
                                <button type="button" onClick={() => addListItem('included')} className="text-sm text-green-600 font-medium hover:text-green-500">
                                    <Plus className="h-4 w-4" /> Add
                                </button>
                            </div>
                            <ul className="space-y-3">
                                {trip.included.map((item, idx) => (
                                    <li key={idx} className="flex items-start space-x-2">
                                        <div className="flex-grow grid grid-cols-3 gap-2">
                                            {['fr', 'en', 'ar'].map((lang: any) => (
                                                <input
                                                    key={lang}
                                                    type="text"
                                                    placeholder={lang}
                                                    value={(item as any)[lang]}
                                                    onChange={e => handleListItemChange('included', idx, lang, e.target.value)}
                                                    className="block w-full text-xs border-gray-300 rounded-md"
                                                />
                                            ))}
                                        </div>
                                        <button type="button" onClick={() => removeListItem('included', idx)} className="text-red-400 hover:text-red-500">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900">Not Included</h2>
                                <button type="button" onClick={() => addListItem('not_included')} className="text-sm text-red-600 font-medium hover:text-red-500">
                                    <Plus className="h-4 w-4" /> Add
                                </button>
                            </div>
                            <ul className="space-y-3">
                                {trip.not_included.map((item, idx) => (
                                    <li key={idx} className="flex items-start space-x-2">
                                        <div className="flex-grow grid grid-cols-3 gap-2">
                                            {['fr', 'en', 'ar'].map((lang: any) => (
                                                <input
                                                    key={lang}
                                                    type="text"
                                                    placeholder={lang}
                                                    value={(item as any)[lang]}
                                                    onChange={e => handleListItemChange('not_included', idx, lang, e.target.value)}
                                                    className="block w-full text-xs border-gray-300 rounded-md"
                                                />
                                            ))}
                                        </div>
                                        <button type="button" onClick={() => removeListItem('not_included', idx)} className="text-red-400 hover:text-red-500">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex justify-end pt-5">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                        >
                            <Save className="h-5 w-5 mr-2" />
                            {loading ? 'Saving...' : 'Save Trip'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default AdminTripForm;
