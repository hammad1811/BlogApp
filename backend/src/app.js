import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: [
        process.env.CORS_ORIGIN,
       " https://blog-wave-chi.vercel.app",
        'http://localhost:5173'  // For local testing
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.static('public'));



import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/blog.routes.js"
import likeRoutes from "./routes/like.routes.js"

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", postRoutes);
app.use("/api/v1/like", likeRoutes);


app.get('/', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Blog App Backend is running',
      timestamp: new Date().toISOString()
    });
  });



export default app;