# Get-me-chai ☕

Get-me-chai is a website where people can support their favourite creators by buying them a chai. A fan doesn't need to make an account to pay, and the money goes directly to the creator's Razorpay account.

I made this while learning Next.js. It started as a Patreon clone from a course, and then I kept adding my own features to it.

Live link: coming soon

## What it does

- Login with Google or GitHub
- Two types of accounts: creator and user
- Anyone can support a creator with just a name and an amount, no login needed
- Every creator gets their own page at `/username`
- Creators can post a caption with an image, and logged in users can like the posts
- Creator dashboard shows total money raised, supporters, post stats and a graph of the last 30 days
- You can search creators from the navbar, or see all of them on the `/explore` page
- Razorpay secret keys are saved in encrypted form in the database

## Tech used

![Next JS](https://img.shields.io/badge/Next-black?style=plastic&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-%2320232a.svg?style=plastic&logo=react&logoColor=%2361DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=plastic&logo=mongodb&logoColor=white) ![Tailwind](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=plastic&logo=tailwind-css&logoColor=white) ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=plastic&logo=vercel&logoColor=white)

Next.js, NextAuth, MongoDB with Mongoose, Razorpay, Tailwind CSS and Recharts.

## How payment works

1. The creator adds their own Razorpay key ID and secret in the dashboard.
2. A fan opens the creator's page, types a name and amount, and pays.
3. The server checks the payment, and only after that it shows in the supporters list.

Each creator uses their own Razorpay keys, so the money never comes to me.

## Run it on your computer

```bash
git clone https://github.com/kg877253/Get-me-chai.git
cd Get-me-chai
npm install
```

Make a file named `.env.local` in the main folder and add the values from the table below. Then run:

```bash
npm run dev
```

Open http://localhost:3000

## Environment variables

| Name | What to put |
| --- | --- |
| `MONGODB_URI` | Your MongoDB connection link |
| `NEXTAUTH_URL` | Your site link (`http://localhost:3000` on your computer) |
| `NEXTAUTH_SECRET` | Any long random string |
| `GOOGLE_ID`, `GOOGLE_SECRET` | From Google Cloud Console |
| `GITHUB_ID`, `GITHUB_SECRET` | From GitHub developer settings |
| `NEXT_PUBLIC_BASE_URL` | Your site link again, used after a payment |
| `ENCRYPTION_KEY` | 64 character key used to encrypt Razorpay secrets |

You can make a random key for `ENCRYPTION_KEY` and `NEXTAUTH_SECRET` like this:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Don't share these values and don't push `.env.local` to GitHub. Also save `ENCRYPTION_KEY` somewhere safe, because if it is lost the saved Razorpay secrets can't be read again.

For testing, use Razorpay test mode keys so no real money is used.

