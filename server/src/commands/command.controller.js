const commandHealth = (req, res) => {
  res.json({
    status: "ok",
    message: "Command controller is working",
  });
};

module.exports = {
  commandHealth,
};