module.exports = (error, response) => {
  const { name, message } = error;

  if (name === 'ValidationError') response.status(400).json({ error: message });
  else response.status(500).json({ error: message });
};
