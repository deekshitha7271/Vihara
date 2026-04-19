import Link from 'next/link';
import { XCircle, ArrowLeft, Home } from 'lucide-react';

export default function BookingCancelPage() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className="bg-red-50 p-6 rounded-full">
                        <XCircle size={80} className="text-red-600" />
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Booking Cancelled</h1>
                    <p className="text-lg text-gray-600">
                        The checkout process was cancelled. No charges were made.
                    </p>
                </div>

                <div className="p-8 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                    <p className="text-gray-500 italic">
                        "Luxury is in the details, and the detail of this stay is still waiting for you."
                    </p>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                    <button 
                        onClick={() => window.history.back()}
                        className="bg-black text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
                    >
                        <ArrowLeft size={18} /> Go back to property
                    </button>
                    <Link 
                        href="/" 
                        className="text-gray-600 flex items-center justify-center gap-2 hover:text-black transition-colors"
                    >
                        <Home size={18} /> Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
