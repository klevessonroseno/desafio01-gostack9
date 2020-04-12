import { Router } from 'express';
import Project from './models/Projects';

const projects = [];

const routes = new Router();

routes.use((req, res, next) => {
    console.time('Request');
    console.log(`Method: ${req.method} URL: ${req.url}`);

    next();

    console.timeEnd('Request');
});

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
function checkIfExistsAttributesAtRequest(req, res, next){
    const { id, title, tasks } = req.body;

    if(( !id || !title ) || !tasks) return res.status(400).json({
        message: 'The id, title and tasks attributes are required'
    });

    return next();
}

function checkIfExistsProjectById(req, res, next){
    const { id } = req.params;

    const project = projects.find(project => {
        return project.id == id;
    });

    if(!project) return res.status(404).json({
        message: 'Project not found'
    });

    req.project = new Project(
        project.id,
        project.title,
        project.tasks
    );

    return next();
}

routes.get('/projects', checkIfExistsProjects, (req, res) => res.json(projects));

routes.get('/projects/:id', checkIfExistsProjectById, (req, res) => {
    res.status(200).json(req.project)
});

routes.post('/projects', checkIfExistsProjectsWithSameId, checkIfExistsAttributesAtRequest, (req, res) => {
    const { id, title, tasks } = req.body;
    projects.push(new Project(id, title, tasks));
    res.status(201).json(projects);
});

export default routes;
