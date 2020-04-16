import errorDetails from '../models/ErrorDetails';
const projects = [];
export function checkIfExistsProjects(req, res, next){
    if(!projects[0]) return res.status(404).json(errorDetails[1]);

    return next();
}

export function checkIfExistsProjectsWithSameId(req, res, next){
    const { id, title, tasks } = req.body;
    const project = projects.find(project => {
        return project.id == id;
    });

    if(project) return res.status(409).json(errorDetails[2]);

    req.project = new Project(id, title, tasks);
    
    return next();
}

export function checkIfExistsAllAttributesAtRequest(req, res, next){
    const { id, title, tasks } = req.body;

    if(( !id || !title ) || !tasks) return res.status(400).json(errorDetails[3]);

    return next();
}
export function checkIfExistsNameAndTitleAtRequest(req, res, next){
    const { title, tasks } = req.body;

    if(!title || !tasks) return res.status(400).json(errorDetails[4]);

    return next();
}

export function checkIfExistsProjectById(req, res, next){
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

export function checkIfExistsTitleAtRequest(req, res, next){
    const { title } = req.body;
    if(!title) return res.status(400).json(errorDetails[5]);

    return next();
}