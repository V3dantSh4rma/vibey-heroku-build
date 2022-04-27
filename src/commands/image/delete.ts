import { Command, CommandCategories }                  from "../../handlers/command";
import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CommandInteraction, MessageAttachment, User } from "discord.js";
import { Vibey }                                       from "../../handlers/client";
import { Canvacord }                                   from "canvacord";


export default class Delete extends Command {
    public category: CommandCategories = "IMAGE";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("delete")
            .setDescription("Generate a delete meme.")
            .addUserOption(( user: SlashCommandUserOption )=>
                user
                    .setName("user")
                    .setDescription("The user you want to use this command at.")
                    .setRequired(false)
            );
    }

    async handle( interaction: CommandInteraction, client: Vibey ) {
        const user: ( User | null ) = interaction.options.getUser("user") ?? interaction.user;

        if( !interaction!.guild!.me!.permissions.has("ATTACH_FILES") ) {
            return await interaction.reply("I require \"ATTACH_FILES\" Permissions to use this command.");
        }

        try {
            const deleteBuffer: Buffer          = await Canvacord.delete(user.avatarURL({ format: "png" }) as string, true);
            const attachment: MessageAttachment = new MessageAttachment(deleteBuffer, "delete.jpeg");

            await interaction.reply({
                files: [ attachment ]
            });
        } catch( e ) {
            await interaction.reply({
                content  : "There was an error in executing the command. I have told the developers about it.",
                ephemeral: true
            });
            return;
        }
    }
}