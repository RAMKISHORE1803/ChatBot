export const containerStyle = {
  boxSizing: "border-box",
  maxWidth: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const rightDiv = {
  backgroundColor: "black",
  paddingLeft: "40px",
  boxSizing: "border-box",
  width: "50vw",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  scrollbarWidth: "thin", // For Firefox
  scrollbarColor: "red black", // For Firefox

  "&::-webkit-scrollbar": {
    width: "12px", // Adjust the width as needed
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "blue", // Adjust the color as needed
    borderRadius: "6px", // To round the corners of the thumb
  },
};

export const leftDiv = {
  boxSizing: "border-box",
  backgroundColor: "white",
  width: "50vw",
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  maxHeight: "100vh",
  overflow: "scroll",
  padding: "20px",
};

export const inputStyle = {
  padding: "20px",
  border: "1px solid #61dafb",
  borderRadius: "40px",
  outline: "none",
  resize: "none",
  width: "90%", // Full width
  fontFamily: "Roboto Mono",
  fontSize: "18px",
};

export const responseStyle = {
  padding: "10px",
  backgroundColor: "black",
  color: "white",
  border: "2px solid #61dafb",
  borderRadius: "10px",
  outline: "none",
  resize: "none",
  width: "90%", // Full width
  fontFamily: "Roboto Mono",
  fontSize: "15px",
};

export const buttonStyle = {
  padding: "10px",
  borderRadius: "5px",
  backgroundColor: "#61dafb",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  margin: "5px",
};
