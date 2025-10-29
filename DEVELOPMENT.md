# Development Configuration

This file contains development setup and configuration information for contributors.

## Prerequisites

- Node.js >= 16.0.0
- npm >= 7.0.0
- Git

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Spotflow-One/vue-spotflow-checkout.git
   cd vue-spotflow-checkout
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Available Scripts

### Development
- `npm run dev` - Start Vite development server
- `npm run preview` - Preview production build locally

### Building
- `npm run build` - Build library for production
- `npm run build:analyze` - Build and analyze bundle size
- `npm run clean` - Clean dist directory

### Quality Assurance
- `npm run lint` - Run ESLint with auto-fix
- `npm run lint:check` - Run ESLint without auto-fix
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run type-check:watch` - Run type checking in watch mode
- `npm run validate` - Run all quality checks

### Testing
- `npm test` - Run test suite (placeholder)
- `npm run test:types` - Run type checking tests

### Release
- `npm run size` - Check bundle size limits
- `npm run release:dry` - Dry run npm publish
- `npm run release` - Publish to npm

## Bundle Analysis

The project includes bundle analysis tools:

- **Size Limits:** Configured in `package.json` under `size-limit`
- **Bundle Analyzer:** Run `npm run build:analyze` to see detailed bundle composition
- **CI Monitoring:** Bundle size is checked in CI/CD pipeline

### Current Size Limits
- Uncompressed: 50 KB
- Gzipped: 15 KB

## Code Quality

### ESLint Configuration
- Extends Vue 3 recommended rules
- TypeScript support enabled
- Prettier integration for formatting

### TypeScript Configuration
- Strict mode enabled
- Multiple tsconfig files for different build targets
- Declaration file generation

### Prettier Configuration
- Single quotes
- No semicolons
- Tab width: 2
- Print width: 100

## Build Outputs

The build process generates multiple formats:

1. **ES Module** (`dist/index.js`) - Modern bundlers
2. **CommonJS** (`dist/index.cjs`) - Node.js compatibility
3. **UMD** (`dist/index.umd.js`) - Browser globals
4. **Type Definitions** (`dist/*.d.ts`) - TypeScript support
5. **Nuxt Plugin** (`dist/plugin.js`, `dist/plugin.cjs`) - Nuxt.js integration

## CI/CD Pipeline

### GitHub Actions Workflows

1. **Main CI Pipeline** (`.github/workflows/ci.yml`)
   - Lint and type checking
   - Build verification
   - Bundle size analysis
   - Security audit
   - Automated NPM publishing on release

2. **Hacktoberfest Validation** (`.github/workflows/hacktoberfest.yml`)
   - PR quality assessment
   - Automated labeling
   - Contribution validation

### Quality Gates

All PRs must pass:
- ✅ ESLint checks
- ✅ Prettier formatting
- ✅ TypeScript compilation
- ✅ Bundle size limits
- ✅ Security audit

## Contributing Guidelines

### Code Style
- Follow existing patterns and conventions
- Add JSDoc comments for public APIs
- Include examples for new features
- Update type definitions for changes

### Commit Messages
Follow conventional commits format:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Formatting changes
- `refactor:` Code refactoring
- `test:` Test additions
- `chore:` Maintenance tasks

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run validate`
5. Update documentation if needed
6. Submit pull request with clear description

## Debugging

### Development Issues
- Check Node.js version compatibility
- Clear `node_modules` and reinstall if needed
- Verify all peer dependencies are installed

### Build Issues
- Run `npm run clean` before building
- Check TypeScript errors in IDE
- Verify external dependencies are properly configured

### Type Issues
- Run `npm run type-check` for detailed error information
- Check `tsconfig.json` paths and aliases
- Ensure all imports have proper type definitions

## Environment Variables

### Development
- `NODE_ENV` - Set to "development" automatically
- `VITE_*` - Vite-specific environment variables

### Build
- `NODE_AUTH_TOKEN` - NPM publishing token (CI only)
- `GITHUB_TOKEN` - GitHub Actions token (CI only)

## IDE Setup

### VS Code (Recommended)
Recommended extensions:
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- Auto Rename Tag

### Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Troubleshooting

### Common Issues

1. **Build Fails with Module Not Found**
   - Check import paths
   - Verify file extensions
   - Review `tsconfig.json` paths

2. **Type Errors in Development**
   - Restart TypeScript server
   - Check Vue SFC types
   - Verify component prop types

3. **Bundle Size Exceeds Limits**
   - Review imported dependencies
   - Check for duplicate dependencies
   - Consider code splitting

### Getting Help

- Check existing GitHub issues
- Review documentation and examples
- Contact devrel@spotflow.one for support
- Join our developer Slack community