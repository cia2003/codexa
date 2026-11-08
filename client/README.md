This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Authentication

The login and registration pages use the Flask API at `http://localhost:5000/api` by default. Set `NEXT_PUBLIC_API_URL` in the client environment to override that base URL. For example, use `NEXT_PUBLIC_API_URL=http://localhost:5000/api` when running the API locally.

After login, the client stores the returned JWT and user profile in browser local storage. Registration creates the account and then prompts the user to log in.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


For production, set `NEXT_PUBLIC_API_URL` to the deployed Flask API base URL (including `/api`), for example `https://api.example.com/api`. Set `CORS_ORIGINS` on the Flask deployment to the frontend origin, such as `https://app.example.com` (no path). Set `SQLALCHEMY_DATABASE_URI` on the Flask deployment to the DomCloud database connection string. Rebuild the Next.js client after changing `NEXT_PUBLIC_API_URL`.
