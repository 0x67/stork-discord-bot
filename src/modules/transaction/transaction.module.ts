import { Module } from '@nestjs/common';
import { TRANSACTION_SERVICE, TransactionService } from './transaction.service';

@Module({
  providers: [
    {
      provide: TRANSACTION_SERVICE,
      useClass: TransactionService,
    },
  ],
  exports: [TRANSACTION_SERVICE],
})
export class TransactionModule {}
