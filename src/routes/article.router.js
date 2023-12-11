import { Router } from 'express';
import {
  createArticle,
  updateArticleById,
  deleteArticleById,
  getArticles,
  getArticleById,
} from '../controllers/article.controller.js';
import { bodyValidator } from '../middlewares/body-validator.middleware.js';

const articleRouter = Router();

articleRouter
  .get('/', getArticles)
  .get('/:id', getArticleById)
  .post('/', createArticle)
  .put('/:id', bodyValidator(['title', 'subtitle', 'category', 'description']), updateArticleById)
  .delete('/:id', deleteArticleById);

export default articleRouter;
