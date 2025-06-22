import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";

const commands: any = [];


commands.push({
	name: "randomice",
	description: "Return a random mouse",
},
{
	name: "gas",
	description: "Get the current gas price",
},
{
	name: "address",
	description: "Get the ETH balance for a certain address",
	options: [
		{
			"name": "address",
			"description": "The user ETH address",
			"type": 3,
			"required": true
		}
	]
},
{
	name: "stats",
	description: "Get the current floor price for collection",
	options: [
		{
			"name": "slug",
			"description": "The collection slug",
			"type": 3,
			"required": true
		}
	]
},
{
	name: "bug",
	description: "Alert developers of a bug",
	options: [
		{
			"name": "bug",
			"description": "The bug",
			"type": 3,
			"required": true
		}
	]	
},
{
	name: "viewbugs",
	description: "View all current bugs status",
}
,{
	name: "task",
	description: "Alert developers of a new task",
	options: [
		{
			"name": "task",
			"description": "The task",
			"type": 3,
			"required": true
		}
	]	
},
{
	name: "viewtasks",
	description: "View all current tasks status",
},
{
	name: "sugg",
	description: "Alert developers of a new suggestion",
	options: [
		{
			"name": "sugg",
			"description": "The suggestion",
			"type": 3,
			"required": true
		}
	]
},
{
	name: "viewsuggs",
	description: "View all current suggestions status",
},
{
	name: "reset",
	description: "Reset your license",
	options: [
		{
			"name": "license",
			"description": "The license",
			"type": 3,
			"required": true
		}
	]
}
);

const clientId = "123455";

const rest = new REST({version: "9"}).setToken(process.env.DISCORD_TOKEN || "");

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");

		await rest.put(
			Routes.applicationCommands(clientId),
			{body: commands},
		);

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();