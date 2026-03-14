import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
})

export default api

// Portfolio
export const getPortfolio = () => api.get('/portfolio')
export const getMeta = () => api.get('/portfolio/meta')
export const updateMeta = (data) => api.put('/portfolio/meta', data)

// Skills
export const getSkills = () => api.get('/portfolio/skills')
export const createSkill = (data) => api.post('/portfolio/skills', data)
export const updateSkill = (id, data) => api.put(`/portfolio/skills/${id}`, data)
export const deleteSkill = (id) => api.delete(`/portfolio/skills/${id}`)

// Experience
export const getExperience = () => api.get('/portfolio/experience')
export const createExperience = (data) => api.post('/portfolio/experience', data)
export const updateExperience = (id, data) => api.put(`/portfolio/experience/${id}`, data)
export const deleteExperience = (id) => api.delete(`/portfolio/experience/${id}`)

// Projects
export const getProjects = () => api.get('/portfolio/projects')
export const createProject = (data) => api.post('/portfolio/projects', data)
export const updateProject = (id, data) => api.put(`/portfolio/projects/${id}`, data)
export const deleteProject = (id) => api.delete(`/portfolio/projects/${id}`)

// Education
export const getEducation = () => api.get('/portfolio/education')
export const createEducation = (data) => api.post('/portfolio/education', data)
export const updateEducation = (id, data) => api.put(`/portfolio/education/${id}`, data)
export const deleteEducation = (id) => api.delete(`/portfolio/education/${id}`)

// Certifications
export const getCertifications = () => api.get('/portfolio/certifications')
export const createCertification = (data) => api.post('/portfolio/certifications', data)
export const updateCertification = (id, data) => api.put(`/portfolio/certifications/${id}`, data)
export const deleteCertification = (id) => api.delete(`/portfolio/certifications/${id}`)

// Resume upload
export const uploadResume = (formData, onProgress) =>
  api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
  })

// Resume download
export const getResumeDownloadUrl = () => '/api/resume/download'
export const checkResumeExists = () => api.get('/resume/download').catch(() => null)
