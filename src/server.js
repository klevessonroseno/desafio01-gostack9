import express from 'express';
import Project from './models/Projects';
const port = 8000;
const app = express();

const projects = [];

app.use(express.json());

app.use((req, res, next) => {
    console.time('Request');
    console.log(`Method: ${req.method} URL: ${req.url}`);

    next();

    console.timeEnd('Request');
})

function checkIfExistsProjects(req, res, next){
    if(!projects[0]) return res.status(404).json({
        message: 'Not projects found. create a project using POST HTTP method'
    });

    return next();
}

function checkIfExistsProjectsWithSameId(req, res, next){
    const project = projects.find(project => {
        return project.id == req.body.id;
    });
    if(project) return res.status(409).json({
        message: 'Project alread exists'
    });

    return next();

}

app.get('/projects', checkIfExistsProjects, (req, res) => res.json(projects));

app.get('/projects/:id', (req, res) => {
    const project = projects.find(project => {
        return project.id == req.params.id
    });
    return res.status(200).json(project);
})

app.post('/projects', checkIfExistsProjectsWithSameId, (req, res) => {
    const { id, title, tasks } = req.body;
    projects.push(new Project(id, title, tasks));
    res.status(201).json(projects);
});

app.listen(port, () => console.log(`Server at port ${port}`));