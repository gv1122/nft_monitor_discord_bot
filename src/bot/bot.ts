/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Client, Intents, MessageEmbed} from "discord.js";
import {getGas} from "./commands/gas";
import {walletInfo} from "./commands/walletInfo";
import {getCollectionStats} from "./commands/collection";
import {addBug, addTask, addSugg, getBugs, getTasks, getSuggs} from "./commands/notion";
import {resetLicense} from "./commands/license";

const BOT_ICON = process.env.BOT_ICON || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom"
const client = new Client({intents: [Intents.FLAGS.GUILDS]});

client.on("ready", () => {
	// @ts-ignore
	console.log(`Logged in as ${client.user.tag}!`);
});

const options = [
	"🐭",
	"https://media.giphy.com/media/wJZTbXayokOgbCfyQe/giphy.gif",
	"https://media.giphy.com/media/QXh9XnIJetPi0/giphy.gif",
	"🐁",
];

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === "randomice") {
		await interaction.reply(options[Math.floor(Math.random() * options.length)]);
	}

	if (interaction.commandName === "gas") {
		const gas: any = await getGas();
		const gasEmbed = new MessageEmbed()
			.setColor("#6931a5")
			.setTitle("Current Gas Prices: ")
			.setDescription(`Latest Block: ${gas.latestBlock}`)
			.setThumbnail(BOT_ICON)
			.addFields(
				{name: "Slow🐢:", value: `${gas.safeGas} GWEI`, inline: false},
				{name: "Average🚶‍:", value: `${gas.proposeGas} GWEI`, inline: false},
				{name: "Fast⚡:", value: `${gas.fastGas} GWEI`, inline: false},
			)
			.setTimestamp()
			.setFooter({
				text: "Helper",
				iconURL: BOT_ICON
			});

		await interaction.reply({embeds: [gasEmbed]});
	}

	if (interaction.commandName === "address") {

		interaction.deferReply();

		const addy = interaction.options.getString("address");
		const walletData: any = await walletInfo(addy);
		if (walletData.error !== undefined) {
			await interaction.reply({content: `${walletData.error}`});
			return;
		} else {

			const fields: any = [];

			for (const key in walletData.nfts) {
				fields.push({
					name: walletData.nfts[key].name,
					value: walletData.nfts[key].openseaLink,
					inline: false
				});
			}

			const walletEmbed = new MessageEmbed()
				.setColor("#6931a5")
				.setTitle(`${addy} info`)
				.setURL("https://etherscan.io/address/" + addy)
				.setDescription(`Balance: **${walletData.walletValue.toFixed(2)}Ξ**\n__Collections Owned__: ${walletData.collectionAmnt}\n__NFTs Owned__: ${walletData.nftAmnt}\n`)
				.setThumbnail(BOT_ICON)
				.addFields(fields)
				.setTimestamp()
				.setFooter({
					text: "Helper",
					iconURL: BOT_ICON
				});
 
			try {
				await interaction.editReply({embeds: [walletEmbed]});

			} catch (e) {
				console.log(e);
			}
		}
	}

	if (interaction.commandName === "stats") {
		const slug = interaction.options.getString("slug");

		console.log(await getCollectionStats(slug));
	}

	if (interaction.commandName === "bug") {
		interaction.deferReply();

		const bug: any = interaction.options.getString("bug");
		const url = await addBug(bug);

		const bugEmbed = new MessageEmbed()
			.setColor("#6931a5")
			.setTitle("New 🐛Bug Added")
			.setURL(url)
			.setDescription(`Added bug: **${bug}**`)
			.setThumbnail(BOT_ICON)
			.setTimestamp()
			.setFooter({
				text: "Helper",
				iconURL: BOT_ICON
			});
		
		try {
			await interaction.editReply({embeds: [bugEmbed]});

		} catch (e) {
			console.log(e);
		}
	}

	if (interaction.commandName === "viewbugs") {
		interaction.deferReply();

		const bugs: any = await getBugs();

		const bugEmbed = new MessageEmbed()
			.setColor("#6931a5")
			.setTitle("All Current Bugs Status")
			.setFields(bugs)
			.setThumbnail(BOT_ICON)
			.setTimestamp()
			.setFooter({
				text: "Helper",
				iconURL: BOT_ICON
			});
	
		try {
			await interaction.editReply({embeds: [bugEmbed]});

		} catch (e) {
			console.log(e);
		}
	}

	if (interaction.commandName === "task") {
		interaction.deferReply();

		const task: any = interaction.options.getString("task");
		const url = await addTask(task);

		const taskEmbed = new MessageEmbed()
			.setColor("#6931a5")
			.setTitle("New ✔️Task Added")
			.setURL(url)
			.setDescription(`Added task: **${task}**`)
			.setThumbnail(BOT_ICON)
			.setTimestamp()
			.setFooter({
				text: "Helper",
				iconURL: BOT_ICON
			});
		
		try {
			await interaction.editReply({embeds: [taskEmbed]});

		} catch (e) {
			console.log(e);
		}
	}

	if (interaction.commandName === "viewtasks") {
		interaction.deferReply();

		const tasks: any = await getTasks();

		const taskEmbed = new MessageEmbed()
			.setColor("#6931a5")
			.setTitle("All Current Tasks Status")
			.setFields(tasks)
			.setThumbnail(BOT_ICON)
			.setTimestamp()
			.setFooter({
				text: "Helper",
				iconURL: BOT_ICON
			});
	
		try {
			await interaction.editReply({embeds: [taskEmbed]});

		} catch (e) {
			console.log(e);
		}
	}


	if (interaction.commandName === "sugg") {
		interaction.deferReply();

		const sugg: any = interaction.options.getString("sugg");
		const url = await addSugg(sugg);

		const suggEmbed = new MessageEmbed()
			.setColor("#6931a5")
			.setTitle("New 💡Suggestion Added")
			.setURL(url)
			.setDescription(`Added suggestion: **${sugg}**`)
			.setThumbnail(BOT_ICON)
			.setTimestamp()
			.setFooter({
				text: "Helper",
				iconURL: BOT_ICON
			});
		
		try {
			await interaction.editReply({embeds: [suggEmbed]});

		} catch (e) {
			console.log(e);
		}
	}

	if (interaction.commandName === "viewsuggs") {
		interaction.deferReply();

		const suggs: any = await getSuggs();

		const suggEmbed = new MessageEmbed()
			.setColor("#6931a5")
			.setTitle("All Current Suggestions Status")
			.setFields(suggs)
			.setThumbnail(BOT_ICON)
			.setTimestamp()
			.setFooter({
				text: "Helper",
				iconURL: BOT_ICON
			});
	
		try {
			await interaction.editReply({embeds: [suggEmbed]});

		} catch (e) {
			console.log(e);
		}
	}

	if (interaction.commandName === "reset") {
		interaction.deferReply();

		const license: any = interaction.options.getString("license");
		const status = await resetLicense(license, interaction.message.author);

		try {
			await interaction.editReply({embeds: [status]});

		} catch (e) {
			console.log(e);
		}
	}
});

client.login(process.env.BOT_TOKEN);