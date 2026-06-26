"use server";

import { prisma } from '../prisma';
import { Payment } from '../db-schema';

function mapPayment(prismaPayment: any): Payment {
  return {
    id: prismaPayment.id,
    student_id: prismaPayment.student_id,
    amount: prismaPayment.amount,
    payment_date: prismaPayment.payment_date,
    period_covered: prismaPayment.period_covered,
  };
}

export async function getPayments(): Promise<Payment[]> {
  try {
    const payments = await prisma.payments.findMany({
      orderBy: { payment_date: 'desc' },
    });
    return payments.map(mapPayment);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
}
  
export async function getPaymentById(id: string): Promise<Payment | null> {
  try {
    const payment = await prisma.payments.findUnique({
      where: { id },
    });
    if (!payment) return null;
    return mapPayment(payment);
  } catch (error) {
    console.error('Error fetching payment by id:', error);
    return null;
  }
}

export async function savePayment(payment: Payment): Promise<boolean> {
  try {
    await prisma.payments.upsert({
      where: { id: payment.id },
      update: {
        student_id: payment.student_id,
        amount: payment.amount,
        payment_date: payment.payment_date,
        period_covered: payment.period_covered,
      },
      create: {
        id: payment.id,
        student_id: payment.student_id,
        amount: payment.amount,
        payment_date: payment.payment_date,
        period_covered: payment.period_covered,
      },
    });
    return true;
  } catch (error) {
    console.error('Error saving payment:', error);
    return false;
  }
}
