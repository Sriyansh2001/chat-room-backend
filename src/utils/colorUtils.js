function getRandomDarkColor() {
  // Generate random RGB values between 0 and 100 for a dark shade
  const r = Math.floor(Math.random() * 101);
  const g = Math.floor(Math.random() * 101);
  const b = Math.floor(Math.random() * 101);
  return `rgb(${r}, ${g}, ${b})`;
}

module.exports = {
  getRandomDarkColor,
};
