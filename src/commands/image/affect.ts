import Canvacord                                                    from "canvacord";
import { Command, CommandCategories }                               from "../../handlers/command";
import { SlashCommandBuilder, SlashCommandUserOption }              from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageAttachment, User } from "discord.js";
import { Vibey }                                                    from "../../handlers/client";
import * as Buffer                                                  from "buffer";


export default class Affect extends Command {
    public category: CommandCategories = "IMAGE";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("affect")
            .setDescription("Does this affect me?")
            .addUserOption(( cmd )=>
                cmd
                    .setName("user")
                    .setDescription("The user you want to affect.")
                    .setRequired(false)
            );
    }

    async handle( interaction: CommandInteraction, client: Vibey ) {
        const user: ( SlashCommandUserOption | any ) = interaction.options.get("user")?.user ?? interaction.user;

        try {
            if( !interaction?.guild?.me?.permissions.has("ATTACH_FILES") ) {
                await interaction.channel?.send("I do not have permissions to attach files.");
            }

            const img: Buffer = await Canvacord.Canvacord.affect(`${ user.avatarURL({ format: "png" }) }`);

            const attachment: MessageAttachment = new MessageAttachment(img, "affect.png");

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