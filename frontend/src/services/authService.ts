import api from './api';
import { jwtDecode } from 'jwt-decode';

export interface LoginCredentials {
username: string;
password: string;
}

export interface TokenResponse {
access: string;
refresh: string;
}

export interface User {
id: number;
username: string;
email: string;
first_name: string;
last_name: string;
role: string;
hospital: number | null;
employee_id: string | null;
department: number | null;
full_name: string;
status: string;
can_prescribe: boolean;
enable_opd: boolean;
enable_ipd: boolean;
enable_diagnostics: boolean;
enable_pharmacy: boolean;
enable_accounting: boolean;
}

export const authService = {
async login(credentials: LoginCredentials): Promise<{ user: User; tokens: TokenResponse }> {
const response = await api.post('/auth/token/', credentials);
const tokens = response.data;

localStorage.setItem('access_token', tokens.access);
localStorage.setItem('refresh_token', tokens.refresh);

const decoded: any = jwtDecode(tokens.access);
const user: User = {
id: decoded.user_id,
username: decoded.username,
email: decoded.email || '',
first_name: decoded.first_name || '',
last_name: decoded.last_name || '',
role: decoded.role,
hospital: decoded.hospital,
employee_id: decoded.employee_id,
department: decoded.department,
full_name: decoded.full_name || '',
status: decoded.status,
can_prescribe: decoded.can_prescribe,
enable_opd: decoded.enable_opd,
enable_ipd: decoded.enable_ipd,
enable_diagnostics: decoded.enable_diagnostics,
enable_pharmacy: decoded.enable_pharmacy,
enable_accounting: decoded.enable_accounting
};

return { user, tokens };
},

async refreshToken(): Promise<TokenResponse> {
const refreshToken = localStorage.getItem('refresh_token');
if (!refreshToken) {
throw new Error('No refresh token available');
}

const response = await api.post('/auth/token/refresh/', { refresh: refreshToken });
const tokens = response.data;

localStorage.setItem('access_token', tokens.access);
localStorage.setItem('refresh_token', tokens.refresh);

return tokens;
},

async logout(): Promise<void> {
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
},

getCurrentUser(): User | null {
const token = localStorage.getItem('access_token');
if (!token) return null;

try {
const decoded: any = jwtDecode(token);
return {
id: decoded.user_id,
username: decoded.username,
email: decoded.email || '',
first_name: decoded.first_name || '',
last_name: decoded.last_name || '',
role: decoded.role,
hospital: decoded.hospital,
employee_id: decoded.employee_id,
department: decoded.department,
full_name: decoded.full_name || '',
status: decoded.status,
can_prescribe: decoded.can_prescribe,
enable_opd: decoded.enable_opd,
enable_ipd: decoded.enable_ipd,
enable_diagnostics: decoded.enable_diagnostics,
enable_pharmacy: decoded.enable_pharmacy,
enable_accounting: decoded.enable_accounting
};
} catch {
return null;
}
},

isAuthenticated(): boolean {
const token = localStorage.getItem('access_token');
if (!token) return false;

try {
const decoded: any = jwtDecode(token);
return Date.now() < decoded.exp * 1000;
} catch {
return false;
}
},

getToken(): string | null {
return localStorage.getItem('access_token');
}
};
