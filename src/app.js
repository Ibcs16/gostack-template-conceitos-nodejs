const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

app.use('/repositories/:id', (request, response, next) => {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({error: 'Id is not a valid uuid'});
  }

  return next();
});

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {title, url, techs, likes: 0, id: uuid()};

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const { title, techs, url } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }

  const repository = repositories[repositoryIndex];
  repository.techs = techs;
  repository.title = title;
  repository.url = url;

  repositories[repositoryIndex] = {...repository};

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }

  const repository = repositories[repositoryIndex];
  repository.likes++;

  repositories[repositoryIndex] = {...repository};


  return response.json({likes: repository.likes});

});

module.exports = app;
