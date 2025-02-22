import React, { useContext } from 'react';
import { AppContext } from '../store/appContext';


const LandingPage: React.FC = () => {
    const { state, actions } = useContext(AppContext);

    return (
        <div>
            {state.token != null ? (
                <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center max-w-md mx-auto">
                <h1 className="text-2xl font-semibold text-gray-800">Hello, {state.username}</h1>
                <h1 className="text-sm text-gray-600 break-words mt-2">{state.token}</h1>
                <h1 className="text-lg text-gray-700 mt-2">{state.email}</h1>
                </div>
            
            ) : (
            <div className="flex items-center justify-center min-h-screen bg-gray-100"> 
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
                        Welcome to APP_NAME!
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Log in or create an account to start sharing your thoughts.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <a href="/login">
                            <button className="bg-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-600 transition-all">
                                Login
                            </button>
                        </a>
                        <a href="/register">
                            <button className="bg-white text-green-500 font-bold py-3 px-8 rounded-lg border border-green-500 hover:bg-green-500 hover:text-white transition-all">
                                Register
                            </button>
                        </a>
                    </div>
                </div>
                
            </div>
            )}
        </div>
    );
};

export default LandingPage;