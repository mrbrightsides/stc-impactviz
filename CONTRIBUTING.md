# Contributing to STC ImpactViz

First off, thank you for considering contributing to STC ImpactViz! It's people like you that make STC ImpactViz such a great tool for sustainable tourism analytics.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- **Be respectful** and inclusive
- **Welcome newcomers** and help them get started
- **Accept constructive criticism** gracefully
- **Focus on what is best** for the community
- **Show empathy** towards other community members

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git
- A GitHub account
- Basic knowledge of TypeScript and React

### Setting Up Your Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/stc-impactviz.git
   cd stc-impactviz
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/stc-impactviz.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

---

## Development Process

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

Examples:
- `feature/add-ethereum-mainnet-support`
- `fix/currency-conversion-bug`
- `docs/update-api-documentation`

### Workflow

1. **Check for existing issues**
   - Search existing issues before creating a new one
   - Comment on the issue if you want to work on it

2. **Keep your fork synced**
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow coding guidelines
   - Test your changes thoroughly

4. **Commit your changes**
   - Use meaningful commit messages
   - Reference issue numbers when applicable

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use the PR template
   - Provide clear description
   - Link related issues

---

## Coding Guidelines

### TypeScript

- **Strict typing**: Always use explicit types
- **No implicit any**: Avoid `any` type whenever possible
- **Interface over type**: Use interfaces for object shapes
- **Type imports**: Use `import type` for type-only imports

```typescript
// ✅ Good
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Bad
function getUser(id: any): any {
  // ...
}
```

### React Components

- **Functional components**: Use function components with hooks
- **TypeScript interfaces**: Define prop interfaces
- **Explicit return types**: Specify return types for functions
- **Component naming**: Use PascalCase for components

```typescript
// ✅ Good
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}

// ❌ Bad
export function button(props: any) {
  return <button {...props} />
}
```

### File Structure

- **Co-location**: Keep related files together
- **Naming convention**: Use kebab-case for files
- **Barrel exports**: Use index.ts for cleaner imports

```
src/
├── components/
│   ├── stc/
│   │   ├── economic-dashboard.tsx
│   │   ├── social-dashboard.tsx
│   │   └── index.ts
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── index.ts
├── lib/
│   ├── blockchain-api.ts
│   ├── currency.ts
│   └── utils.ts
└── hooks/
    ├── use-currency.tsx
    └── use-mobile.tsx
```

### CSS/Tailwind

- **Tailwind first**: Use Tailwind utility classes
- **Semantic classes**: Use semantic naming for custom CSS
- **Responsive design**: Mobile-first approach
- **Dark mode**: Support dark mode variants

```typescript
// ✅ Good
<div className="p-4 bg-white dark:bg-slate-900 rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
    Title
  </h2>
</div>

// ❌ Bad
<div style={{ padding: '16px', backgroundColor: 'white' }}>
  <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
    Title
  </h2>
</div>
```

### Error Handling

- **Try-catch blocks**: Use for async operations
- **User-friendly messages**: Provide clear error messages
- **Console logging**: Log errors for debugging
- **Graceful degradation**: Handle errors gracefully

```typescript
// ✅ Good
try {
  const data = await fetchBlockchainData()
  setData(data)
} catch (error) {
  console.error('Failed to fetch blockchain data:', error)
  toast.error('Unable to load blockchain data. Please try again.')
}

// ❌ Bad
const data = await fetchBlockchainData()
setData(data)
```

---

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(blockchain): add ethereum mainnet support

Added support for Ethereum mainnet alongside Sepolia testnet.
Users can now switch between networks via settings.

Closes #123

---

fix(currency): correct IDR conversion rate

Fixed incorrect exchange rate for Indonesian Rupiah.
Updated rate from 15000 to 15750.

Fixes #456

---

docs(readme): update installation instructions

Added detailed steps for Windows users and troubleshooting section.
```

---

## Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests** (if available)
   ```bash
   npm test
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Check for TypeScript errors**
   ```bash
   npm run type-check
   ```

5. **Lint your code**
   ```bash
   npm run lint
   ```

### PR Template

Use this template when creating a PR:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #[issue number]

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] My code follows the project's coding guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have made corresponding changes to documentation
- [ ] My changes generate no new warnings
- [ ] I have tested my changes thoroughly

## Testing
Describe how you tested your changes.

## Additional Notes
Any additional information that reviewers should know.
```

### Review Process

1. **Automated checks**: Wait for CI/CD to pass
2. **Code review**: Address reviewer comments
3. **Update if needed**: Make requested changes
4. **Approval**: Get approval from maintainers
5. **Merge**: Maintainer will merge your PR

---

## Testing

### Manual Testing

1. **Load demo data** and verify all features work
2. **Test responsive design** on different screen sizes
3. **Check dark mode** functionality
4. **Verify exports** (PDF, XLSX, JSON)
5. **Test blockchain integration** with live data
6. **Validate AI recommendations** accuracy
7. **Check ML analytics** pattern detection

### Automated Testing (Future)

We plan to add:
- Unit tests (Jest)
- Integration tests (React Testing Library)
- E2E tests (Playwright)

---

## Documentation

### Code Documentation

- **JSDoc comments**: For complex functions
- **Inline comments**: For tricky logic
- **Type definitions**: Export all public types
- **README updates**: Update docs for new features

```typescript
/**
 * Fetch blockchain data from Sepolia network
 * @param blockCount - Number of recent blocks to fetch (default: 10)
 * @returns Promise with transactions and network stats
 * @throws {Error} If blockchain API fails
 */
export async function fetchBlockchainData(
  blockCount: number = 10
): Promise<{ transactions: BlockchainTransaction[]; stats: BlockchainStats }> {
  // Implementation
}
```

### User Documentation

When adding new features:
1. Update README.md
2. Add usage examples
3. Update CHANGELOG.md
4. Create tutorial if complex
5. Add FAQ entries if needed

---

## Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: support@stc-impactviz.com

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Added to GitHub contributors page
- Credited in documentation

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to STC ImpactViz! 🎉

Together, we're making tourism sustainability transparent and actionable.
