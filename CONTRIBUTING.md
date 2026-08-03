# Contributing to MediCheck

Thank you for helping improve MediCheck.

## Before You Start

- Search existing issues before creating a new one.
- Never include real patient information, API keys, or private medical data.
- Keep the assistant's non-diagnostic and non-prescriptive boundaries intact.
- Use fictional symptom examples in screenshots, tests, and bug reports.

## Development Workflow

1. Fork the repository.
2. Create a focused branch:

   ```bash
   git checkout -b fix/clear-description
   ```

3. Configure a local `GROQ_API_KEY` in `.env.local`.
4. Run the project with `vercel dev`.
5. Test desktop and mobile layouts.
6. Test English and Roman Urdu conversations.
7. Confirm that red-flag symptoms still produce urgent-care guidance.
8. Commit with a clear message and open a pull request.

## Pull Request Checklist

- [ ] The change has one clear purpose.
- [ ] No secret or personal information is included.
- [ ] The chatbot continues the existing conversation instead of restarting.
- [ ] The chatbot asks one question at a time.
- [ ] The user-facing language remains simple and respectful.
- [ ] Error handling remains understandable to non-technical users.
- [ ] Responsive layouts were checked.
- [ ] Relevant documentation was updated.

## Reporting Safety Concerns

For security vulnerabilities or medical-safety issues, follow the private reporting guidance in [`SECURITY.md`](SECURITY.md) instead of publishing sensitive details in a public issue.
