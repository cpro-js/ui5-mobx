# Contribution Guidelines

We welcome any contribution to `ui5-mobx`:
- bug reports
- feature requests
- pull requests
- suggestions
- usage questions
- ...

We're using [Github Issues](https://github.com/cpro-js/ui5-mobx/issues) and 
[Pull Requests](https://github.com/cpro-js/ui5-mobx/pulls) as main line of communication. 

## Code Contributions 

### Prerequisites
* Node.js
* Yarn
 
### Setup
Clone the repo.

```shell
yarn install
```

### Running Unit Tests
To run the **unit tests**:
```shell
yarn test
```

### Commits & Pull Requests
We love [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) and use them to drive
our semantic versioning. Try to adhere to these conventions. `ui5-mobx` uses the following `types`:
- `fix`: Bug fixes, fixing typos, etc.
- `feat`: New features
- `chore`: 
- `doc`: Documentation changes
- `refactor`: Refactoring code
- `build`: changes to the build process

We will probably squash your commits before merging them into the `main` branch.
So also adhere to conventional commits within the title of your pull request.
Examples:
* fix: typo in README
* feat: my new feature
* ...

## Maintaining
Only available for maintainers.

### Release
```shell
yarn release
```
