const gulp = require("gulp");
const spawn = require("child_process").spawn;


var chatProcess,chatApiProcess;
gulp.task("chatServer", () => {
	if (chatProcess){
	 log("restarting chat socket server changes made");
	 chatProcess.kill()
	}
	chatProcess = spawn('node',['./chatServer.js'],{stdio: 'inherit'});
	chatProcess.on('close', (code) => {
		if(code === 8){
			log("error in chat sockets server, waiting for update");
		}
	});
})
gulp.task("chatApiServer", () => {
	if (chatApiProcess){
	 log("restarting chat api socket server changes made");
	 chatApiProcess.kill()
	}
	chatApiProcess = spawn('node',['server.js'],{stdio: 'inherit'});
	chatApiProcess.on('close', (code) => {
		if(code === 8){
			log("error in chat api server, waiting for update");
		}
	});
})
gulp.task('startServers',['chatServer','chatApiServer'], () => {
	gulp.watch(["./chatServer.js"],["chatServer"]);		
	gulp.watch(["./server.js","./**/*.js"],["chatApiServer"]);		
});

gulp.task("default", ["startServers"]);
process.on('exit',()=>{
	if(chatProcess) chatProcess.kill();
	if(chatApiProcess) chatApiProcess.kill();
});
