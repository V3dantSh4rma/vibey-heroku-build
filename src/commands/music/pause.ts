import { audioPlayer }                           from "../../handlers/player";
import { Command, CommandCategories }            from "../../handlers/command";
import { SlashCommandBuilder }                   from "@discordjs/builders";
import { CommandInteraction, VoiceBasedChannel } from "discord.js";
import { Vibey }                                 from "../../handlers/client";

export default class Pause extends Command {
    public category: CommandCategories = "MUSIC";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("pause")
            .setDescription("Pause the current playing music.");
    }

    async handle( interaction: CommandInteraction, client: Vibey ) {
        const vc: ( VoiceBasedChannel | null | undefined ) = interaction.guild?.members.cache.get(interaction.id)?.voice.channel;
        await interaction.deferReply();

        try {
            if( !vc ) {
                await interaction.followUp({ content: "You have to be in a voice channel to use this command." });
                return;
            }

            if( !interaction?.guild?.me?.voice.channel ) {
                await interaction.followUp({ content: "I am not in a Voice Channel currently." });
                return;
            }

            if( vc!.id !== interaction!.guild!.me!.voice!.channel!.id ) {
                await interaction.followUp({ content: "You have to be in the same voice channel as me to use this command." });
                return;
            }

            audioPlayer.pause();
            await interaction.followUp({ content: "Successfully Paused the player." });
        } catch( e ) {
            await interaction.reply({
                content  : "There was an error in executing the command. I have told the developers about it.",
                ephemeral: true
            });
            return;
        }
    }
}