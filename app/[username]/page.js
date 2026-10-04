import React from 'react'
import { notFound } from 'next/navigation'
import Paymentpage from '../../components/Paymentpage'
import { fetchuser } from '@/actions/useraction'

export async function generateMetadata({ params }) {
  const { username } = await params;
  const user = await fetchuser(username);

  return {
    title: `${username} - GetMeAChai`,
    description: user.error
      ? `Support ${username} on GetMeAChai.`
      : `Support ${user.name || username} on GetMeAChai.`,
  };
}

export default async function Username({ params }) {
  const { username } = await params;
  const user = await fetchuser(username);

  if (user.error || user.role !== "creator") {
    notFound();
  }

  return <Paymentpage key={username} username={username} />;
}