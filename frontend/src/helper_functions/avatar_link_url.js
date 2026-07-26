// ✅ Keep styles global and clean
export const avatarStyles = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "4px solid #0d6efd", 
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  marginBottom: "15px",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto"
};


// Container style to vertically stack the image and the label text
export const avatarContainerStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "2px", // Tiny space between circle and "Profile" text
  cursor: "pointer"
};

// Fixed circle dimensions to seamlessly fit your nav bar space
export const avatarStylesMini = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid #0d6efd", // Reduced border size proportionally
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)"
};

// Clean styling for the "Profile" text underneath the circle
export const avatarLabelStyles = {
  fontSize: "11px",
  fontWeight: "500",
  color: "#a0aec0", // Light slate gray matching dark mode styling themes
  fontFamily: "sans-serif"
};


/**
 * Generates a dynamic placeholder avatar URL safely using any provided name string
 * @param {string} name - Name of the hostel roommate
 */
export const getAvatarUrl = (name="User",lastName=" ") => {
  console.log(name+lastName)
  // If name isn't loaded yet, fall back safely to a default generic text label
  const first = name?.[0] || "?";
  const last = lastName?.[0] || "";
  const displayName = (first + " " + last).trim();
  console.log(displayName)

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D6EFD&color=fff&rounded=true&size=150`;
};
