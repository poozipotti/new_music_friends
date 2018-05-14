const userRoutes = require("./users");
const chatRoutes = require("./chats");
const spotifyRoutes = require("./spotify");

const constructorMethod = (app) => {
    app.use("/users", userRoutes);
    app.use("/spotify", spotifyRoutes);
    app.use("/chats", chatRoutes);
    app.use("*", (req, res) => {
		console.log("no endpoint here!" + req.originalUrl);
        res.json({error:"404 endpoint not found"});
		
    });
};

module.exports = constructorMethod;
