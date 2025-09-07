import api from './api';

export interface Department {
id: number;
name: string;
description: string;
head_doctor: number;
active: boolean;
created_at: string;
updated_at: string;
}

export const departmentService = {
async getAll(): Promise<Department[]> {
const response = await api.get('/departments/');
return response.data.results || response.data;
},

async getById(id: number): Promise<Department> {
const response = await api.get(`/departments/${id}/`);
return response.data;
}
};
