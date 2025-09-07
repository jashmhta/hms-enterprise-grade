import api from './api';

export interface Patient {
id: number;
uuid: string;
first_name: string;
last_name: string;
date_of_birth: string;
gender: string;
phone: string;
email: string;
address: string;
emergency_contact: string;
insurance_provider: string;
insurance_number: string;
active: boolean;
created_at: string;
updated_at: string;
}

export const patientService = {
async getAll(): Promise<Patient[]> {
const response = await api.get('/patients/');
return response.data.results || response.data;
},

async getById(id: number): Promise<Patient> {
const response = await api.get(`/patients/${id}/`);
return response.data;
},

async create(patient: Partial<Patient>): Promise<Patient> {
const response = await api.post('/patients/', patient);
return response.data;
},

async update(id: number, patient: Partial<Patient>): Promise<Patient> {
const response = await api.patch(`/patients/${id}/`, patient);
return response.data;
},

async delete(id: number): Promise<void> {
await api.delete(`/patients/${id}/`);
},

async search(query: string): Promise<Patient[]> {
const response = await api.get('/patients/', { params: { search: query } });
return response.data.results || response.data;
}
};
