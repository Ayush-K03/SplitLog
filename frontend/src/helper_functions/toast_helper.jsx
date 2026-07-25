import { toast } from 'react-toastify';


export const showNotification = (type, message, statusCode = null) => {
  
  // 1. Core Rule: Auto-format message strings based on server status codes
  let clearMessage = message;
  
  if (statusCode) {
    if (statusCode === 401) clearMessage = "🔒 Session expired. Please log in again.";
    else if (statusCode === 403) clearMessage = "🚫 You do not have permission to modify this ledger.";
    else if (statusCode === 404) clearMessage = "🔍 Requested item or room could not be found.";
    else if (statusCode >= 500) clearMessage = "💥 Server error. Please try again later.";
  }

  // 2. Core Rule: Global configuration defaults
  const options = {
    position: "top-right",
    autoClose: type === 'loading' ? false : 3000, // Loading blocks stay open until resolved
    closeOnClick: type !== 'loading',
    draggable: type !== 'loading',
    pauseOnHover: true,
  };

  // 3. Core Rule: Execute specific toast methods dynamically
  switch (type) {
    case 'success':
      return toast.success(clearMessage, options);
    case 'error':
      return toast.error(clearMessage, options);
    case 'loading':
      return toast.loading(clearMessage, options);
    default:
      return toast(clearMessage, options);
  }
};

/**
 * Utility to switch an active loading spinner into a resolved success/error toast
 */
export const resolveLoadingNotification = (toastId, finalType, finalMessage) => {
  toast.update(toastId, {
    render: finalMessage,
    type: finalType, // 'success' or 'error'
    isLoading: false,
    autoClose: 3000,
    closeOnClick: true,
    draggable: true
  });
};
