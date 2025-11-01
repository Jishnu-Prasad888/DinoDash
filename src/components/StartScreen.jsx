import React from "react";

const Popup = ({ onClose }) => {
    return (
        // Fullscreen dark overlay
        <div className="fixed inset-0 flex items-center justify-center z-50">

            {/* Popup box */}
            <div className="bg-white rounded-lg shadow-lg w-80 p-6 relative flex flex-col items-center">

                <h2 className="text-lg font-semibold mb-4">Popup Title</h2>
                <p className="text-gray-600 mb-8 text-center">
                    This is a simple popup with a button at the bottom.
                </p>

                {/* Button at the bottom middle */}
                <button
                    onClick={onClose}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Popup;
