"use server";

import { prisma } from '@/lib/prisma';
import { Transfer } from '../db-schema';

export async function getTransfers() {
  try {
    const transfers = await prisma.transfers.findMany({
      orderBy: { created_at: 'desc' }
    });
    return transfers;
  } catch (error) {
    console.error('Error fetching transfers:', error);
    return [];
  }
}

export async function saveTransfer(transferData: Transfer) {
  try {
    const transfer = await prisma.transfers.upsert({
      where: { id: transferData.id },
      update: {
        amount: transferData.amount,
        date: transferData.date,
        from_account: transferData.from_account,
        to_account: transferData.to_account,
        description: transferData.description,
      },
      create: {
        id: transferData.id,
        amount: transferData.amount,
        date: transferData.date,
        from_account: transferData.from_account,
        to_account: transferData.to_account,
        description: transferData.description,
      }
    });
    return transfer;
  } catch (error) {
    console.error('Error saving transfer:', error);
    throw error;
  }
}
