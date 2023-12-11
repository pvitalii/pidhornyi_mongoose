import Article from '../models/article.model.js';

export const getArticles = async (req, res, next) => {
  try {
    let { title, page, limit } = req.query;
    if(page <= 0 ) page = 1;
    if(limit < 0) limit = 0;
    const articles = await Article
      .find({ title: new RegExp(title, 'i') })
      .populate('owner', 'fullName email age -_id')
      .limit(limit)
      .skip((page-1) * limit);
    return res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
}

export const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    return res.status(200).json(article);
  } catch (err) {
    next(err);
  }
}

export const createArticle = async (req, res, next) => {
  try {
    const newArticle = await Article.create(req.body);
    return res.status(201).json(newArticle);
  } catch (err) {
    next(err);
  }
}

export const updateArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id } = req.headers;
    const updatedArticle = await Article.findOneAndUpdate({ _id: id, owner: user_id }, req.body, { new: true, runValidators: true });
    return res.status(200).json(updatedArticle);
  } catch (err) {
    next(err);
  }
}

export const deleteArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id } = req.headers;
    await Article.findOneAndDelete({ _id: id, owner: user_id });
    return res.status(204).json();
  } catch (err) {
    next(err);
  }
}
