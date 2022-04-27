import { Canvacord }                                     from "canvacord";
import { Command, CommandCategories }                    from "../../handlers/command";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, MessageAttachment, User }   from "discord.js";
import { Vibey }                                         from "../../handlers/client";

export default class Comment extends Command {
    public category: CommandCategories = "IMAGE";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup" | any> {
        return new SlashCommandBuilder()
            .setName("comment")
            .setDescription("Generate a PornHub themed comment.")
            .addStringOption(( s: SlashCommandStringOption )=>
                s
                    .setName("text")
                    .setDescription("The text you want to comment.")
                    .setRequired(true)
            );
    }

    async handle( interaction: CommandInteraction, client: Vibey ): Promise<void> {

        try {
            const user: ( User | null ) = interaction.options.getUser("user") ?? interaction.user;

            if( !interaction?.guild?.me?.permissions.has("ATTACH_FILES") ) {
                await interaction.reply("I require \"ATTACH_FILES\" permission to use this command.");
                return;
            }

            const comment: Buffer = await Canvacord.phub({
                username: `${ user.username }`,
                message : `${ interaction.options.getString("text") }`,
                image   : `${ user.avatarURL({ format: "png" }) }`
            });

            const attachment: MessageAttachment = new MessageAttachment(comment, "comment.jpeg");
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