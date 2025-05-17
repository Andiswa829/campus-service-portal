import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import {
  deleteIssue,
  fetchIssuesReported,
  IssueStatus,
  updateIssue,
} from "../../api/issueReporting";
import { Edit } from "@mui/icons-material";

export interface Issue {
 // id: number;
  issueId: number;
  title: string;
  description: string;
  reportedBy: string;
  reportedDate: Date;
  status: string;
  userId?: number;
  resolvedDate?: Date | null;
}

const IssueReportingDashboard: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewedIssue, setViewedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetchIssuesReported();
        setIssues(response.$values);
        console.log("Fetched Issues:", response.$values); // Log the fetched issues for debugging
      } catch (err) {
        console.error("Error fetching issues:", err);
        setError("Failed to fetch issues. Please try again later.");
      }
    };

    fetchIssues();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteIssue(id); // Replace with your API endpoint
      setIssues((prevIssues) => prevIssues.filter((issue) => issue.issueId !== id));
    } catch (err) {
      console.error("Error deleting issue:", err);
      setError("Failed to delete the issue. Please try again later.");
    }
  };

  const handleViewDetails = (issue: Issue) => {
    setViewedIssue(issue);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsUpdateDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (selectedIssue) {
      try {
        const updatedIssue:Issue = {
            issueId: selectedIssue.issueId,
            userId: selectedIssue.userId, // Replace with the actual user ID

            // IssueType: "Bug", // Replace with the actual issue type if applicable
            title: selectedIssue.title,
            description: selectedIssue.description,
            status: selectedIssue.status as IssueStatus,
            reportedDate: new Date(selectedIssue.reportedDate),
            resolvedDate: selectedIssue.status === "Resolved" ? new Date() : null,
            reportedBy: selectedIssue.reportedBy,
        };

        await updateIssue(selectedIssue.issueId, updatedIssue)
        //); // Replace with your API endpoint

        setIssues((prevIssues) =>
          prevIssues.map((issue) =>
            issue.issueId === selectedIssue.issueId ? { ...selectedIssue } : issue
          )
        );

        setIsUpdateDialogOpen(false);
      } catch (err) {
        console.error("Error updating issue:", err);
        setError("Failed to update the issue. Please try again later.");
      }
    }
  };

  return (
    <>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Reported Issues
        </Typography>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Reported By</TableCell>
                <TableCell>Date Reported</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.issueId}>
                  <TableCell>{issue.issueId}</TableCell>
                  <TableCell>{issue.title}</TableCell>
                  <TableCell>{issue.description}</TableCell>
                  <TableCell>{issue.reportedBy}</TableCell>
                  <TableCell>
                    {new Date(issue.reportedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{issue.status}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewDetails(issue)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(issue.issueId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      color="default"
                      onClick={() => handleEdit(issue)}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog
        open={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
      >
        <DialogTitle>Update Issue</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={selectedIssue?.title || ""}
            onChange={(e) =>
              setSelectedIssue((prev) =>
                prev ? { ...prev, title: e.target.value } : null
              )
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={selectedIssue?.description || ""}
            onChange={(e) =>
              setSelectedIssue((prev) =>
                prev ? { ...prev, description: e.target.value } : null
              )
            }
            fullWidth
            margin="normal"
          />
          <Typography variant="body1" gutterBottom>
            Status
          </Typography>
          <Select
            value={selectedIssue?.status || ""}
            onChange={(e) =>
              setSelectedIssue((prev) =>
                prev ? { ...prev, status: e.target.value as IssueStatus } : null
              )
            }
            fullWidth
          >
            {Object.values(IssueStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsUpdateDialogOpen(false)}
            color="secondary"
          >
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
      >
        <DialogTitle>Issue Details</DialogTitle>
        <DialogContent>
          {viewedIssue && (
            <>
              <Typography variant="h6" gutterBottom>
                {viewedIssue.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Description:</strong> {viewedIssue.description}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Reported By:</strong> {viewedIssue.reportedBy}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Date Reported:</strong>{" "}
                {new Date(viewedIssue.reportedDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Status:</strong> {viewedIssue.status}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IssueReportingDashboard;
