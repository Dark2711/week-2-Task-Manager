import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },
  type: {
    type: String,
    enum: ['personal', 'shopping', 'work', 'health'],
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: 'User',
    required: true,
  },
  completed: {
    type: Boolean,
    default: false, // Defaults to false, meaning the task is not done initially
  },
});

export const Task = mongoose.model('Task', taskSchema);
