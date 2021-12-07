const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
  const data = await service.listTheaters();
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
};
