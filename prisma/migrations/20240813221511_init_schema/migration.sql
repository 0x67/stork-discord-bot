-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM (
  'admin_gift',
  'admin_remove',
  'event_entry',
  'event_end',
  'event_win',
  'event_loss'
);
-- CreateTable
CREATE TABLE "events" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "guild_id" TEXT NOT NULL,
  "channel_id" TEXT NOT NULL,
  "created_by" TEXT NOT NULL,
  "base_amount" INTEGER NOT NULL DEFAULT 1,
  "bonus_amount_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "max_participants" INTEGER NOT NULL DEFAULT 50,
  "message_id" TEXT,
  "expires_at" TIMESTAMPTZ,
  "closed" BOOLEAN NOT NULL DEFAULT false,
  "question" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ,
  CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "event_options" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "event_id" UUID NOT NULL,
  "value" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "correct" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ,
  CONSTRAINT "event_options_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "event_votes" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "event_id" UUID NOT NULL,
  "option_id" UUID NOT NULL,
  "user_id" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "snapshot_bonus_amount_multiplier" DOUBLE PRECISION NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ,
  CONSTRAINT "event_votes_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "transactions" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" TEXT NOT NULL,
  "guild_id" TEXT NOT NULL,
  "amount" INTEGER NOT NULL DEFAULT 0,
  "type" "TransactionType" NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ,
  "event_vote_id" UUID,
  CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "logs" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "guild_id" TEXT,
  "channel_id" TEXT,
  "user_id" TEXT,
  "command" TEXT,
  "command_id" TEXT,
  "error" JSONB,
  "interaction" JSONB,
  "message" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE INDEX "events_id_guild_id_channel_id_idx" ON "events"("id", "guild_id", "channel_id");
-- CreateIndex
CREATE INDEX "event_options_event_id_id_idx" ON "event_options"("event_id", "id");
-- CreateIndex
CREATE INDEX "event_votes_event_id_option_id_user_id_idx" ON "event_votes"("event_id", "option_id", "user_id");
-- CreateIndex
CREATE INDEX "transactions_guild_id_user_id_amount_type_idx" ON "transactions"("guild_id", "user_id", "amount", "type");
-- AddForeignKey
ALTER TABLE "event_options"
ADD CONSTRAINT "event_options_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "event_votes"
ADD CONSTRAINT "event_votes_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "event_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "event_votes"
ADD CONSTRAINT "event_votes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "transactions"
ADD CONSTRAINT "transactions_event_vote_id_fkey" FOREIGN KEY ("event_vote_id") REFERENCES "event_votes"("id") ON DELETE
SET NULL ON UPDATE CASCADE;