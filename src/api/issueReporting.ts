import axios from "axios";
import React from "react";
import { apiClient } from "../components/services/authService";
import { Issue } from "../components/Admin/IssueReporting";

export enum IssueStatus {
    Open = "Open",
    InProgress = "In Progress",
    Resolved = "Resolved",
    Closed = "Closed",
  }


export const fetchIssuesReported = async () => {
    //console.log("Fetching User by ID:", userId); // Log the lecturer ID for debugging
    try {
        const response = await apiClient.get(`/IssueReport`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

export const deleteIssue = async (issueId:number) => {
    //console.log("Fetching User by ID:", userId); // Log the lecturer ID for debugging
    try {
        await apiClient.delete(`/IssueReport/delete/${issueId}`);
        //return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};

export const updateIssue = async (issueId:number,issue:Issue) => {
    console.log("Updatig issue", issue,issue); // Log the lecturer ID for debugging
    try {
        await apiClient.put(`/IssueReport/${issueId}`, issue);
        //return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('An unexpected error occurred');
    }
};