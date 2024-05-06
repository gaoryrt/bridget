import { u as useState, o as onMount, d as createEffect, f as on, i as insert, g as createComponent, h as use, b as createRenderEffect, s as setAttribute, F as For, t as template, j as delegateEvents, $ as $PROXY, p as $TRACK, q as getListener, r as batch, c as createSignal, v as spread, w as mergeProps, l as loadGsap, x as invariant, n as createMemo, e as expand, S as Show, _ as __vitePreload } from "./main.js";
var _tmpl$$3 = /* @__PURE__ */ template(`<div class=collection>`), _tmpl$2$1 = /* @__PURE__ */ template(`<img>`);
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function onIntersection(element, trigger) {
  new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (trigger(entry)) {
        observer.disconnect();
        break;
      }
    }
  }).observe(element);
}
function Collection(props) {
  const imgs = Array(props.ijs.length);
  const [state, {
    setIndex
  }] = useState();
  const handleClick = (i) => {
    if (props.isAnimating())
      return;
    setIndex(i);
    props.setIsOpen(true);
  };
  const scrollToActive = () => {
    imgs[state().index].scrollIntoView({
      behavior: "auto",
      block: "center"
    });
  };
  onMount(() => {
    imgs.forEach((img, i) => {
      if (i < 5) {
        img.src = img.dataset.src;
      }
      img.addEventListener("click", () => {
        handleClick(i);
      }, {
        passive: true
      });
      img.addEventListener("keydown", () => {
        handleClick(i);
      }, {
        passive: true
      });
      onIntersection(img, (entry) => {
        if (entry.intersectionRatio <= 0)
          return false;
        if (i + 5 < imgs.length) {
          imgs[i + 5].src = imgs[i + 5].dataset.src;
        }
        return true;
      });
    });
  });
  createEffect(on(() => {
    props.isOpen();
  }, () => {
    if (!props.isOpen())
      scrollToActive();
  }, {
    defer: true
  }));
  return (() => {
    var _el$ = _tmpl$$3();
    insert(_el$, createComponent(For, {
      get each() {
        return props.ijs;
      },
      children: (ij, i) => (() => {
        var _el$2 = _tmpl$2$1();
        _el$2.$$keydown = () => {
          handleClick(i());
        };
        _el$2.$$click = () => {
          handleClick(i());
        };
        var _ref$ = imgs[i()];
        typeof _ref$ === "function" ? use(_ref$, _el$2) : imgs[i()] = _el$2;
        createRenderEffect((_p$) => {
          var _v$ = ij.loImgH, _v$2 = ij.loImgW, _v$3 = ij.loUrl, _v$4 = ij.alt, _v$5 = `translate3d(${i() !== 0 ? getRandom(-25, 25) : 0}%, ${i() !== 0 ? getRandom(-35, 35) : 0}%, 0)`;
          _v$ !== _p$.e && setAttribute(_el$2, "height", _p$.e = _v$);
          _v$2 !== _p$.t && setAttribute(_el$2, "width", _p$.t = _v$2);
          _v$3 !== _p$.a && setAttribute(_el$2, "data-src", _p$.a = _v$3);
          _v$4 !== _p$.o && setAttribute(_el$2, "alt", _p$.o = _v$4);
          _v$5 !== _p$.i && ((_p$.i = _v$5) != null ? _el$2.style.setProperty("transform", _v$5) : _el$2.style.removeProperty("transform"));
          return _p$;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0
        });
        return _el$2;
      })()
    }));
    return _el$;
  })();
}
delegateEvents(["click", "keydown"]);
const $RAW = Symbol("store-raw"), $NODE = Symbol("store-node"), $HAS = Symbol("store-has"), $SELF = Symbol("store-self");
function wrap$1(value) {
  let p = value[$PROXY];
  if (!p) {
    Object.defineProperty(value, $PROXY, {
      value: p = new Proxy(value, proxyTraps$1)
    });
    if (!Array.isArray(value)) {
      const keys = Object.keys(value), desc = Object.getOwnPropertyDescriptors(value);
      for (let i = 0, l = keys.length; i < l; i++) {
        const prop = keys[i];
        if (desc[prop].get) {
          Object.defineProperty(value, prop, {
            enumerable: desc[prop].enumerable,
            get: desc[prop].get.bind(p)
          });
        }
      }
    }
  }
  return p;
}
function isWrappable(obj) {
  let proto;
  return obj != null && typeof obj === "object" && (obj[$PROXY] || !(proto = Object.getPrototypeOf(obj)) || proto === Object.prototype || Array.isArray(obj));
}
function unwrap(item, set = /* @__PURE__ */ new Set()) {
  let result, unwrapped, v, prop;
  if (result = item != null && item[$RAW])
    return result;
  if (!isWrappable(item) || set.has(item))
    return item;
  if (Array.isArray(item)) {
    if (Object.isFrozen(item))
      item = item.slice(0);
    else
      set.add(item);
    for (let i = 0, l = item.length; i < l; i++) {
      v = item[i];
      if ((unwrapped = unwrap(v, set)) !== v)
        item[i] = unwrapped;
    }
  } else {
    if (Object.isFrozen(item))
      item = Object.assign({}, item);
    else
      set.add(item);
    const keys = Object.keys(item), desc = Object.getOwnPropertyDescriptors(item);
    for (let i = 0, l = keys.length; i < l; i++) {
      prop = keys[i];
      if (desc[prop].get)
        continue;
      v = item[prop];
      if ((unwrapped = unwrap(v, set)) !== v)
        item[prop] = unwrapped;
    }
  }
  return item;
}
function getNodes(target, symbol) {
  let nodes = target[symbol];
  if (!nodes)
    Object.defineProperty(target, symbol, {
      value: nodes = /* @__PURE__ */ Object.create(null)
    });
  return nodes;
}
function getNode(nodes, property, value) {
  if (nodes[property])
    return nodes[property];
  const [s, set] = createSignal(value, {
    equals: false,
    internal: true
  });
  s.$ = set;
  return nodes[property] = s;
}
function proxyDescriptor$1(target, property) {
  const desc = Reflect.getOwnPropertyDescriptor(target, property);
  if (!desc || desc.get || !desc.configurable || property === $PROXY || property === $NODE)
    return desc;
  delete desc.value;
  delete desc.writable;
  desc.get = () => target[$PROXY][property];
  return desc;
}
function trackSelf(target) {
  getListener() && getNode(getNodes(target, $NODE), $SELF)();
}
function ownKeys(target) {
  trackSelf(target);
  return Reflect.ownKeys(target);
}
const proxyTraps$1 = {
  get(target, property, receiver) {
    if (property === $RAW)
      return target;
    if (property === $PROXY)
      return receiver;
    if (property === $TRACK) {
      trackSelf(target);
      return receiver;
    }
    const nodes = getNodes(target, $NODE);
    const tracked = nodes[property];
    let value = tracked ? tracked() : target[property];
    if (property === $NODE || property === $HAS || property === "__proto__")
      return value;
    if (!tracked) {
      const desc = Object.getOwnPropertyDescriptor(target, property);
      if (getListener() && (typeof value !== "function" || target.hasOwnProperty(property)) && !(desc && desc.get))
        value = getNode(nodes, property, value)();
    }
    return isWrappable(value) ? wrap$1(value) : value;
  },
  has(target, property) {
    if (property === $RAW || property === $PROXY || property === $TRACK || property === $NODE || property === $HAS || property === "__proto__")
      return true;
    getListener() && getNode(getNodes(target, $HAS), property)();
    return property in target;
  },
  set() {
    return true;
  },
  deleteProperty() {
    return true;
  },
  ownKeys,
  getOwnPropertyDescriptor: proxyDescriptor$1
};
function setProperty(state, property, value, deleting = false) {
  if (!deleting && state[property] === value)
    return;
  const prev = state[property], len = state.length;
  if (value === void 0) {
    delete state[property];
    if (state[$HAS] && state[$HAS][property] && prev !== void 0)
      state[$HAS][property].$();
  } else {
    state[property] = value;
    if (state[$HAS] && state[$HAS][property] && prev === void 0)
      state[$HAS][property].$();
  }
  let nodes = getNodes(state, $NODE), node;
  if (node = getNode(nodes, property, prev))
    node.$(() => value);
  if (Array.isArray(state) && state.length !== len) {
    for (let i = state.length; i < len; i++)
      (node = nodes[i]) && node.$();
    (node = getNode(nodes, "length", len)) && node.$(state.length);
  }
  (node = nodes[$SELF]) && node.$();
}
function mergeStoreNode(state, value) {
  const keys = Object.keys(value);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    setProperty(state, key, value[key]);
  }
}
function updateArray(current, next) {
  if (typeof next === "function")
    next = next(current);
  next = unwrap(next);
  if (Array.isArray(next)) {
    if (current === next)
      return;
    let i = 0, len = next.length;
    for (; i < len; i++) {
      const value = next[i];
      if (current[i] !== value)
        setProperty(current, i, value);
    }
    setProperty(current, "length", len);
  } else
    mergeStoreNode(current, next);
}
function updatePath(current, path, traversed = []) {
  let part, prev = current;
  if (path.length > 1) {
    part = path.shift();
    const partType = typeof part, isArray = Array.isArray(current);
    if (Array.isArray(part)) {
      for (let i = 0; i < part.length; i++) {
        updatePath(current, [part[i]].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "function") {
      for (let i = 0; i < current.length; i++) {
        if (part(current[i], i))
          updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "object") {
      const { from = 0, to = current.length - 1, by = 1 } = part;
      for (let i = from; i <= to; i += by) {
        updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (path.length > 1) {
      updatePath(current[part], path, [part].concat(traversed));
      return;
    }
    prev = current[part];
    traversed = [part].concat(traversed);
  }
  let value = path[0];
  if (typeof value === "function") {
    value = value(prev, traversed);
    if (value === prev)
      return;
  }
  if (part === void 0 && value == void 0)
    return;
  value = unwrap(value);
  if (part === void 0 || isWrappable(prev) && isWrappable(value) && !Array.isArray(value)) {
    mergeStoreNode(prev, value);
  } else
    setProperty(current, part, value);
}
function createStore(...[store, options]) {
  const unwrappedStore = unwrap(store || {});
  const isArray = Array.isArray(unwrappedStore);
  const wrappedStore = wrap$1(unwrappedStore);
  function setStore(...args) {
    batch(() => {
      isArray && args.length === 1 ? updateArray(unwrappedStore, args[0]) : updatePath(unwrappedStore, args);
    });
  }
  return [wrappedStore, setStore];
}
var _tmpl$$2 = /* @__PURE__ */ template(`<div class=slideContainer><img><div class=loadingText>`);
function GalleryImage(props) {
  let img;
  let loadingDiv;
  let _gsap;
  const [state] = useState();
  onMount(() => {
    loadGsap().then((g) => {
      _gsap = g;
    }).catch((e) => {
      console.log(e);
    });
    img == null ? void 0 : img.addEventListener("load", () => {
      invariant(img);
      invariant(loadingDiv);
      if (state().index !== props.ij.index) {
        _gsap.set(img, {
          opacity: 1
        });
        _gsap.set(loadingDiv, {
          opacity: 0
        });
      } else {
        _gsap.to(img, {
          opacity: 1,
          delay: 0.5,
          duration: 0.5,
          ease: "power3.out"
        });
        _gsap.to(loadingDiv, {
          opacity: 0,
          duration: 0.5,
          ease: "power3.in"
        });
      }
    }, {
      once: true,
      passive: true
    });
  });
  return (() => {
    var _el$ = _tmpl$$2(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    var _ref$ = img;
    typeof _ref$ === "function" ? use(_ref$, _el$2) : img = _el$2;
    spread(_el$2, mergeProps(() => props.load && {
      src: props.ij.hiUrl
    }, {
      get height() {
        return props.ij.hiImgH;
      },
      get width() {
        return props.ij.hiImgW;
      },
      get ["data-src"]() {
        return props.ij.hiUrl;
      },
      get alt() {
        return props.ij.alt;
      },
      "style": {
        opacity: 0
      }
    }), false);
    var _ref$2 = loadingDiv;
    typeof _ref$2 === "function" ? use(_ref$2, _el$3) : loadingDiv = _el$3;
    insert(_el$3, () => props.loadingText);
    return _el$;
  })();
}
var _tmpl$$1 = /* @__PURE__ */ template(`<div class=nav><div><span class=num></span><span class=num></span><span class=num></span><span class=num></span><span>/</span><span class=num></span><span class=num></span><span class=num></span><span class=num></span></div><div>`);
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function GalleryNav(props) {
  const [state] = useState();
  const indexValue = createMemo(() => expand(state().index + 1));
  const indexLength = createMemo(() => expand(state().length));
  const onClick = () => {
    if (props.isAnimating())
      return;
    props.setIsOpen(false);
  };
  return (() => {
    var _el$ = _tmpl$$1(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.nextSibling, _el$6 = _el$5.nextSibling, _el$7 = _el$6.nextSibling, _el$8 = _el$7.nextSibling, _el$9 = _el$8.nextSibling, _el$10 = _el$9.nextSibling, _el$11 = _el$10.nextSibling, _el$12 = _el$2.nextSibling;
    insert(_el$3, () => indexValue()[0]);
    insert(_el$4, () => indexValue()[1]);
    insert(_el$5, () => indexValue()[2]);
    insert(_el$6, () => indexValue()[3]);
    insert(_el$8, () => indexLength()[0]);
    insert(_el$9, () => indexLength()[1]);
    insert(_el$10, () => indexLength()[2]);
    insert(_el$11, () => indexLength()[3]);
    _el$12.$$keydown = onClick;
    _el$12.$$click = onClick;
    insert(_el$12, () => capitalizeFirstLetter(props.closeText));
    return _el$;
  })();
}
delegateEvents(["click", "keydown"]);
var _tmpl$ = /* @__PURE__ */ template(`<div class=gallery><div class=galleryInner><div class=swiper-wrapper>`), _tmpl$2 = /* @__PURE__ */ template(`<div class=curtain>`), _tmpl$3 = /* @__PURE__ */ template(`<div class=swiper-slide>`);
function removeDuplicates(arr) {
  if (arr.length < 2)
    return arr;
  return [...new Set(arr)];
}
async function loadSwiper() {
  const s = await __vitePreload(() => import("./CPLfJH.js"), true ? [] : void 0);
  return s.Swiper;
}
function Gallery(props) {
  let _gsap;
  let _swiper;
  let curtain;
  let gallery;
  let galleryInner;
  const _loadingText = capitalizeFirstLetter(props.loadingText);
  let lastIndex = -1;
  let mounted = false;
  let navigateVector = "none";
  const [state, {
    setIndex
  }] = useState();
  const [libLoaded, setLibLoaded] = createSignal(false);
  const [loads, setLoads] = createStore(Array(props.ijs.length).fill(false));
  const slideUp = () => {
    if (!libLoaded() || !mounted)
      return;
    props.setIsAnimating(true);
    invariant(curtain);
    invariant(gallery);
    _gsap.to(curtain, {
      opacity: 1,
      duration: 1
    });
    _gsap.to(gallery, {
      y: 0,
      ease: "power3.inOut",
      duration: 1,
      delay: 0.4
    });
    setTimeout(() => {
      props.setScrollable(false);
      props.setIsAnimating(false);
    }, 1200);
  };
  const slideDown = () => {
    props.setIsAnimating(true);
    invariant(gallery);
    invariant(curtain);
    _gsap.to(gallery, {
      y: "100%",
      ease: "power3.inOut",
      duration: 1
    });
    _gsap.to(curtain, {
      opacity: 0,
      duration: 1.2,
      delay: 0.4
    });
    setTimeout(() => {
      props.setScrollable(true);
      props.setIsAnimating(false);
      lastIndex = -1;
    }, 1400);
  };
  const galleryLoadImages = () => {
    let activeImagesIndex = [];
    const _state = state();
    const currentIndex = _state.index;
    const nextIndex = Math.min(currentIndex + 1, _state.length - 1);
    const prevIndex = Math.max(currentIndex - 1, 0);
    switch (navigateVector) {
      case "next":
        activeImagesIndex = [nextIndex];
        break;
      case "prev":
        activeImagesIndex = [prevIndex];
        break;
      case "none":
        activeImagesIndex = [currentIndex, nextIndex, prevIndex];
        break;
    }
    setLoads(removeDuplicates(activeImagesIndex), true);
  };
  const changeSlide = (slide) => {
    galleryLoadImages();
    _swiper.slideTo(slide, 0);
  };
  onMount(() => {
    window.addEventListener("touchstart", () => {
      loadGsap().then((g) => {
        _gsap = g;
      }).catch((e) => {
        console.log(e);
      });
      loadSwiper().then((S) => {
        invariant(galleryInner);
        _swiper = new S(galleryInner, {
          spaceBetween: 20
        });
        _swiper.on("slideChange", ({
          realIndex
        }) => {
          setIndex(realIndex);
        });
      }).catch((e) => {
        console.log(e);
      });
      setLibLoaded(true);
    }, {
      once: true,
      passive: true
    });
    mounted = true;
  });
  createEffect(on(() => {
    state();
  }, () => {
    const i = state().index;
    if (i === lastIndex)
      return;
    else if (lastIndex === -1)
      navigateVector = "none";
    else if (i < lastIndex)
      navigateVector = "prev";
    else if (i > lastIndex)
      navigateVector = "next";
    else
      navigateVector = "none";
    changeSlide(i);
    lastIndex = i;
  }));
  createEffect(on(() => {
    props.isOpen();
  }, () => {
    if (props.isAnimating())
      return;
    if (props.isOpen())
      slideUp();
    else
      slideDown();
  }, {
    defer: true
  }));
  return [(() => {
    var _el$ = _tmpl$(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild;
    var _ref$ = gallery;
    typeof _ref$ === "function" ? use(_ref$, _el$) : gallery = _el$;
    var _ref$2 = galleryInner;
    typeof _ref$2 === "function" ? use(_ref$2, _el$2) : galleryInner = _el$2;
    insert(_el$3, createComponent(Show, {
      get when() {
        return libLoaded();
      },
      get children() {
        return createComponent(For, {
          get each() {
            return props.ijs;
          },
          children: (ij, i) => (() => {
            var _el$5 = _tmpl$3();
            insert(_el$5, createComponent(GalleryImage, {
              get load() {
                return loads[i()];
              },
              ij,
              loadingText: _loadingText
            }));
            return _el$5;
          })()
        });
      }
    }));
    insert(_el$, createComponent(GalleryNav, {
      get closeText() {
        return props.closeText;
      },
      get isAnimating() {
        return props.isAnimating;
      },
      get setIsOpen() {
        return props.setIsOpen;
      }
    }), null);
    return _el$;
  })(), (() => {
    var _el$4 = _tmpl$2();
    var _ref$3 = curtain;
    typeof _ref$3 === "function" ? use(_ref$3, _el$4) : curtain = _el$4;
    return _el$4;
  })()];
}
function Mobile(props) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [isAnimating, setIsAnimating] = createSignal(false);
  return createComponent(Show, {
    get when() {
      return props.ijs.length > 0;
    },
    get children() {
      return [createComponent(Collection, {
        get ijs() {
          return props.ijs;
        },
        isAnimating,
        isOpen,
        setIsOpen
      }), createComponent(Gallery, {
        get ijs() {
          return props.ijs;
        },
        get closeText() {
          return props.closeText;
        },
        get loadingText() {
          return props.loadingText;
        },
        isAnimating,
        setIsAnimating,
        isOpen,
        setIsOpen,
        get setScrollable() {
          return props.setScrollable;
        }
      })];
    }
  });
}
export {
  Mobile as default
};
