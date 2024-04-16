const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

const reqFilter = (req: any, res: any, next: any) => {
  if (!req.query.age) {
    res.send("Please provide age");
  } else if (req.query.age < 18) {
    res.send("You can not access the page");
  } else {
    next();
  }
};

app.use(reqFilter);

app.get("/api", (_req: any, res: any) => {
  res.json({
    message: "Welcome to the API",
  });
});

app.post("/api/login", (_req: any, res: any) => {
  const user = {
    id: 1,
    username: "Soumya",
    email: "soumya@gmail.com",
  };

  app.post("/api/posts", verifyToken, (req: any, res: any) => {
    jwt.verify(req.token, "secretkey", (err: any, authData: any) => {
      if (err) {
        res.sendStatus(403);
      } else {
        res.json({
          message: "Post created...",
          authData,
        });
      }
    });
  });

  jwt.sign(
    { user },
    "secretkey",
    { expiresIn: "60s" },
    (_err: any, token: any) => {
      res.json({
        token,
      });
    }
  );
});

function verifyToken(req: any, res: any, next: any) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(5000, () => console.log("Server started on port 5000"));
