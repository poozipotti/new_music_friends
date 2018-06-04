const userRoutes = require("./users");
const chatRoutes = require("./chats");
const spotifyRoutes = require("./spotify");
const path = require("path");
const constructorMethod = (app) => {
    app.use("/users", userRoutes);
    app.use("/spotify", spotifyRoutes);
    app.use("/chats", chatRoutes);
};

module.exports = constructorMethod;
