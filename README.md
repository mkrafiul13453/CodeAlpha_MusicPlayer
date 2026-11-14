# Sonora Music Player

Sonora is a responsive, browser-based music player built with HTML, CSS, and vanilla JavaScript. It plays the MP3 files in the local library and pairs each track with its local cover artwork.

## Features

- Play and pause, skip tracks, and select songs directly from the playlist
- View the current song, artist, artwork, playback time, and duration
- Seek through a song and adjust, mute, or restore the volume
- Shuffle the playlist and cycle through repeat-off, repeat-playlist, and repeat-current-song modes
- Automatically play the next track when a song ends
- Use keyboard shortcuts for playback and navigation
- Responsive dark interface for desktop, tablet, and mobile
- Clear status messages if a local audio or image file cannot be loaded

## Getting started

No package installation or build step is required.

1. Keep `index.html`, `style.css`, `script.js`, and the `assets` folder together.
2. Open `index.html` in a modern browser.
3. Select a song or press the play button to start listening.

You can also serve the folder locally. From the project directory, run:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser. In VS Code, the Live Server extension is another option.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Space` | Play or pause |
| `Left Arrow` | Seek backward 5 seconds |
| `Right Arrow` | Seek forward 5 seconds |
| `N` | Play the next track |
| `P` | Play the previous track |

The arrow shortcuts seek within the current track when its duration is available. The previous button restarts the current song if it has played for more than three seconds.

## Local music library

Songs and covers are matched by name in `script.js`. Keep these assets in their existing folders and preserve their filenames:

| Track | Artist shown | Audio file | Cover image |
| --- | --- | --- | --- |
| Agar Tum Saath Ho | Alka Yagnik, Arijit Singh | `assets/songs/Agar Tum Saath Ho.mp3` | `assets/images/Agar Tum Saath Ho.jfif` |
| Apna Bana Le | Arijit Singh | `assets/songs/Apna Bana Le.mp3` | `assets/images/Apna Bana Le.jfif` |
| Channa Mereya | Arijit Singh | `assets/songs/Channa Mereya.mp3` | `assets/images/Channa Mereya.jpg` |
| Kesariya | Arijit Singh | `assets/songs/Kesariya.mp3` | `assets/images/Kesariya.jpg` |
| Tum Hi Ho | Arijit Singh | `assets/songs/Tum Hi Ho.mp3` | `assets/images/Tum Hi Ho.jfif` |

To add or replace a track, place the audio and cover in their respective folders, then update the song list in `script.js` with the title, artist, and relative file paths.

## Project structure

```text
.
├── index.html
├── style.css
├── script.js
└── assets
    ├── images
    └── songs
```

## Technology

- HTML5 and the browser Audio API
- CSS, including responsive layouts and reduced-motion support
- Vanilla JavaScript

There are no JavaScript dependencies or build tools. The stylesheet requests DM Sans and Manrope from Google Fonts; system fonts are used as a fallback if those fonts are unavailable.
