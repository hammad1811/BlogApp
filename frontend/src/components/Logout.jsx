import React, { useState } from 'react';
import axios from "axios";
import { logout } from "../store/features/authSlice.js";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLogOut } from 'react-icons/fi';

function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logoutUser = async () => {
        setIsLoggingOut(true);
        try {
            // First try to call the logout endpoint
            await axios.get(
                `${import.meta.env.VITE_PORT}/api/v1/user/logout`,
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            // If successful, update the UI state
            dispatch(logout());
            toast.success("Logged out successfully");
            navigate('/');
        } catch (error) {
            console.error("Logout failed:", error);
            
            // If we get a 401, the session might already be invalid
            if (error.response?.status === 401) {
                // Still clear the client-side state
                dispatch(logout());
                toast.info("Session already expired");
                navigate('/');
            } else {
                toast.error("Logout failed. Please try again.");
            }
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <button 
            className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 disabled:opacity-50" 
            onClick={logoutUser}
            disabled={isLoggingOut}
        >
            {isLoggingOut ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging out...
                </>
            ) : (
                <>
                    <FiLogOut className="mr-2" />
                    Logout
                </>
            )}
        </button>
    );
}

export default Logout;