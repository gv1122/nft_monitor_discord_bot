/* eslint-disable @typescript-eslint/ban-ts-comment */

import Twit from "twit";

import config from "../../../config.json";
import {sendWebhook} from "./webhook";

export class Twitter {
	private userIds: any;
	private twitterInstance: Twit;

	constructor() {
		this.twitterInstance = new Twit({
			consumer_key: config.Twitter.consumer_key,
			consumer_secret: config.Twitter.consumer_secret,
			access_token: config.Twitter.access_token,
			access_token_secret: config.Twitter.access_token_secret,
		});
		this.userIds = [];
		this.run();
	}

	public async run() {
		await this.init();
		await this.monitor();
	}

	public async init() {
		const a: any = [];
		for (const user of config.Twitter.Accounts) {
			const userId = await this.twitterInstance.get("/users/show", {screen_name: user});
			a.push(userId.data.id_str);
		}
		this.userIds = a;
	}

	public async monitor() {
		const stream = this.twitterInstance.stream("statuses/filter", {follow: this.userIds});


		stream.on("connected", () => {
			console.log(`Monitoring Twitter for ${this.userIds.join(", ")}`);
		});


		stream.on("tweet", tweet => {
			if (this.userIds.includes(tweet.user.id_str)) {

				if (!isReply(tweet)) {
					sendWebhook(tweet);
				}
			}
		});


		stream.on("disconnect", disconnectMessage => {
			console.log("Twitter stream disconnected: " + disconnectMessage);
		});
	}
}

function isReply(tweet: any) {
	return (
		tweet.retweeted_status ||
		tweet.in_reply_to_status_id ||
		tweet.in_reply_to_status_id_str ||
		tweet.in_reply_to_user_id ||
		tweet.in_reply_to_user_id_str ||
		tweet.in_reply_to_screen_name
	);
}

new Twitter();