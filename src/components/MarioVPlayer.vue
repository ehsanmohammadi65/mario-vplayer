<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";

const props = defineProps({
  code: { type: String },
  video: { type: String, required: true },
  w: { type: String },
  h: { type: String },
});

const controls = ref(null);
const videoContainer = ref(null);
const playIs = ref(false);
const FullscreenIs = ref(false);
const currentTime = ref("0:00");
const duration = ref("0:00");
const controlsVisible = ref(true);
const progressValue = ref(0);
const isMobile = ref(false);
const isSeeking = ref(false);
const seekTimeout = ref(null);
let inactivityTimer = null;
let touchStartX = 0;
let touchStartTime = 0;

const checkIfMobile = () => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

watch(() => props.video, async (newVideo) => {
  if (!newVideo) return;
  try {
    playIs.value = false;
    currentTime.value = "0:00";
    duration.value = "0:00";
    progressValue.value = 0;
    await nextTick();
    if (controls.value) {
      controls.value.pause();
      controls.value.currentTime = 0;
      controls.value.src = newVideo;
      controls.value.load();
      try {
        await controls.value.play();
        playIs.value = true;
      } catch (error) {
        console.log("Autoplay blocked:", error);
        playIs.value = false;
      }
    }
  } catch (error) {
    console.error("Error changing video:", error);
  }
}, { immediate: true });

const updateProgress = () => {
  if (!isSeeking.value && controls.value && !isNaN(controls.value.duration)) {
    const percentage = (controls.value.currentTime / controls.value.duration) * 100;
    progressValue.value = percentage;
    currentTime.value = formatTime(controls.value.currentTime);
  }
};

const updateDuration = () => {
  if (controls.value && !isNaN(controls.value.duration)) {
    duration.value = formatTime(controls.value.duration);
  }
};

const play = () => {
  if (!playIs.value) {
    controls.value.play().then(() => {
      playIs.value = true;
    }).catch(error => {
      console.error("Play failed:", error);
    });
  } else {
    controls.value.pause();
    playIs.value = false;
  }
  showControls();
};

const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    if (videoContainer.value.requestFullscreen) {
      videoContainer.value.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

const handleFullscreenChange = () => {
  FullscreenIs.value = !!document.fullscreenElement;
  if (FullscreenIs.value) {
    showControls();
  } else {
    controlsVisible.value = true;
    clearTimeout(inactivityTimer);
  }
};

const showControls = () => {
  controlsVisible.value = true;
  resetInactivityTimer();
};

const hideControls = () => {
  if (FullscreenIs.value && playIs.value) {
    controlsVisible.value = false;
  }
};

const resetInactivityTimer = () => {
  clearTimeout(inactivityTimer);
  if (FullscreenIs.value && playIs.value) {
    inactivityTimer = setTimeout(hideControls, 3000);
  }
};

const handleTouchStart = (e) => {
  if (!isMobile.value || !FullscreenIs.value) return;
  touchStartX = e.touches[0].clientX;
  touchStartTime = controls.value.currentTime;
  isSeeking.value = true;
};

const handleTouchMove = (e) => {
  if (!isMobile.value || !FullscreenIs.value || !isSeeking.value) return;
  const touchX = e.touches[0].clientX;
  const diffX = touchX - touchStartX;
  const seekAmount = (diffX / window.innerWidth) * 10;
  controls.value.currentTime = Math.max(0, Math.min(
    touchStartTime + seekAmount,
    controls.value.duration
  ));
  showControls();
};

const handleTouchEnd = () => {
  if (!isMobile.value || !isSeeking.value) return;
  isSeeking.value = false;
  clearTimeout(seekTimeout.value);
  seekTimeout.value = setTimeout(() => {
    if (playIs.value) {
      hideControls();
    }
  }, 3000);
};

const handleProgressClick = (e) => {
  if (!controls.value) return;
  const progressBar = e.target;
  const rect = progressBar.getBoundingClientRect();
  const clickPosition = e.clientX - rect.left;
  const progressBarWidth = rect.width;
  const percentage = clickPosition / progressBarWidth;
  const newTime = percentage * controls.value.duration;
  controls.value.currentTime = newTime;
  showControls();
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

onMounted(() => {
  checkIfMobile();
  controls.value.addEventListener("timeupdate", updateProgress);
  controls.value.addEventListener("loadedmetadata", updateDuration);
  controls.value.addEventListener("durationchange", updateDuration);
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  if (isMobile.value) {
    videoContainer.value.addEventListener("touchstart", handleTouchStart, { passive: true });
    videoContainer.value.addEventListener("touchmove", handleTouchMove, { passive: true });
    videoContainer.value.addEventListener("touchend", handleTouchEnd, { passive: true });
  } else {
    videoContainer.value.addEventListener("mousemove", showControls);
  }
});

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  if (isMobile.value) {
    videoContainer.value.removeEventListener("touchstart", handleTouchStart);
    videoContainer.value.removeEventListener("touchmove", handleTouchMove);
    videoContainer.value.removeEventListener("touchend", handleTouchEnd);
  } else {
    videoContainer.value.removeEventListener("mousemove", showControls);
  }
  clearTimeout(inactivityTimer);
  clearTimeout(seekTimeout.value);
});
</script>

<template>
  <div
    :class="[FullscreenIs ? 'fullscreen-video' : '', props.w]"
    class="video-player-container"
    ref="videoContainer"
  >
    <!-- متن نمایش داده شده -->
    <div class="text-overlay" dir="ltr">{{ props.code }}</div>

    <video
      ref="controls"
      :controls="false"
      @click="play"
      playsinline
      webkit-playsinline
      x5-playsinline
    >
      <source :src="props.video" type="video/mp4" />
    </video>

    <!-- کنترل‌ها -->
    <div
      class="controls-container"
      :class="[FullscreenIs ? 'fullscreen-controls' : '', FullscreenIs && !controlsVisible ? 'hidden' : '']"
    >
      <div
        class="progress-bar"
        :class="FullscreenIs ? 'fullscreen-progress' : ''"
      >
        <span class="text-white text-sm" dir="ltr">{{ currentTime }} / {{ duration }}</span>
        <progress
          dir="ltr"
          id="progress"
          :value="progressValue"
          max="100"
          @click="handleProgressClick"
        ></progress>
      </div>

      <div
        class="buttons-bar"
        dir="ltr"
        :class="FullscreenIs ? 'fullscreen-buttons' : ''"
      >
        <button @click="play">
          {{ playIs ? "⏸ Pause" : "▶️ Play" }}
        </button>
        <button @click="toggleFullScreen">
          {{ FullscreenIs ? "⛶ Exit" : "⛶ Fullscreen" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.video-player-container {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: black;
}

.fullscreen-video {
  width: 100vw;
  height: 100vh;
}

.text-overlay {
  color: white;
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  font-size: 1.5rem;
  z-index: 10;
  pointer-events: none;
}

.fullscreen-video .text-overlay {
  font-size: 2rem;
  top: 20px;
  left: 20px;
}

video {
  width: 100%;
  height: auto;
  background-color: black;
}

:fullscreen video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.controls-container {
  display: flex;
  flex-direction: column;
  transition: opacity 0.3s;
}

.fullscreen-controls {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.controls-container.hidden {
  opacity: 0;
}

.progress-bar {
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  background-color: rgba(31, 41, 55, 0.5);
}

.fullscreen-progress {
  padding: 0.5rem 0;
}

#progress {
  flex: 1;
  height: 0.5rem;
  margin: 0 0.5rem;
  cursor: pointer;
}

.buttons-bar {
  display: flex;
  justify-content: space-between;
  padding: 0 0.5rem;
  background-color: rgba(31, 41, 55, 0.5);
}

.fullscreen-buttons {
  padding: 0.5rem 0;
}

.buttons-bar button {
  color: white;
  padding: 0.25rem 0;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
}

.text-white {
  color: white;
}

.text-sm {
  font-size: 0.875rem;
}
</style>
