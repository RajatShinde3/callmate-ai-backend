import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory storage for demo purposes
let calls = [
  {
    id: uuidv4(),
    phoneNumber: '+1234567890',
    duration: 300,
    status: 'completed',
    transcript: 'Hello, this is a sample call transcript.',
    aiSummary: 'Customer called about product inquiry.',
    timestamp: new Date().toISOString()
  }
];

// Get all calls with pagination and optional filtering
router.get('/', (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  let filteredCalls = calls;
  if (status) {
    filteredCalls = calls.filter(call => call.status === status);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedCalls = filteredCalls.slice(startIndex, endIndex);

  res.json({
    calls: paginatedCalls,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredCalls.length,
      totalPages: Math.ceil(filteredCalls.length / limit)
    }
  });
});

// Get a specific call by ID
router.get('/:id', (req, res) => {
  const call = calls.find(c => c.id === req.params.id);

  if (!call) {
    return res.status(404).json({
      error: 'Call not found',
      message: `Call with ID ${req.params.id} does not exist`
    });
  }

  res.json(call);
});

// Create a new call
router.post('/', (req, res) => {
  const { phoneNumber, duration, transcript } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'phoneNumber is required'
    });
  }

  const newCall = {
    id: uuidv4(),
    phoneNumber,
    duration: duration || 0,
    status: 'in-progress',
    transcript: transcript || '',
    aiSummary: '',
    timestamp: new Date().toISOString()
  };

  calls.push(newCall);

  res.status(201).json({
    message: 'Call created successfully',
    call: newCall
  });
});

// Update a call
router.put('/:id', (req, res) => {
  const callIndex = calls.findIndex(c => c.id === req.params.id);

  if (callIndex === -1) {
    return res.status(404).json({
      error: 'Call not found',
      message: `Call with ID ${req.params.id} does not exist`
    });
  }

  calls[callIndex] = {
    ...calls[callIndex],
    ...req.body,
    id: calls[callIndex].id, // Ensure ID stays the same
    updatedAt: new Date().toISOString()
  };

  res.json({
    message: 'Call updated successfully',
    call: calls[callIndex]
  });
});

// Delete a call
router.delete('/:id', (req, res) => {
  const callIndex = calls.findIndex(c => c.id === req.params.id);

  if (callIndex === -1) {
    return res.status(404).json({
      error: 'Call not found',
      message: `Call with ID ${req.params.id} does not exist`
    });
  }

  calls.splice(callIndex, 1);

  res.json({
    message: 'Call deleted successfully'
  });
});

export default router;
