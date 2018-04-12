const axios = require('axios');
async function getStuff(){
	try{
	let data =  await axios.get("localhost:4000/users");
	console.log(data.data);
	}catch (e){
		console.log(e);
	}
}
getStuff();
