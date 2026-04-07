import pool from '../db/connection';

export interface Task {
    id?: number;
    title: string;
    description?: string;
    completed?: boolean;
    created_at?: Date;
}

export const getAllTasks = async (): Promise<Task[]> => {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    return result.rows;
};

export const getTaskById = async (id: number): Promise<Task | null> => {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0] || null;
};

export const createTask = async (task: Task): Promise<Task> => {
    const { title, description } = task;
    const result = await pool.query(
        'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
        [title, description]
    );
    return result.rows[0];
};

export const updateTask = async (id: number, task: Task): Promise<Task | null> => {
    const { title, description } = task;
    const result = await pool.query(
        'UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *',
        [title, description, id]
    );
    return result.rows[0] || null;
};

export const deleteTask = async (id: number): Promise<boolean> => {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
};

export const toggleTask = async (id: number): Promise<Task | null> => {
    const result = await pool.query(
        'UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0] || null;
};