'use client'
import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 720,
  maxWidth: "95%",
  background: "#111827",
  borderRadius: "22px",
  boxShadow: 24,
  padding: "60px 40px",
  textAlign: "center",
};

export default function ReusableModal({ open, children }) {

  return (
    <Modal
      open={open}
      disableEscapeKeyDown
      onClose={() => {}} // ❌ cannot close outside click
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(18px)",
            backgroundColor: "rgba(0,0,0,0.65)",
          },
        },
      }}
    >
      <Box sx={style}>
        {children}
      </Box>
    </Modal>
  );
}