export const generateTransactionId = () => {
  const timestamp = Date.now().toString(36); // Convert timestamp to base36
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // Random string
  return `TXN-${timestamp}-${randomPart}`; // Format: TXN-UNIQUEID-RANDOM
};
