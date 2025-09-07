import { useState, useEffect } from 'react';
import { authService, User } from '../services/authService';

export const useAuth = () => {
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const currentUser = authService.getCurrentUser();
setUser(currentUser);
setLoading(false);
}, []);

const login = async (credentials: any) => {
setLoading(true);
try {
const { user: loggedInUser } = await authService.login(credentials);
setUser(loggedInUser);
return loggedInUser;
} finally {
setLoading(false);
}
};

const logout = async () => {
setLoading(true);
try {
await authService.logout();
setUser(null);
} finally {
setLoading(false);
}
};

return {
user,
loading,
login,
logout,
isAuthenticated: authService.isAuthenticated()
};
};
