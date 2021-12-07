const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

async function list(req, res, next) {
  const isShowing = req.query.is_showing;

  const data = await service.list(isShowing);
  res.json({ data });
}

async function movieIdExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movieId = movieId;
    res.locals.movie = movie;
    return next();
  }
  return next({ status: 404, message: `Movie cannot be found.` });
}

function read(req, res, next) {
  res.json({ data: res.locals.movie });
}

async function listTheaters(req, res, next) {
  const data = await service.listTheaters(res.locals.movieId);
  res.json({ data });
}

async function listReviews(req, res, next) {
  const reviews = await service.listReviews(res.locals.movieId);
  const data = reviews.map((review) => addCritic(review));
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieIdExists), read],
  listTheaters: [
    asyncErrorBoundary(movieIdExists),
    asyncErrorBoundary(listTheaters),
  ],
  listReviews: [
    asyncErrorBoundary(movieIdExists),
    asyncErrorBoundary(listReviews),
  ],
};
