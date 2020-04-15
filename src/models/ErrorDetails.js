class ErrorDetails {
    constructor(_title, _httpStatusCode, _errordate, _developerMessage){
        this.title = _title;
        this.httpStatusCode = _httpStatusCode;
        this.errorDate = _errordate;
        this.developerMessage = _developerMessage;
    }
}

const errorDetails = [
    new ErrorDetails(
        'This project does not exist',
        404,
        new Date(),
        'Create a new project using the http post method'
        ),
    new ErrorDetails(
        'There are no registered projects',
        404,
        new Date(),
        'Create a new project using the http post method'
        ),
    new ErrorDetails(
        'This project already exists',
        409,
        new Date(),
        'Error caused by id conflict'
        ),
    new ErrorDetails(
        'The id, title and tasks attributes are required',
        400,
        new Date(),
        'It is necessary to pass id, title and tasks in the request body'
        ),
    new ErrorDetails(
        'The title and tasks attributes are required',
        400,
        new Date(),
        'It is necessary to pass title and tasks in the request body'
    ),
    new ErrorDetails(
        'The title attribute is required',
        400,
        new Date(),
        'It is necessary to pass title attribute in the request body'
    )
];

export default errorDetails;