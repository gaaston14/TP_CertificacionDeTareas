const config = require('./configs/config')
const express = require('express')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')

const allowedOrigins = [
  'https://tp-certificaciondetareas-front.onrender.com',
  'http://localhost:8080'
];
const corsOptions = {
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ extended: true }))
app.use(cookieParser())

const PORT = config.app.port || 4000

app.use('/api/tasks', require('./routes/tasks'))
app.use('/api/groups', require('./routes/groups'))
app.use('/api/technicians', require('./routes/technicians'))
app.use('/api/group_technicians', require('./routes/group_technicians'))
app.use('/api/group_tasks', require('./routes/group_tasks'))
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
})
