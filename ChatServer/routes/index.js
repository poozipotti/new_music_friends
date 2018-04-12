const userRoutes = require("./users");
const chatRoutes = require("./chats");

const constructorMethod = (app) => {
    app.use("/users", userRoutes);
    app.use("/chats", chatRoutes);
    app.use("*", (req, res) => {
		console.log("no endpoint here!");
        res.json({error:"404 endpoint not found"});
		
    });
};

module.exports = constructorMethod;
