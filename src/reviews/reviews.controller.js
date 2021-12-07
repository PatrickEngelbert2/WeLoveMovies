const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewIdExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);
  if (review) {
    res.locals.reviewId = reviewId;
    res.locals.review = review;
    return next();
  }
  return next({ status: 404, message: `Review cannot be found.` });
}

async function update(req, res, next) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.reviewId,
  };
  await service.update(updatedReview);
  const data = await service.addCriticToReview(res.locals.reviewId);
  res.json({ data });
}

async function destroy(req, res, next) {
  await service.destroy(res.locals.reviewId);
  res.sendStatus(204);
}

module.exports = {
  update: [asyncErrorBoundary(reviewIdExists), asyncErrorBoundary(update)],
  destroy: [asyncErrorBoundary(reviewIdExists), asyncErrorBoundary(destroy)],
};
