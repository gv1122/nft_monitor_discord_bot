import axios from "axios";
import fs from "fs";
import sleep from "../utils/sleep";

const webhook = JSON.parse(fs.readFileSync("./config.json", "utf8")).icyVolume;

function sendWebhook(data: any) {
	let allData = "";

	data.forEach((item: any) => {
		allData += `[${item.name}](https://opensea.io/collection/${item.slug}) - ${item.volume}Ξ\n`;
	});

	axios.post(webhook, {
		"embeds": [
			{
				"title": "Top Volume - Last hour",
				"description": allData,
				"timestamp": new Date().toISOString(),
				"color": 6893989,
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
		"avatar_url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom"
	}
	);
}

export async function volumeTrending() {
	axios.request({
		method: "POST",
		url: "https://graphql.icy.tools/graphql",
		headers: {
			"Content-Type": "application/json",
			"X-API-KEY": process.env.ICY_API_KEY || "",
		},
		data: {
			query: `
				query TrendingCollections {
					contracts(orderBy: VOLUME, orderDirection: DESC) {
					  edges {
						node {
						  address
						  ... on ERC721Contract {
							name
							unsafeOpenseaSlug
							stats {
							  totalSales
							  average
							  ceiling
							  floor
							  volume
							}
						  }
						}
					  }
					}
				  }
				`
		}
	}).then(res => {
		const data = res.data.data.contracts.edges.slice(0, 5).map(({node}) => {
			return {
				name: node.name,
				address: node.address,
				slug: node.unsafeOpenseaSlug,
				volume: node.stats.volume
			};
		});

		sendWebhook(data);
	}).catch(async () => {
		console.log("rate limit on highest sale");
		await sleep(2000);
		volumeTrending();
	});
}