/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function addSugg(sugg: string) {
	const response = await notion.pages.create({
		parent: {
			database_id: "2a6bea474ebd45eba4e4ba345f44ba46",
		},
		properties: {
			Name: {
				title: [
					{
						text: {
							content: sugg,
						},
					},
				],
			},
			Status: {
				select: {
					"name": "To Do"
				}
			}
		}
	});
	// @ts-ignore
	return response.url;
}

export async function addTask(task: string) {
	const response = await notion.pages.create({
		parent: {
			database_id: "bded91d3becc41c79543de951d90876d",
		},
		properties: {
			Name: {
				title: [
					{
						text: {
							content: task,
						},
					},
				],
			},
			Status: {
				select: {
					"name": "To Do"
				}
			}
		}
	});
	// @ts-ignore
	return response.url;
}

export async function addBug(bug: string) {
	const response = await notion.pages.create({
		parent: {
			database_id: "5b0a23225bb847039bc40c5501cfd2b7",
		},
		properties: {
			Name: {
				title: [
					{
						text: {
							content: bug,
						},
					},
				],
			},
			Status: {
				select: {
					"name": "Not Fixed"
				}
			}
		}
	});
	// @ts-ignore
	return response.url;
}

export async function getBugs() {
	const fields = [{"name": "Not Fixed", "value": ""}, {"name": "In Progress", "value": ""}, {"name": "Completed", "value": ""}];

	const databaseId = "5b0a23225bb847039bc40c5501cfd2b7";

	const response = await notion.databases.query({
		database_id: databaseId
	});
	for (const bug of response.results) {
		try {
			switch (bug.properties.Status.select.name) {
			case "Not Fixed": {
				fields[0].value += `[${bug.properties.Name.title[0].text.content}](${bug.url})` + "\n";
				break;
			}
			case "In Progress": {
				fields[1].value += `[${bug.properties.Name.title[0].text.content}](${bug.url})` + "\n";
				break;
			}
			default: {
				fields[2].value += `[${bug.properties.Name.title[0].text.content}](${bug.url})` + "\n";
			}
			}
		} catch {
			continue;
		}
	}
	
	if (fields[0].value === "") {
		fields[0].value = "No bugs";
	}
	if (fields[1].value === "") {
		fields[1].value = "No bugs";
	}
	if (fields[2].value === "") {
		fields[2].value = "No bugs";
	}

	return fields;
}

export async function getTasks() {
	const fields = [{"name": "To Do", "value": ""}, {"name": "Doing", "value": ""}, {"name": "Done 🙌", "value": ""}];

	const databaseId = "bded91d3becc41c79543de951d90876d";

	const response = await notion.databases.query({
		database_id: databaseId
	});
	for (const bug of response.results) {
		try {
			switch (bug.properties.Status.select.name) {
			case "To Do": {
				fields[0].value += `[${bug.properties.Name.title[0].text.content}](${bug.url})` + "\n";
				break;
			}
			case "Doing": {
				fields[1].value += `[${bug.properties.Name.title[0].text.content}](${bug.url})` + "\n";
				break;
			}
			default: {
				fields[2].value += `[${bug.properties.Name.title[0].text.content}](${bug.url})` + "\n";
			}
			}
		} catch {
			continue;
		}
	}
	
	if (fields[0].value === "") {
		fields[0].value = "No bugs";
	}
	if (fields[1].value === "") {
		fields[1].value = "No bugs";
	}
	if (fields[2].value === "") {
		fields[2].value = "No bugs";
	}

	return fields;
}

export async function getSuggs() {
	const fields = [{"name": "To Do", "value": ""}, {"name": "Doing", "value": ""}, {"name": "Done 🙌", "value": ""}];

	const databaseId = "2a6bea474ebd45eba4e4ba345f44ba46";

	const response = await notion.databases.query({
		database_id: databaseId
	});
	for (const bug of response.results) {
		try {
			switch (bug.properties.Status.select.name) {
			case "To Do": {
				fields[0].value += `[${bug.properties.Name.title[0].text.content}](${bug.url})` + "\n";
				break;
			}
			case "Doing": {
				fields[1].value += `[${bug.properties.Name.title[0].text.content}](${bug.url})` + "\n";
				break;
			}
			default: {
				fields[2].value += `[${bug.properties.Name.title[0].text.content}](${bug.url})` + "\n";
			}
			}
		} catch {
			continue;
		}
	}
	
	if (fields[0].value === "") {
		fields[0].value = "No bugs";
	}
	if (fields[1].value === "") {
		fields[1].value = "No bugs";
	}
	if (fields[2].value === "") {
		fields[2].value = "No bugs";
	}

	return fields;
}