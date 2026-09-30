import React from 'react'
import Paymentpage from '../../components/Paymentpage'
import { fetchuser } from '@/actions/useraction'
import Notfoundpage from '../notfound/page';

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

  // Creator nahi mila, ya role creator nahi hai (fan/user ka koi public page nahi)
  if (user.error || user.role !== "creator") {
    return <Notfoundpage />;
  }

  return <Paymentpage key={username} username={username} />;
}