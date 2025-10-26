import queryModel from "../models/queryModel.js";
import userModel from "../models/userModel.js";

export const addQuery = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    if (!title || !description) {
      return res.status(409).json({
        success: false,
        message: "Title and description are required!",
      });
    }

    const newQuery = await queryModel.create({
      title,
      description,
      image,
      createdBy: req.user._id,
    });

    if (!newQuery) {
      return res.status(409).json({
        success: false,
        message: "Error while creating query!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Query posted!",
      query: newQuery,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, status } = req.body;

    const query = await queryModel.findById(id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: "No query found with this id!",
      });
    }

    if (query.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this query!",
      });
    }

    if (title) query.title = title;
    if (description) query.description = description;
    if (image) query.image = image;
    if (status && req.user.role === "admin") query.status = status;

    await query.save();

    return res.status(200).json({
      success: true,
      message: "Query updated successfully!",
      query,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await queryModel.findById(id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Query not found!",
      });
    }

    if (
      query.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "user"
    ) {
      return res.status(402).json({
        success: false,
        message: "Not authorized to take this action!",
      });
    }

    await query.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Query deleted successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getUserQueries = async (req, res) => {
  try {
    const queries = await queryModel.find({ createdBy: req.user.id });

    return res.status(200).json({
      success: true,
      message: "User queries fetched!",
      queries,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
