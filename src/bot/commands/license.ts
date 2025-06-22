import axios from "axios";
import {MessageEmbed} from "discord.js";

export async function resetLicense(license: string, username: string): Promise<MessageEmbed> {
	const admins = ["Gv", "cale", "chefmike", "KosherPlug", "Sharp"];
	
	await axios({
		method: "GET",
		url: `https://api.hyper.co/v6/licenses/${license}`,
		headers: { Authorization: `Bearer ${process.env.HYPER_API_KEY}` },  
	}).then(async (response) => {

		if (admins.includes(username) || username == response.data.user.discord.username) {
			await axios({
				method: "PATCH",
				url: `https://api.hyper.co/v5/licenses/${license}`,
				headers: { Authorization: `Bearer ${process.env.HYPER_API_KEY}` },  
				data: {
					metadata: {
						hwid: "",
						ip: ""
					}
				}
			});
			// Successfully reset license!
			return new MessageEmbed();
		} else {
			// "This license is not yours! Why you snooping eh?"
			return new MessageEmbed();
		}
	}).catch((err) => {
		// Error resetting license!
		return new MessageEmbed();
	});

	return new MessageEmbed();
}