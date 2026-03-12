# DrHorns Desktop Tutorial

A simple todo list app built with vanilla HTML, CSS, and JavaScript. Tasks persist in your browser using localStorage.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- Add, complete, and delete tasks
- Double-click a task to edit it inline
- Clear all completed tasks in one click
- Smooth slide-in and fade-out animations
- Tasks persist across browser sessions (localStorage)
- Dark/light theme toggle (remembered across sessions)
- Filter tasks: All, Active, or Done
- Live task counter
- Fully responsive design
- No dependencies — pure HTML, CSS, and JS

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DrHorns/-DrHorns-desktop-tutorial.git
   cd -DrHorns-desktop-tutorial
   ```

2. Open `index.html` in your browser.

## Usage

1. Type a task in the input field and click **Add** (or press Enter)
2. Click the checkbox to mark a task as done
3. Click the **x** button to delete a task
4. Use the **All / Active / Done** filter tabs to view specific tasks
5. Click the moon/sun icon to toggle dark/light theme
6. Double-click a task's text to **edit** it (Enter to save, Escape to cancel)
7. Click **Clear done** to remove all completed tasks at once

## Project Structure

```
index.html   — App markup
style.css    — Styles, CSS variables, and theme support
app.js       — Todo logic and localStorage persistence
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

<!-- Specify your license here, e.g.: -->
<!-- This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->
