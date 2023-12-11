import mongoose from 'mongoose';
import User from './user.model.js';
import createHttpError from 'http-errors';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 5,
    maxLength: 400,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    minLength: 5
  },
  description: {
    type: String,
    minLength: 5,
    maxLength: 5000,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['sport', 'games', 'history'],
    required: true
  }
},
  {
    timestamps: true
  }
);

articleSchema.pre('validate', async function(next) {
  const user = await User.findById(this.owner);
  if (!user) {
    next(createHttpError.BadRequest("Owner doesn't exist or not provided"));
  }
  next();
});

articleSchema.pre(['findOneAndUpdate', 'findOneAndDelete'], async function (next) {
  const filter = this.getFilter();
  const article = await Article.findById(filter._id);

  if (!article) {
    next(createHttpError.NotFound('Article not found'));
  }

  if (article.owner.toString() !== filter.owner) {
    next(createHttpError.Forbidden('Only owner can update or delete article'));
  }
  next();
});

articleSchema.post('findOneAndDelete', async function(doc, next) {
  await User.findByIdAndUpdate(doc.owner, { $inc: { numberOfArticles: -1 }, $pull: { articles: doc._id } });
  next();
});

articleSchema.post('save', async function (doc, next) {
  await User.findByIdAndUpdate(doc.owner, { $inc: { numberOfArticles: 1 }, $push: { articles: doc._id } });
  next();
});

articleSchema.post(['save', 'findOneAndUpdate'], function (error, doc, next) {
  if (error.name === 'ValidationError') {
    next(createHttpError.BadRequest(error.message));
  }
  next();
})

const Article = mongoose.model('Article', articleSchema);

export default Article;
