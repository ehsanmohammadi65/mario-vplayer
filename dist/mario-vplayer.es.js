import { ref as n, watch as D, nextTick as O, onMounted as W, onUnmounted as z, createElementBlock as R, openBlock as U, normalizeClass as p, createElementVNode as o, toDisplayString as d } from "vue";
const j = {
  class: "text-overlay",
  dir: "ltr"
}, G = ["src"], H = {
  class: "text-white text-sm",
  dir: "ltr"
}, J = ["value"], Y = {
  __name: "MarioVPlayer",
  props: {
    code: { type: String },
    video: { type: String, required: !0 },
    w: { type: String },
    h: { type: String }
  },
  setup(F) {
    const m = F, e = n(null), a = n(null), r = n(!1), l = n(!1), g = n("0:00"), y = n("0:00"), f = n(!0), T = n(0), s = n(!1), v = n(!1), E = n(null);
    let h = null, _ = 0, b = 0;
    const X = () => {
      s.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    D(() => m.video, async (t) => {
      if (t)
        try {
          if (r.value = !1, g.value = "0:00", y.value = "0:00", T.value = 0, await O(), e.value) {
            e.value.pause(), e.value.currentTime = 0, e.value.src = t, e.value.load();
            try {
              await e.value.play(), r.value = !0;
            } catch (u) {
              console.log("Autoplay blocked:", u), r.value = !1;
            }
          }
        } catch (u) {
          console.error("Error changing video:", u);
        }
    }, { immediate: !0 });
    const I = () => {
      if (!v.value && e.value && !isNaN(e.value.duration)) {
        const t = e.value.currentTime / e.value.duration * 100;
        T.value = t, g.value = B(e.value.currentTime);
      }
    }, L = () => {
      e.value && !isNaN(e.value.duration) && (y.value = B(e.value.duration));
    }, w = () => {
      r.value ? (e.value.pause(), r.value = !1) : e.value.play().then(() => {
        r.value = !0;
      }).catch((t) => {
        console.error("Play failed:", t);
      }), i();
    }, N = () => {
      document.fullscreenElement ? document.exitFullscreen && document.exitFullscreen() : a.value.requestFullscreen && a.value.requestFullscreen().catch((t) => {
        console.error(`Error attempting to enable fullscreen: ${t.message}`);
      });
    }, x = () => {
      l.value = !!document.fullscreenElement, l.value ? i() : (f.value = !0, clearTimeout(h));
    }, i = () => {
      f.value = !0, A();
    }, C = () => {
      l.value && r.value && (f.value = !1);
    }, A = () => {
      clearTimeout(h), l.value && r.value && (h = setTimeout(C, 3e3));
    }, M = (t) => {
      !s.value || !l.value || (_ = t.touches[0].clientX, b = e.value.currentTime, v.value = !0);
    }, S = (t) => {
      if (!s.value || !l.value || !v.value) return;
      const k = (t.touches[0].clientX - _) / window.innerWidth * 10;
      e.value.currentTime = Math.max(0, Math.min(
        b + k,
        e.value.duration
      )), i();
    }, P = () => {
      !s.value || !v.value || (v.value = !1, clearTimeout(E.value), E.value = setTimeout(() => {
        r.value && C();
      }, 3e3));
    }, $ = (t) => {
      if (!e.value) return;
      const c = t.target.getBoundingClientRect(), k = t.clientX - c.left, q = c.width, V = k / q * e.value.duration;
      e.value.currentTime = V, i();
    }, B = (t) => {
      const u = Math.floor(t / 60), c = Math.floor(t % 60);
      return `${u}:${c < 10 ? "0" : ""}${c}`;
    };
    return W(() => {
      X(), e.value.addEventListener("timeupdate", I), e.value.addEventListener("loadedmetadata", L), e.value.addEventListener("durationchange", L), document.addEventListener("fullscreenchange", x), s.value ? (a.value.addEventListener("touchstart", M, { passive: !0 }), a.value.addEventListener("touchmove", S, { passive: !0 }), a.value.addEventListener("touchend", P, { passive: !0 })) : a.value.addEventListener("mousemove", i);
    }), z(() => {
      document.removeEventListener("fullscreenchange", x), s.value ? (a.value.removeEventListener("touchstart", M), a.value.removeEventListener("touchmove", S), a.value.removeEventListener("touchend", P)) : a.value.removeEventListener("mousemove", i), clearTimeout(h), clearTimeout(E.value);
    }), (t, u) => (U(), R("div", {
      class: p([[l.value ? "fullscreen-video" : "", m.w], "video-player-container"]),
      ref_key: "videoContainer",
      ref: a
    }, [
      o("div", j, d(m.code), 1),
      o("video", {
        ref_key: "controls",
        ref: e,
        controls: !1,
        onClick: w,
        playsinline: "",
        "webkit-playsinline": "",
        "x5-playsinline": ""
      }, [
        o("source", {
          src: m.video,
          type: "video/mp4"
        }, null, 8, G)
      ], 512),
      o("div", {
        class: p(["controls-container", [l.value ? "fullscreen-controls" : "", l.value && !f.value ? "hidden" : ""]])
      }, [
        o("div", {
          class: p(["progress-bar", l.value ? "fullscreen-progress" : ""])
        }, [
          o("span", H, d(g.value) + " / " + d(y.value), 1),
          o("progress", {
            dir: "ltr",
            id: "progress",
            value: T.value,
            max: "100",
            onClick: $
          }, null, 8, J)
        ], 2),
        o("div", {
          class: p(["buttons-bar", l.value ? "fullscreen-buttons" : ""]),
          dir: "ltr"
        }, [
          o("button", { onClick: w }, d(r.value ? "⏸ Pause" : "▶️ Play"), 1),
          o("button", { onClick: N }, d(l.value ? "⛶ Exit" : "⛶ Fullscreen"), 1)
        ], 2)
      ], 2)
    ], 2));
  }
};
export {
  Y as default
};
