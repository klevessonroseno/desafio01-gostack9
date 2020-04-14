import { Router } from 'express';
import Project from '../models/Projects';
import errorDetails from '../models/ErrorDetails';

const projects = [];

const routes = new Router();

routes.use((req, res, next) => {
    console.time('Request');
    console.log(`Method: ${req.method} URL: ${req.url}`);

    next();

    console.timeEnd('Request');
});

function checkIfExistsProjects(req, res, next){
    if(!projects[0]) return res.status(404).json(errorDetails[1]);

    return next();
}

function checkIfExistsProjectsWithSameId(req, res, next){
    const { id, title, tasks } = req.body;
    const project = projects.find(project => {
        return project.id == id;
    });

    if(project) return res.status(409).json(errorDetails[2]);

    req.project = new Project(id, title, tasks);
    
    return next();
}

function checkIfExistsAttributesAtRequest(req, res, next){
    const { id, title, tasks } = req.body;

    if(( !id || !title ) || !tasks) return res.status(400).json(errorDetails[3]);

    return next();
}

function checkIfExistsProjectById(req, res, next){
    const { id } = req.params;

    const project = projects.find(project => {
        return project.id == id;
    });

    if(!project) return res.status(404).json(errorDetails[0]);

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
    projects.push(req.project);
    res.status(201).json(req.project);
});

routes.put('/projects/:id', (req, res) => {

    const { title, tasks } = req.body;
    const { id } = req.params;

    let project = projects.find(project => project.id == id );

    project = new Project(id, title, tasks);

    return res.status(204).json({
        message: 'Project updated'
    }); 
});

routes.delete('/projects/:id', checkIfExistsProjectById, (req, res) => {
    const { id } = req.params;
    const project = projects.find(project => {
        return project.id == id;
    });

    if(!project) return res.status(404).json({
        message: 'Project not found'
    });

    projects.splice(projects.findIndex(project => {
        return project.id === id;
    }), 1);

    return res.status(202).json({
        message: 'Project deleted'
    }); 
});

routes.post('/projects/:id/tasks', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(project => {
        project.id == id;
    });

   // project.tasks[0] = title

    res.status(202).json({
        message: 'title created',
        nameTitle: title,
        project: project
    });
});

export default routes;
