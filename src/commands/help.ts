import { Command, CommandCategories }                      from "../handlers/command";
import { SlashCommandBuilder }                             from "@discordjs/builders";
import { CommandInteraction, MessageButton, MessageEmbed } from "discord.js";
import { Vibey }                                           from "../handlers/client";
import paginate                                            from "../lib/pagination";


export default class Help extends Command {
    public category: CommandCategories = "GENERAL";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("help")
            .setDescription("Get the Usable commands by the bot.");
    };

    async handle( interaction: CommandInteraction, client: Vibey ): Promise<void> {
        try {

            const commandData: any = {
                FUN: {
                    commands: []
                },

                GENERAL: {
                    commands: []
                },

                IMAGE: {
                    commands: []
                },

                API: {
                    commands: []
                }
            };

            client.commands.forEach(( cmd: Command )=>{
                commandData[cmd.category as any]?.commands.push(cmd.builderJson.name);
            });

            const apiCommands: MessageEmbed = new MessageEmbed()
                .setTitle(`${ client?.user?.username }'s Commands`)
                .setDescription("```Page: 1```")
                .addField("> :smile: Api Commands", `\`\`\`- /${ commandData.API.commands.join("\n- /") }\`\`\``)
                .setColor("RANDOM")
                .setTimestamp()

            const funCommands: MessageEmbed = new MessageEmbed()
                .setTitle(`${ client?.user?.username }'s Commands`)
                .addField("> :laughing: Fun Commands", `\`\`\`- /${ commandData.FUN.commands.join("\n- /") }\`\`\``)
                .setColor("RANDOM")
                .setTimestamp()


            const imageCommands: MessageEmbed = new MessageEmbed()
                .setTitle(`${ client?.user?.username }'s Commands`)
                .addField("> :camera: Image Manipulation Commands", `\`\`\`- /${ commandData.IMAGE.commands.join("\n- /") }\`\`\``)
                .setColor("RANDOM")
                .setTimestamp()

            const generalCommands: MessageEmbed = new MessageEmbed()
                .setTitle(`${ client?.user?.username }'s Commands`)
                .setDescription("```Page: 1```")
                .addField("> :sweat_smile: General Commands", `\`\`\`- /${ commandData.GENERAL.commands.join("\n- /") }\`\`\``)
                .setColor("RANDOM")
                .setTimestamp()

            const button1: MessageButton = new MessageButton()
                .setEmoji("⏮️")
                .setStyle("PRIMARY")
                .setCustomId("btn-1");


            const button2: MessageButton = new MessageButton()
                .setEmoji("⏭️")
                .setStyle("PRIMARY")
                .setCustomId("btn-2");

            await paginate(interaction, [ apiCommands, funCommands, generalCommands, imageCommands ], [ button1, button2 ]);
        } catch( e ) {
            await interaction.reply({
                content  : "There was an error in executing the command. I have told the developers about it.",
                ephemeral: true
            });
            return;
        }
    }
};