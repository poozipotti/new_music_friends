const userRoutes = require("./users");
const chatRoutes = require("./chats");
const spotifyRoutes = require("./spotify");
const path = require("path");
const constructorMethod = (app) => {
    app.use("/users", userRoutes);
    app.use("/spotify", spotifyRoutes);
    app.use("/chats", chatRoutes);
	app.get("*", (req,res) => {
		res.sendFile(path.join(__dirname,"client","build","index.html"));
	});
};

module.exports = constructorMethod;
