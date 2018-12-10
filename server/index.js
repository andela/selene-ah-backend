import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import methodOverride from 'method-override';
import routes from './routes';
import passportFacebookStrategy from './controllers/auth/passport';
import passport from './helpers/auth/passport';

// const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
// Create global app object
const app = express();


app.use(cors());
// Normal express config defaults
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(methodOverride());
passportFacebookStrategy(app);

app.use(express.static('public'));

app.use(
  session({
    secret: 'authorshaven',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);


passport(app);
app.use(routes);

// / catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* eslint-disable-next-line */
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    errors: {
      message: err.message,
      error: err
    }
  });
});


// finally, let's start our server...
/* eslint-disable-next-line */
app.listen(port, () => console.log(`App Listening on port ${port}`));

export default app;
