import { Request, Response } from 'express';
import * as TaskModel from '../models/taskModel';

export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const tasks = await TaskModel.getAllTasks();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await TaskModel.getTaskById(Number(req.params.id));
        if (!task) {
            res.status(404).json({ message: 'Tarea no encontrada' });
            return;
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la tarea' });
    }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await TaskModel.createTask(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la tarea' });
    }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await TaskModel.updateTask(Number(req.params.id), req.body);
        if (!task) {
            res.status(404).json({ message: 'Tarea no encontrada' });
            return;
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la tarea' });
    }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const deleted = await TaskModel.deleteTask(Number(req.params.id));
        if (!deleted) {
            res.status(404).json({ message: 'Tarea no encontrada' });
            return;
        }
        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
};

export const toggleTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await TaskModel.toggleTask(Number(req.params.id));
        if (!task) {
            res.status(404).json({ message: 'Tarea no encontrada' });
            return;
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error al hacer toggle de la tarea' });
    }
};