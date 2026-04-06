---
title: "How to Build a Terminal UI Application with Go and Bubble Tea"
description: "A practical guide to building interactive terminal UI applications in Go using the Bubble Tea framework. Learn the Elm architecture pattern, handle keyboard input, and create real TUI apps."
pubDate: 2026-04-06
tags: ["go", "bubble-tea", "terminal-ui", "cli", "tutorial"]
faq:
  - question: "What is Bubble Tea in Go?"
    answer: "Bubble Tea is a Go framework for building interactive terminal UI (TUI) applications. It uses the Elm architecture pattern with three core concepts: a Model that holds application state, an Update function that handles messages and user input, and a View function that renders the UI as a string. It is maintained by Charm and is one of the most popular TUI frameworks in the Go ecosystem."
  - question: "Is Bubble Tea good for production applications?"
    answer: "Yes. Bubble Tea is used in production by companies and open-source projects. It handles terminal resizing, mouse events, alternate screen buffers, and concurrent operations via commands. The framework is well-tested and actively maintained with over 28,000 GitHub stars."
  - question: "How does Bubble Tea compare to other Go TUI frameworks?"
    answer: "Bubble Tea uses a functional, Elm-inspired architecture which makes state management predictable. Alternatives like tview use a widget-based approach similar to traditional GUI frameworks. Bubble Tea is generally preferred for custom, highly interactive UIs, while tview works well for standard dashboard layouts with tables and forms."
  - question: "Can I use Bubble Tea for database clients or SQL tools?"
    answer: "Yes. Bubble Tea is well-suited for building database clients and SQL tools. You can create interactive query editors, result tables, and connection managers. I built GOSQLIT — an open-source terminal SQL client with Bubble Tea that supports PostgreSQL, MySQL, and SQLite with encrypted credential storage."
  - question: "What is the Elm architecture in Bubble Tea?"
    answer: "The Elm architecture in Bubble Tea is a pattern where your application has three parts: a Model struct that holds all state, an Update method that receives messages (like key presses) and returns a new model, and a View method that takes the current model and returns a string to render. This unidirectional data flow makes TUI applications easier to reason about and debug."
---

Bubble Tea is a Go framework for building interactive terminal user interface (TUI) applications using the Elm architecture pattern. It lets you create rich, keyboard-driven terminal apps — from simple selection menus to full database clients — with a clean, functional programming model that keeps your code maintainable as complexity grows.

In this guide, I will walk through building a terminal UI application with Go and Bubble Tea from scratch, based on patterns I used when building [GOSQLIT](https://github.com/imran-vz/gosqlit), a terminal SQL client that supports multiple databases.

## Prerequisites

Before starting, make sure you have:

- **Go 1.21 or later** installed
- A terminal emulator (any modern terminal works)
- Basic familiarity with Go structs and interfaces

## Setting Up the Project

Create a new Go module and install Bubble Tea:

```bash
mkdir my-tui-app && cd my-tui-app
go mod init my-tui-app
go get github.com/charmbracelet/bubbletea
```

## Understanding the Elm Architecture

Bubble Tea applications are built around three concepts:

1. **Model** — A struct that holds your entire application state
2. **Update** — A method that receives messages (key presses, timer ticks, API responses) and returns an updated model
3. **View** — A method that takes the current model and returns a string to render in the terminal

Data flows in one direction: **View renders Model → User input creates Messages → Update processes Messages into new Model → View re-renders**.

This pattern makes state changes predictable. Every UI change traces back to a specific message handled in Update.

## Building Your First Bubble Tea App

Let us build a simple todo list with keyboard navigation. Create `main.go`:

```go
package main

import (
    "fmt"
    "os"

    tea "github.com/charmbracelet/bubbletea"
)

// Model holds the application state
type model struct {
    items    []string
    cursor   int
    selected map[int]struct{}
}

// initialModel returns the starting state
func initialModel() model {
    return model{
        items: []string{
            "Build a TUI app",
            "Learn Bubble Tea",
            "Ship to production",
        },
        selected: make(map[int]struct{}),
    }
}

// Init runs on startup. Return nil for no initial command.
func (m model) Init() tea.Cmd {
    return nil
}

// Update handles messages and returns an updated model.
func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    switch msg := msg.(type) {
    case tea.KeyMsg:
        switch msg.String() {
        case "ctrl+c", "q":
            return m, tea.Quit
        case "up", "k":
            if m.cursor > 0 {
                m.cursor--
            }
        case "down", "j":
            if m.cursor < len(m.items)-1 {
                m.cursor++
            }
        case "enter", " ":
            if _, ok := m.selected[m.cursor]; ok {
                delete(m.selected, m.cursor)
            } else {
                m.selected[m.cursor] = struct{}{}
            }
        }
    }
    return m, nil
}

// View renders the current state as a string.
func (m model) View() string {
    s := "What needs to be done?\n\n"

    for i, item := range m.items {
        cursor := " "
        if m.cursor == i {
            cursor = ">"
        }

        checked := " "
        if _, ok := m.selected[i]; ok {
            checked = "x"
        }

        s += fmt.Sprintf("%s [%s] %s\n", cursor, checked, item)
    }

    s += "\nPress q to quit.\n"
    return s
}

func main() {
    p := tea.NewProgram(initialModel())
    if _, err := p.Run(); err != nil {
        fmt.Printf("Error: %v", err)
        os.Exit(1)
    }
}
```

Run it with `go run main.go`. You should see an interactive list where you can navigate with arrow keys or j/k and toggle items with space or enter.

## Handling Async Operations with Commands

Real applications need to do async work — fetching data, running queries, reading files. Bubble Tea handles this with **commands** (`tea.Cmd`), which are functions that run asynchronously and return a message.

```go
// A message type for when data loads
type dataLoadedMsg struct {
    items []string
    err   error
}

// A command that fetches data asynchronously
func fetchData() tea.Msg {
    // This runs in a goroutine — safe to do I/O here
    items, err := loadItemsFromDatabase()
    return dataLoadedMsg{items: items, err: err}
}

// In your Update method, handle the result
func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    switch msg := msg.(type) {
    case dataLoadedMsg:
        if msg.err != nil {
            m.error = msg.err.Error()
            return m, nil
        }
        m.items = msg.items
        m.loading = false
        return m, nil
    }
    return m, nil
}

// Trigger the command from Init or Update
func (m model) Init() tea.Cmd {
    return fetchData
}
```

Commands keep your Update function pure — it never does I/O directly. This makes testing straightforward: you can test Update by sending it messages and checking the returned model.

## Adding Styles with Lip Gloss

[Lip Gloss](https://github.com/charmbracelet/lipgloss) is a companion library for styling terminal output. Install it:

```bash
go get github.com/charmbracelet/lipgloss
```

Use it to add colors, borders, and layout to your View:

```go
import "github.com/charmbracelet/lipgloss"

var (
    titleStyle = lipgloss.NewStyle().
        Bold(true).
        Foreground(lipgloss.Color("205")).
        MarginBottom(1)

    selectedStyle = lipgloss.NewStyle().
        Foreground(lipgloss.Color("170")).
        Bold(true)

    normalStyle = lipgloss.NewStyle().
        Foreground(lipgloss.Color("252"))
)

func (m model) View() string {
    s := titleStyle.Render("Todo List") + "\n\n"

    for i, item := range m.items {
        if m.cursor == i {
            s += selectedStyle.Render("> " + item) + "\n"
        } else {
            s += normalStyle.Render("  " + item) + "\n"
        }
    }

    return s
}
```

## Structuring Larger Applications

For anything beyond a simple demo, split your Bubble Tea app into multiple models that compose together. Each screen or panel can be its own model:

```go
// Each screen implements tea.Model
type listScreen struct { /* ... */ }
type detailScreen struct { /* ... */ }

// Parent model switches between screens
type appModel struct {
    current    string
    listModel  listScreen
    detailModel detailScreen
}

func (m appModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    switch m.current {
    case "list":
        updated, cmd := m.listModel.Update(msg)
        m.listModel = updated.(listScreen)
        return m, cmd
    case "detail":
        updated, cmd := m.detailModel.Update(msg)
        m.detailModel = updated.(detailScreen)
        return m, cmd
    }
    return m, nil
}
```

In GOSQLIT, I use this pattern to manage separate screens for connection selection, query editing, and result display — each with their own state and key bindings.

## Key Takeaways

- **Start with the Model**: Define your state struct first, then build Update and View around it
- **Use Commands for I/O**: Never do network calls or file reads inside Update — return a `tea.Cmd` instead
- **Compose Models**: Break large apps into sub-models, each handling their own screen or panel
- **Lip Gloss for styling**: Use it to add colors and layout without fighting ANSI escape codes
- **Test by sending messages**: Since Update is a pure function of (Model, Msg) → (Model, Cmd), unit testing is straightforward

Bubble Tea's functional architecture makes terminal applications surprisingly maintainable. The patterns scale from simple menus to complex multi-screen applications like database clients and file managers.
