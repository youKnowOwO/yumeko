"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const turndown_1 = __importDefault(require("turndown"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const discord_js_1 = require("discord.js");
const decorators_1 = require("@yumeko/decorators");
const regions = {
    pl: {
        uri: "https://brainly.pl",
        question: "zadanie"
    },
    es: {
        uri: "https://brainly.lat",
        question: "tarea"
    },
    pt: {
        uri: "https://brainly.com.br",
        question: "tarefa"
    },
    id: {
        uri: "https://brainly.co.id",
        question: "tugas"
    },
    us: {
        uri: "https://brainly.com",
        question: "question"
    }
};
const defaultAvatar = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/microsoft/54/bust-in-silhouette_1f464.png";
const graphql = `
    query SearchQuery($query: String!, $first: Int!, $after: ID) {
        questionSearch(query: $query, first: $first, after: $after) {
            count
            edges {
                node {
                    databaseId
                    content
                    points
                    created
                    lastActivity
                    attachments {
                        url
                    }
                    author {
                        databaseId
                        nick
                        points
                        gender
                        description
                        isDeleted
                        avatar {
                            url
                        }
                        category
                        clientType
                        rank {
                            databaseId
                            name
                        }
                        receivedThanks
                        bestAnswersCount
                        helpedUsersCount
                    }
                    isAuthorsFirstQuestion
                    canBeAnswered
                    pointsForAnswer
                    pointsForBestAnswer
                    answers {
                        nodes {
                            databaseId
                            content
                            points
                            isBest
                            created
                            rating
                            ratesCount
                            thanksCount
                            attachments {
                                url
                            }
                            author {
                                databaseId
                                nick
                                points
                                gender
                                description
                                isDeleted
                                avatar {
                                    url
                                }
                                category
                                clientType
                                rank {
                                    databaseId
                                    name
                                }
                                receivedThanks
                                bestAnswersCount
                                helpedUsersCount
                            }
                        }
                    }
                }
            }
        }
    }
`;
let default_1 = class extends Command_1.default {
    async exec(msg, { question, region }) {
        region = region.toLowerCase();
        region = region in regions ? region : "us";
        const td = new turndown_1.default();
        const baselink = regions[region];
        const data = await this.getData(question, region);
        if (!data)
            return msg.ctx.send(msg.guild.loc.get("COMMAND_UTIL_NO_RESULT_FOUND"));
        const { node } = data[0];
        const embed = new discord_js_1.MessageEmbed()
            .setColor(0x5BB8FF)
            .setTitle(msg.guild.loc.get("COMMAND_BRAINLY_QUESTION"))
            .setAuthor("Brainly User", defaultAvatar)
            .setURL(`${baselink.uri}/${baselink.question}/${node.databaseId}`)
            .setDescription(td.turndown(node.content));
        if (node.author)
            embed.setAuthor(node.author.nick, node.author.avatar ? node.author.avatar.url : defaultAvatar, `${baselink.uri}/app/profile/${node.author.databaseId}`);
        if (node.attachments.length) {
            const { attachments } = node;
            embed.setImage(attachments[0].url);
            if (attachments.length > 1)
                embed.addField("Attachments", attachments.slice(1).map(x => x.url).join("\n"));
        }
        if (node.answers.nodes.length) {
            const filter = (a, b) => {
                let first = Number(a.isBest);
                let second = Number(b.isBest);
                first += a.rating;
                second += b.rating;
                return second - first;
            };
            const [answer] = node.answers.nodes.sort(filter);
            await msg.channel.send(embed);
            embed.setColor("GREEN").setImage("").spliceFields(0, 1)
                .setAuthor("Brainly User", defaultAvatar)
                .setTitle(msg.guild.loc.get("COMMAND_BRAINLY_ANSWER", answer.isBest))
                .setDescription(td.turndown(answer.content))
                .setFooter(`⭐ ${answer.rating} ♥️ ${answer.thanksCount}`);
            if (answer.author)
                embed.setAuthor(answer.author.nick, answer.author.avatar ? answer.author.avatar.url : defaultAvatar, `${baselink.uri}/app/profile/${answer.author.databaseId}`);
            if (answer.attachments.length) {
                const { attachments } = answer;
                embed.setImage(attachments[0].url);
                if (attachments.length > 1)
                    embed.addField("Attachments", attachments.slice(1).map(x => x.url).join("\n"));
            }
            return msg.channel.send(embed);
        }
        else
            return msg.ctx.send(embed);
    }
    async getData(query, region, length = 1) {
        try {
            const { body } = await node_superfetch_1.default.post(`https://brainly.com/graphql/${region}`)
                .send({
                query: graphql,
                operationName: "SearchQuery",
                variables: {
                    query,
                    after: null,
                    first: length
                }
            })
                .set({
                "host": "brainly.com",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0"
            });
            return body.data.questionSearch.edges;
        }
        catch {
            return undefined;
        }
    }
};
default_1 = __decorate([
    decorators_1.DeclareCommand("brainly", {
        aliases: ["brainly", "brainless"],
        description: {
            content: (msg) => msg.guild.loc.get("COMMAND_BRAINLY_DESCRIPTION"),
            usage: "brainly <question> [--region]",
            examples: ["brainly flowchart", "brainly flowchart --id"]
        },
        category: "utility",
        permissions: {
            client: ["EMBED_LINKS"]
        },
        args: [
            {
                identifier: "region",
                match: "flag",
                flag: "region",
                type: (msg, content) => {
                    const keys = Object.keys(regions);
                    if (!keys.includes(content.toLowerCase()))
                        throw new CustomError_1.default("!PARSING", msg.guild.loc.get("COMMAND_BRAINLY_INVALID_REGION", keys));
                    return content;
                },
                default: (msg) => msg.guild.loc.get("META_ID").split("_")[1].toLowerCase()
            },
            {
                identifier: "question",
                match: "rest",
                type: "string",
                prompt: (msg) => msg.guild.loc.get("COMMAND_BRAINLY_PROMPT")
            }
        ]
    })
], default_1);
exports.default = default_1;
