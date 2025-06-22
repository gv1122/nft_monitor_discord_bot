import fs from "fs";
import axios from "axios";

interface fieldModel {
	name: string;
	value: string;
	inline?: boolean;
}

export function sendWebhook(tweet: any) {
	const webhook = JSON.parse(fs.readFileSync("./config.json", "utf8")).twitter;
	const fields: fieldModel[] = [];

	if (tweet.entities.urls[0]) {
		fields.push({
			name: "Link:",
			value: tweet.entities.urls[0].expanded_url,
			inline: true
		});
	}
	if (tweet.entities.user_mentions[0]) {
		fields.push({
			name: "User Mentioned:",
			value: tweet.entities.user_mentions
				.map(user => `@${user.screen_name} - ${user.name}`)
				.join(", "),
			inline: true
		});
	}

	fields.push({
		name: "Content:",
		value: tweet.text,
	});

	axios.request({
		method: "POST",
		url: webhook,
		headers: {
			"Content-Type": "application/json"
		},
		data: {
			"username": "Monitors",
			"avatar_url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom",
			"embeds": [
				{
					"color": 6893989,
					"title": "Tweet URL",
					"author": {
						"name": `@${tweet.user.name} - ${tweet.user.followers_count} followers!`,
						"url": `https://twitter.com/${tweet.user.screen_name}`,
					},
					"thumbnail": {
						"url": tweet.user.profile_image_url_https
					},
					"url": `https://twitter.com/${tweet.user.screen_name}/status/${
						tweet.id_str
					}`,
					"image": {
						"url": tweet.entities.media
							? tweet.entities.media[0].media_url
							: ""
					},
					"fields": fields,
					"timestamp": new Date(),
					"footer": {
						"text": "Monitors",
						"icon_url":
							process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom"
					}
				}
			]
		}
	});
}