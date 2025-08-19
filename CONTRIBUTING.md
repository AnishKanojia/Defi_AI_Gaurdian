# 🤝 Contributing to CryptoVault Sentinel

## 🎯 **Welcome Contributors!**

Thank you for your interest in contributing to **CryptoVault Sentinel**! This document provides guidelines and information for contributors who want to help improve our DeFi security platform.

## 📋 **Table of Contents**

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Community](#community)

## 📜 **Code of Conduct**

### **Our Standards**
- **Respectful**: Treat all contributors with respect
- **Inclusive**: Welcome contributors from all backgrounds
- **Professional**: Maintain professional communication
- **Constructive**: Provide constructive feedback and suggestions

### **Unacceptable Behavior**
- Harassment or discrimination
- Trolling or inflammatory comments
- Spam or off-topic discussions
- Personal attacks or insults

## 🚀 **Getting Started**

### **Before You Start**
1. **Familiarize yourself** with the project structure
2. **Read the documentation** to understand the codebase
3. **Check existing issues** to see what needs work
4. **Join our community** to discuss ideas and get help

### **Ways to Contribute**
- 🐛 **Bug Fixes**: Fix reported issues
- ✨ **New Features**: Implement requested features
- 📚 **Documentation**: Improve docs and guides
- 🧪 **Testing**: Write tests and improve coverage
- 🎨 **UI/UX**: Enhance user interface and experience
- 🔒 **Security**: Improve security features
- 🌐 **Localization**: Add new languages
- 📱 **Mobile**: Improve mobile experience

## 🔧 **Development Setup**

### **Prerequisites**
- **Node.js**: 18.0.0 or higher
- **Python**: 3.11 or higher
- **Git**: Latest version
- **Firebase Account**: For development testing

### **Fork and Clone**
```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/your-username/cryptovault-sentinel.git
cd cryptovault-sentinel

# Add upstream remote
git remote add upstream https://github.com/original-owner/cryptovault-sentinel.git
```

### **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

### **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### **Environment Configuration**
1. Copy `.env.example` to `.env`
2. Configure Firebase credentials
3. Set up API keys and RPC URLs

## 📝 **Contributing Guidelines**

### **Branch Naming Convention**
```
feature/feature-name
bugfix/issue-description
hotfix/critical-fix
docs/documentation-update
test/test-improvements
```

### **Commit Message Format**
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Build/tooling changes

**Examples:**
```
feat(auth): add two-factor authentication
fix(dashboard): resolve chart rendering issue
docs(api): update endpoint documentation
style(ui): improve button component styling
```

### **Pull Request Guidelines**
1. **Create a feature branch** from `main`
2. **Make focused changes** - one PR per feature/fix
3. **Write clear commit messages** following conventions
4. **Add tests** for new functionality
5. **Update documentation** as needed
6. **Ensure all tests pass** before submitting

## 🎨 **Code Standards**

### **Frontend (React/TypeScript)**

#### **Component Structure**
```typescript
// Component file structure
import React from 'react';
import { ComponentProps } from './types';

interface ComponentProps {
  // Props interface
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  
  return (
    // JSX
  );
};
```

#### **Naming Conventions**
- **Components**: PascalCase (`UserProfile`, `RiskDashboard`)
- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase (`userName`, `riskScore`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)
- **Types/Interfaces**: PascalCase (`UserSettings`, `AlertType`)

#### **Code Style**
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use destructuring for props
- Implement proper error boundaries
- Follow React best practices

### **Backend (Python/FastAPI)**

#### **Code Structure**
```python
# File structure
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

class ModelName(BaseModel):
    field1: str
    field2: Optional[int] = None

@app.get("/endpoint")
async def endpoint_function(param: str) -> dict:
    # Function logic
    return {"result": "success"}
```

#### **Naming Conventions**
- **Functions**: snake_case (`get_user_settings`)
- **Variables**: snake_case (`user_id`, `risk_score`)
- **Classes**: PascalCase (`UserService`, `RiskAnalyzer`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_CONTRACT_SIZE`)
- **Files**: snake_case (`user_service.py`, `risk_analyzer.py`)

#### **Code Style**
- Follow PEP 8 guidelines
- Use type hints for all functions
- Implement proper error handling
- Use async/await for I/O operations
- Follow FastAPI best practices

### **General Standards**
- **Documentation**: Comment complex logic
- **Error Handling**: Implement proper error handling
- **Logging**: Use appropriate logging levels
- **Security**: Follow security best practices
- **Performance**: Consider performance implications

## 🧪 **Testing**

### **Frontend Testing**
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- ComponentName.test.tsx

# Run tests in watch mode
npm test -- --watch
```

#### **Test Structure**
```typescript
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    // Test user interactions
  });
});
```

### **Backend Testing**
```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_service.py

# Run tests in verbose mode
pytest -v
```

#### **Test Structure**
```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_endpoint():
    response = client.get("/endpoint")
    assert response.status_code == 200
    assert response.json() == {"expected": "result"}
```

### **Testing Guidelines**
- **Coverage**: Aim for 80%+ test coverage
- **Unit Tests**: Test individual functions/components
- **Integration Tests**: Test API endpoints and database
- **E2E Tests**: Test complete user workflows
- **Mocking**: Mock external dependencies

## 🔄 **Pull Request Process**

### **1. Preparation**
- [ ] Fork the repository
- [ ] Create a feature branch
- [ ] Make your changes
- [ ] Write/update tests
- [ ] Update documentation

### **2. Submission**
- [ ] Push to your fork
- [ ] Create a pull request
- [ ] Fill out the PR template
- [ ] Link related issues
- [ ] Request reviews

### **3. Review Process**
- [ ] Address review comments
- [ ] Make requested changes
- [ ] Ensure CI/CD passes
- [ ] Get approval from maintainers

### **4. Merge**
- [ ] Squash commits if needed
- [ ] Merge to main branch
- [ ] Delete feature branch
- [ ] Celebrate! 🎉

### **PR Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Test improvement
- [ ] Other

## Testing
- [ ] Tests pass locally
- [ ] New tests added
- [ ] Documentation updated

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Code commented where needed
- [ ] Changes generate no new warnings

## Screenshots (if applicable)
Add screenshots for UI changes

## Additional Notes
Any additional information
```

## 🐛 **Issue Reporting**

### **Bug Report Template**
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment**
- OS: [e.g., Windows 10, macOS 11]
- Browser: [e.g., Chrome 90, Firefox 88]
- Version: [e.g., 1.0.0]

## Screenshots
Add screenshots if applicable

## Additional Context
Any other context about the problem
```

### **Issue Guidelines**
- **Search first**: Check if issue already exists
- **Be specific**: Provide clear reproduction steps
- **Include details**: OS, browser, version information
- **Add screenshots**: Visual evidence helps
- **Be respectful**: Maintain professional tone

## 💡 **Feature Requests**

### **Feature Request Template**
```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this work?

## Alternatives Considered
Other approaches you considered

## Additional Context
Any other relevant information
```

### **Feature Request Guidelines**
- **Explain the problem**: Why is this needed?
- **Provide examples**: How would this work?
- **Consider impact**: What's the scope?
- **Be realistic**: Consider development effort

## 🌟 **Community**

### **Communication Channels**
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time chat and collaboration
- **Email**: Security issues and private matters

### **Getting Help**
1. **Check documentation** first
2. **Search existing issues** for similar problems
3. **Ask in discussions** for general questions
4. **Create an issue** for bugs or features
5. **Join Discord** for real-time help

### **Contributor Recognition**
- **Contributors list** in README
- **Special badges** for significant contributions
- **Mention in release notes** for major features
- **Community spotlight** for outstanding work

## 📚 **Resources**

### **Documentation**
- [Project Documentation](./PROJECT_DOCUMENTATION.md)
- [API Reference](./API_REFERENCE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

### **External Resources**
- [React Documentation](https://reactjs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Material-UI Documentation](https://mui.com/)
- [Firebase Documentation](https://firebase.google.com/docs)

### **Development Tools**
- [VS Code](https://code.visualstudio.com/) - Recommended editor
- [Prettier](https://prettier.io/) - Code formatting
- [ESLint](https://eslint.org/) - JavaScript linting
- [Black](https://black.readthedocs.io/) - Python formatting
- [Pylint](https://www.pylint.org/) - Python linting

## 🎉 **Thank You!**

Your contributions help make CryptoVault Sentinel better for everyone in the DeFi community. Whether you're fixing bugs, adding features, improving documentation, or just providing feedback, your help is greatly appreciated!

### **Questions?**
If you have any questions about contributing, feel free to:
- Open a GitHub discussion
- Join our Discord community
- Contact the maintainers directly

**Happy coding! 🚀**
