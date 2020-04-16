import { Router } from 'express';
import Project from '../models/Projects';
import * as mid from '../middlewares/middlewares';


const projects = [];

const routes = new Router();

routes.use((req, res, next) => {
    console.time('Request');
    console.log(`Method: ${req.method} URL: ${req.url}`);

    next();

    console.timeEnd('Request');
});

routes.get('/projects', mid.checkIfExistsProjects, (req, res) => res.json(projects));

routes.get('/projects/:id', mid.checkIfExistsProjectById, (req, res) => {
    res.status(200).json(req.project);
});

routes.post('/projects', mid.checkIfExistsProjectsWithSameId, mid.checkIfExistsAllAttributesAtRequest, (req, res) => {
    projects.push(req.project);
    res.status(201).json(req.project);
});

routes.put('/projects/:id', mid.checkIfExistsProjectById, mid.checkIfExistsNameAndTitleAtRequest, (req, res) => {

    const { title, tasks } = req.body;
    const { id } = req.params;
    const projectId = projects.findIndex(project => project.id = id);
    
    projects[projectId] = new Project(id, title, tasks);

    return res.status(200).json(projects[projectId]); 
});

routes.delete('/projects/:id', mid.checkIfExistsProjectById, (req, res) => {
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

routes.post('/projects/:id/tasks', mid.checkIfExistsProjectById, mid.checkIfExistsTitleAtRequest,(req, res) => {
    const { title } = req.body;
    const { id } = req.params;
    const projectId = projects.findIndex(project => project.id == id);

    projects[projectId].tasks.push(title);
    
    res.json(projects[projectId].tasks);
});

export default routes;
