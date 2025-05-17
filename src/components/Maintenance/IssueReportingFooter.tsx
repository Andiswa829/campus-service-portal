import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";

interface IssueReportingFooterProps {
    userId: number;
  }

  const IssueReportingFooter: React.FC<IssueReportingFooterProps> = ({ userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issueData, setIssueData] = useState({
    title: "",
    description: "",
    issueType: "",
    status: "Open",
    reportedDate: new Date().toISOString().split("T")[0],
    resolvedDate: "",
    userId: userId || null,
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setIssueData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Issue submitted:", issueData);
    // TODO: Send to API
    setIsModalOpen(false);
  };

  return (
    <>
      <Box
        component="footer"
        sx={{
          backgroundColor: "#f5f5f5",
          padding: "1rem",
          textAlign: "center",
          borderTop: "1px solid #ddd",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          &copy; {new Date().getFullYear()} Campus Service Portal. All rights reserved.
        </Typography>
        <Button variant="text" onClick={() => setIsModalOpen(true)}>
          Report an Issue
        </Button>
      </Box>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Report an Issue</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={issueData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={issueData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <TextField
            label="Issue Type"
            name="issueType"
            value={issueData.issueType}
            onChange={handleChange}
            fullWidth
            margin="normal"
            select
          >
            <MenuItem value="Bug">Bug</MenuItem>
            <MenuItem value="Feature Request">Feature Request</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IssueReportingFooter;
