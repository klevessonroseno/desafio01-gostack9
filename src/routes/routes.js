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

function checkIfExistsAllAttributesAtRequest(req, res, next){
    const { id, title, tasks } = req.body;

    if(( !id || !title ) || !tasks) return res.status(400).json(errorDetails[3]);

    return next();
}
function checkIfExistsNameAndTitleAtRequest(req, res, next){
    const { title, tasks } = req.body;

    if(!title || !tasks) return res.status(400).json(errorDetails[4]);

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

function chechIfExistsTitleAtRequest(req, res, next){
    const { title } = req.body;
    if(!title) return res.status(400).json({
        message: 'The title attribute is requered'
    });

    return next();
}

routes.get('/projects', checkIfExistsProjects, (req, res) => res.json(projects));

routes.get('/projects/:id', checkIfExistsProjectById, (req, res) => {
    res.status(200).json(req.project);
});

routes.post('/projects', checkIfExistsProjectsWithSameId, checkIfExistsAllAttributesAtRequest, (req, res) => {
    projects.push(req.project);
    res.status(201).json(req.project);
});

routes.put('/projects/:id', checkIfExistsProjectById, checkIfExistsNameAndTitleAtRequest, (req, res) => {

    const { title, tasks } = req.body;
    const { id } = req.params;
    const projectId = projects.findIndex(project => project.id = id);
    
    projects[projectId] = new Project(id, title, tasks);

    return res.status(200).json(projects[projectId]); 
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

routes.post('/projects/:id/tasks', checkIfExistsProjectById, chechIfExistsTitleAtRequest,(req, res) => {
    const { title } = req.body;
    const { id } = req.params;
    const projectId = projects.findIndex(project => project.id == id);

    projects[projectId].tasks.push(title);
    
    res.json(projects[projectId].tasks);
});

export default routes;
