import { BalanceCommand } from '@/modules/command/balance/balance.command';
import { BalanceModal } from '@/modules/command/balance/balance.modal';
import { TransactionService, TRANSACTION_SERVICE } from '@/modules/transaction';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    BalanceCommand,
    BalanceModal,
    {
      useClass: TransactionService,
      provide: TRANSACTION_SERVICE,
    },
  ],
})
export class BalanceModule {}
