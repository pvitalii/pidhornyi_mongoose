import User from '../models/user.model.js';

export const getUsers = async (req, res, next) => {
  try {
    const { byAge } = req.query;
    const sortValue = byAge === "ascending" ? 1 : byAge === "descending" ? -1 : null;
    const users = await User.find({}, '_id fullName email age').sort({ age: sortValue });
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

export const getUserByIdWithArticles = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('articles', 'title subtitle createdAt -_id');
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

export const createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    return res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
}

export const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}

export const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    return res.status(204).json();
  } catch (err) {
    next(err);
  }
}

