# Security Policy

## Supported Version

The latest version on the `main` branch receives security and safety fixes.

## Reporting a Vulnerability

Please report vulnerabilities privately to the repository owner through GitHub's private vulnerability reporting feature when available. Include:

- a clear description of the issue;
- steps to reproduce it;
- the potential impact;
- a proposed fix, if known.

Do not include real patient information or active API keys in a report.

## Sensitive Data Rules

- Keep `GROQ_API_KEY` only in local environment files or Vercel environment variables.
- Never expose secrets in frontend code.
- Never commit `.env` or `.env.local`.
- Do not store patient conversations without explicit consent and an appropriate privacy design.
- Avoid logging raw patient messages in production.

## Medical-Safety Issues

Treat failures involving emergency red flags, unsafe diagnosis, medication instructions, or misleading medical summaries as high-priority safety issues.
