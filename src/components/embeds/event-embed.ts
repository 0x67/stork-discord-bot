import { createEmbed } from '@/components/utils';
import { STORK_COLOR, STORK_IMAGE, STORK_LOGO } from '@/constants';
import { dateToTimestamp, numberToEmoji } from '@/utils';
import { Event, EventOption, EventVote } from '@prisma/client';

export enum EventStatus {
  Open = 'Open',
  Waiting = 'Waiting for admin to select answer(s)',
  Counting = 'Distributing rewards...',
  Closed = 'Closed',
}

interface CreateEventEmbedArgs {
  id: string;
  question: string;
  max_participants: number;
  event: Event & {
    options: (EventOption & {
      votes: EventVote[];
    })[];
  };
  expires_at: Date;
  status?: EventStatus;
  correct_answers?: EventOption[];
}

export const createEventEmbed = ({
  status = EventStatus.Open,
  ...args
}: CreateEventEmbedArgs) => {
  const expiringEmbedSections = [
    `🗓️ **Closed**\n`,
    `<t:${dateToTimestamp(args.expires_at)}:R>`,
  ];

  const expiringEmbed = createEmbed({
    description: expiringEmbedSections.join(''),
    color: STORK_COLOR,
  });

  const embedDetailsSections = [
    `**Max participants: ** ${args.max_participants}\n`,
    `**Minimum bet**: ${args.event.base_amount}\n`,
    `**Winning multiplier**: ${args.event.bonus_amount_multiplier}\n`,
    '**Results: **\n\n',
    `**Status: ** ${status}`,
  ];

  const pollEmbedSections = [];

  const totalVotes = args.event.options.reduce(
    (acc, option) => acc + option.votes.length,
    0,
  );

  args.event.options.forEach((option, index) => {
    const votes = option.votes.length;
    const emoji = numberToEmoji(index);

    const percentage = totalVotes === 0 ? 0 : (votes / totalVotes) * 100;
    const EOL = index === args.event.options.length - 1 ? '\n\n' : '\n';

    pollEmbedSections.push(
      `${emoji} - **${option.value}** - ${votes} / ${totalVotes} (${percentage}%)${EOL}`,
    );
  });

  pollEmbedSections.push(...embedDetailsSections);

  const pollEmbed = createEmbed({
    title: args.question,
    description: pollEmbedSections.join(''),
    // thumbnail: STORK_LOGO,
    // image: STORK_IMAGE,
    color: STORK_COLOR,
  });

  const NODE_ENV = process.env.NODE_ENV;

  const response = [pollEmbed, expiringEmbed];

  if (status === EventStatus.Closed && args.correct_answers?.length) {
    const correctAnswers = args.correct_answers
      .map((option) => numberToEmoji(option.order))
      .join(', ');

    response.push(
      createEmbed({
        description: `**Correct answers**: ${correctAnswers}`,
        color: STORK_COLOR,
      }),
    );
  }

  if (NODE_ENV === 'dev') {
    response.push(
      createEmbed({
        title: 'Dev Info',
        description: `**Poll ID**: \`\`${args.id}\`\``,
        color: STORK_COLOR,
      }),
    );
  }

  return response;
};
