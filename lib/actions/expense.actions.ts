"use server";

import { prisma } from '@/lib/prisma';

export async function getExpenses() {
  try {
    const expenses = await prisma.expenses.findMany({
      orderBy: { date: 'desc' }
    });
    return expenses;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
}

export async function saveExpense(expenseData: any) {
  try {
    const expense = await prisma.expenses.upsert({
      where: { id: expenseData.id },
      update: {
        amount: expenseData.amount,
        date: expenseData.date,
        category: expenseData.category,
        description: expenseData.description,
        recipient_name: expenseData.recipient_name,
        teacher_id: expenseData.teacher_id,
        payment_method: expenseData.payment_method || 'Efectivo',
      },
      create: {
        id: expenseData.id,
        amount: expenseData.amount,
        date: expenseData.date,
        category: expenseData.category,
        description: expenseData.description,
        recipient_name: expenseData.recipient_name,
        teacher_id: expenseData.teacher_id,
        payment_method: expenseData.payment_method || 'Efectivo',
      }
    });
    return expense;
  } catch (error) {
    console.error('Error saving expense:', error);
    throw error;
  }
}
