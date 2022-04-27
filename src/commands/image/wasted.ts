import { Canvacord }                                   from "canvacord";
import { Command, CommandCategories }                  from "../../handlers/command";
import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CommandInteraction, MessageAttachment }       from "discord.js";
import { Vibey }                                       from "../../handlers/client";
import Buffer                                          from "buffer";


export default class Wasted extends Command {
    public category: CommandCategories = "IMAGE";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("wasted")
            .setDescription("Wasted...")
            .addUserOption(( user: SlashCommandUserOption )=>
                user
                    .setName("user")
                    .setDescription("The user you want to use this command on")
                    .setRequired(false)
            );
    }

    async handle( interaction: CommandInteraction, client: Vibey ): Promise<void> {
        const user: ( SlashCommandUserOption | any ) = interaction.options.get("user")?.user ?? interaction.user;

        try {
            if( !interaction?.guild?.me?.permissions.has("ATTACH_FILES") ) {
                await interaction.channel?.send("I do not have permissions to attach files.");
            }

            const img: Buffer = await Canvacord.wasted(`${ user.avatarURL({ format: "png" }) }`);

            const attachment: MessageAttachment = new MessageAttachment(img, "wasted.png");

            await interaction.reply({ files: [ attachment ] });
        } catch( e ) {
            await interaction.reply({
                content  : "There was an error in executing the command. I have told the developers about it.",
                ephemeral: true
            });
            return;
        }
    }
}