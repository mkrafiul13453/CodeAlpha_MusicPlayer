'use strict';

const songs = [
  {
    title: 'Agar Tum Saath Ho',
    artist: 'Alka Yagnik, Arijit Singh',
    audio: 'assets/songs/Agar%20Tum%20Saath%20Ho.mp3',
    cover: 'assets/images/Agar%20Tum%20Saath%20Ho.jfif',
    fallbackDuration: '--:--'
  },
  {
    title: 'Apna Bana Le',
    artist: 'Arijit Singh',
    audio: 'assets/songs/Apna%20Bana%20Le.mp3',
    cover: 'assets/images/Apna%20Bana%20Le.jfif',
    fallbackDuration: '--:--'
  },
  {
    title: 'Channa Mereya',
    artist: 'Arijit Singh',
    audio: 'assets/songs/Channa%20Mereya.mp3',
    cover: 'assets/images/Channa%20Mereya.jpg',
    fallbackDuration: '--:--'
  },
  {
    title: 'Kesariya',
    artist: 'Arijit Singh',
    audio: 'assets/songs/Kesariya.mp3',
    cover: 'assets/images/Kesariya.jpg',
    fallbackDuration: '--:--'
  },
  {
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh',
    audio: 'assets/songs/Tum%20Hi%20Ho.mp3',
    cover: 'assets/images/Tum%20Hi%20Ho.jfif',
    fallbackDuration: '--:--'
  }
];

const audio = document.querySelector('#audio-player');
const trackList = document.querySelector('#track-list');
const playButton = document.querySelector('#play-button');
const previousButton = document.querySelector('#previous-button');
const nextButton = document.querySelector('#next-button');
const shuffleButton = document.querySelector('#shuffle-button');
const repeatButton = document.querySelector('#repeat-button');
const progressSlider = document.querySelector('#progress-slider');
const volumeSlider = document.querySelector('#volume-slider');
const muteButton = document.querySelector('#mute-button');
const playerMessage = document.querySelector('#player-message');
const favoriteButton = document.querySelector('#favorite-button');
let currentIndex = 0;
let isShuffle = false;
let repeatMode = 0;
let lastVolume = Number(volumeSlider.value);
let isSeeking = false;
const failedSongs = new Set();

audio.volume = lastVolume;

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function updateRangeBackground(slider, percentage) {
  slider.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${percentage}%, #41463d ${percentage}%, #41463d 100%)`;
}

function renderPlaylist() {
  trackList.replaceChildren();
  songs.forEach((song, index) => {
    const item = document.createElement('li');
    item.className = 'track-row';
    item.dataset.index = String(index);
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Play ${song.title} by ${song.artist}`);

    const artWrap = document.createElement('span');
    artWrap.className = 'track-art-wrap';
    const image = document.createElement('img');
    image.className = 'track-art';
    image.src = song.cover;
    image.alt = '';
    image.loading = 'lazy';
    image.addEventListener('error', () => {
      image.classList.add('image-unavailable');
      playerMessage.textContent = `Cover image unavailable for ${song.title}.`;
    });
    const indicator = document.createElement('span');
    indicator.className = 'track-play-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    indicator.innerHTML = '<svg viewBox="0 0 24 24"><path d="m8 5 12 7-12 7z"/></svg>';
    artWrap.append(image, indicator);

    const meta = document.createElement('span');
    meta.className = 'track-meta';
    const title = document.createElement('strong');
    title.textContent = song.title;
    const artist = document.createElement('span');
    artist.textContent = song.artist;
    meta.append(title, artist);

    const duration = document.createElement('span');
    duration.className = 'track-duration';
    duration.textContent = song.fallbackDuration;
    item.append(artWrap, meta, duration);
    item.addEventListener('click', () => playSong(index));
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        playSong(index);
      }
    });
    trackList.append(item);
  });
  document.querySelector('#track-count').textContent = `${String(songs.length).padStart(2, '0')} TRACKS`;
  document.querySelector('#nav-count').textContent = String(songs.length).padStart(2, '0');
  document.querySelector('#playlist-bottom-count').textContent = `${songs.length} songs`;
  updatePlaylist();
}

function updatePlaylist() {
  trackList.querySelectorAll('.track-row').forEach((row, index) => {
    const active = index === currentIndex;
    row.classList.toggle('active', active);
    row.classList.toggle('playing', active && !audio.paused);
    row.setAttribute('aria-current', active ? 'true' : 'false');
    row.setAttribute('aria-label', `${audio.paused || !active ? 'Play' : 'Pause'} ${songs[index].title} by ${songs[index].artist}`);
  });
}

function showSong(index) {
  currentIndex = index;
  const song = songs[currentIndex];
  audio.src = song.audio;
  audio.load();
  document.querySelector('#track-title').textContent = song.title;
  document.querySelector('#track-artist').textContent = song.artist;
  document.querySelector('#cover-caption-title').textContent = song.title;
  document.querySelector('#cover-index').innerHTML = `${String(currentIndex + 1).padStart(2, '0')} <span>/ ${String(songs.length).padStart(2, '0')}</span>`;
  const cover = document.querySelector('#main-cover');
  cover.alt = `${song.title} album cover`;
  cover.classList.remove('image-unavailable');
  cover.src = song.cover;
  cover.onerror = () => {
    cover.classList.add('image-unavailable');
    playerMessage.textContent = `Cover image unavailable for ${song.title}.`;
  };
  playerMessage.textContent = '';
  document.querySelector('#duration').textContent = song.fallbackDuration;
  document.querySelector('#current-time').textContent = '0:00';
  progressSlider.value = '0';
  updateRangeBackground(progressSlider, 0);
  updatePlaylist();
}

function playSong(index) {
  showSong(index);
  const playRequest = audio.play();
  if (playRequest && typeof playRequest.catch === 'function') {
    playRequest.catch((error) => {
      if (error.name === 'AbortError') return;
      playerMessage.textContent = failedSongs.has(index)
        ? `Unable to play ${songs[index].title}. Check that the audio file is available.`
        : `Playback could not start for ${songs[index].title}. Press play to try again.`;
      setPlayingState(false);
    });
  }
}

function setPlayingState(isPlaying) {
  playButton.classList.toggle('is-playing', isPlaying);
  playButton.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
  playButton.title = isPlaying ? 'Pause' : 'Play';
  document.querySelector('.sound-wave').classList.toggle('is-playing', isPlaying);
  updatePlaylist();
}

function togglePlayback() {
  if (audio.paused) {
    if (!audio.src) {
      playSong(currentIndex);
      return;
    }
    const playRequest = audio.play();
    if (playRequest && typeof playRequest.catch === 'function') {
      playRequest.catch(() => {
        playerMessage.textContent = `Unable to play ${songs[currentIndex].title}. Check that the audio file is available.`;
      });
    }
  } else {
    audio.pause();
  }
}

function getNextIndex(direction) {
  if (isShuffle && direction > 0 && songs.length > 1) {
    let nextIndex = currentIndex;
    while (nextIndex === currentIndex) {
      nextIndex = Math.floor(Math.random() * songs.length);
    }
    return nextIndex;
  }
  return (currentIndex + direction + songs.length) % songs.length;
}

function changeTrack(direction) {
  playSong(getNextIndex(direction));
}

playButton.addEventListener('click', togglePlayback);
previousButton.addEventListener('click', () => {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  changeTrack(-1);
});
nextButton.addEventListener('click', () => changeTrack(1));

shuffleButton.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleButton.classList.toggle('active', isShuffle);
  shuffleButton.setAttribute('aria-label', `Shuffle ${isShuffle ? 'on' : 'off'}`);
  playerMessage.textContent = isShuffle ? 'Shuffle is on.' : 'Shuffle is off.';
});

repeatButton.addEventListener('click', () => {
  repeatMode = (repeatMode + 1) % 3;
  repeatButton.classList.toggle('active', repeatMode !== 0);
  repeatButton.classList.toggle('repeat-track', repeatMode === 2);
  const labels = ['Repeat off', 'Repeat playlist', 'Repeat current song'];
  repeatButton.setAttribute('aria-label', labels[repeatMode]);
  playerMessage.textContent = labels[repeatMode] + '.';
});

favoriteButton.addEventListener('click', () => {
  const isFavorite = favoriteButton.classList.toggle('active');
  favoriteButton.setAttribute('aria-label', isFavorite ? 'Remove from favorites' : 'Add to favorites');
  favoriteButton.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';
});

progressSlider.addEventListener('input', () => {
  isSeeking = true;
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    const seekTime = (Number(progressSlider.value) / 100) * audio.duration;
    document.querySelector('#current-time').textContent = formatTime(seekTime);
    updateRangeBackground(progressSlider, Number(progressSlider.value));
  }
});
progressSlider.addEventListener('change', () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(progressSlider.value) / 100) * audio.duration;
  }
  isSeeking = false;
});

volumeSlider.addEventListener('input', () => {
  audio.volume = Number(volumeSlider.value);
  if (audio.volume > 0) lastVolume = audio.volume;
  audio.muted = audio.volume === 0;
  updateVolumeUI();
});

function updateVolumeUI() {
  const volume = audio.muted ? 0 : audio.volume;
  document.querySelector('#volume-value').textContent = `${Math.round(volume * 100)}%`;
  volumeSlider.value = String(volume);
  updateRangeBackground(volumeSlider, volume * 100);
  muteButton.classList.toggle('is-muted', volume === 0);
  muteButton.setAttribute('aria-label', volume === 0 ? 'Unmute' : 'Mute');
  muteButton.title = volume === 0 ? 'Unmute' : 'Mute';
}

muteButton.addEventListener('click', () => {
  if (audio.muted || audio.volume === 0) {
    audio.muted = false;
    audio.volume = lastVolume || 0.7;
  } else {
    lastVolume = audio.volume;
    audio.muted = true;
  }
  updateVolumeUI();
});

audio.addEventListener('loadedmetadata', () => {
  if (Number.isFinite(audio.duration)) {
    document.querySelector('#duration').textContent = formatTime(audio.duration);
    const durationCell = trackList.querySelector(`.track-row[data-index="${currentIndex}"] .track-duration`);
    if (durationCell) durationCell.textContent = formatTime(audio.duration);
  }
});

audio.addEventListener('timeupdate', () => {
  if (!isSeeking && Number.isFinite(audio.duration) && audio.duration > 0) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressSlider.value = String(progress);
    updateRangeBackground(progressSlider, progress);
    document.querySelector('#current-time').textContent = formatTime(audio.currentTime);
  }
});

audio.addEventListener('play', () => {
  playerMessage.textContent = '';
  setPlayingState(true);
});
audio.addEventListener('pause', () => setPlayingState(false));
audio.addEventListener('ended', () => {
  if (repeatMode === 2) {
    audio.currentTime = 0;
    audio.play().catch(() => {
      playerMessage.textContent = `Unable to replay ${songs[currentIndex].title}.`;
    });
    return;
  }
  if (currentIndex === songs.length - 1 && !isShuffle && repeatMode === 0) {
    setPlayingState(false);
    audio.currentTime = 0;
    return;
  }
  changeTrack(1);
});
audio.addEventListener('error', () => {
  if (!audio.src) return;
  failedSongs.add(currentIndex);
  playerMessage.textContent = `Couldn't load ${songs[currentIndex].title}. Check that the audio file exists, then try another song.`;
  setPlayingState(false);
});

document.addEventListener('keydown', (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return;
  if (event.code === 'Space') {
    if (target instanceof HTMLElement && target.classList.contains('track-row')) return;
    event.preventDefault();
    togglePlayback();
  } else if (event.code === 'ArrowRight') {
    event.preventDefault();
    if (Number.isFinite(audio.duration)) audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
    else changeTrack(1);
  } else if (event.code === 'ArrowLeft') {
    event.preventDefault();
    if (Number.isFinite(audio.duration)) audio.currentTime = Math.max(audio.currentTime - 5, 0);
    else changeTrack(-1);
  } else if (event.key.toLowerCase() === 'n') {
    changeTrack(1);
  } else if (event.key.toLowerCase() === 'p') {
    changeTrack(-1);
  }
});

renderPlaylist();
showSong(0);
updateVolumeUI();
