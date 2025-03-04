import React from "react";
import { FormControl, Select, MenuItem, FormHelperText } from "@mui/material";
import toast from "react-hot-toast";

const NetworkSelector = ({ selectedNetwork, setSelectedNetwork }) => {
  const handleChange = (event) => {
    if (event.target.value === 'mainnet') {
      toast.error("This application does not support betting on mainnet right now")
      return;
    }
    setSelectedNetwork('devnet');
  };

  return (
    <FormControl
      sx={{
        m: 1,
        minWidth: 150,
        bgcolor: "#1E1E1E", // Darker background for better contrast
        borderRadius: "8px",
      }}
    >
      <Select
        value={selectedNetwork}
        onChange={handleChange}
        displayEmpty
        sx={{
          color: "#FFFFFF",
          borderRadius: "8px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#424242", // Darker border
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#616161", // Medium gray on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2196F3", // Blue accent on focus
            borderWidth: "2px",
          },
          "& .MuiSelect-icon": {
            color: "#FFFFFF", // White dropdown icon
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: "#2D2D2D", // Dark dropdown background
              color: "#FFFFFF",
              marginTop: "4px",
              borderRadius: "8px",
              "& .MuiMenuItem-root": {
                padding: "10px 16px",
                "&:hover": {
                  bgcolor: "#383838", // Hover state
                },
                "&.Mui-selected": {
                  bgcolor: "#2196F3", // Selected state
                  "&:hover": {
                    bgcolor: "#42A5F5", // Hover on selected
                  },
                },
              },
            },
          },
        }}
        inputProps={{
          "aria-label": "Select Network",
        }}
      >
        <MenuItem value="" sx={{ color: "#9E9E9E" }}> {/* Placeholder */}
          Select Network
        </MenuItem>
        <MenuItem value="mainnet">Mainnet</MenuItem>
        <MenuItem value="devnet">Devnet</MenuItem>
      </Select>
      <FormHelperText sx={{ color: "#B0B0B0", ml: 0 }}> {/* Lighter text */}
        Select Solana Network
      </FormHelperText>
    </FormControl>
  );
};

export default NetworkSelector;
