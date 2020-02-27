import CommandInterface from 'nlc-cli/src/CommandInterface';
import TTF from 'talkify-tts';

export default class TestCommand extends CommandInterface {

  init() {
    return this.command('test <text>');
  }

  /**
   * @param {import('nlc-cli/src/CommandRequest').default} request
   * @param {string} text
   */
  async action(request, text) {
    const player = new TTF.TtsPlayer();

    player.playText(text);
  }

}
