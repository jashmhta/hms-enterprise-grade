import api from './api';

export interface Doctor {
id: number;
user: number;
first_name: string;
last_name: string;
specialization: string;
license_number: string;
phone: string;
email: string;
active: boolean;
created_at: string;
updated_at: string;
}

export const doctorService = {
async getAll(): Promise<Doctor[]> {
const response = await api.get('/doctors/');
return response.data.results || response.data;
},

async getById(id: number): Promise<Doctor> {
const response = await api.get(`/doctors/${id}/`);
return response.data;
},

async search(query: string): Promise<Doctor[]> {
const response = await api.get('/doctors/', { params: { search: query } });
return response.data.results || response.data;
}
};
