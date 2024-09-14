import { Inject, Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from '@/modules/prisma';
import { Prisma } from '@prisma/client';

export const TRANSACTION_SERVICE = 'TRANSACTION_SERVICE';
export const InjectTransactionService = () => Inject(TRANSACTION_SERVICE);

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly txClient: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async create(payload: Prisma.TransactionCreateArgs) {
    return await this.txClient.tx.transaction.create(payload);
  }

  async createMany(payload: Prisma.TransactionCreateManyArgs) {
    return await this.txClient.tx.transaction.createMany(payload);
  }

  async aggregate(payload: { user_id: string; guild_id: string }) {
    return (
      (
        await this.prisma.transaction.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            user_id: payload.user_id,
            guild_id: payload.guild_id,
          },
        })
      )._sum.amount ?? 0
    );
  }
}
