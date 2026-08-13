import { createServer } from "http";
const PORT = 8000;

const users = [
  {
    id: 1,
    name: "Manraj Singh Roopra",
    course: "Computer Science and Engineering",
  },
  { id: 2, name: "Ishaan Batish", course: "Computer Science and Engineering" },
  { id: 3, name: "Aditya Singh", course: "Computer Science and Engineering" },
  { id: 4, name: "Viraj", course: "Computer Science and Engineering" },
];

// Logger middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// JSON middleware
const jsonMiddleware = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
};

// Route handler for GET /api/students
const getStudentsHandler = (req, res) => {
  res.write(JSON.stringify(users));
  res.end();
};

// Route handler for GET /api/students
const getUserByIdHandler = (req, res) => {
  const id = req.url.split("/")[3];
  const user = users.find((user) => user.id === parseInt(id));

  if (user) {
    res.write(JSON.stringify(user));
  } else {
    res.statusCode = 404;
    res.write(JSON.stringify({ message: "User not found" }));
  }
  res.end();
};

// Route handler for POST /api/students
const createUserHandler = (req, res) => {
  let body = "";
  // Listen for data
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const newUser = JSON.parse(body);
    users.push(newUser);
    res.statusCode = 201;
    res.write(JSON.stringify(newUser));
    res.end();
  });
};

// Not found handler
const notFoundHandler = (req, res) => {
  res.statusCode = 404;
  res.write(JSON.stringify({ message: "Route not found" }));
  res.end();
};

const server = createServer((req, res) => {
  logger(req, res, () => {
    jsonMiddleware(req, res, () => {
      if (req.url === "/api/students" && req.method === "GET") {
        getStudentsHandler(req, res);
      } else if (
        req.url.match(/\/api\/students\/([0-9]+)/) &&
        req.method === "GET"
      ) {
        getUserByIdHandler(req, res);
      } else if (req.url === "/api/students" && req.method === "POST") {
        createUserHandler(req, res);
      } else {
        notFoundHandler(req, res);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
