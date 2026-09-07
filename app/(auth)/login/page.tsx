"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { User } from '@/lib/db-schema';
import { getUsers } from '@/lib/actions/user.actions';

export default function LoginPage() {
  const router = useRouter();
  const [dbUsers, setDbUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then(setDbUsers);
  }, []);

  const handleLoginSuccess = (user: User) => {
    router.push('/dashboard');
  };

  const addLog = (action: string, status: 'SUCCESS' | 'DENIED' | 'INFO', msg: string) => {
    console.log(`[${status}] ${action}: ${msg}`);
  };

  return (
    <LoginForm onLoginSuccess={handleLoginSuccess} addLog={addLog} dbUsers={dbUsers} />
  );
}
