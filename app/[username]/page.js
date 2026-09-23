import React from 'react'
import Paymentpage from '../../components/Paymentpage'
import { notFound } from 'next/navigation'
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
  // Await the params Promise to access its properties
  const { username } = await params;
  const user = await fetchuser(username);
  //Agar user nahi mila to 404 page dikhao
  if (user.error === "User not found") {
    return <Notfoundpage />;
  }

  else {
    return <>
      {<Paymentpage key={username} username={username} />}
    </>
  }
}
