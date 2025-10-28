
import Task from "../models/Tasks.js";

export const getAllTasks = async (req, res) => {
  const {filter = 'today'} = req.query;
  const now = new Date();
  let startDay;
  switch (filter) {
    case 'today':
      startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      break;
    case 'month':
      startDay = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'all':
      startDay = null;
      break;
    default:
      startDay = null;
  }
  const query = startDay ? { createdAt: { $gte: startDay } } : {};
  try {
    const result = await Task.aggregate([
      {$match: query},
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          pendingCount: [
            { $match: { status: "pending" } },
            { $count: "count" }
          ],
          completedCount: [
            { $match: { status: "completed" } },
            { $count: "count" }
          ]
        }
      }
    ]);
    const tasks = result[0].tasks;
    const pendingCount = result[0].pendingCount[0]?.count || 0;
    const completedCount = result[0].completedCount[0]?.count || 0;
    res.status(200).json({ tasks, pendingCount, completedCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const newTask = new Task({ title });
    await newTask.save();
    res.status(201).json({ message: "Task created", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

export const updateTask = async (req, res) => {
   try{
    const { title, status, completedAt } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, status, completedAt },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task updated", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
   }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};

