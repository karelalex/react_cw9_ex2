import axios from 'axios'
import {SECRET_TOKEN} from "./secret";
const API_URL = 'https://api.github.com/repos/karelalex/react_cw9_ex2/issues'
axios.defaults.headers.common['Authorization'] = 'Basic '+ btoa('karelalex:' + SECRET_TOKEN)

export const getIssueList = () =>
    axios.get(API_URL, {params: {
        state: 'all'
        }}).then((res) => res.data)

export const getIssue = (issueNumber) =>
    axios.get(`${API_URL}/${issueNumber}`).then(res => res.data)

export const getIssueComments = (issueNumber) =>
    axios.get(`${API_URL}/${issueNumber}/comments`).then(res => res.data)

export const createIssue = (issueBody) =>
    axios.post(API_URL, issueBody)

export const updateIssue = (issueNumber, issueBody) =>
    axios.patch(`${API_URL}/${issueNumber}`, {
        ...issueBody,
        issue_number: issueNumber
    }).then(res => res.data)

export const addComment = (issueNumber, commentBody) =>
    axios.post(`${API_URL}/${issueNumber}/comments`, commentBody)
        .then(res => res.data)

export const closeIssue = (issueNumber) =>
    axios.patch(`${API_URL}/${issueNumber})`, {state: 'closed'})

export const lockIssue = (issueNumber) =>
    axios.put(`${API_URL}/${issueNumber}/lock`, {
        lockReason: 'resolved'
    })
