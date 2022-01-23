# Yeoman Project Setup Generator

## 0. Table of content

- [Yeoman Project Setup Generator](#yeoman-project-setup-generator)
  - [0. Table of content](#0-table-of-content)
  - [1. How to install generators](#1-how-to-install-generators)
  - [2. Available generators](#2-available-generators)
    - [ ] [2.1. Setup editor configuration](#21-setup-editor-configuration)
      - [x] [2.1.1. .editorconfig](#211-editorconfig)
      - [ ] [2.1.2. .vscode](#212-vscode)
    - [ ] [2.2. Setup project code linting and formatting](#22-setup-project-code-linting-and-formatting)
      - [ ] [2.2.1. Javascript](#221-javascript)
      - [ ] [2.2.2. Typescript](#222-typescript)
      - [ ] [2.2.3. CSS/SCSS](#223-cssscss)
      - [ ] [2.2.4. Markdown](#224-markdown)
    - [2.3. Setup git](#23-setup-git)
      - [ ] [2.3.1. git commit linting](#231-git-commit-linting)
      - [ ] [2.3.2. git hooks](#232-git-hooks)
    - [x]  [2.4. Setup NPM project](#24-setup-npm-project)
    - [ ] [2.5. Setup typescript](#25-setup-typescript)
    - [ ] [2.6. Setup webpack](#26-setup-webpack)
    - [ ] [2.7. Setup testing](#27-setup-testing)
      - [ ] [2.7.1. Karma](#271-karma)
      - [ ] [2.7.2. Cypress](#272-cypress)
    - [ ] [2.8. Setup translations](#28-setup-translations)
  - [3. How to contribute](#3-how-to-contribute)

## 1. How to install generators

Global install yeoman cli

```bash
npm install -g yo
```

## 2. Available generators

### 2.1. Setup editor configuration

#### 2.1.1. .editorconfig

```bash
yo xes-project:editorconfig
```

#### 2.1.2. .vscode

### 2.2. Setup project code linting and formatting

#### 2.2.1. Javascript

#### 2.2.2. Typescript

#### 2.2.3. CSS/SCSS

#### 2.2.4. Markdown

```bash
yo xes-project:markdownlint
```

### 2.3. Setup git

```bash
yo xes-project:git
```

#### 2.3.1. git commit linting

#### 2.3.2. git hooks

### 2.4. Setup NPM project

```bash
yo xes-project:npm
```

### 2.5. Setup typescript

```bash
yo xes-project:typescript
```

### 2.6. Setup webpack

```bash
yo xes-project:webpack
```

### 2.7. Setup testing

#### 2.7.1. Karma

```bash
yo xes-project:karma
```

#### 2.7.2. Cypress

```bash
yo xes-project:cypress
```

### 2.8. Setup translations

```bash
yo xes-project:i18n
```

## 3. How to contribute

## 4. About generator development

### 4.1 Linting and formatting

Using jsonlint for lint-staged ignores editorconfig indentation configuration(allways uses spaces). Its formatting is closest to what vscode (vscode.json-language-features) formatting does. Looks better than what prettier formatting but cannot handle json with comments.

__Idea__: use [vscode language server](https://github.com/microsoft/vscode-languageserver-node) to format committed code consistent with vscode setup.
[More info about Language Server](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide)
