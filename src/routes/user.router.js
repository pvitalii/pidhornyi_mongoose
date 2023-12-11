import { Router } from 'express';
import {
  createUser,
  getUsers,
  updateUserById,
  deleteUserById,
  getUserByIdWithArticles,
} from '../controllers/user.controller.js';
import { bodyValidator } from '../middlewares/body-validator.middleware.js';

const userRouter = Router();

userRouter
  .get('/', getUsers)
  .get('/:id', getUserByIdWithArticles)
  .post('/', createUser)
  .put('/:id', bodyValidator(['firstName', 'lastName', 'age']), updateUserById)
  .delete('/:id', deleteUserById);

export default userRouter;
