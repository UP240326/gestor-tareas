const BASE_URL = 'https://gestor-tareas-production-3a93.up.railway.app/api';

export const getTasks = async () => {
    const response = await fetch(`${BASE_URL}/tasks`);
    return response.json();
};

export const getTaskById = async (id: number) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}`);
    return response.json();
};

export const createTask = async (task: { title: string; description?: string }) => {
    const response = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
    return response.json();
};

export const updateTask = async (id: number, task: { title: string; description?: string }) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
    return response.json();
};

export const deleteTask = async (id: number) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
    });
    return response.json();
};

export const toggleTask = async (id: number) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}/toggle`, {
        method: 'PATCH'
    });
    return response.json();
};