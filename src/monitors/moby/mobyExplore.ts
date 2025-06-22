/* eslint-disable no-useless-catch */
import axios from "axios";
import fs from "fs";
import sleep from "../utils/sleep";

const recentItems: any = [];
const configFile = JSON.parse(fs.readFileSync("./config.json", "utf8"));

function sendWebhook(data: any) {
	let desc = "";
	const fields: any = [];

	data[0].unixTime = data[0].Unix.toString().substring(0, data[0].Unix.length - 3);
	desc += `<t:${data[0].Unix}>`;

	if (data[0].SiteLink !== null) {
		desc += ` - [Website](${data[0].SiteLink})`;
	}
	if (data[0].Discord !== null) {
		desc += ` - [Discord](${data[0].Discord})`;
	}
	for (const action of data) {
		fields.push({
			"name": action.Action,
			"value": `${action.TypeOfAction} to ${action.Amount} in the last ${action.Time}`
		});
	}

	axios.request({
		method: "POST",
		url: configFile.mobyExplore,
		headers: {
			"Content-Type": "application/json",
		},
		data: {
			"content": null,
			"embeds": [
				{
					"title": `${data.length} new actions!`,
					"author": {
						"name": data[0].Name,
						"url": data[0].OpenseaLink,
						"icon_url": data[0].Image
					},
					"description": desc,
					"color": 6893989,
					"fields": fields,
					"footer": {
						"text": "Monitors",
						"icon_url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom"
					},
					"thumbnail": {
						"url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom"
					}
				}
			],
			"username": "Monitors",
			"avatar_url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom",
		}
	}).catch(() => {
		console.log({
			"content": null,
			"embeds": [
				{
					"title": `${data.user} ${data.action} ${data.asset}`,
					"url": data.etherscan,
					"color": 6893989,
					"fields": fields,
					"footer": {
						"text": "Monitors",
						"icon_url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom"
					},
					"thumbnail": {
						"url": data.image
					}
				}
			],
			"username": "Monitors",
			"avatar_url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom",
		});
		console.log(fields);
		console.log(data);
	});
}

export function getRecentMobyExplore() {
	axios.get("https://moby-api.onrender.com/live/explore", {
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${process.env.MOBY_API_KEY}` || ""
		},
	}).then((response: any) => {
		response.data.list.forEach((item: any) => {
			recentItems.push(item._id);
		});
	});
}

export function mobyExplore() {
	axios.get("https://moby-api.onrender.com/live/explore", {
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${process.env.MOBY_API_KEY}` || ""
		},
	}).then((response: any) => {
		for (let i = 0; i < 4; i++) {
			const item = response.data.list[i];

			if (recentItems.includes(item._id)) {
				return;
			}
			recentItems.push(item._id);

			const list: any = [];
			let bodyData = {};

			item.items.forEach((action: any) => {
				if (action.selected_metric === "avg") {
					bodyData["Action"] = "Average";
				} else if (action.selected_metric === "volume") {
					bodyData["Action"] = "Volume";
				} else {
					bodyData["Action"] = "Count";
				}

				if (action.calculated_value.toString().startsWith("-")) {
					bodyData["TypeOfAction"] = "Decreased";
				} else {
					bodyData["TypeOfAction"] = "Increased";
				}

				if (bodyData["Action"] === "Average" || bodyData["Action"] === "volume") {
					bodyData["Amount"] = `Ξ${action.current}`;
				} else {
					bodyData["Amount"] = action.current;
				}

				if (action.domain === "days") {
					bodyData["Time"] = "24 Hours";
				} else if (action.domain === "hours") {
					bodyData["Time"] = "60 minutes";
				} else {
					const t = action.domain.match(/\d+/g);
					const l = action.domain.match(/[a-zA-Z]+/g);
					const a = t.concat(l);
					const time = a.join(" ");
					bodyData["Time"] = time;
				}

				bodyData["Unix"] = item.ts;
				bodyData["Name"] = item.contract.openSeaData.name ? item.contract.openSeaData.name : null;
				bodyData["Image"] = item.contract.openSeaData.image_url ? item.contract.openSeaData.image_url : "https://twitter.com/KosherKit";
				bodyData["OpenseaLink"] = item.contract.openSeaData.collection.slug ? `https://opensea.io/collection/${item.contract.openSeaData.collection.slug}` : "https://opensea.io/";
				bodyData["SiteLink"] = item.contract.openSeaData.collection.external_url ? item.contract.openSeaData.collection.external_url : null;
				bodyData["Discord"] = item.contract.openSeaData.collection.discord_url ? item.contract.openSeaData.collection.discord_url : null;

				list.push(bodyData);
			});
			bodyData = {};
			sendWebhook(list);
		}
	}).catch(async () => {
		console.log("Error in mobyExplore");
		await sleep(2000);
		return mobyExplore();
	});
}

