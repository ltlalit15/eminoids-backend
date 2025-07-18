const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fileUpload = require('express-fileupload');
const socketIo = require('socket.io'); // soc
 const http = require('http'); // required for socket.ioket.io
const userRoutes = require('./routes/userRoutes');
const memberRoutes = require('./routes/memberRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const projectFilesRoutes = require('./routes/projectFiles');
const activityLogsRoutes = require('./routes/activityLogsRoutes');
const taskGymRoutes = require('./routes/taskGymRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const groupRoutes = require('./routes/groupRoutes');
const tasksRoutes = require('./routes/tasksRoutes');
const projectsStatusReportRoutes = require('./routes/projectsStatusReportRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskAutomationRoutes = require('./routes/taskAutomationRoutes');
const smsTemplateRoutes = require('./routes/smsTemplateRoutes');
const assignedProjectsRoutes = require('./routes/assignedProjectsRoutes');
const shiftRoutes = require('./routes/shiftRoutes'); 
const eventRoutes = require('./routes/eventRoutes');
const languageRoutes = require('./routes/languageRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const groupChatRoutes = require('./routes/groupChatRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const serviceCategoryRoutes = require('./routes/serviceCategoryRoutes');
const clientRoutes = require('./routes/clientRoutes');



const db = require('./config');
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure correct path to views
// Middleware
const server = http.createServer(app); // wrap express app with http server
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://pm-2.netlify.app'], // Allow all origins for development
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// ✅ Make io available globally in your app
app.set('io', io);

// ✅ Socket.io connection event
io.on('connection', (socket) => {
  console.log('🟢 New client connected: ' + socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected: ' + socket.id);
  });
});



app.use(cors({
    origin: ['http://localhost:5173', 'https://pm-2.netlify.app'],  // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],  // Allow all HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Allow necessary headers
}));
// ✅ Increase Payload Limit for Base64 Images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ **File Upload Middleware**
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'upload')));
app.use(
    session({
        secret: 'your_secret_key', // Change this to a secure key
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 86400000 }, // 1 day expiration
    })
);



//app.use(express.static(path.join(__dirname, 'public')));

app.get('/upload/:imageName', (req, res) => {
    const imagePath = path.join(__dirname, 'upload', req.params.imageName);
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error(`Error serving image: ${err}`);
            res.status(500).send(err);
        }
    });
});


 
// Middleware
app.use(cors());
app.use(bodyParser.json());


app.use('/api/user', userRoutes);
app.use('/api/member', memberRoutes);

app.use('/api/roles', rolesRoutes);

app.use('/api/projectFiles', projectFilesRoutes);
app.use('/api/activityLogs', activityLogsRoutes);
app.use('/api/taskGym', taskGymRoutes);
app.use('/api/adminDashboard', adminDashboardRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/projectsStatusReport', projectsStatusReportRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/taskAutomation', taskAutomationRoutes);
app.use('/api/smsTemplate', smsTemplateRoutes);
app.use('/api/assignedProjects', assignedProjectsRoutes);
app.use('/api/shift', shiftRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/language', languageRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/groupChat', groupChatRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/serviceCategory', serviceCategoryRoutes);


// app.use('/api/user', authRoutes);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.listen(8800, () => {
    console.log('Server connected on port 8800');
});
