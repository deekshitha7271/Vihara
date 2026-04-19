'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Home, Loader2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookingSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [error, setError] = useState('');
    const hasConfirmed = useRef(false);

    useEffect(() => {
        if (!sessionId) {
            setStatus('error');
            setError('Missing session details.');
            return;
        }

        if (hasConfirmed.current) return;
        hasConfirmed.current = true;

        const confirmBooking = async () => {
            try {
                const res = await fetch('/api/stripe/confirm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ session_id: sessionId }),
                });

                const data = await res.json();

                if (res.ok) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    setError(data.message || 'Failed to confirm booking.');
                }
            } catch (err) {
                console.error('Confirmation error:', err);
                setStatus('error');
                setError('An unexpected error occurred.');
            }
        };

        confirmBooking();
    }, [sessionId]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
            <AnimatePresence mode="wait">
                {status === 'verifying' && (
                    <motion.div 
                        key="verifying"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-4"
                    >
                        <Loader2 className="w-12 h-12 text-black animate-spin mx-auto" />
                        <h2 className="text-2xl font-semibold">Verifying your payment...</h2>
                        <p className="text-gray-500">Please don't close this page.</p>
                    </motion.div>
                )}

                {status === 'success' && (
                    <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full text-center space-y-8"
                    >
                        <div className="flex justify-center">
                            <div className="bg-green-50 p-6 rounded-full">
                                <CheckCircle size={80} className="text-green-600" />
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Booking Confirmed!</h1>
                            <p className="text-lg text-gray-600">
                                Your luxury retreat at Vihara is now secured. We've notified the host of your arrival.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left space-y-4">
                            <div className="flex items-center gap-3 text-gray-700 font-medium">
                                <CheckCircle size={18} className="text-green-500" />
                                <span>Instant payment successful</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <CheckCircle size={18} className="text-green-500" />
                                <span>Reservation synchronized</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <CheckCircle size={18} className="text-green-500" />
                                <span>Check-in ready for selection</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 pt-4">
                            <Link 
                                href="/host/bookings" 
                                className="bg-black text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
                            >
                                View your bookings <ArrowRight size={18} />
                            </Link>
                            <Link 
                                href="/" 
                                className="text-gray-600 flex items-center justify-center gap-2 hover:text-black transition-colors"
                            >
                                <Home size={18} /> Back to home
                            </Link>
                        </div>
                    </motion.div>
                )}

                {status === 'error' && (
                    <motion.div 
                        key="error"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md w-full text-center space-y-6"
                    >
                        <div className="flex justify-center">
                            <div className="bg-red-50 p-6 rounded-full">
                                <XCircle size={80} className="text-red-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold">Something went wrong</h2>
                        <p className="text-gray-600">{error || "We couldn't confirm your booking. Please contact support."}</p>
                        <button 
                            onClick={() => router.push('/')}
                            className="bg-black text-white px-8 py-3 rounded-lg font-medium mx-auto block"
                        >
                            Return Home
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
