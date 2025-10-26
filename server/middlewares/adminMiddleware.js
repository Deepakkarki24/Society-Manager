export const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    }
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Access denied: Admin only!",
    });
  }
};
