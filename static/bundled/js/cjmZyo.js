import { c as createSignal, o as onMount, a as onCleanup, i as insert, b as createRenderEffect, t as template, u as useState, d as createEffect, e as expand, f as on, g as createComponent, h as use, s as setAttribute, F as For, j as delegateEvents, l as loadGsap, k as decrement, m as increment, n as createMemo, S as Show } from "./main.js";
var _tmpl$$2 = /* @__PURE__ */ template(`<div class=cursor><div class=cursorInner>`);
function CustomCursor(props) {
  let controller;
  const [xy, setXy] = createSignal({
    x: 0,
    y: 0
  });
  const onMouse = (e) => {
    const {
      clientX,
      clientY
    } = e;
    setXy({
      x: clientX,
      y: clientY
    });
  };
  onMount(() => {
    controller = new AbortController();
    const abortSignal = controller.signal;
    window.addEventListener("mousemove", onMouse, {
      passive: true,
      signal: abortSignal
    });
  });
  onCleanup(() => {
    controller == null ? void 0 : controller.abort();
  });
  return (() => {
    var _el$ = _tmpl$$2(), _el$2 = _el$.firstChild;
    insert(_el$2, () => props.cursorText());
    createRenderEffect((_p$) => {
      var _v$ = !!props.active(), _v$2 = `translate3d(${xy().x}px, ${xy().y}px, 0)`;
      _v$ !== _p$.e && _el$.classList.toggle("active", _p$.e = _v$);
      _v$2 !== _p$.t && ((_p$.t = _v$2) != null ? _el$.style.setProperty("transform", _v$2) : _el$.style.removeProperty("transform"));
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
}
const thresholdDiv = document.getElementsByClassName("threshold")[0];
const thresholdDispNums = Array.from(thresholdDiv.getElementsByClassName("num"));
const decButton = thresholdDiv.getElementsByClassName("dec").item(0);
const incButton = thresholdDiv.getElementsByClassName("inc").item(0);
const indexDiv = document.getElementsByClassName("index").item(0);
const indexDispNums = Array.from(indexDiv.getElementsByClassName("num"));
function updateThresholdText(thresholdValue) {
  thresholdDispNums.forEach((e, i) => {
    e.innerText = thresholdValue[i];
  });
}
function updateIndexText(indexValue, indexLength) {
  indexDispNums.forEach((e, i) => {
    if (i < 4) {
      e.innerText = indexValue[i];
    } else {
      e.innerText = indexLength[i - 4];
    }
  });
}
function Nav() {
  const [state, {
    incThreshold,
    decThreshold
  }] = useState();
  createEffect(() => {
    updateIndexText(expand(state().index + 1), expand(state().length));
    updateThresholdText(expand(state().threshold));
  });
  decButton.onclick = decThreshold;
  incButton.onclick = incThreshold;
  return null;
}
var _tmpl$$1 = /* @__PURE__ */ template(`<div class=stage>`), _tmpl$2$1 = /* @__PURE__ */ template(`<img>`);
function getTrailElsIndex(cordHistValue) {
  return cordHistValue.map((el) => el.i);
}
function getTrailCurrentElsIndex(cordHistValue, stateValue) {
  return getTrailElsIndex(cordHistValue).slice(-stateValue.trailLength);
}
function getTrailInactiveElsIndex(cordHistValue, stateValue) {
  return getTrailCurrentElsIndex(cordHistValue, stateValue).slice(0, -1);
}
function getCurrentElIndex(cordHistValue) {
  return getTrailElsIndex(cordHistValue).slice(-1)[0];
}
function getPrevElIndex(cordHistValue, stateValue) {
  return decrement(cordHistValue.slice(-1)[0].i, stateValue.length);
}
function getNextElIndex(cordHistValue, stateValue) {
  return increment(cordHistValue.slice(-1)[0].i, stateValue.length);
}
function getImagesFromIndexes(imgs, indexes) {
  return indexes.map((i) => imgs[i]);
}
function hires(imgs) {
  imgs.forEach((img) => {
    if (img.src === img.dataset.hiUrl)
      return;
    img.src = img.dataset.hiUrl;
    img.height = parseInt(img.dataset.hiImgH);
    img.width = parseInt(img.dataset.hiImgW);
  });
}
function lores(imgs) {
  imgs.forEach((img) => {
    if (img.src === img.dataset.loUrl)
      return;
    img.src = img.dataset.loUrl;
    img.height = parseInt(img.dataset.loImgH);
    img.width = parseInt(img.dataset.loImgW);
  });
}
function onMutation(element, trigger, observeOptions = {
  attributes: true
}) {
  new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
      if (trigger(mutation)) {
        observer.disconnect();
        break;
      }
    }
  }).observe(element, observeOptions);
}
function Stage(props) {
  let _gsap;
  const imgs = Array(props.ijs.length);
  let last = {
    x: 0,
    y: 0
  };
  let abortController;
  let gsapLoaded = false;
  const [state, {
    incIndex
  }] = useState();
  const stateLength = state().length;
  let mounted = false;
  const onMouse = (e) => {
    if (props.isOpen() || props.isAnimating() || !gsapLoaded || !mounted)
      return;
    const cord = {
      x: e.clientX,
      y: e.clientY
    };
    const travelDist = Math.hypot(cord.x - last.x, cord.y - last.y);
    if (travelDist > state().threshold) {
      last = cord;
      incIndex();
      const _state = state();
      const newHist = {
        i: _state.index,
        ...cord
      };
      props.setCordHist((prev) => [...prev, newHist].slice(-stateLength));
    }
  };
  const onClick = () => {
    !props.isAnimating() && props.setIsOpen(true);
  };
  const setPosition = () => {
    if (!mounted)
      return;
    if (imgs.length === 0)
      return;
    const _cordHist = props.cordHist();
    const trailElsIndex = getTrailElsIndex(_cordHist);
    if (trailElsIndex.length === 0)
      return;
    const elsTrail = getImagesFromIndexes(imgs, trailElsIndex);
    const _isOpen = props.isOpen();
    const _state = state();
    _gsap.set(elsTrail, {
      x: (i) => _cordHist[i].x - window.innerWidth / 2,
      y: (i) => _cordHist[i].y - window.innerHeight / 2,
      opacity: (i) => Math.max((i + 1 + _state.trailLength <= _cordHist.length ? 0 : 1) - (_isOpen ? 1 : 0), 0),
      zIndex: (i) => i,
      scale: 0.62
    });
    if (_isOpen) {
      const elc = getImagesFromIndexes(imgs, [getCurrentElIndex(_cordHist)])[0];
      const indexArrayToHires = [];
      const indexArrayToCleanup = [];
      switch (props.navVector()) {
        case "prev":
          indexArrayToHires.push(getPrevElIndex(_cordHist, _state));
          indexArrayToCleanup.push(getNextElIndex(_cordHist, _state));
          break;
        case "next":
          indexArrayToHires.push(getNextElIndex(_cordHist, _state));
          indexArrayToCleanup.push(getPrevElIndex(_cordHist, _state));
          break;
      }
      hires(getImagesFromIndexes(imgs, indexArrayToHires));
      _gsap.set(getImagesFromIndexes(imgs, indexArrayToCleanup), {
        opacity: 0
      });
      _gsap.set(elc, {
        x: 0,
        y: 0,
        scale: 1
      });
      setLoaderForHiresImage(elc);
    } else {
      lores(elsTrail);
    }
  };
  const expandImage = async () => {
    if (!mounted || !gsapLoaded)
      throw new Error("not mounted or gsap not loaded");
    props.setIsAnimating(true);
    const _cordHist = props.cordHist();
    const _state = state();
    const elcIndex = getCurrentElIndex(_cordHist);
    const elc = imgs[elcIndex];
    hires(getImagesFromIndexes(imgs, [elcIndex, getPrevElIndex(_cordHist, _state), getNextElIndex(_cordHist, _state)]));
    setLoaderForHiresImage(elc);
    const tl = _gsap.timeline();
    const trailInactiveEls = getImagesFromIndexes(imgs, getTrailInactiveElsIndex(_cordHist, _state));
    tl.to(trailInactiveEls, {
      y: "+=20",
      ease: "power3.in",
      stagger: 0.075,
      duration: 0.3,
      delay: 0.1,
      opacity: 0
    });
    tl.to(elc, {
      x: 0,
      y: 0,
      ease: "power3.inOut",
      duration: 0.7,
      delay: 0.3
    });
    tl.to(elc, {
      delay: 0.1,
      scale: 1,
      ease: "power3.inOut"
    });
    return await tl.then(() => {
      props.setIsAnimating(false);
    });
  };
  const minimizeImage = async () => {
    if (!mounted || !gsapLoaded)
      throw new Error("not mounted or gsap not loaded");
    props.setIsAnimating(true);
    props.setNavVector("none");
    const _cordHist = props.cordHist();
    const _state = state();
    const elcIndex = getCurrentElIndex(_cordHist);
    const elsTrailInactiveIndexes = getTrailInactiveElsIndex(_cordHist, _state);
    lores(getImagesFromIndexes(imgs, [...elsTrailInactiveIndexes, elcIndex]));
    const tl = _gsap.timeline();
    const elc = getImagesFromIndexes(imgs, [elcIndex])[0];
    const elsTrailInactive = getImagesFromIndexes(imgs, elsTrailInactiveIndexes);
    tl.to(elc, {
      scale: 0.62,
      duration: 0.6,
      ease: "power3.inOut"
    });
    tl.to(elc, {
      delay: 0.3,
      duration: 0.7,
      ease: "power3.inOut",
      x: _cordHist.slice(-1)[0].x - window.innerWidth / 2,
      y: _cordHist.slice(-1)[0].y - window.innerHeight / 2
    });
    tl.to(elsTrailInactive, {
      y: "-=20",
      ease: "power3.out",
      stagger: -0.1,
      duration: 0.3,
      opacity: 1
    });
    return await tl.then(() => {
      props.setIsAnimating(false);
    });
  };
  function setLoaderForHiresImage(img) {
    if (!mounted || !gsapLoaded)
      return;
    if (!img.complete) {
      props.setIsLoading(true);
      const controller = new AbortController();
      const abortSignal = controller.signal;
      img.addEventListener("load", () => {
        _gsap.to(img, {
          opacity: 1,
          ease: "power3.out",
          duration: 0.5
        }).then(() => {
          props.setIsLoading(false);
        }).catch((e) => {
          console.log(e);
        }).finally(() => {
          controller.abort();
        });
      }, {
        once: true,
        passive: true,
        signal: abortSignal
      });
      img.addEventListener("error", () => {
        _gsap.set(img, {
          opacity: 1
        }).then(() => {
          props.setIsLoading(false);
        }).catch((e) => {
          console.log(e);
        }).finally(() => {
          controller.abort();
        });
      }, {
        once: true,
        passive: true,
        signal: abortSignal
      });
    } else {
      _gsap.set(img, {
        opacity: 1
      }).then(() => {
        props.setIsLoading(false);
      }).catch((e) => {
        console.log(e);
      });
    }
  }
  onMount(() => {
    imgs.forEach((img, i) => {
      if (i < 5) {
        img.src = img.dataset.loUrl;
      }
      onMutation(img, (mutation) => {
        if (props.isOpen() || props.isAnimating())
          return false;
        if (mutation.attributeName !== "style")
          return false;
        const opacity = parseFloat(img.style.opacity);
        if (opacity !== 1)
          return false;
        if (i + 5 < imgs.length) {
          imgs[i + 5].src = imgs[i + 5].dataset.loUrl;
        }
        return true;
      });
    });
    window.addEventListener("mousemove", () => {
      loadGsap().then((g) => {
        _gsap = g;
        gsapLoaded = true;
      }).catch((e) => {
        console.log(e);
      });
    }, {
      passive: true,
      once: true
    });
    abortController = new AbortController();
    const abortSignal = abortController.signal;
    window.addEventListener("mousemove", onMouse, {
      passive: true,
      signal: abortSignal
    });
    mounted = true;
  });
  createEffect(on(() => props.cordHist(), () => {
    setPosition();
  }, {
    defer: true
  }));
  createEffect(on(() => props.isOpen(), async () => {
    if (props.isAnimating())
      return;
    if (props.isOpen()) {
      await expandImage().catch(() => {
      }).then(() => {
        abortController == null ? void 0 : abortController.abort();
      });
    } else {
      await minimizeImage().catch(() => {
      }).then(() => {
        abortController = new AbortController();
        const abortSignal = abortController.signal;
        window.addEventListener("mousemove", onMouse, {
          passive: true,
          signal: abortSignal
        });
        props.setIsLoading(false);
      });
    }
  }, {
    defer: true
  }));
  return (() => {
    var _el$ = _tmpl$$1();
    _el$.$$keydown = onClick;
    _el$.$$click = onClick;
    insert(_el$, createComponent(For, {
      get each() {
        return props.ijs;
      },
      children: (ij, i) => (() => {
        var _el$2 = _tmpl$2$1();
        var _ref$ = imgs[i()];
        typeof _ref$ === "function" ? use(_ref$, _el$2) : imgs[i()] = _el$2;
        createRenderEffect((_p$) => {
          var _v$ = ij.loImgH, _v$2 = ij.loImgW, _v$3 = ij.hiUrl, _v$4 = ij.hiImgH, _v$5 = ij.hiImgW, _v$6 = ij.loUrl, _v$7 = ij.loImgH, _v$8 = ij.loImgW, _v$9 = ij.alt;
          _v$ !== _p$.e && setAttribute(_el$2, "height", _p$.e = _v$);
          _v$2 !== _p$.t && setAttribute(_el$2, "width", _p$.t = _v$2);
          _v$3 !== _p$.a && setAttribute(_el$2, "data-hi-url", _p$.a = _v$3);
          _v$4 !== _p$.o && setAttribute(_el$2, "data-hi-img-h", _p$.o = _v$4);
          _v$5 !== _p$.i && setAttribute(_el$2, "data-hi-img-w", _p$.i = _v$5);
          _v$6 !== _p$.n && setAttribute(_el$2, "data-lo-url", _p$.n = _v$6);
          _v$7 !== _p$.s && setAttribute(_el$2, "data-lo-img-h", _p$.s = _v$7);
          _v$8 !== _p$.h && setAttribute(_el$2, "data-lo-img-w", _p$.h = _v$8);
          _v$9 !== _p$.r && setAttribute(_el$2, "alt", _p$.r = _v$9);
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0,
          n: void 0,
          s: void 0,
          h: void 0,
          r: void 0
        });
        return _el$2;
      })()
    }));
    return _el$;
  })();
}
delegateEvents(["click", "keydown"]);
var _tmpl$ = /* @__PURE__ */ template(`<div class=navOverlay>`), _tmpl$2 = /* @__PURE__ */ template(`<div class=overlay>`);
function StageNav(props) {
  const navItems = [props.prevText, props.closeText, props.nextText];
  const [state, {
    incIndex,
    decIndex
  }] = useState();
  const stateLength = state().length;
  const prevImage = () => {
    props.setNavVector("prev");
    props.setCordHist((c) => c.map((item) => {
      return {
        ...item,
        i: decrement(item.i, stateLength)
      };
    }));
    decIndex();
  };
  const closeImage = () => {
    props.setIsOpen(false);
  };
  const nextImage = () => {
    props.setNavVector("next");
    props.setCordHist((c) => c.map((item) => {
      return {
        ...item,
        i: increment(item.i, stateLength)
      };
    }));
    incIndex();
  };
  const handleClick = (item) => {
    if (!props.isOpen() || props.isAnimating())
      return;
    if (item === navItems[0])
      prevImage();
    else if (item === navItems[1])
      closeImage();
    else
      nextImage();
  };
  const handleKey = (e) => {
    if (!props.isOpen() || props.isAnimating())
      return;
    if (e.key === "ArrowLeft")
      prevImage();
    else if (e.key === "Escape")
      closeImage();
    else if (e.key === "ArrowRight")
      nextImage();
  };
  return (() => {
    var _el$ = _tmpl$();
    insert(_el$, createComponent(For, {
      each: navItems,
      children: (item) => (() => {
        var _el$2 = _tmpl$2();
        _el$2.$$mouseover = () => props.setHoverText(item);
        _el$2.addEventListener("focus", () => props.setHoverText(item));
        _el$2.$$keydown = handleKey;
        _el$2.$$click = () => {
          handleClick(item);
        };
        return _el$2;
      })()
    }));
    createRenderEffect(() => _el$.classList.toggle("active", !!props.active()));
    return _el$;
  })();
}
delegateEvents(["click", "keydown", "mouseover"]);
function Desktop(props) {
  const [cordHist, setCordHist] = createSignal([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [isOpen, setIsOpen] = createSignal(false);
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [hoverText, setHoverText] = createSignal("");
  const [navVector, setNavVector] = createSignal("none");
  const active = createMemo(() => isOpen() && !isAnimating());
  const cursorText = createMemo(() => isLoading() ? props.loadingText : hoverText());
  return [createComponent(Nav, {}), createComponent(Show, {
    get when() {
      return props.ijs.length > 0;
    },
    get children() {
      return [createComponent(Stage, {
        get ijs() {
          return props.ijs;
        },
        setIsLoading,
        isOpen,
        setIsOpen,
        isAnimating,
        setIsAnimating,
        cordHist,
        setCordHist,
        navVector,
        setNavVector
      }), createComponent(Show, {
        get when() {
          return isOpen();
        },
        get children() {
          return [createComponent(CustomCursor, {
            cursorText,
            active,
            isOpen
          }), createComponent(StageNav, {
            get prevText() {
              return props.prevText;
            },
            get closeText() {
              return props.closeText;
            },
            get nextText() {
              return props.nextText;
            },
            get loadingText() {
              return props.loadingText;
            },
            active,
            isAnimating,
            setCordHist,
            isOpen,
            setIsOpen,
            setHoverText,
            navVector,
            setNavVector
          })];
        }
      })];
    }
  })];
}
export {
  Desktop as default
};
