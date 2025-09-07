import api from './api';

export interface Appointment {
id: number;
patient: number;
doctor: number;
department: number;
scheduled_start: string;
scheduled_end: string;
status: string;
type: string;
reason: string;
notes: string;
created_at: string;
updated_at: string;
}

export const appointmentService = {
async getAll(): Promise<Appointment[]> {
const response = await api.get('/appointments/');
return response.data.results || response.data;
},

async getById(id: number): Promise<Appointment> {
const response = await api.get(`/appointments/${id}/`);
return response.data;
},

async create(appointment: Partial<Appointment>): Promise<Appointment> {
const response = await api.post('/appointments/', appointment);
return response.data;
},

async update(id: number, appointment: Partial<Appointment>): Promise<Appointment> {
const response = await api.patch(`/appointments/${id}/`, appointment);
return response.data;
},

async delete(id: number): Promise<void> {
await api.delete(`/appointments/${id}/`);
},

async getByPatient(patientId: number): Promise<Appointment[]> {
const response = await api.get('/appointments/', { params: { patient: patientId } });
return response.data.results || response.data;
},

async getByDoctor(doctorId: number): Promise<Appointment[]> {
const response = await api.get('/appointments/', { params: { doctor: doctorId } });
return response.data.results || response.data;
}
};
