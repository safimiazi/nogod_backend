export  const generateRandomUniqueNumber = () => {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit unique number
  };