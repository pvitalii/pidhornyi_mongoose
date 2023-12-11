import mongoose from 'mongoose';
import Article from './article.model.js';
import createHttpError from 'http-errors';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minLength: 4,
    maxLength: 50,
    required: true,
    trim: true 
  },
  lastName: {
    type: String,
    minLength: 3,
    maxLength: 60,
    required: true,
    trim: true
  },
  fullName: String,
  email: {
    type: String,
    required: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['admin', 'writer', 'guest']
  },
  age: {
    type: Number,
    min: 1,
    max: 99,
  },
  numberOfArticles: {
    type: Number,
    default: 0
  },
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
},
  {
    timestamps: true
  },
);

userSchema.pre('validate', function(next) {
  if(this.age < 0) {
    this.age = 1;
  }
  next();
})

userSchema.pre('save', function(next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  next();
});

userSchema.pre(['findOneAndDelete', 'findOneAndUpdate'], async function (next) {
  const user = await User.findById(this.getQuery()._id);
  if (!user) {
    next(createHttpError.NotFound('User not Found'))
  }
  next();
});

userSchema.pre('findOneAndUpdate', async function(next) {
  const query = this.getUpdate();
  if (query.firstName && query.lastName) {
    query.$set.fullName = `${query.firstName} ${query.lastName}`;
  }
  next();
});

userSchema.post('findOneAndDelete', async function(doc, next) {
  const id = this.getQuery()._id;
  await Article.deleteMany({ owner: id });
  next();
});

userSchema.post(['save', 'findOneAndUpdate'], function(error, doc, next) {
  if(error.name === 'ValidationError') {
    next(createHttpError.BadRequest(error.message));
  }
  next();
})

const User = mongoose.model('User', userSchema);

export default User;
