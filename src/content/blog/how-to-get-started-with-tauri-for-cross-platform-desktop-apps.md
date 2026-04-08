---
title: "How to Get Started with Tauri for Cross-Platform Desktop Apps"
description: "A practical guide to building cross-platform desktop applications with Tauri, React, and Rust. Learn the architecture, set up your first project, and ship native apps from a single codebase."
pubDate: 2026-04-08
tags: ["tauri", "rust", "react", "desktop-app", "tutorial"]
faq:
  - question: "What is Tauri and how is it different from Electron?"
    answer: "Tauri is a framework for building cross-platform desktop applications using web technologies for the frontend and Rust for the backend. Unlike Electron, which bundles Chromium and Node.js (resulting in 150MB+ binaries), Tauri uses the operating system's native webview — WebView2 on Windows, WebKit on macOS and Linux. This produces binaries under 10MB, with significantly lower memory usage and faster startup times."
  - question: "Do I need to know Rust to use Tauri?"
    answer: "Not for basic applications. Tauri's scaffolding generates a working Rust backend out of the box, and many apps only need to write frontend code. However, learning Rust basics becomes valuable when you need custom backend commands — like calling FFmpeg, accessing the filesystem, or running CPU-intensive tasks. Tauri's command system makes the Rust side approachable even for Rust beginners."
  - question: "What frontend frameworks work with Tauri?"
    answer: "Tauri is frontend-agnostic. It works with React, Vue, Svelte, SolidJS, Angular, or plain HTML/CSS/JavaScript. Any framework that produces static files or runs a dev server works. The official create-tauri-app scaffolding tool offers templates for all major frameworks."
  - question: "Can Tauri apps access native system features?"
    answer: "Yes. Tauri provides a plugin system for native capabilities including filesystem access, system dialogs, notifications, clipboard, global shortcuts, HTTP requests, and more. The Rust backend can also call any system library or CLI tool directly. For example, in my app Seer, the Rust backend calls FFmpeg and FFprobe for media analysis — something that would be difficult to do securely in a browser-only environment."
  - question: "Is Tauri ready for production applications?"
    answer: "Yes. Tauri 2.0 is stable and supports macOS, Windows, Linux, iOS, and Android. It includes built-in auto-updaters, code signing, native installers (DMG, MSI, AppImage, DEB), and a security-focused architecture with fine-grained permissions. The framework is actively maintained and backed by the CrabNebula company."
---

Tauri is a framework for building lightweight, cross-platform desktop applications using web technologies for the UI and Rust for the backend. It produces small, fast, native binaries by using the operating system's built-in webview instead of bundling a full browser engine.

In this guide, I will walk through setting up a Tauri project from scratch, explain how the frontend and backend communicate, and cover the patterns I found most useful when building [Seer](https://github.com/imran-vz/seer), a desktop app for media file management and analysis.

## Prerequisites

Before starting, make sure you have:

- **Node.js 18+** or **Bun** installed
- **Rust toolchain** — install via [rustup](https://rustup.rs/)
- Basic familiarity with a frontend framework (React, Vue, or Svelte)

On macOS, you also need Xcode Command Line Tools:

```bash
xcode-select --install
```

On Windows, you need the [Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) and [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (pre-installed on Windows 11).

On Linux, install the required system dependencies:

```bash
# Debian/Ubuntu
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

## Scaffolding a New Project

Tauri provides a CLI that generates a working project with your choice of frontend framework:

```bash
bun create tauri-app my-tauri-app
```

The scaffolding will ask you to pick a frontend framework and language. For this guide, I will use React with TypeScript — but the Tauri concepts apply regardless of your frontend choice.

After scaffolding, install dependencies and start the dev server:

```bash
cd my-tauri-app
bun install
bun run tauri dev
```

This starts both the Vite dev server for the frontend and the Rust backend, then opens your app in a native window. Hot module replacement works — edit your React components and the app updates instantly.

## Understanding the Project Structure

A Tauri project has two distinct sides:

```
my-tauri-app/
├── src/                  # Frontend (React/TypeScript)
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── src-tauri/            # Backend (Rust)
│   ├── src/
│   │   └── lib.rs        # Tauri commands and app setup
│   ├── capabilities/     # Permission definitions
│   ├── Cargo.toml        # Rust dependencies
│   └── tauri.conf.json   # App configuration
├── package.json
└── vite.config.ts
```

The **frontend** in `src/` is a standard web app — it runs inside the native webview. The **backend** in `src-tauri/` is a Rust application that manages the window, handles system calls, and exposes commands to the frontend.

This split is the core of Tauri's architecture: the frontend handles UI and user interaction, while the backend handles anything that needs native access — filesystem operations, spawning processes, database connections, or calling system APIs.

## The Command System: Frontend-Backend Communication

The most important concept in Tauri is **commands** — Rust functions that the frontend can call over an internal IPC bridge. This is how your web UI talks to the native backend.

Define a command in Rust:

```rust
// src-tauri/src/lib.rs

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! This ran in Rust.", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

Call it from the frontend:

```typescript
import { invoke } from "@tauri-apps/api/core";

const message = await invoke<string>("greet", { name: "Imran" });
console.log(message); // "Hello, Imran! This ran in Rust."
```

The `invoke` function sends a message to the Rust backend, the command runs natively, and the result is serialized back to TypeScript. Arguments and return values are automatically serialized with `serde` — any type that implements `Serialize` and `Deserialize` works.

### Commands with Complex Types

Commands can accept and return structs, which map directly to TypeScript interfaces:

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct FileInfo {
    name: String,
    size: u64,
    path: String,
}

#[tauri::command]
fn get_file_info(path: String) -> Result<FileInfo, String> {
    let metadata = std::fs::metadata(&path)
        .map_err(|e| e.to_string())?;

    Ok(FileInfo {
        name: std::path::Path::new(&path)
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string(),
        size: metadata.len(),
        path,
    })
}
```

```typescript
interface FileInfo {
  name: string;
  size: number;
  path: string;
}

const info = await invoke<FileInfo>("get_file_info", {
  path: "/Users/imran/video.mp4",
});
```

In Seer, I use this pattern extensively — the Rust backend calls FFprobe to analyze media files and returns structured data (codec info, stream details, bitrate statistics) that the React frontend renders into interactive charts and tables.

### Error Handling in Commands

Commands that return `Result<T, E>` automatically map to rejected promises on the frontend:

```rust
#[tauri::command]
fn read_config(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read {}: {}", path, e))
}
```

```typescript
try {
  const config = await invoke<string>("read_config", { path: configPath });
} catch (error) {
  // error is the string from Err()
  console.error(error);
}
```

## Using Tauri Plugins

Tauri's plugin system provides access to native features. Plugins are added as Rust dependencies and registered in the app builder.

For example, to add SQLite database support (which Seer uses for caching media analysis results):

```bash
# Add the plugin
bun run tauri add sql
```

This updates both `Cargo.toml` and `package.json`. Then register the plugin in Rust:

```rust
// src-tauri/src/lib.rs
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

Use it from the frontend:

```typescript
import Database from "@tauri-apps/plugin-sql";

const db = await Database.load("sqlite:app.db");

await db.execute(
  "CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT, created_at INTEGER)"
);

await db.execute("INSERT INTO cache (key, value, created_at) VALUES ($1, $2, $3)", [
  "analysis:video.mp4",
  JSON.stringify(analysisResult),
  Date.now(),
]);

const results = await db.select<CacheEntry[]>("SELECT * FROM cache WHERE key = $1", [
  "analysis:video.mp4",
]);
```

Other commonly used plugins include:

- **dialog** — Native file picker and message dialogs
- **fs** — Filesystem read/write with scoped permissions
- **shell** — Spawn child processes (useful for calling CLI tools like FFmpeg)
- **notification** — System notifications
- **clipboard** — Read/write clipboard content

## Tauri's Security Model

Tauri takes a different approach to security than Electron. Instead of giving the frontend full access to everything, Tauri uses a **capability-based permission system**. Each plugin's permissions must be explicitly granted in a capabilities file:

```json
// src-tauri/capabilities/default.json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Default capabilities for the main window",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "sql:default",
    "dialog:default",
    "shell:allow-spawn"
  ]
}
```

If you try to use a plugin feature without granting its permission, the call fails at runtime. This means even if an attacker injects JavaScript into your app, they cannot access native features that are not explicitly permitted.

## Calling External CLI Tools

One pattern I rely on heavily in Seer is calling external CLI tools from the Rust backend. The app uses FFmpeg and FFprobe for media analysis — the Rust backend spawns these processes, parses their output, and returns structured data to the frontend.

```rust
use std::process::Command;
use serde::Serialize;

#[derive(Serialize)]
pub struct MediaInfo {
    format: String,
    duration: f64,
    streams: Vec<StreamInfo>,
}

#[derive(Serialize)]
pub struct StreamInfo {
    codec_type: String,
    codec_name: String,
    width: Option<u32>,
    height: Option<u32>,
}

#[tauri::command]
fn analyze_media(path: String) -> Result<MediaInfo, String> {
    let output = Command::new("ffprobe")
        .args([
            "-v", "quiet",
            "-print_format", "json",
            "-show_format",
            "-show_streams",
            &path,
        ])
        .output()
        .map_err(|e| format!("Failed to run ffprobe: {}", e))?;

    if !output.status.success() {
        return Err("ffprobe failed".to_string());
    }

    let json: serde_json::Value = serde_json::from_slice(&output.stdout)
        .map_err(|e| format!("Failed to parse ffprobe output: {}", e))?;

    // Parse the JSON into your structured types
    // ...

    Ok(media_info)
}
```

This pattern — Rust command wraps a CLI tool, parses its output, returns typed data — keeps the frontend clean and gives you access to any system tool.

## Building and Distributing

When you are ready to ship, Tauri builds native installers for each platform:

```bash
bun run tauri build
```

This produces:

- **macOS**: `.dmg` and `.app` bundle
- **Windows**: `.msi` and `.exe` installer
- **Linux**: `.deb`, `.rpm`, and `.AppImage`

The output binaries are remarkably small. A basic Tauri app produces a ~5-8MB installer, compared to 150MB+ for an equivalent Electron app. The difference comes from using the OS webview instead of shipping Chromium.

### Configuration

The `tauri.conf.json` file controls your app's identity and build settings:

```json
{
  "productName": "My App",
  "version": "0.1.0",
  "identifier": "com.myapp.dev",
  "build": {
    "frontendDist": "../dist",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "bun run build",
    "beforeDevCommand": "bun run dev"
  },
  "app": {
    "windows": [
      {
        "title": "My App",
        "width": 1200,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600
      }
    ]
  }
}
```

## Key Takeaways

- **Commands are the bridge**: Define Rust functions with `#[tauri::command]`, call them from the frontend with `invoke`. This is how your UI talks to the native layer
- **Use plugins for native features**: Filesystem, dialogs, databases, notifications — add them as plugins rather than writing from scratch
- **Permissions are explicit**: Tauri's capability system means you declare exactly what native features your app needs. Nothing is accessible by default
- **Rust backend for heavy lifting**: Spawn CLI tools, parse binary formats, run CPU-intensive analysis in Rust — send only the results to the frontend
- **Small binaries, real performance**: Using the OS webview instead of bundling Chromium means your app installs fast and uses less memory

Tauri makes it practical to build desktop applications with the web stack you already know, while giving you Rust's performance and safety for the parts that need native access. The framework handles the hard parts — cross-platform packaging, auto-updates, security sandboxing — so you can focus on your application.
