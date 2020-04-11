const express = require('express');
const port = 8000;
const app = express();
const Project = require('./models/Projects');
const projects = [];

app.use(express.json());

function checkIfExistsProjects(req, res, next){
    if(!projects[0]) return res.status(404).json({
        message: 'Not projects found. create a project using POST HTTP method'
    });

    return next();
}

app.get('/projects', checkIfExistsProjects, (req, res) => res.json(projects));

app.post('/projects', (req, res) => {
    const { id, title, tasks } = req.body;
    projects.push(new Project(id, title, tasks));
    res.status(201).json(projects);
});

app.listen(port, () => console.log(`Server at port ${port}`));