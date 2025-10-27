export const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only!",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
