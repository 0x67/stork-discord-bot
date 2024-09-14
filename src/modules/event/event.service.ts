import { Inject, Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from '@/modules/prisma';
import { Prisma } from '@prisma/client';

export const EVENT_SERVICE = 'EVENT_SERVICE';
export const InjectEventService = () => Inject(EVENT_SERVICE);

@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly txClient: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async create(payload: Prisma.EventCreateArgs) {
    return await this.txClient.tx.event.create(payload);
  }

  async findOne(id: string, includeVotes = false) {
    return await this.prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        options: {
          orderBy: {
            order: 'asc',
          },
          include: {
            votes: includeVotes,
          },
        },
      },
    });
  }

  async update(id: string, payload: Prisma.EventUpdateInput) {
    return await this.txClient.tx.event.update({
      where: {
        id,
      },
      data: payload,
    });
  }

  async createUserVote(payload: Prisma.EventVoteCreateInput) {
    return await this.txClient.tx.eventVote.create({
      data: payload,
    });
  }

  async getUserVote(event_id: string, user_id: string) {
    return await this.prisma.eventVote.findFirst({
      where: {
        event_id,
        user_id,
      },
      include: {
        option: {
          select: {
            value: true,
          },
        },
      },
    });
  }

  async getTotalVotes(event_id: string) {
    return await this.prisma.eventVote.count({
      where: {
        event_id,
      },
    });
  }

  async updateSelectedAnswers(event_id: string, option_ids: string[]) {
    await this.txClient.tx.eventOption.updateMany({
      where: {
        event_id,
      },
      data: {
        correct: false,
      },
    });

    await this.txClient.tx.eventOption.updateMany({
      where: {
        event_id,
        id: {
          in: option_ids,
        },
      },
      data: {
        correct: true,
      },
    });
  }
}
