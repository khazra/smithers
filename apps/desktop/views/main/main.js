const Kr = (e, t) => e === t, xe = Symbol("solid-proxy"), ht = Symbol("solid-track"), Ve = {
  equals: Kr
};
let sr = ur;
const we = 1, Je = 2, or = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var Y = null;
let dt = null, Ur = null, X = null, re = null, he = null, ot = 0;
function Ge(e, t) {
  const r = X, n = Y, o = e.length === 0, s = t === void 0 ? n : t, a = o ? or : {
    owned: null,
    cleanups: null,
    context: s ? s.context : null,
    owner: s
  }, i = o ? e : () => e(() => oe(() => Pe(a)));
  Y = a, X = null;
  try {
    return Ce(i, !0);
  } finally {
    X = r, Y = n;
  }
}
function j(e, t) {
  t = t ? Object.assign({}, Ve, t) : Ve;
  const r = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, n = (o) => (typeof o == "function" && (o = o(r.value)), cr(r, o));
  return [lr.bind(r), n];
}
function E(e, t, r) {
  const n = St(e, t, !1, we);
  Le(n);
}
function Se(e, t, r) {
  sr = Zr;
  const n = St(e, t, !1, we);
  n.user = !0, he ? he.push(n) : Le(n);
}
function z(e, t, r) {
  r = r ? Object.assign({}, Ve, r) : Ve;
  const n = St(e, t, !0, 0);
  return n.observers = null, n.observerSlots = null, n.comparator = r.equals || void 0, Le(n), lr.bind(n);
}
function Gr(e) {
  return Ce(e, !1);
}
function oe(e) {
  if (X === null) return e();
  const t = X;
  X = null;
  try {
    return e();
  } finally {
    X = t;
  }
}
function qt(e, t, r) {
  const n = Array.isArray(e);
  let o;
  return (s) => {
    let a;
    if (n) {
      a = Array(e.length);
      for (let l = 0; l < e.length; l++) a[l] = e[l]();
    } else a = e();
    const i = oe(() => t(a, o, s));
    return o = a, i;
  };
}
function _t(e) {
  Se(() => oe(e));
}
function Ne(e) {
  return Y === null || (Y.cleanups === null ? Y.cleanups = [e] : Y.cleanups.push(e)), e;
}
function pt() {
  return X;
}
function ir(e, t) {
  const r = Symbol("context");
  return {
    id: r,
    Provider: Yr(r),
    defaultValue: e
  };
}
function ar(e) {
  const t = z(e), r = z(() => gt(t()));
  return r.toArray = () => {
    const n = r();
    return Array.isArray(n) ? n : n != null ? [n] : [];
  }, r;
}
function lr() {
  if (this.sources && this.state)
    if (this.state === we) Le(this);
    else {
      const e = re;
      re = null, Ce(() => Xe(this), !1), re = e;
    }
  if (X) {
    const e = this.observers ? this.observers.length : 0;
    X.sources ? (X.sources.push(this), X.sourceSlots.push(e)) : (X.sources = [this], X.sourceSlots = [e]), this.observers ? (this.observers.push(X), this.observerSlots.push(X.sources.length - 1)) : (this.observers = [X], this.observerSlots = [X.sources.length - 1]);
  }
  return this.value;
}
function cr(e, t, r) {
  let n = e.value;
  return (!e.comparator || !e.comparator(n, t)) && (e.value = t, e.observers && e.observers.length && Ce(() => {
    for (let o = 0; o < e.observers.length; o += 1) {
      const s = e.observers[o], a = dt && dt.running;
      a && dt.disposed.has(s), (a ? !s.tState : !s.state) && (s.pure ? re.push(s) : he.push(s), s.observers && dr(s)), a || (s.state = we);
    }
    if (re.length > 1e6)
      throw re = [], new Error();
  }, !1)), t;
}
function Le(e) {
  if (!e.fn) return;
  Pe(e);
  const t = ot;
  Vr(e, e.value, t);
}
function Vr(e, t, r) {
  let n;
  const o = Y, s = X;
  X = Y = e;
  try {
    n = e.fn(t);
  } catch (a) {
    return e.pure && (e.state = we, e.owned && e.owned.forEach(Pe), e.owned = null), e.updatedAt = r + 1, fr(a);
  } finally {
    X = s, Y = o;
  }
  (!e.updatedAt || e.updatedAt <= r) && (e.updatedAt != null && "observers" in e ? cr(e, n) : e.value = n, e.updatedAt = r);
}
function St(e, t, r, n = we, o) {
  const s = {
    fn: e,
    state: n,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: Y,
    context: Y ? Y.context : null,
    pure: r
  };
  return Y === null || Y !== or && (Y.owned ? Y.owned.push(s) : Y.owned = [s]), s;
}
function Ze(e) {
  if (e.state === 0) return;
  if (e.state === Je) return Xe(e);
  if (e.suspense && oe(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < ot); )
    e.state && t.push(e);
  for (let r = t.length - 1; r >= 0; r--)
    if (e = t[r], e.state === we)
      Le(e);
    else if (e.state === Je) {
      const n = re;
      re = null, Ce(() => Xe(e, t[0]), !1), re = n;
    }
}
function Ce(e, t) {
  if (re) return e();
  let r = !1;
  t || (re = []), he ? r = !0 : he = [], ot++;
  try {
    const n = e();
    return Jr(r), n;
  } catch (n) {
    r || (he = null), re = null, fr(n);
  }
}
function Jr(e) {
  if (re && (ur(re), re = null), e) return;
  const t = he;
  he = null, t.length && Ce(() => sr(t), !1);
}
function ur(e) {
  for (let t = 0; t < e.length; t++) Ze(e[t]);
}
function Zr(e) {
  let t, r = 0;
  for (t = 0; t < e.length; t++) {
    const n = e[t];
    n.user ? e[r++] = n : Ze(n);
  }
  for (t = 0; t < r; t++) Ze(e[t]);
}
function Xe(e, t) {
  e.state = 0;
  for (let r = 0; r < e.sources.length; r += 1) {
    const n = e.sources[r];
    if (n.sources) {
      const o = n.state;
      o === we ? n !== t && (!n.updatedAt || n.updatedAt < ot) && Ze(n) : o === Je && Xe(n, t);
    }
  }
}
function dr(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const r = e.observers[t];
    r.state || (r.state = Je, r.pure ? re.push(r) : he.push(r), r.observers && dr(r));
  }
}
function Pe(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const r = e.sources.pop(), n = e.sourceSlots.pop(), o = r.observers;
      if (o && o.length) {
        const s = o.pop(), a = r.observerSlots.pop();
        n < o.length && (s.sourceSlots[a] = n, o[n] = s, r.observerSlots[n] = a);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) Pe(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) Pe(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function Xr(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function fr(e, t = Y) {
  throw Xr(e);
}
function gt(e) {
  if (typeof e == "function" && !e.length) return gt(e());
  if (Array.isArray(e)) {
    const t = [];
    for (let r = 0; r < e.length; r++) {
      const n = gt(e[r]);
      Array.isArray(n) ? t.push.apply(t, n) : t.push(n);
    }
    return t;
  }
  return e;
}
function Yr(e, t) {
  return function(n) {
    let o;
    return E(() => o = oe(() => (Y.context = {
      ...Y.context,
      [e]: n.value
    }, ar(() => n.children))), void 0), o;
  };
}
const en = Symbol("fallback");
function Dt(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function tn(e, t, r = {}) {
  let n = [], o = [], s = [], a = 0, i = t.length > 1 ? [] : null;
  return Ne(() => Dt(s)), () => {
    let l = e() || [], c = l.length, h, f;
    return l[ht], oe(() => {
      let d, m, p, g, I, x, C, S, T;
      if (c === 0)
        a !== 0 && (Dt(s), s = [], n = [], o = [], a = 0, i && (i = [])), r.fallback && (n = [en], o[0] = Ge((N) => (s[0] = N, r.fallback())), a = 1);
      else if (a === 0) {
        for (o = new Array(c), f = 0; f < c; f++)
          n[f] = l[f], o[f] = Ge(b);
        a = c;
      } else {
        for (p = new Array(c), g = new Array(c), i && (I = new Array(c)), x = 0, C = Math.min(a, c); x < C && n[x] === l[x]; x++) ;
        for (C = a - 1, S = c - 1; C >= x && S >= x && n[C] === l[S]; C--, S--)
          p[S] = o[C], g[S] = s[C], i && (I[S] = i[C]);
        for (d = /* @__PURE__ */ new Map(), m = new Array(S + 1), f = S; f >= x; f--)
          T = l[f], h = d.get(T), m[f] = h === void 0 ? -1 : h, d.set(T, f);
        for (h = x; h <= C; h++)
          T = n[h], f = d.get(T), f !== void 0 && f !== -1 ? (p[f] = o[h], g[f] = s[h], i && (I[f] = i[h]), f = m[f], d.set(T, f)) : s[h]();
        for (f = x; f < c; f++)
          f in p ? (o[f] = p[f], s[f] = g[f], i && (i[f] = I[f], i[f](f))) : o[f] = Ge(b);
        o = o.slice(0, a = c), n = l.slice(0);
      }
      return o;
    });
    function b(d) {
      if (s[f] = d, i) {
        const [m, p] = j(f);
        return i[f] = p, t(l[f], m);
      }
      return t(l[f]);
    }
  };
}
function w(e, t) {
  return oe(() => e(t || {}));
}
const hr = (e) => `Stale read from <${e}>.`;
function G(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return z(tn(() => e.each, e.children, t || void 0));
}
function P(e) {
  const t = e.keyed, r = z(() => e.when, void 0, void 0), n = t ? r : z(r, void 0, {
    equals: (o, s) => !o == !s
  });
  return z(() => {
    const o = n();
    if (o) {
      const s = e.children;
      return typeof s == "function" && s.length > 0 ? oe(() => s(t ? o : () => {
        if (!oe(n)) throw hr("Show");
        return r();
      })) : s;
    }
    return e.fallback;
  }, void 0, void 0);
}
function rn(e) {
  const t = ar(() => e.children), r = z(() => {
    const n = t(), o = Array.isArray(n) ? n : [n];
    let s = () => {
    };
    for (let a = 0; a < o.length; a++) {
      const i = a, l = o[a], c = s, h = z(() => c() ? void 0 : l.when, void 0, void 0), f = l.keyed ? h : z(h, void 0, {
        equals: (b, d) => !b == !d
      });
      s = () => c() || (f() ? [i, h, l] : void 0);
    }
    return s;
  });
  return z(() => {
    const n = r()();
    if (!n) return e.fallback;
    const [o, s, a] = n, i = a.children;
    return typeof i == "function" && i.length > 0 ? oe(() => i(a.keyed ? s() : () => {
      if (oe(r)()?.[0] !== o) throw hr("Match");
      return s();
    })) : i;
  }, void 0, void 0);
}
function ye(e) {
  return e;
}
const je = (e) => z(() => e());
function nn(e, t, r) {
  let n = r.length, o = t.length, s = n, a = 0, i = 0, l = t[o - 1].nextSibling, c = null;
  for (; a < o || i < s; ) {
    if (t[a] === r[i]) {
      a++, i++;
      continue;
    }
    for (; t[o - 1] === r[s - 1]; )
      o--, s--;
    if (o === a) {
      const h = s < n ? i ? r[i - 1].nextSibling : r[s - i] : l;
      for (; i < s; ) e.insertBefore(r[i++], h);
    } else if (s === i)
      for (; a < o; )
        (!c || !c.has(t[a])) && t[a].remove(), a++;
    else if (t[a] === r[s - 1] && r[i] === t[o - 1]) {
      const h = t[--o].nextSibling;
      e.insertBefore(r[i++], t[a++].nextSibling), e.insertBefore(r[--s], h), t[o] = r[s];
    } else {
      if (!c) {
        c = /* @__PURE__ */ new Map();
        let f = i;
        for (; f < s; ) c.set(r[f], f++);
      }
      const h = c.get(t[a]);
      if (h != null)
        if (i < h && h < s) {
          let f = a, b = 1, d;
          for (; ++f < o && f < s && !((d = c.get(t[f])) == null || d !== h + b); )
            b++;
          if (b > h - i) {
            const m = t[a];
            for (; i < h; ) e.insertBefore(r[i++], m);
          } else e.replaceChild(r[i++], t[a++]);
        } else a++;
      else t[a++].remove();
    }
  }
}
const Ft = "_$DX_DELEGATE";
function sn(e, t, r, n = {}) {
  let o;
  return Ge((s) => {
    o = s, t === document ? e() : u(t, e(), t.firstChild ? null : void 0, r);
  }, n.owner), () => {
    o(), t.textContent = "";
  };
}
function v(e, t, r, n) {
  let o;
  const s = () => {
    const i = n ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
    return i.innerHTML = e, r ? i.content.firstChild.firstChild : n ? i.firstChild : i.content.firstChild;
  }, a = t ? () => oe(() => document.importNode(o || (o = s()), !0)) : () => (o || (o = s())).cloneNode(!0);
  return a.cloneNode = a, a;
}
function pe(e, t = window.document) {
  const r = t[Ft] || (t[Ft] = /* @__PURE__ */ new Set());
  for (let n = 0, o = e.length; n < o; n++) {
    const s = e[n];
    r.has(s) || (r.add(s), t.addEventListener(s, an));
  }
}
function Z(e, t, r) {
  r == null ? e.removeAttribute(t) : e.setAttribute(t, r);
}
function ie(e, t) {
  t == null ? e.removeAttribute("class") : e.className = t;
}
function on(e, t, r = {}) {
  const n = Object.keys(t || {}), o = Object.keys(r);
  let s, a;
  for (s = 0, a = o.length; s < a; s++) {
    const i = o[s];
    !i || i === "undefined" || t[i] || (Lt(e, i, !1), delete r[i]);
  }
  for (s = 0, a = n.length; s < a; s++) {
    const i = n[s], l = !!t[i];
    !i || i === "undefined" || r[i] === l || !l || (Lt(e, i, !0), r[i] = l);
  }
  return r;
}
function Ee(e, t, r) {
  r != null ? e.style.setProperty(t, r) : e.style.removeProperty(t);
}
function Nt(e, t, r) {
  return oe(() => e(t, r));
}
function u(e, t, r, n) {
  if (r !== void 0 && !n && (n = []), typeof t != "function") return Ye(e, t, n, r);
  E((o) => Ye(e, t(), o, r), n);
}
function Lt(e, t, r) {
  const n = t.trim().split(/\s+/);
  for (let o = 0, s = n.length; o < s; o++) e.classList.toggle(n[o], r);
}
function an(e) {
  let t = e.target;
  const r = `$$${e.type}`, n = e.target, o = e.currentTarget, s = (l) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: l
  }), a = () => {
    const l = t[r];
    if (l && !t.disabled) {
      const c = t[`${r}Data`];
      if (c !== void 0 ? l.call(t, c, e) : l.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && s(t.host), !0;
  }, i = () => {
    for (; a() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const l = e.composedPath();
    s(l[0]);
    for (let c = 0; c < l.length - 2 && (t = l[c], !!a()); c++) {
      if (t._$host) {
        t = t._$host, i();
        break;
      }
      if (t.parentNode === o)
        break;
    }
  } else i();
  s(n);
}
function Ye(e, t, r, n, o) {
  for (; typeof r == "function"; ) r = r();
  if (t === r) return r;
  const s = typeof t, a = n !== void 0;
  if (e = a && r[0] && r[0].parentNode || e, s === "string" || s === "number") {
    if (s === "number" && (t = t.toString(), t === r))
      return r;
    if (a) {
      let i = r[0];
      i && i.nodeType === 3 ? i.data !== t && (i.data = t) : i = document.createTextNode(t), r = $e(e, r, n, i);
    } else
      r !== "" && typeof r == "string" ? r = e.firstChild.data = t : r = e.textContent = t;
  } else if (t == null || s === "boolean")
    r = $e(e, r, n);
  else {
    if (s === "function")
      return E(() => {
        let i = t();
        for (; typeof i == "function"; ) i = i();
        r = Ye(e, i, r, n);
      }), () => r;
    if (Array.isArray(t)) {
      const i = [], l = r && Array.isArray(r);
      if (bt(i, t, r, o))
        return E(() => r = Ye(e, i, r, n, !0)), () => r;
      if (i.length === 0) {
        if (r = $e(e, r, n), a) return r;
      } else l ? r.length === 0 ? jt(e, i, n) : nn(e, r, i) : (r && $e(e), jt(e, i));
      r = i;
    } else if (t.nodeType) {
      if (Array.isArray(r)) {
        if (a) return r = $e(e, r, n, t);
        $e(e, r, null, t);
      } else r == null || r === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      r = t;
    }
  }
  return r;
}
function bt(e, t, r, n) {
  let o = !1;
  for (let s = 0, a = t.length; s < a; s++) {
    let i = t[s], l = r && r[e.length], c;
    if (!(i == null || i === !0 || i === !1)) if ((c = typeof i) == "object" && i.nodeType)
      e.push(i);
    else if (Array.isArray(i))
      o = bt(e, i, l) || o;
    else if (c === "function")
      if (n) {
        for (; typeof i == "function"; ) i = i();
        o = bt(e, Array.isArray(i) ? i : [i], Array.isArray(l) ? l : [l]) || o;
      } else
        e.push(i), o = !0;
    else {
      const h = String(i);
      l && l.nodeType === 3 && l.data === h ? e.push(l) : e.push(document.createTextNode(h));
    }
  }
  return o;
}
function jt(e, t, r = null) {
  for (let n = 0, o = t.length; n < o; n++) e.insertBefore(t[n], r);
}
function $e(e, t, r, n) {
  if (r === void 0) return e.textContent = "";
  const o = n || document.createTextNode("");
  if (t.length) {
    let s = !1;
    for (let a = t.length - 1; a >= 0; a--) {
      const i = t[a];
      if (o !== i) {
        const l = i.parentNode === e;
        !s && !a ? l ? e.replaceChild(o, i) : e.insertBefore(o, r) : l && i.remove();
      } else s = !0;
    }
  } else e.insertBefore(o, r);
  return [o];
}
const mt = Symbol("store-raw"), ke = Symbol("store-node"), fe = Symbol("store-has"), pr = Symbol("store-self");
function gr(e) {
  let t = e[xe];
  if (!t && (Object.defineProperty(e, xe, {
    value: t = new Proxy(e, un)
  }), !Array.isArray(e))) {
    const r = Object.keys(e), n = Object.getOwnPropertyDescriptors(e);
    for (let o = 0, s = r.length; o < s; o++) {
      const a = r[o];
      n[a].get && Object.defineProperty(e, a, {
        enumerable: n[a].enumerable,
        get: n[a].get.bind(t)
      });
    }
  }
  return t;
}
function et(e) {
  let t;
  return e != null && typeof e == "object" && (e[xe] || !(t = Object.getPrototypeOf(e)) || t === Object.prototype || Array.isArray(e));
}
function Me(e, t = /* @__PURE__ */ new Set()) {
  let r, n, o, s;
  if (r = e != null && e[mt]) return r;
  if (!et(e) || t.has(e)) return e;
  if (Array.isArray(e)) {
    Object.isFrozen(e) ? e = e.slice(0) : t.add(e);
    for (let a = 0, i = e.length; a < i; a++)
      o = e[a], (n = Me(o, t)) !== o && (e[a] = n);
  } else {
    Object.isFrozen(e) ? e = Object.assign({}, e) : t.add(e);
    const a = Object.keys(e), i = Object.getOwnPropertyDescriptors(e);
    for (let l = 0, c = a.length; l < c; l++)
      s = a[l], !i[s].get && (o = e[s], (n = Me(o, t)) !== o && (e[s] = n));
  }
  return e;
}
function tt(e, t) {
  let r = e[t];
  return r || Object.defineProperty(e, t, {
    value: r = /* @__PURE__ */ Object.create(null)
  }), r;
}
function qe(e, t, r) {
  if (e[t]) return e[t];
  const [n, o] = j(r, {
    equals: !1,
    internal: !0
  });
  return n.$ = o, e[t] = n;
}
function ln(e, t) {
  const r = Reflect.getOwnPropertyDescriptor(e, t);
  return !r || r.get || !r.configurable || t === xe || t === ke || (delete r.value, delete r.writable, r.get = () => e[xe][t]), r;
}
function br(e) {
  pt() && qe(tt(e, ke), pr)();
}
function cn(e) {
  return br(e), Reflect.ownKeys(e);
}
const un = {
  get(e, t, r) {
    if (t === mt) return e;
    if (t === xe) return r;
    if (t === ht)
      return br(e), r;
    const n = tt(e, ke), o = n[t];
    let s = o ? o() : e[t];
    if (t === ke || t === fe || t === "__proto__") return s;
    if (!o) {
      const a = Object.getOwnPropertyDescriptor(e, t);
      pt() && (typeof s != "function" || e.hasOwnProperty(t)) && !(a && a.get) && (s = qe(n, t, s)());
    }
    return et(s) ? gr(s) : s;
  },
  has(e, t) {
    return t === mt || t === xe || t === ht || t === ke || t === fe || t === "__proto__" ? !0 : (pt() && qe(tt(e, fe), t)(), t in e);
  },
  set() {
    return !0;
  },
  deleteProperty() {
    return !0;
  },
  ownKeys: cn,
  getOwnPropertyDescriptor: ln
};
function rt(e, t, r, n = !1) {
  if (!n && e[t] === r) return;
  const o = e[t], s = e.length;
  r === void 0 ? (delete e[t], e[fe] && e[fe][t] && o !== void 0 && e[fe][t].$()) : (e[t] = r, e[fe] && e[fe][t] && o === void 0 && e[fe][t].$());
  let a = tt(e, ke), i;
  if ((i = qe(a, t, o)) && i.$(() => r), Array.isArray(e) && e.length !== s) {
    for (let l = e.length; l < s; l++) (i = a[l]) && i.$();
    (i = qe(a, "length", s)) && i.$(e.length);
  }
  (i = a[pr]) && i.$();
}
function mr(e, t) {
  const r = Object.keys(t);
  for (let n = 0; n < r.length; n += 1) {
    const o = r[n];
    rt(e, o, t[o]);
  }
}
function dn(e, t) {
  if (typeof t == "function" && (t = t(e)), t = Me(t), Array.isArray(t)) {
    if (e === t) return;
    let r = 0, n = t.length;
    for (; r < n; r++) {
      const o = t[r];
      e[r] !== o && rt(e, r, o);
    }
    rt(e, "length", n);
  } else mr(e, t);
}
function Oe(e, t, r = []) {
  let n, o = e;
  if (t.length > 1) {
    n = t.shift();
    const a = typeof n, i = Array.isArray(e);
    if (Array.isArray(n)) {
      for (let l = 0; l < n.length; l++)
        Oe(e, [n[l]].concat(t), r);
      return;
    } else if (i && a === "function") {
      for (let l = 0; l < e.length; l++)
        n(e[l], l) && Oe(e, [l].concat(t), r);
      return;
    } else if (i && a === "object") {
      const {
        from: l = 0,
        to: c = e.length - 1,
        by: h = 1
      } = n;
      for (let f = l; f <= c; f += h)
        Oe(e, [f].concat(t), r);
      return;
    } else if (t.length > 1) {
      Oe(e[n], t, [n].concat(r));
      return;
    }
    o = e[n], r = [n].concat(r);
  }
  let s = t[0];
  typeof s == "function" && (s = s(o, r), s === o) || n === void 0 && s == null || (s = Me(s), n === void 0 || et(o) && et(s) && !Array.isArray(s) ? mr(o, s) : rt(e, n, s));
}
function fn(...[e, t]) {
  const r = Me(e || {}), n = Array.isArray(r), o = gr(r);
  function s(...a) {
    Gr(() => {
      n && a.length === 1 ? dn(r, a[0]) : Oe(r, a);
    });
  }
  return [o, s];
}
const hn = {
  currentView: "chat",
  agent: null,
  sessionId: null,
  sessions: [],
  workspaceRoot: null,
  settings: null,
  secretStatus: { openai: !1, anthropic: !1 },
  workflows: [],
  runs: [],
  selectedRunId: null,
  contextRunId: null,
  runDetails: {},
  runEvents: {},
  runEventSeq: {},
  frames: {},
  outputs: {},
  attempts: {},
  toolCalls: {},
  activeTab: "graph",
  inspectorOpen: !1,
  inspectorExpanded: !1,
  logQuery: "",
  logFilters: /* @__PURE__ */ new Set(["run", "node", "approval", "revert"]),
  graphZoom: 1,
  graphPan: { x: 0, y: 0 },
  toasts: []
}, [_, M] = fn(hn);
let pn = 0;
function se(e, t) {
  const r = `toast-${++pn}`;
  M("toasts", (n) => [...n, { id: r, level: e, message: t }]), setTimeout(() => {
    M("toasts", (n) => n.filter((o) => o.id !== r));
  }, 3500);
}
function We(e) {
  return new Date(e).toLocaleTimeString();
}
function wr(e, t) {
  const r = t ?? Date.now(), n = Math.max(0, r - e), o = Math.floor(n / 1e3), s = Math.floor(o / 60), a = Math.floor(s / 60), i = [];
  return a && i.push(`${a}h`), (s % 60 || !a) && i.push(`${s % 60}m`), !a && s < 5 && i.push(`${o % 60}s`), i.join(" ");
}
function xr(e, t = 28) {
  return e.length <= t ? e : `…${e.slice(-t)}`;
}
function gn(e, t = 120) {
  return e.length <= t ? e : `${e.slice(0, t - 1)}…`;
}
function vr(e) {
  var t, r, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (r = vr(e[t])) && (n && (n += " "), n += r);
  } else for (r in e) e[r] && (n && (n += " "), n += r);
  return n;
}
function bn() {
  for (var e, t, r = 0, n = "", o = arguments.length; r < o; r++) (e = arguments[r]) && (t = vr(e)) && (n && (n += " "), n += t);
  return n;
}
const Ct = "-", mn = (e) => {
  const t = xn(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: n
  } = e;
  return {
    getClassGroupId: (a) => {
      const i = a.split(Ct);
      return i[0] === "" && i.length !== 1 && i.shift(), yr(i, t) || wn(a);
    },
    getConflictingClassGroupIds: (a, i) => {
      const l = r[a] || [];
      return i && n[a] ? [...l, ...n[a]] : l;
    }
  };
}, yr = (e, t) => {
  if (e.length === 0)
    return t.classGroupId;
  const r = e[0], n = t.nextPart.get(r), o = n ? yr(e.slice(1), n) : void 0;
  if (o)
    return o;
  if (t.validators.length === 0)
    return;
  const s = e.join(Ct);
  return t.validators.find(({
    validator: a
  }) => a(s))?.classGroupId;
}, Wt = /^\[(.+)\]$/, wn = (e) => {
  if (Wt.test(e)) {
    const t = Wt.exec(e)[1], r = t?.substring(0, t.indexOf(":"));
    if (r)
      return "arbitrary.." + r;
  }
}, xn = (e) => {
  const {
    theme: t,
    prefix: r
  } = e, n = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return yn(Object.entries(e.classGroups), r).forEach(([s, a]) => {
    wt(a, n, s, t);
  }), n;
}, wt = (e, t, r, n) => {
  e.forEach((o) => {
    if (typeof o == "string") {
      const s = o === "" ? t : Qt(t, o);
      s.classGroupId = r;
      return;
    }
    if (typeof o == "function") {
      if (vn(o)) {
        wt(o(n), t, r, n);
        return;
      }
      t.validators.push({
        validator: o,
        classGroupId: r
      });
      return;
    }
    Object.entries(o).forEach(([s, a]) => {
      wt(a, Qt(t, s), r, n);
    });
  });
}, Qt = (e, t) => {
  let r = e;
  return t.split(Ct).forEach((n) => {
    r.nextPart.has(n) || r.nextPart.set(n, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), r = r.nextPart.get(n);
  }), r;
}, vn = (e) => e.isThemeGetter, yn = (e, t) => t ? e.map(([r, n]) => {
  const o = n.map((s) => typeof s == "string" ? t + s : typeof s == "object" ? Object.fromEntries(Object.entries(s).map(([a, i]) => [t + a, i])) : s);
  return [r, o];
}) : e, $n = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  const o = (s, a) => {
    r.set(s, a), t++, t > e && (t = 0, n = r, r = /* @__PURE__ */ new Map());
  };
  return {
    get(s) {
      let a = r.get(s);
      if (a !== void 0)
        return a;
      if ((a = n.get(s)) !== void 0)
        return o(s, a), a;
    },
    set(s, a) {
      r.has(s) ? r.set(s, a) : o(s, a);
    }
  };
}, $r = "!", kn = (e) => {
  const {
    separator: t,
    experimentalParseClassName: r
  } = e, n = t.length === 1, o = t[0], s = t.length, a = (i) => {
    const l = [];
    let c = 0, h = 0, f;
    for (let g = 0; g < i.length; g++) {
      let I = i[g];
      if (c === 0) {
        if (I === o && (n || i.slice(g, g + s) === t)) {
          l.push(i.slice(h, g)), h = g + s;
          continue;
        }
        if (I === "/") {
          f = g;
          continue;
        }
      }
      I === "[" ? c++ : I === "]" && c--;
    }
    const b = l.length === 0 ? i : i.substring(h), d = b.startsWith($r), m = d ? b.substring(1) : b, p = f && f > h ? f - h : void 0;
    return {
      modifiers: l,
      hasImportantModifier: d,
      baseClassName: m,
      maybePostfixModifierPosition: p
    };
  };
  return r ? (i) => r({
    className: i,
    parseClassName: a
  }) : a;
}, _n = (e) => {
  if (e.length <= 1)
    return e;
  const t = [];
  let r = [];
  return e.forEach((n) => {
    n[0] === "[" ? (t.push(...r.sort(), n), r = []) : r.push(n);
  }), t.push(...r.sort()), t;
}, Sn = (e) => ({
  cache: $n(e.cacheSize),
  parseClassName: kn(e),
  ...mn(e)
}), Cn = /\s+/, In = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: n,
    getConflictingClassGroupIds: o
  } = t, s = [], a = e.trim().split(Cn);
  let i = "";
  for (let l = a.length - 1; l >= 0; l -= 1) {
    const c = a[l], {
      modifiers: h,
      hasImportantModifier: f,
      baseClassName: b,
      maybePostfixModifierPosition: d
    } = r(c);
    let m = !!d, p = n(m ? b.substring(0, d) : b);
    if (!p) {
      if (!m) {
        i = c + (i.length > 0 ? " " + i : i);
        continue;
      }
      if (p = n(b), !p) {
        i = c + (i.length > 0 ? " " + i : i);
        continue;
      }
      m = !1;
    }
    const g = _n(h).join(":"), I = f ? g + $r : g, x = I + p;
    if (s.includes(x))
      continue;
    s.push(x);
    const C = o(p, m);
    for (let S = 0; S < C.length; ++S) {
      const T = C[S];
      s.push(I + T);
    }
    i = c + (i.length > 0 ? " " + i : i);
  }
  return i;
};
function An() {
  let e = 0, t, r, n = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (r = kr(t)) && (n && (n += " "), n += r);
  return n;
}
const kr = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let n = 0; n < e.length; n++)
    e[n] && (t = kr(e[n])) && (r && (r += " "), r += t);
  return r;
};
function Rn(e, ...t) {
  let r, n, o, s = a;
  function a(l) {
    const c = t.reduce((h, f) => f(h), e());
    return r = Sn(c), n = r.cache.get, o = r.cache.set, s = i, i(l);
  }
  function i(l) {
    const c = n(l);
    if (c)
      return c;
    const h = In(l, r);
    return o(l, h), h;
  }
  return function() {
    return s(An.apply(null, arguments));
  };
}
const U = (e) => {
  const t = (r) => r[e] || [];
  return t.isThemeGetter = !0, t;
}, _r = /^\[(?:([a-z-]+):)?(.+)\]$/i, On = /^\d+\/\d+$/, Tn = /* @__PURE__ */ new Set(["px", "full", "screen"]), En = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Pn = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Mn = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, qn = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Dn = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, de = (e) => _e(e) || Tn.has(e) || On.test(e), be = (e) => Ie(e, "length", Bn), _e = (e) => !!e && !Number.isNaN(Number(e)), ft = (e) => Ie(e, "number", _e), Ae = (e) => !!e && Number.isInteger(Number(e)), Fn = (e) => e.endsWith("%") && _e(e.slice(0, -1)), D = (e) => _r.test(e), me = (e) => En.test(e), Nn = /* @__PURE__ */ new Set(["length", "size", "percentage"]), Ln = (e) => Ie(e, Nn, Sr), jn = (e) => Ie(e, "position", Sr), Wn = /* @__PURE__ */ new Set(["image", "url"]), Qn = (e) => Ie(e, Wn, Kn), zn = (e) => Ie(e, "", Hn), Re = () => !0, Ie = (e, t, r) => {
  const n = _r.exec(e);
  return n ? n[1] ? typeof t == "string" ? n[1] === t : t.has(n[1]) : r(n[2]) : !1;
}, Bn = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Pn.test(e) && !Mn.test(e)
), Sr = () => !1, Hn = (e) => qn.test(e), Kn = (e) => Dn.test(e), Un = () => {
  const e = U("colors"), t = U("spacing"), r = U("blur"), n = U("brightness"), o = U("borderColor"), s = U("borderRadius"), a = U("borderSpacing"), i = U("borderWidth"), l = U("contrast"), c = U("grayscale"), h = U("hueRotate"), f = U("invert"), b = U("gap"), d = U("gradientColorStops"), m = U("gradientColorStopPositions"), p = U("inset"), g = U("margin"), I = U("opacity"), x = U("padding"), C = U("saturate"), S = U("scale"), T = U("sepia"), N = U("skew"), q = U("space"), y = U("translate"), k = () => ["auto", "contain", "none"], O = () => ["auto", "hidden", "clip", "visible", "scroll"], $ = () => ["auto", D, t], A = () => [D, t], W = () => ["", de, be], F = () => ["auto", _e, D], L = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], ee = () => ["solid", "dashed", "dotted", "double", "none"], R = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], B = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], H = () => ["", "0", D], Q = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], J = () => [_e, D];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [Re],
      spacing: [de, be],
      blur: ["none", "", me, D],
      brightness: J(),
      borderColor: [e],
      borderRadius: ["none", "", "full", me, D],
      borderSpacing: A(),
      borderWidth: W(),
      contrast: J(),
      grayscale: H(),
      hueRotate: J(),
      invert: H(),
      gap: A(),
      gradientColorStops: [e],
      gradientColorStopPositions: [Fn, be],
      inset: $(),
      margin: $(),
      opacity: J(),
      padding: A(),
      saturate: J(),
      scale: J(),
      sepia: H(),
      skew: J(),
      space: A(),
      translate: A()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", D]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [me]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": Q()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": Q()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [...L(), D]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: O()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": O()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": O()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: k()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": k()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": k()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [p]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [p]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [p]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [p]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [p]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [p]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [p]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [p]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [p]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ["auto", Ae, D]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: $()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", D]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: H()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: H()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", Ae, D]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [Re]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", Ae, D]
        }, D]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": F()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": F()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [Re]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [Ae, D]
        }, D]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": F()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": F()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ["auto", "min", "max", "fr", D]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", D]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [b]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [b]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [b]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...B()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...B(), "baseline"]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [...B(), "baseline"]
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [x]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [x]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [x]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [x]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [x]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [x]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [x]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [x]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [x]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [g]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [g]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [g]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [g]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [g]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [g]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [g]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [g]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [g]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [q]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [q]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", D, t]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [D, t, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [D, t, "none", "full", "min", "max", "fit", "prose", {
          screen: [me]
        }, me]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [D, t, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [D, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [D, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [D, t, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", me, be]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", ft]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Re]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", D]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", _e, ft]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", de, D]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", D]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", D]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [e]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [I]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [e]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [I]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...ee(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", de, be]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", de, D]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [e]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: A()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", D]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", D]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [I]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [...L(), jn]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", Ln]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, Qn]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [e]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [m]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [m]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [m]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [d]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [d]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [d]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [s]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [s]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [s]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [s]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [s]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [s]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [s]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [s]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [s]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [s]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [s]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [s]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [s]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [s]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [s]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [i]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [i]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [i]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [i]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [i]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [i]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [i]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [i]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [i]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [I]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...ee(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [i]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [i]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [I]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: ee()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [o]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [o]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [o]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [o]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [o]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [o]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [o]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [o]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [o]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [o]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...ee()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [de, D]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [de, be]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [e]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: W()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [e]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [I]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [de, be]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [e]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", me, zn]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [Re]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [I]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...R(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": R()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [r]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [n]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [l]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", me, D]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [c]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [h]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [f]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [C]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [T]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [r]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [n]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [l]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [c]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [h]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [f]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [I]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [C]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [T]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": [a]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [a]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [a]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", D]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: J()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", D]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: J()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", D]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [S]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [S]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [S]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [Ae, D]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [y]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [y]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [N]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [N]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", D]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", e]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", D]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [e]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": A()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": A()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": A()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": A()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": A()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": A()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": A()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": A()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": A()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": A()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": A()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": A()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": A()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": A()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": A()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": A()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": A()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": A()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", D]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [e, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [de, be, ft]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [e, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
}, Gn = /* @__PURE__ */ Rn(Un);
function ae(...e) {
  return Gn(bn(e));
}
var Vn = /* @__PURE__ */ v('<pre class="my-2 rounded-lg bg-background p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">'), Jn = /* @__PURE__ */ v("<span class=whitespace-pre-wrap>"), Zn = /* @__PURE__ */ v('<div class="message--user flex justify-end mb-3"><div class="max-w-[75%] bg-panel-2 px-4 py-2.5 text-foreground text-sm"style="border-radius:18px 18px 4px 18px"><div class="mt-1 text-[10px] text-subtle text-right">'), Xn = /* @__PURE__ */ v('<span class="inline-block w-1.5 h-4 bg-accent rounded-sm animate-pulse ml-0.5 align-text-bottom">'), Yn = /* @__PURE__ */ v('<div class="mt-1 text-xs text-danger border border-danger/30 rounded px-2 py-1">'), es = /* @__PURE__ */ v('<span class="ml-2 font-mono">'), ts = /* @__PURE__ */ v('<div class="message--assistant flex justify-start mb-3"><div class=max-w-[85%]><div class="mt-1 text-[10px] text-subtle">'), rs = /* @__PURE__ */ v('<div class="text-sm text-foreground mb-1">'), ns = /* @__PURE__ */ v('<div class="border-l-2 border-subtle pl-3 mb-2 text-sm text-muted italic">'), ss = /* @__PURE__ */ v('<div class="inline-block mb-1 mr-1 rounded bg-panel-2 px-2 py-0.5 font-mono text-xs text-muted">'), os = /* @__PURE__ */ v('<div class="message--toolResult mb-2 ml-4"><div><span class="text-subtle mr-1">⤶ <!>:'), is = /* @__PURE__ */ v('<div class="workflow-card mb-3 mx-1"><div class="rounded-lg border border-border bg-panel p-3 max-w-[85%]"><div class="flex items-center gap-2 mb-2"><span class="workflow-card__title text-sm font-medium text-foreground"></span><span></span></div><div class="text-xs text-subtle font-mono mb-2">Run: </div><div class="workflow-card__actions flex items-center gap-2 flex-wrap"><button class="rounded px-2 py-1 text-xs bg-accent/20 text-accent hover:bg-accent/30 transition-colors">Open run'), as = /* @__PURE__ */ v('<div class="flex items-center gap-1"><button class="rounded px-2 py-1 text-xs bg-success/20 text-success hover:bg-success/30 transition-colors">Approve</button><button class="rounded px-2 py-1 text-xs bg-danger/20 text-danger hover:bg-danger/30 transition-colors">Deny'), ls = /* @__PURE__ */ v('<div class="mention-box absolute bottom-full left-4 right-4 mb-1 rounded-lg border border-border bg-panel shadow-lg max-h-48 overflow-y-auto z-50">'), cs = /* @__PURE__ */ v('<button class="mention-item w-full text-left px-3 py-2 text-sm text-foreground hover:bg-panel-2 transition-colors flex items-center gap-2"><span></span><span class=truncate>'), us = /* @__PURE__ */ v('<span class="text-[11px] text-subtle font-mono truncate max-w-[180px]">'), ds = /* @__PURE__ */ v('<span class="text-[10px] text-accent font-mono bg-accent/10 rounded px-1.5 py-0.5">run:'), fs = /* @__PURE__ */ v('<div class="message--error mb-3 rounded-lg border border-danger/40 bg-danger/5 px-4 py-2 text-sm text-danger">'), hs = /* @__PURE__ */ v('<div class="max-w-2xl mx-auto"><div>'), ps = /* @__PURE__ */ v('<div class="chat-panel flex flex-col flex-1 min-h-0"><header class="flex items-center gap-2 px-4 h-11 shrink-0 border-b border-border bg-panel"><select id=session-select class="bg-panel-2 text-foreground text-xs rounded px-2 py-1 border border-border min-w-[140px] max-w-[220px] truncate"></select><button id=new-session class="w-6 h-6 rounded flex items-center justify-center text-muted hover:text-foreground hover:bg-panel-2 transition-colors text-sm"title="New session">+</button><div class=flex-1></div><button id=toggle-sidebar title="Toggle inspector (⌘I)">⌘I</button></header><div class="flex-1 overflow-y-auto min-h-0 px-4 py-4"></div><div class="shrink-0 px-4 pb-4 pt-1"><div class="relative max-w-2xl mx-auto"><div class="flex items-end gap-2 rounded-[22px] border border-border bg-panel p-2 shadow-lg"><textarea class="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-subtle px-2 py-1.5 min-h-[3rem] max-h-[12rem] leading-relaxed focus:outline-none"placeholder="Ask anything, @ to add files, / for commands"rows=1></textarea><button>'), gs = /* @__PURE__ */ v("<option>"), bs = /* @__PURE__ */ v('<div class="flex items-center justify-center h-full"><span class="text-subtle text-lg">How can I help you today?');
function ms(e) {
  return typeof e.content == "string" ? e.content : e.content.filter((t) => t.type === "text").map((t) => t.text).join("");
}
function Cr(e) {
  const t = e.split(/(```[\s\S]*?```)/g);
  return w(G, {
    each: t,
    children: (r) => r.startsWith("```") ? (() => {
      var n = Vn();
      return u(n, () => r.replace(/^```\w*\n?/, "").replace(/\n?```$/, "")), n;
    })() : (() => {
      var n = Jn();
      return u(n, r), n;
    })()
  });
}
function ws(e) {
  const t = Object.keys(e.arguments).slice(0, 2).join(", ");
  return `→ ${e.name}(${t})`;
}
function xs(e) {
  switch (e) {
    case "running":
      return "bg-accent/20 text-accent";
    case "waiting-approval":
      return "bg-warning/20 text-warning";
    case "finished":
      return "bg-success/20 text-success";
    case "failed":
    case "cancelled":
      return "bg-danger/20 text-danger";
    default:
      return "bg-panel-2 text-muted";
  }
}
const vs = (e) => (() => {
  var t = Zn(), r = t.firstChild, n = r.firstChild;
  return u(r, () => Cr(ms(e.msg)), n), u(n, () => We(e.timestamp)), t;
})(), ys = (e) => (() => {
  var t = ts(), r = t.firstChild, n = r.firstChild;
  return u(r, w(G, {
    get each() {
      return e.msg.content;
    },
    children: (o) => o.type === "text" ? (() => {
      var s = rs();
      return u(s, () => Cr(o.text)), s;
    })() : o.type === "thinking" ? (() => {
      var s = ns();
      return u(s, () => o.thinking), s;
    })() : o.type === "toolCall" ? (() => {
      var s = ss();
      return u(s, () => ws(o)), s;
    })() : null
  }), n), u(r, w(P, {
    get when() {
      return e.streaming;
    },
    get children() {
      return Xn();
    }
  }), n), u(r, w(P, {
    get when() {
      return e.msg.errorMessage;
    },
    get children() {
      var o = Yn();
      return u(o, () => e.msg.errorMessage), o;
    }
  }), n), u(n, () => We(e.msg.timestamp), null), u(n, w(P, {
    get when() {
      return e.msg.model;
    },
    get children() {
      var o = es();
      return u(o, () => e.msg.model), o;
    }
  }), null), t;
})(), $s = (e) => {
  const t = () => e.msg.content.filter((r) => r.type === "text").map((r) => r.text).join("");
  return (() => {
    var r = os(), n = r.firstChild, o = n.firstChild, s = o.firstChild, a = s.nextSibling;
    return a.nextSibling, u(o, () => e.msg.toolName, a), u(n, () => gn(t(), 200), null), E(() => ie(n, ae("rounded bg-panel px-3 py-1.5 font-mono text-xs max-w-[80%]", e.msg.isError ? "text-danger border border-danger/30" : "text-muted"))), r;
  })();
}, ks = (e) => {
  const t = async (n, o) => {
    try {
      await te().request.approveNode({
        runId: e.msg.runId,
        nodeId: n,
        iteration: o
      });
    } catch (s) {
      console.error("Approve failed:", s);
    }
  }, r = async (n, o) => {
    try {
      await te().request.denyNode({
        runId: e.msg.runId,
        nodeId: n,
        iteration: o
      });
    } catch (s) {
      console.error("Deny failed:", s);
    }
  };
  return (() => {
    var n = is(), o = n.firstChild, s = o.firstChild, a = s.firstChild, i = a.nextSibling, l = s.nextSibling;
    l.firstChild;
    var c = l.nextSibling, h = c.firstChild;
    return u(a, () => e.msg.workflowName), u(i, () => e.msg.status), u(l, () => e.msg.runId.slice(0, 8), null), h.$$click = () => ue(e.msg.runId), u(c, w(P, {
      get when() {
        return je(() => !!e.msg.approvals)() && e.msg.approvals.length > 0;
      },
      get children() {
        return w(G, {
          get each() {
            return e.msg.approvals;
          },
          children: (f) => (() => {
            var b = as(), d = b.firstChild, m = d.nextSibling;
            return d.$$click = () => t(f.nodeId, f.iteration), m.$$click = () => r(f.nodeId, f.iteration), b;
          })()
        });
      }
    }), null), E(() => ie(i, ae("workflow-card__status rounded-full px-2 py-0.5 text-[10px] font-medium", xs(e.msg.status)))), n;
  })();
}, _s = (e) => w(P, {
  get when() {
    return e.items.length > 0;
  },
  get children() {
    var t = ls();
    return u(t, w(G, {
      get each() {
        return e.items;
      },
      children: (r) => (() => {
        var n = cs(), o = n.firstChild, s = o.nextSibling;
        return n.$$mousedown = (a) => {
          a.preventDefault(), e.onSelect(r);
        }, u(o, () => r.kind === "workflow" ? "@wf" : "#run"), u(s, () => r.label), E(() => ie(o, ae("text-[10px] rounded px-1 py-0.5 font-mono", r.kind === "workflow" ? "bg-accent/20 text-accent" : "bg-warning/20 text-warning"))), n;
      })()
    })), t;
  }
}), Ss = (e) => {
  const [t, r] = j(""), [n, o] = j({
    messages: [],
    isStreaming: !1,
    streamingMessage: null
  }), [s, a] = j([]);
  let i, l;
  Se(qt(() => _.agent, (S) => {
    if (!S) return;
    const T = S.subscribe((N) => o(N));
    Ne(T);
  }));
  const c = z(() => {
    const S = n(), T = [...S.messages];
    return S.streamingMessage && T.push(S.streamingMessage), T;
  }), h = () => n().isStreaming, f = () => n().error;
  Se(qt(() => c().length, () => {
    queueMicrotask(() => i?.scrollIntoView({
      behavior: "smooth"
    }));
  }));
  const b = () => {
    if (!l) return;
    l.style.height = "auto";
    const S = 192;
    l.style.height = `${Math.min(l.scrollHeight, S)}px`;
  }, d = (S) => {
    r(S), b(), m(S);
  }, m = (S) => {
    const T = S.match(/@workflow\(([^)]*)$/);
    if (T) {
      const q = T[1].toLowerCase(), y = _.workflows.filter((k) => (k.name ?? k.path).toLowerCase().includes(q)).slice(0, 8).map((k) => ({
        label: k.name ?? k.path,
        value: `@workflow(${k.path})`,
        kind: "workflow"
      }));
      a(y);
      return;
    }
    const N = S.match(/#run\(([^)]*)$/);
    if (N) {
      const q = N[1].toLowerCase(), y = _.runs.filter((k) => k.runId.toLowerCase().includes(q) || k.workflowName?.toLowerCase().includes(q)).slice(0, 8).map((k) => ({
        label: `${k.workflowName ?? "run"} (${k.runId.slice(0, 8)})`,
        value: `#run(${k.runId})`,
        kind: "run"
      }));
      a(y);
      return;
    }
    a([]);
  }, p = (S) => {
    const T = t(), N = S.kind === "workflow" ? /@workflow\([^)]*$/ : /#run\([^)]*$/, q = T.replace(N, S.value);
    r(q), a([]), l?.focus();
  }, g = async () => {
    if (h()) {
      _.agent?.abort();
      return;
    }
    const S = t().trim();
    !S || !_.agent || (r(""), l && (l.style.height = "auto"), await _.agent.send(S));
  }, I = (S) => {
    S.key === "Enter" && !S.shiftKey && (S.preventDefault(), g());
  }, x = () => {
    M("inspectorOpen", (S) => !S);
  }, C = (S) => {
    S !== _.sessionId && Pr(S);
  };
  return (() => {
    var S = ps(), T = S.firstChild, N = T.firstChild, q = N.nextSibling, y = q.nextSibling, k = y.nextSibling, O = T.nextSibling, $ = O.nextSibling, A = $.firstChild, W = A.firstChild, F = W.firstChild, L = F.nextSibling;
    N.addEventListener("change", (R) => C(R.currentTarget.value)), u(N, w(G, {
      get each() {
        return _.sessions;
      },
      children: (R) => (() => {
        var B = gs();
        return u(B, () => R.title || R.sessionId.slice(0, 10)), E(() => B.value = R.sessionId), B;
      })()
    })), q.$$click = () => Mr(), u(T, w(P, {
      get when() {
        return _.workspaceRoot;
      },
      get children() {
        var R = us();
        return u(R, () => xr(_.workspaceRoot)), E(() => Z(R, "title", _.workspaceRoot)), R;
      }
    }), k), u(T, w(P, {
      get when() {
        return _.contextRunId;
      },
      get children() {
        var R = ds();
        return R.firstChild, u(R, () => _.contextRunId.slice(0, 8), null), R;
      }
    }), k), k.$$click = x, u(O, w(P, {
      get when() {
        return c().length > 0;
      },
      get fallback() {
        return bs();
      },
      get children() {
        var R = hs(), B = R.firstChild;
        u(R, w(G, {
          get each() {
            return c();
          },
          children: (Q, J) => {
            const ge = () => n().streamingMessage !== null && J() === c().length - 1 && Q.role === "assistant";
            return [w(P, {
              get when() {
                return Q.role === "user";
              },
              get children() {
                return w(vs, {
                  msg: Q,
                  get timestamp() {
                    return Q.timestamp;
                  }
                });
              }
            }), w(P, {
              get when() {
                return Q.role === "assistant";
              },
              get children() {
                return w(ys, {
                  msg: Q,
                  get streaming() {
                    return ge();
                  }
                });
              }
            }), w(P, {
              get when() {
                return Q.role === "toolResult";
              },
              get children() {
                return w($s, {
                  msg: Q
                });
              }
            }), w(P, {
              get when() {
                return Q.role === "workflow";
              },
              get children() {
                return w(ks, {
                  msg: Q
                });
              }
            })];
          }
        }), B), u(R, w(P, {
          get when() {
            return f();
          },
          get children() {
            var Q = fs();
            return u(Q, f), Q;
          }
        }), B);
        var H = i;
        return typeof H == "function" ? Nt(H, B) : i = B, R;
      }
    })), u(A, w(_s, {
      get items() {
        return s();
      },
      onSelect: p
    }), W), F.$$keydown = I, F.$$input = (R) => d(R.currentTarget.value);
    var ee = l;
    return typeof ee == "function" ? Nt(ee, F) : l = F, L.$$click = g, u(L, () => h() ? "■" : "Send"), E((R) => {
      var B = ae("w-7 h-7 rounded flex items-center justify-center text-xs transition-colors", _.inspectorOpen ? "bg-accent/20 text-accent" : "text-muted hover:text-foreground hover:bg-panel-2"), H = h(), Q = ae("w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors text-sm font-medium", h() ? "bg-danger text-white hover:bg-danger/80" : t().trim() ? "bg-accent text-white hover:bg-accent/80" : "bg-panel-2 text-subtle cursor-default"), J = h() ? "Stop" : "Send";
      return B !== R.e && ie(k, R.e = B), H !== R.t && (F.disabled = R.t = H), Q !== R.a && ie(L, R.a = Q), J !== R.o && Z(L, "title", R.o = J), R;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), E(() => N.value = _.sessionId ?? ""), E(() => F.value = t()), S;
  })();
};
pe(["click", "mousedown", "input", "keydown"]);
var Cs = /* @__PURE__ */ v('<div class="flex flex-col flex-1 min-h-0 overflow-hidden"><div class="px-4 py-3 border-b border-border"><h3 class="text-xs font-semibold uppercase tracking-wide text-muted">Runs</h3></div><div class="flex-1 overflow-y-auto">'), Is = /* @__PURE__ */ v('<div class="empty text-muted text-xs uppercase tracking-wide text-center py-8">No runs found.'), As = /* @__PURE__ */ v("<span>• Active: <span class=font-mono>"), Rs = /* @__PURE__ */ v('<span class="bg-accent text-[#07080A] text-[9px] px-1.5 rounded-full font-semibold"> approvals'), Os = /* @__PURE__ */ v('<button class="px-2 py-1 rounded border border-border bg-panel-2 text-muted text-[11px] uppercase tracking-wide cursor-pointer hover:text-foreground"data-action=cancel>Cancel'), Ts = /* @__PURE__ */ v('<button class="px-2 py-1 rounded border border-border bg-panel-2 text-muted text-[11px] uppercase tracking-wide cursor-pointer hover:text-foreground"data-action=resume>Resume'), Es = /* @__PURE__ */ v('<div tabindex=0 role=listitem><div></div><div class="flex-1 min-w-0"><div class="font-semibold text-sm truncate"></div><div class="text-[10px] text-muted flex flex-wrap gap-1 mt-0.5"><span class=font-mono></span><span>• </span><span>• </span></div></div><div class="flex gap-1 flex-shrink-0"><button class="px-2 py-1 rounded border border-border bg-panel-2 text-muted text-[11px] uppercase tracking-wide cursor-pointer hover:text-foreground"data-action=open>Open</button><button class="px-2 py-1 rounded border border-border bg-panel-2 text-muted text-[11px] uppercase tracking-wide cursor-pointer hover:text-foreground"data-action=copy>Copy ID');
function Ps(e) {
  switch (e) {
    case "running":
      return "bg-accent";
    case "finished":
      return "bg-success";
    case "failed":
      return "bg-danger";
    case "waiting-approval":
      return "bg-warning";
    case "cancelled":
      return "bg-subtle";
    default:
      return "bg-subtle";
  }
}
const Ms = () => (() => {
  var e = Cs(), t = e.firstChild, r = t.nextSibling;
  return u(r, w(P, {
    get when() {
      return _.runs.length > 0;
    },
    get fallback() {
      return Is();
    },
    get children() {
      return w(G, {
        get each() {
          return _.runs;
        },
        children: (n) => (() => {
          var o = Es(), s = o.firstChild, a = s.nextSibling, i = a.firstChild, l = i.nextSibling, c = l.firstChild, h = c.nextSibling;
          h.firstChild;
          var f = h.nextSibling;
          f.firstChild;
          var b = a.nextSibling, d = b.firstChild, m = d.nextSibling;
          return o.$$keydown = (p) => {
            (p.key === "Enter" || p.key === " ") && (p.preventDefault(), ue(n.runId));
          }, o.$$click = () => ue(n.runId), u(i, () => n.workflowName), u(c, () => n.runId.slice(0, 6)), u(h, () => We(n.startedAtMs), null), u(f, () => wr(n.startedAtMs, n.finishedAtMs ?? null), null), u(l, w(P, {
            get when() {
              return n.activeNodes?.length;
            },
            get children() {
              var p = As(), g = p.firstChild, I = g.nextSibling;
              return u(I, () => n.activeNodes[0]), p;
            }
          }), null), u(l, w(P, {
            get when() {
              return (n.waitingApprovals ?? 0) > 0;
            },
            get children() {
              var p = Rs(), g = p.firstChild;
              return u(p, () => n.waitingApprovals, g), p;
            }
          }), null), b.$$click = (p) => p.stopPropagation(), d.$$click = () => ue(n.runId), u(b, w(P, {
            get when() {
              return n.status === "running" || n.status === "waiting-approval";
            },
            get children() {
              var p = Os();
              return p.$$click = async () => {
                await te().request.cancelRun({
                  runId: n.runId
                }), await ce(), se("info", "Run cancelled");
              }, p;
            }
          }), m), u(b, w(P, {
            get when() {
              return n.status === "waiting-approval";
            },
            get children() {
              var p = Ts();
              return p.$$click = () => te().request.resumeRun({
                runId: n.runId
              }), p;
            }
          }), m), m.$$click = () => {
            navigator.clipboard?.writeText(n.runId), se("info", "Run ID copied");
          }, E((p) => {
            var g = ae("run-row flex items-center gap-3 px-4 py-3 border-b border-border cursor-pointer hover:bg-panel-2 transition-colors", `status-${n.status}`), I = ae("w-2 h-2 rounded-full flex-shrink-0", Ps(n.status));
            return g !== p.e && ie(o, p.e = g), I !== p.t && ie(s, p.t = I), p;
          }, {
            e: void 0,
            t: void 0
          }), o;
        })()
      });
    }
  })), e;
})();
pe(["click", "keydown"]);
var qs = /* @__PURE__ */ v('<div class="flex flex-col flex-1 min-h-0 overflow-hidden"><div class="px-4 py-3 border-b border-border"><h3 class="text-xs font-semibold uppercase tracking-wide text-muted">Workflows</h3></div><div class="flex-1 overflow-y-auto">'), Ds = /* @__PURE__ */ v('<div class="empty text-muted text-xs uppercase tracking-wide text-center py-8">No workflows found. Open a workspace to scan for .tsx workflows.'), Fs = /* @__PURE__ */ v('<div class="workflow-row flex items-center justify-between px-4 py-3 border-b border-border hover:bg-panel-2 transition-colors"><div><div class="workflow-row__title font-semibold text-sm"></div><div class="text-[10px] text-muted mt-0.5"></div></div><button class="px-3 py-1.5 rounded bg-accent text-white text-[11px] font-semibold uppercase tracking-wide cursor-pointer hover:bg-accent-hover">Run');
const Ns = (e) => (() => {
  var t = qs(), r = t.firstChild, n = r.nextSibling;
  return u(n, w(P, {
    get when() {
      return _.workflows.length > 0;
    },
    get fallback() {
      return Ds();
    },
    get children() {
      return w(G, {
        get each() {
          return _.workflows;
        },
        children: (o) => (() => {
          var s = Fs(), a = s.firstChild, i = a.firstChild, l = i.nextSibling, c = a.nextSibling;
          return u(i, () => o.name ?? o.path), u(l, () => o.path), c.$$click = () => e.onRunWorkflow?.(o.path), s;
        })()
      });
    }
  })), t;
})();
pe(["click"]);
var Ls = /* @__PURE__ */ v("<option>"), js = /* @__PURE__ */ v('<nav class="flex flex-col bg-[#07080A] border-r border-border w-14 flex-shrink-0 overflow-hidden py-2 z-10"><div class="flex items-center gap-2 px-3 pb-3 border-b border-border mb-2"><span class="text-lg text-accent flex-shrink-0 w-8 text-center">◆</span><span class="text-xs font-semibold uppercase tracking-widest text-muted whitespace-nowrap overflow-hidden">Smithers</span></div><div class="px-2 mb-2"><select id=workspace-select class="w-full bg-transparent border border-border text-foreground text-xs rounded-md px-1 py-1 cursor-pointer focus:border-accent focus:outline-none truncate"><option value>No workspace</option></select></div><div class="flex flex-col gap-0.5 px-2"></div><div class="mt-auto pt-2 border-t border-border px-2"><div class="text-[9px] text-subtle text-center py-1 font-mono">v0.1.0'), Ws = /* @__PURE__ */ v('<span class="absolute top-1 right-1 bg-accent text-[#07080A] text-[9px] px-1 rounded-full font-semibold font-mono min-w-[14px] text-center leading-[14px]">'), Qs = /* @__PURE__ */ v('<button class="flex items-center gap-2.5 p-2 border-none bg-transparent text-muted cursor-pointer rounded-md text-[11px] font-medium uppercase tracking-wide whitespace-nowrap transition-colors duration-100 relative"><span class="text-base w-6 text-center flex-shrink-0"></span><span class="overflow-hidden text-ellipsis">');
const zs = [{
  view: "chat",
  icon: "💬",
  label: "Chat",
  id: "tab-chat"
}, {
  view: "runs",
  icon: "▶",
  label: "Runs",
  id: "tab-runs"
}, {
  view: "workflows",
  icon: "⚡",
  label: "Workflows",
  id: "tab-workflows"
}, {
  view: "settings",
  icon: "⚙",
  label: "Settings"
}], Bs = () => {
  const e = z(() => _.runs.reduce((t, r) => t + (r.waitingApprovals ?? 0), 0));
  return (() => {
    var t = js(), r = t.firstChild, n = r.nextSibling, o = n.firstChild, s = o.firstChild, a = n.nextSibling;
    return o.addEventListener("change", (i) => {
      i.currentTarget.value, _.workspaceRoot;
    }), u(o, w(P, {
      get when() {
        return _.workspaceRoot;
      },
      get children() {
        var i = Ls();
        return u(i, () => xr(_.workspaceRoot, 20)), E(() => i.value = _.workspaceRoot), i;
      }
    }), s), u(a, w(G, {
      each: zs,
      children: (i) => (() => {
        var l = Qs(), c = l.firstChild, h = c.nextSibling;
        return l.$$click = () => M("currentView", i.view), u(c, () => i.icon), u(h, () => i.label), u(l, w(P, {
          get when() {
            return je(() => i.view === "runs")() && e() > 0;
          },
          get children() {
            var f = Ws();
            return u(f, e), f;
          }
        }), null), E((f) => {
          var b = i.id, d = {
            "bg-accent/15 text-accent": _.currentView === i.view,
            "hover:bg-panel-2 hover:text-foreground": _.currentView !== i.view
          };
          return b !== f.e && Z(l, "id", f.e = b), f.t = on(l, d, f.t), f;
        }, {
          e: void 0,
          t: void 0
        }), l;
      })()
    })), E(() => o.value = _.workspaceRoot ?? ""), t;
  })();
};
pe(["click"]);
var Hs = /* @__PURE__ */ v('<div id=sidebar-collapsed class="absolute right-0 top-1/2 -translate-y-1/2 z-10"><button id=sidebar-open class="bg-panel border border-border rounded-l px-1 py-2 text-xs text-muted hover:text-foreground cursor-pointer">◀'), Ks = /* @__PURE__ */ v('<div class="relative flex-shrink-0"><aside id=sidebar aria-label=Inspector><div class="flex items-center justify-between px-3 py-2 border-b border-border flex-shrink-0"><span class="text-xs font-semibold uppercase tracking-wide text-muted">Inspector</span><div class="flex gap-1"><button class="text-muted hover:text-foreground bg-transparent border border-border rounded px-1.5 py-0.5 text-xs cursor-pointer"></button><button class="text-muted hover:text-foreground bg-transparent border border-border rounded px-1.5 py-0.5 text-xs cursor-pointer">✕</button></div></div><div class="flex-1 overflow-y-auto">'), Us = /* @__PURE__ */ v('<div class="text-muted text-xs uppercase tracking-wide text-center py-8">Select a run to inspect'), Gs = /* @__PURE__ */ v('<button class="px-2 py-1 rounded border border-border bg-panel-2 text-muted text-[11px] uppercase tracking-wide cursor-pointer hover:text-foreground">Cancel'), Vs = /* @__PURE__ */ v('<button class="px-2 py-1 rounded border border-border bg-panel-2 text-muted text-[11px] uppercase tracking-wide cursor-pointer hover:text-foreground">Resume'), Js = /* @__PURE__ */ v('<div class="p-3 border-b border-border bg-warning/5">'), Zs = /* @__PURE__ */ v('<div class="flex flex-col"><div class="run-header__meta p-3 border-b border-border"><div class="font-semibold text-sm"></div><div class="text-[10px] text-muted mt-1 flex flex-wrap gap-1"><span class="mono font-mono"></span><span>• </span><span>• </span><span>• </span></div><div class="flex gap-1.5 mt-2"></div></div><div class="flex border-b border-border"></div><div class="flex-1 p-3 overflow-y-auto">'), Xs = /* @__PURE__ */ v('<div class="approval-card py-1.5"><div class="approval-card__title text-xs font-semibold uppercase tracking-wide text-warning mb-2">Approval Required</div><div class="flex items-center justify-between"><div><span class="font-mono text-xs"></span><span class="text-[10px] text-muted ml-1">(iter <!>)</span></div><div class="flex gap-1"><button class="btn btn-primary px-2 py-0.5 rounded bg-accent text-white text-[10px] font-semibold uppercase cursor-pointer">Approve</button><button class="btn btn-danger px-2 py-0.5 rounded bg-danger text-white text-[10px] font-semibold uppercase cursor-pointer">Deny'), It = /* @__PURE__ */ v("<button>"), Ys = /* @__PURE__ */ v('<div><div class="flex gap-1 mb-2"><button class="px-2 py-0.5 text-xs border border-border rounded bg-panel-2 text-muted cursor-pointer hover:text-foreground"data-graph-action=zoom-in>+</button><button class="px-2 py-0.5 text-xs border border-border rounded bg-panel-2 text-muted cursor-pointer hover:text-foreground"data-graph-action=zoom-out>−</button><button class="px-2 py-0.5 text-xs border border-border rounded bg-panel-2 text-muted cursor-pointer hover:text-foreground"data-graph-action=fit>Fit'), eo = /* @__PURE__ */ v('<div class="text-muted text-xs uppercase">No frame data yet.'), to = /* @__PURE__ */ v('<div class="graph-canvas overflow-auto"><svg class=block>'), ro = /* @__PURE__ */ v("<svg><line stroke=#1E2736 stroke-width=2></svg>", !1, !0, !1), no = /* @__PURE__ */ v("<svg><g class=cursor-pointer><rect rx=10 ry=10 width=140 height=48></rect><text fill=#e9eaf0 font-size=12></svg>", !1, !0, !1), so = /* @__PURE__ */ v('<div class="node-drawer__section mb-2"><div class="node-drawer__label text-[10px] text-muted uppercase tracking-wide mb-1">Iteration</div><div class=text-xs>'), oo = /* @__PURE__ */ v('<div class="node-drawer__section mb-2"><div class="node-drawer__label text-[10px] text-muted uppercase tracking-wide mb-1">Output</div><pre class="text-xs font-mono text-muted overflow-auto">'), io = /* @__PURE__ */ v('<span class="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse">'), ao = /* @__PURE__ */ v('<div class="node-drawer__section mb-2"><div class="node-drawer__label text-[10px] text-muted uppercase tracking-wide mb-1 flex items-center gap-1.5">Agent Response</div><pre class="text-xs font-mono text-foreground overflow-auto whitespace-pre-wrap max-h-[400px] bg-background border border-border rounded p-2">'), lo = /* @__PURE__ */ v('<button class="px-2 py-0.5 text-[10px] border border-border rounded bg-panel-2 text-muted cursor-pointer hover:text-foreground"data-copy=response>Copy Response'), co = /* @__PURE__ */ v('<div class="node-drawer mt-3 border-t border-border pt-3"><div class="node-drawer__title text-sm font-semibold mb-2"></div><div class="node-drawer__section mb-2"><div class="node-drawer__label text-[10px] text-muted uppercase tracking-wide mb-1">State</div><div class=text-xs></div></div><div class="node-drawer__actions flex gap-1 mt-2"><button class="px-2 py-0.5 text-[10px] border border-border rounded bg-panel-2 text-muted cursor-pointer hover:text-foreground"data-copy=output>Copy Output'), uo = /* @__PURE__ */ v('<div class="flex flex-col gap-1">'), fo = /* @__PURE__ */ v('<div class="text-muted text-xs uppercase">No events.'), ho = /* @__PURE__ */ v('<span class="text-muted font-mono">'), po = /* @__PURE__ */ v('<div class="timeline-row flex gap-3 text-xs py-1"><span class="text-muted font-mono flex-shrink-0"></span><span class=text-foreground>'), go = /* @__PURE__ */ v('<div class="mb-3 border border-border rounded bg-background p-2"><div class="text-[10px] text-muted uppercase tracking-wide mb-1">Agent Output</div><pre class="text-xs font-mono text-foreground overflow-auto whitespace-pre-wrap max-h-[400px]">'), bo = /* @__PURE__ */ v('<div><div class="flex gap-1 mb-2 items-center flex-wrap"><input id=logs-search class="bg-background border border-border text-foreground text-xs rounded px-2 py-1 flex-1 min-w-[100px] focus:border-accent focus:outline-none"placeholder="Search logs…"><button>Output</button><button id=logs-export class="px-2 py-0.5 text-[10px] border border-border rounded bg-panel-2 text-muted cursor-pointer hover:text-foreground">Export</button><button id=logs-copy class="px-2 py-0.5 text-[10px] border border-border rounded bg-panel-2 text-muted cursor-pointer hover:text-foreground">Copy</button></div><pre class="logs text-xs font-mono text-muted overflow-auto whitespace-pre-wrap">'), mo = /* @__PURE__ */ v('<div class="text-muted text-xs uppercase">No outputs.'), wo = /* @__PURE__ */ v('<div class="output-table mb-3"><div class="output-table__title text-xs font-semibold mb-1"> (<!>)</div><pre class="text-xs font-mono text-muted overflow-auto">'), xo = /* @__PURE__ */ v('<div class="text-muted text-xs uppercase">No attempts.'), vo = /* @__PURE__ */ v('<div class="text-[10px] text-danger mt-0.5">Error: '), yo = /* @__PURE__ */ v('<div class="attempt-row flex justify-between items-start py-1.5 border-b border-border last:border-0"><div><div class="font-mono text-xs"></div><div class="text-[10px] text-muted">iter <!> - attempt </div></div><div class="text-[10px] text-muted">'), $o = /* @__PURE__ */ v('<div class="text-[11px] text-danger bg-danger/10 border border-danger/30 rounded px-2 py-1">'), ko = /* @__PURE__ */ v('<div class="text-muted text-xs">Loading...'), _o = /* @__PURE__ */ v('<div class="overflow-auto border border-border rounded"><div class="text-[10px] text-muted px-2 py-1 border-b border-border"> row</div><table class="w-full text-xs"><thead><tr class="border-b border-border bg-panel-2"></tr></thead><tbody>'), So = /* @__PURE__ */ v('<div class="flex flex-col gap-3"><div><div class="text-[10px] text-muted uppercase tracking-wide mb-1">Tables</div><div class="flex flex-wrap gap-1"></div></div><div><div class="text-[10px] text-muted uppercase tracking-wide mb-1">SQL Query</div><div class="flex gap-1"><textarea class="flex-1 bg-background border border-border text-foreground text-xs rounded px-2 py-1 font-mono resize-y min-h-[60px] focus:border-accent focus:outline-none"placeholder="SELECT * FROM ..."></textarea><button class="px-3 py-1 text-[11px] uppercase tracking-wide border border-border rounded bg-panel-2 text-muted cursor-pointer hover:text-foreground self-end">Run'), Co = /* @__PURE__ */ v('<span class="text-muted text-xs">No tables found.'), Io = /* @__PURE__ */ v('<th class="text-left px-2 py-1 text-[10px] text-muted uppercase tracking-wide font-medium whitespace-nowrap">'), Ao = /* @__PURE__ */ v('<tr class="border-b border-border last:border-0 hover:bg-panel-2/50">'), Ro = /* @__PURE__ */ v('<td class="px-2 py-1 font-mono text-foreground whitespace-nowrap max-w-[300px] overflow-hidden text-ellipsis">'), Oo = /* @__PURE__ */ v('<span class="text-muted italic">null');
const To = [{
  key: "graph",
  label: "Graph"
}, {
  key: "timeline",
  label: "Timeline"
}, {
  key: "logs",
  label: "Logs"
}, {
  key: "outputs",
  label: "Outputs"
}, {
  key: "attempts",
  label: "Attempts"
}, {
  key: "db",
  label: "DB"
}], Eo = () => {
  const e = z(() => {
    const o = _.selectedRunId;
    return o ? _.runDetails[o] : void 0;
  }), t = z(() => {
    const o = e();
    return o ? o.nodes.filter((s) => s.state === "waiting-approval") : [];
  }), r = async (o, s) => {
    const a = _.selectedRunId;
    a && (await te().request.approveNode({
      runId: a,
      nodeId: o,
      iteration: s
    }), await ce(), await ue(a));
  }, n = async (o, s) => {
    const a = _.selectedRunId;
    a && (await te().request.denyNode({
      runId: a,
      nodeId: o,
      iteration: s
    }), await ce(), await ue(a));
  };
  return (() => {
    var o = Ks(), s = o.firstChild, a = s.firstChild, i = a.firstChild, l = i.nextSibling, c = l.firstChild, h = c.nextSibling, f = a.nextSibling;
    return c.$$click = () => M("inspectorExpanded", (b) => !b), u(c, () => _.inspectorExpanded ? "⤡" : "⤢"), h.$$click = () => M({
      inspectorOpen: !1,
      inspectorExpanded: !1
    }), u(f, w(P, {
      get when() {
        return e();
      },
      get fallback() {
        return Us();
      },
      children: (b) => (() => {
        var d = Zs(), m = d.firstChild, p = m.firstChild, g = p.nextSibling, I = g.firstChild, x = I.nextSibling;
        x.firstChild;
        var C = x.nextSibling;
        C.firstChild;
        var S = C.nextSibling;
        S.firstChild;
        var T = g.nextSibling, N = m.nextSibling, q = N.nextSibling;
        return u(p, () => b().run.workflowName), u(I, () => b().run.runId), u(x, () => b().run.status, null), u(C, () => We(b().run.startedAtMs), null), u(S, () => wr(b().run.startedAtMs, b().run.finishedAtMs ?? null), null), u(T, w(P, {
          get when() {
            return b().run.status === "running" || b().run.status === "waiting-approval";
          },
          get children() {
            var y = Gs();
            return y.$$click = async () => {
              _.selectedRunId && (await te().request.cancelRun({
                runId: _.selectedRunId
              }), await ce(), await ue(_.selectedRunId), se("info", "Run cancelled"));
            }, y;
          }
        }), null), u(T, w(P, {
          get when() {
            return b().run.status === "failed" || b().run.status === "cancelled";
          },
          get children() {
            var y = Vs();
            return y.$$click = async () => {
              _.selectedRunId && (await te().request.resumeRun({
                runId: _.selectedRunId
              }), await ce(), await ue(_.selectedRunId), se("info", "Run resumed"));
            }, y;
          }
        }), null), u(d, w(P, {
          get when() {
            return t().length > 0;
          },
          get children() {
            var y = Js();
            return u(y, w(G, {
              get each() {
                return t();
              },
              children: (k) => (() => {
                var O = Xs(), $ = O.firstChild, A = $.nextSibling, W = A.firstChild, F = W.firstChild, L = F.nextSibling, ee = L.firstChild, R = ee.nextSibling;
                R.nextSibling;
                var B = W.nextSibling, H = B.firstChild, Q = H.nextSibling;
                return u(F, () => k.nodeId), u(L, () => k.iteration, R), H.$$click = () => r(k.nodeId, k.iteration), Q.$$click = () => n(k.nodeId, k.iteration), O;
              })()
            })), y;
          }
        }), N), u(N, w(G, {
          each: To,
          children: (y) => (() => {
            var k = It();
            return k.$$click = () => M("activeTab", y.key), u(k, () => y.label), E((O) => {
              var $ = ae("run-tab px-3 py-2 text-[11px] uppercase tracking-wide font-medium cursor-pointer bg-transparent border-none transition-colors", _.activeTab === y.key ? "text-accent border-b-2 border-b-accent" : "text-muted hover:text-foreground"), A = y.key;
              return $ !== O.e && ie(k, O.e = $), A !== O.t && Z(k, "data-tab", O.t = A), O;
            }, {
              e: void 0,
              t: void 0
            }), k;
          })()
        })), u(q, w(rn, {
          get children() {
            return [w(ye, {
              get when() {
                return _.activeTab === "graph";
              },
              get children() {
                return w(Po, {
                  get runId() {
                    return _.selectedRunId;
                  }
                });
              }
            }), w(ye, {
              get when() {
                return _.activeTab === "timeline";
              },
              get children() {
                return w(Mo, {
                  get runId() {
                    return _.selectedRunId;
                  }
                });
              }
            }), w(ye, {
              get when() {
                return _.activeTab === "logs";
              },
              get children() {
                return w(qo, {
                  get runId() {
                    return _.selectedRunId;
                  }
                });
              }
            }), w(ye, {
              get when() {
                return _.activeTab === "outputs";
              },
              get children() {
                return w(Do, {
                  get runId() {
                    return _.selectedRunId;
                  }
                });
              }
            }), w(ye, {
              get when() {
                return _.activeTab === "attempts";
              },
              get children() {
                return w(Fo, {
                  get runId() {
                    return _.selectedRunId;
                  }
                });
              }
            }), w(ye, {
              get when() {
                return _.activeTab === "db";
              },
              get children() {
                return w(No, {
                  get runId() {
                    return _.selectedRunId;
                  }
                });
              }
            })];
          }
        })), d;
      })()
    })), u(o, w(P, {
      get when() {
        return !_.inspectorOpen;
      },
      get children() {
        var b = Hs(), d = b.firstChild;
        return d.$$click = () => M("inspectorOpen", !0), b;
      }
    }), null), E((b) => {
      var d = _.inspectorOpen ? _.inspectorExpanded ? "calc(100% - 56px)" : "380px" : "0px", m = ae("border-l border-border bg-panel overflow-hidden flex flex-col h-full w-full transition-all duration-300", !_.inspectorOpen && "border-l-0 sidebar--closed"), p = !_.inspectorOpen;
      return d !== b.e && Ee(o, "width", b.e = d), m !== b.t && ie(s, b.t = m), p !== b.a && Z(s, "aria-hidden", b.a = p), b;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), o;
  })();
};
function Po(e) {
  const t = z(() => _.frames[e.runId]), [r, n] = j(null), o = z(() => {
    const d = r();
    if (!d) return null;
    const m = t();
    return m ? m.graph.nodes.find((g) => g.id === d) ?? null : null;
  }), s = z(() => {
    const d = r();
    if (!d) return null;
    const m = d.match(/^(.+)::iter(\d+)$/);
    return m ? {
      baseId: m[1],
      iteration: parseInt(m[2], 10)
    } : {
      baseId: d,
      iteration: void 0
    };
  }), a = z(() => {
    const d = s();
    if (!d) return;
    const m = _.outputs[e.runId];
    if (m)
      for (const p of m.tables) {
        const g = p.rows.find((I) => (I.nodeId ?? I.node_id) !== d.baseId ? !1 : d.iteration !== void 0 && I.iteration !== void 0 ? I.iteration === d.iteration : !0);
        if (g) return g;
      }
  }), i = z(() => {
    const d = s();
    if (!d) return "";
    const m = _.runEvents[e.runId] ?? [], p = [];
    for (const g of m)
      if (g.type === "NodeOutput" && g.nodeId === d.baseId) {
        if (d.iteration !== void 0 && g.iteration !== void 0 && g.iteration !== d.iteration)
          continue;
        p.push(g.text);
      }
    return p.join("");
  }), l = z(() => {
    const d = s();
    if (!d) return null;
    const m = _.attempts[e.runId];
    if (!m) return null;
    const p = m.attempts.filter((g) => g.nodeId !== d.baseId ? !1 : d.iteration !== void 0 && g.iteration !== void 0 ? g.iteration === d.iteration : !0);
    return p.length === 0 ? null : p[0].responseText ?? null;
  }), c = z(() => {
    const d = i();
    return d || (l() ?? "");
  }), h = z(() => o()?.state === "in-progress"), f = () => _.graphZoom, b = () => `scale(${f()})`;
  return (() => {
    var d = Ys(), m = d.firstChild, p = m.firstChild, g = p.nextSibling, I = g.nextSibling;
    return p.$$click = () => M("graphZoom", (x) => x * 1.2), g.$$click = () => M("graphZoom", (x) => x / 1.2), I.$$click = () => M("graphZoom", 1), u(d, w(P, {
      get when() {
        return t();
      },
      get fallback() {
        return eo();
      },
      children: (x) => {
        const C = () => x().graph.nodes, S = () => x().graph.edges;
        return (() => {
          var T = to(), N = T.firstChild;
          return u(N, w(G, {
            get each() {
              return S();
            },
            children: (q) => {
              const y = () => C().findIndex((F) => F.id === q.from), k = () => C().findIndex((F) => F.id === q.to), O = () => C()[y()], $ = () => C()[k()], A = () => O()?.kind === "Workflow" ? 0 : O()?.kind === "Task" ? 2 : 1, W = () => $()?.kind === "Workflow" ? 0 : $()?.kind === "Task" ? 2 : 1;
              return w(P, {
                get when() {
                  return je(() => !!O())() && $();
                },
                get children() {
                  var F = ro();
                  return E((L) => {
                    var ee = A() * 180 + 180, R = y() * 90 + 64, B = W() * 180 + 40, H = k() * 90 + 64;
                    return ee !== L.e && Z(F, "x1", L.e = ee), R !== L.t && Z(F, "y1", L.t = R), B !== L.a && Z(F, "x2", L.a = B), H !== L.o && Z(F, "y2", L.o = H), L;
                  }, {
                    e: void 0,
                    t: void 0,
                    a: void 0,
                    o: void 0
                  }), F;
                }
              });
            }
          }), null), u(N, w(G, {
            get each() {
              return C();
            },
            children: (q, y) => {
              const k = () => q.kind === "Workflow" ? 0 : q.kind === "Task" ? 2 : 1, O = () => k() * 180 + 40, $ = () => y() * 90 + 40, A = () => q.kind === "Ralph", W = () => {
                if (A())
                  switch (q.state) {
                    case "in-progress":
                      return {
                        bg: "#1A0D30",
                        stroke: "#9B6DFF"
                      };
                    case "finished":
                      return {
                        bg: "#0A1F1A",
                        stroke: "#3DDC97"
                      };
                    case "failed":
                      return {
                        bg: "#1E0A12",
                        stroke: "#FF3B5C"
                      };
                    default:
                      return {
                        bg: "#14101E",
                        stroke: "#5A4B8A"
                      };
                  }
                switch (q.state) {
                  case "in-progress":
                    return {
                      bg: "#0D1530",
                      stroke: "#4C7DFF"
                    };
                  case "finished":
                    return {
                      bg: "#0A1F1A",
                      stroke: "#3DDC97"
                    };
                  case "failed":
                    return {
                      bg: "#1E0A12",
                      stroke: "#FF3B5C"
                    };
                  case "waiting-approval":
                    return {
                      bg: "#1A1508",
                      stroke: "#F2A43A"
                    };
                  default:
                    return {
                      bg: "#10141A",
                      stroke: "#2C3A4E"
                    };
                }
              };
              return (() => {
                var F = no(), L = F.firstChild, ee = L.nextSibling;
                return F.$$click = () => n(q.id), u(ee, () => q.label), E((R) => {
                  var B = q.id, H = O(), Q = $(), J = W().bg, ge = W().stroke, Qe = A() ? "6 3" : void 0, ve = O() + 12, ze = $() + 28;
                  return B !== R.e && Z(F, "data-node-id", R.e = B), H !== R.t && Z(L, "x", R.t = H), Q !== R.a && Z(L, "y", R.a = Q), J !== R.o && Z(L, "fill", R.o = J), ge !== R.i && Z(L, "stroke", R.i = ge), Qe !== R.n && Z(L, "stroke-dasharray", R.n = Qe), ve !== R.s && Z(ee, "x", R.s = ve), ze !== R.h && Z(ee, "y", R.h = ze), R;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0,
                  o: void 0,
                  i: void 0,
                  n: void 0,
                  s: void 0,
                  h: void 0
                }), F;
              })();
            }
          }), null), E((q) => {
            var y = b(), k = Math.max(600, C().length * 180), O = Math.max(400, C().length * 90);
            return y !== q.e && Ee(T, "transform", q.e = y), k !== q.t && Z(N, "width", q.t = k), O !== q.a && Z(N, "height", q.a = O), q;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), T;
        })();
      }
    }), null), u(d, w(P, {
      get when() {
        return o();
      },
      children: (x) => (() => {
        var C = co(), S = C.firstChild, T = S.nextSibling, N = T.firstChild, q = N.nextSibling, y = T.nextSibling, k = y.firstChild;
        return u(S, () => x().label), u(C, w(P, {
          get when() {
            return x().iteration !== void 0;
          },
          get children() {
            var O = so(), $ = O.firstChild, A = $.nextSibling;
            return u(A, () => x().iteration), O;
          }
        }), T), u(q, () => x().state), u(C, w(P, {
          get when() {
            return a() !== void 0;
          },
          get children() {
            var O = oo(), $ = O.firstChild, A = $.nextSibling;
            return u(A, () => JSON.stringify(a(), null, 2)), O;
          }
        }), y), u(C, w(P, {
          get when() {
            return c();
          },
          get children() {
            var O = ao(), $ = O.firstChild;
            $.firstChild;
            var A = $.nextSibling;
            return u($, w(P, {
              get when() {
                return h();
              },
              get children() {
                return io();
              }
            }), null), u(A, c), O;
          }
        }), y), k.$$click = () => {
          navigator.clipboard?.writeText(JSON.stringify(a() ?? "", null, 2)), se("info", "Output copied");
        }, u(y, w(P, {
          get when() {
            return c();
          },
          get children() {
            var O = lo();
            return O.$$click = () => {
              navigator.clipboard?.writeText(c()), se("info", "Response copied");
            }, O;
          }
        }), null), C;
      })()
    }), null), d;
  })();
}
function Mo(e) {
  const t = z(() => _.runEvents[e.runId] ?? []), r = z(() => t().filter((n) => n.type !== "NodeOutput"));
  return (() => {
    var n = uo();
    return u(n, w(G, {
      get each() {
        return r();
      },
      get fallback() {
        return fo();
      },
      children: (o) => (() => {
        var s = po(), a = s.firstChild, i = a.nextSibling;
        return u(a, () => We(o.timestampMs)), u(i, () => o.type), u(s, w(P, {
          get when() {
            return o.nodeId;
          },
          get children() {
            var l = ho();
            return u(l, () => o.nodeId), l;
          }
        }), null), s;
      })()
    })), n;
  })();
}
function qo(e) {
  const [t, r] = j(""), [n, o] = j(!0), [s, a] = j(/* @__PURE__ */ new Set(["run", "node", "approval", "revert"])), i = z(() => _.runEvents[e.runId] ?? []), l = z(() => {
    const b = [];
    for (const d of i())
      d.type === "NodeOutput" && b.push(d.text);
    return b.join("");
  }), c = z(() => {
    let b = i();
    const d = t().toLowerCase();
    d && (b = b.filter((p) => JSON.stringify(p).toLowerCase().includes(d)));
    const m = s();
    return b = b.filter((p) => {
      const g = (p.type ?? "").toLowerCase();
      return !(g === "nodeoutput" || g.startsWith("run") && !m.has("run") || g.startsWith("node") && !m.has("node") || g.startsWith("approval") && !m.has("approval") || g.startsWith("revert") && !m.has("revert"));
    }), b;
  }), h = (b) => {
    a((d) => {
      const m = new Set(d);
      return m.has(b) ? m.delete(b) : m.add(b), m;
    });
  }, f = () => {
    const b = c().map((g) => JSON.stringify(g)).join(`
`), d = new Blob([b], {
      type: "application/x-ndjson"
    }), m = URL.createObjectURL(d), p = document.createElement("a");
    p.href = m, p.download = `${e.runId}-logs.jsonl`, p.click(), URL.revokeObjectURL(m);
  };
  return (() => {
    var b = bo(), d = b.firstChild, m = d.firstChild, p = m.nextSibling, g = p.nextSibling, I = g.nextSibling, x = d.nextSibling;
    return m.$$input = (C) => r(C.currentTarget.value), p.$$click = () => o((C) => !C), u(d, () => ["Run", "Node", "Approval", "Revert"].map((C) => (() => {
      var S = It();
      return S.$$click = () => h(C.toLowerCase()), u(S, C), E(() => ie(S, ae("logs-filter px-2 py-0.5 text-[10px] border border-border rounded cursor-pointer", s().has(C.toLowerCase()) ? "bg-accent/20 text-accent" : "bg-panel-2 text-muted"))), S;
    })()), g), g.$$click = f, I.$$click = () => {
      const C = n() ? l() : c().map((S) => JSON.stringify(S)).join(`
`);
      navigator.clipboard?.writeText(C), se("info", "Copied");
    }, u(b, w(P, {
      get when() {
        return je(() => !!n())() && l();
      },
      get children() {
        var C = go(), S = C.firstChild, T = S.nextSibling;
        return u(T, l), C;
      }
    }), x), u(x, () => c().map((C) => JSON.stringify(C)).join(`
`)), E(() => ie(p, ae("logs-filter px-2 py-0.5 text-[10px] border border-border rounded cursor-pointer", n() ? "bg-accent/20 text-accent" : "bg-panel-2 text-muted"))), E(() => m.value = t()), b;
  })();
}
function Do(e) {
  const t = z(() => _.outputs[e.runId]);
  return w(P, {
    get when() {
      return t();
    },
    get fallback() {
      return mo();
    },
    children: (r) => w(G, {
      get each() {
        return r().tables;
      },
      children: (n) => (() => {
        var o = wo(), s = o.firstChild, a = s.firstChild, i = a.nextSibling;
        i.nextSibling;
        var l = s.nextSibling;
        return u(s, () => n.name, a), u(s, () => n.rows.length, i), u(l, () => JSON.stringify(n.rows, null, 2)), o;
      })()
    })
  });
}
function Fo(e) {
  const t = z(() => _.attempts[e.runId]);
  return w(P, {
    get when() {
      return t();
    },
    get fallback() {
      return xo();
    },
    children: (r) => w(G, {
      get each() {
        return r().attempts;
      },
      children: (n) => (() => {
        var o = yo(), s = o.firstChild, a = s.firstChild, i = a.nextSibling, l = i.firstChild, c = l.nextSibling;
        c.nextSibling;
        var h = s.nextSibling;
        return u(a, () => n.nodeId), u(i, () => n.iteration, c), u(i, () => n.attempt, null), u(s, w(P, {
          get when() {
            return n.errorJson;
          },
          get children() {
            var f = vo();
            return f.firstChild, u(f, () => String(n.errorJson).slice(0, 140), null), f;
          }
        }), null), u(h, () => n.state), o;
      })()
    })
  });
}
function No(e) {
  const [t, r] = j([]), [n, o] = j([]), [s, a] = j([]), [i, l] = j(null), [c, h] = j(""), [f, b] = j(null), [d, m] = j(!1), p = async (x) => {
    m(!0), b(null);
    try {
      const C = await te().request.queryRunDb({
        runId: e.runId,
        sql: x
      });
      o(C.columns), a(C.rows);
    } catch (C) {
      b(C?.message ?? String(C)), o([]), a([]);
    } finally {
      m(!1);
    }
  };
  _t(async () => {
    try {
      const x = await te().request.queryRunDb({
        runId: e.runId,
        sql: "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
      });
      r(x.rows.map((C) => String(C[0])));
    } catch (x) {
      b(x?.message ?? String(x));
    }
  });
  const g = (x) => {
    l(x), p(`SELECT * FROM "${x}" LIMIT 100`);
  }, I = () => {
    const x = c().trim();
    x && p(x);
  };
  return (() => {
    var x = So(), C = x.firstChild, S = C.firstChild, T = S.nextSibling, N = C.nextSibling, q = N.firstChild, y = q.nextSibling, k = y.firstChild, O = k.nextSibling;
    return u(T, w(G, {
      get each() {
        return t();
      },
      get fallback() {
        return Co();
      },
      children: ($) => (() => {
        var A = It();
        return A.$$click = () => g($), u(A, $), E(() => ie(A, ae("px-2 py-0.5 text-[11px] border border-border rounded cursor-pointer", i() === $ ? "bg-accent/20 text-accent" : "bg-panel-2 text-muted hover:text-foreground"))), A;
      })()
    })), k.$$keydown = ($) => {
      ($.metaKey || $.ctrlKey) && $.key === "Enter" && ($.preventDefault(), I());
    }, k.$$input = ($) => h($.currentTarget.value), O.$$click = I, u(x, w(P, {
      get when() {
        return f();
      },
      get children() {
        var $ = $o();
        return u($, f), $;
      }
    }), null), u(x, w(P, {
      get when() {
        return d();
      },
      get children() {
        return ko();
      }
    }), null), u(x, w(P, {
      get when() {
        return n().length > 0;
      },
      get children() {
        var $ = _o(), A = $.firstChild, W = A.firstChild, F = A.nextSibling, L = F.firstChild, ee = L.firstChild, R = L.nextSibling;
        return u(A, () => s().length, W), u(A, () => s().length !== 1 ? "s" : "", null), u(ee, w(G, {
          get each() {
            return n();
          },
          children: (B) => (() => {
            var H = Io();
            return u(H, B), H;
          })()
        })), u(R, w(G, {
          get each() {
            return s();
          },
          children: (B) => (() => {
            var H = Ao();
            return u(H, w(G, {
              each: B,
              children: (Q) => (() => {
                var J = Ro();
                return u(J, () => Q === null ? Oo() : String(Q)), J;
              })()
            })), H;
          })()
        })), $;
      }
    }), null), E(() => O.disabled = d()), E(() => k.value = c()), x;
  })();
}
pe(["click", "input", "keydown"]);
var Lo = /* @__PURE__ */ v('<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"role=status aria-live=polite>'), jo = /* @__PURE__ */ v("<div>");
const Wo = () => (() => {
  var e = Lo();
  return u(e, w(G, {
    get each() {
      return _.toasts;
    },
    children: (t) => (() => {
      var r = jo();
      return u(r, () => t.message), E(() => ie(r, ae("toast px-4 py-3 rounded-md border bg-panel text-sm font-sans text-foreground shadow-lg max-w-xs", "animate-in slide-in-from-bottom-2 fade-in duration-200", `toast-${t.level}`, t.level === "info" && "border-l-[3px] border-l-accent border-border", t.level === "warning" && "border-l-[3px] border-l-warning border-border", t.level === "error" && "border-l-[3px] border-l-danger border-border"))), r;
    })()
  })), e;
})();
var Qo = /* @__PURE__ */ v('<div id=settings-panel-open class="flex flex-col flex-1 min-h-0 overflow-y-auto p-4 max-w-lg mx-auto w-full"><h2 class="text-xs font-semibold uppercase tracking-wide mb-4">Preferences</h2><div class="text-[10px] font-semibold text-muted uppercase tracking-widest mt-4 mb-1">UI</div><label class="text-[10px] text-muted uppercase tracking-wide mt-2">Inspector panel open</label><select class="w-full bg-background border border-border text-foreground text-xs rounded-lg px-2 py-1.5 focus:border-accent focus:outline-none"><option value=true>Open</option><option value=false>Closed</option></select><label class="text-[10px] text-muted uppercase tracking-wide mt-2">Inspector panel width</label><input id=settings-panel-width class="w-full bg-background border border-border text-foreground text-xs rounded-lg px-2 py-1.5 focus:border-accent focus:outline-none"type=number><div class="text-[10px] font-semibold text-muted uppercase tracking-widest mt-4 mb-1">AI Provider</div><label class="text-[10px] text-muted uppercase tracking-wide mt-2">Provider</label><select id=settings-provider class="w-full bg-background border border-border text-foreground text-xs rounded-lg px-2 py-1.5 focus:border-accent focus:outline-none"><option value=openai>OpenAI</option><option value=anthropic>Anthropic</option></select><label class="text-[10px] text-muted uppercase tracking-wide mt-2">Model</label><input id=settings-model class="w-full bg-background border border-border text-foreground text-xs rounded-lg px-2 py-1.5 focus:border-accent focus:outline-none"><label class="text-[10px] text-muted uppercase tracking-wide mt-2">Temperature</label><input id=settings-temperature class="w-full bg-background border border-border text-foreground text-xs rounded-lg px-2 py-1.5 focus:border-accent focus:outline-none"type=number step=0.1><label class="text-[10px] text-muted uppercase tracking-wide mt-2">Max tokens</label><input id=settings-max-tokens class="w-full bg-background border border-border text-foreground text-xs rounded-lg px-2 py-1.5 focus:border-accent focus:outline-none"type=number><label class="text-[10px] text-muted uppercase tracking-wide mt-2">System prompt</label><textarea id=settings-system-prompt class="w-full bg-background border border-border text-foreground text-xs rounded-lg px-2 py-1.5 focus:border-accent focus:outline-none font-mono min-h-[90px] resize-y"></textarea><div class="text-[10px] font-semibold text-muted uppercase tracking-widest mt-4 mb-1">API Keys</div><label class="text-[10px] text-muted uppercase tracking-wide mt-2">OpenAI API Key</label><div class="flex gap-1.5"><input id=settings-openai-key class="w-full bg-background border border-border text-foreground text-xs rounded-lg px-2 py-1.5 focus:border-accent focus:outline-none flex-1"type=password><button id=settings-openai-clear class="px-2 py-1 rounded border border-border bg-transparent text-muted text-[11px] uppercase cursor-pointer hover:text-foreground flex-shrink-0">Clear</button></div><label class="text-[10px] text-muted uppercase tracking-wide mt-2">Anthropic API Key</label><div class="flex gap-1.5"><input id=settings-anthropic-key class="w-full bg-background border border-border text-foreground text-xs rounded-lg px-2 py-1.5 focus:border-accent focus:outline-none flex-1"type=password><button id=settings-anthropic-clear class="px-2 py-1 rounded border border-border bg-transparent text-muted text-[11px] uppercase cursor-pointer hover:text-foreground flex-shrink-0">Clear</button></div><div class="text-[10px] font-semibold text-muted uppercase tracking-widest mt-4 mb-1">Tools</div><label class="text-[10px] text-muted uppercase tracking-wide mt-2">Bash network access</label><select id=settings-allow-network class="w-full bg-background border border-border text-foreground text-xs rounded-lg px-2 py-1.5 focus:border-accent focus:outline-none"><option value=false>Blocked</option><option value=true>Allowed</option></select><div class="flex justify-end gap-1.5 mt-6"><button id=settings-cancel class="px-3 py-1.5 rounded border border-border bg-transparent text-muted text-[11px] uppercase tracking-wide cursor-pointer hover:text-foreground">Cancel</button><button id=settings-save class="px-3 py-1.5 rounded bg-accent text-white text-[11px] font-semibold uppercase tracking-wide cursor-pointer">Save'), zo = /* @__PURE__ */ v('<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"><div class="bg-panel border border-border rounded-xl w-[480px] max-h-[80vh] overflow-y-auto">');
const zt = (e) => {
  const t = () => _.settings, [r, n] = j(t()?.ui.workflowPanel.isOpen ?? !0), [o, s] = j(t()?.ui.workflowPanel.width ?? 380), [a, i] = j(t()?.agent.provider ?? "openai"), [l, c] = j(t()?.agent.model ?? "gpt-4o-mini"), [h, f] = j(t()?.agent.temperature ?? 0.2), [b, d] = j(t()?.agent.maxTokens ?? 1024), [m, p] = j(t()?.agent.systemPrompt ?? ""), [g, I] = j(""), [x, C] = j(""), [S, T] = j(t()?.smithers?.allowNetwork ?? !1);
  Se(() => {
    const $ = t();
    $ && (e.modal && !e.open || (n($.ui.workflowPanel.isOpen), s($.ui.workflowPanel.width), i($.agent.provider), c($.agent.model), f($.agent.temperature ?? 0.2), d($.agent.maxTokens ?? 1024), p($.agent.systemPrompt ?? ""), T($.smithers?.allowNetwork ?? !1)));
  });
  const N = () => {
    e.onClose ? e.onClose() : M("currentView", "chat");
  }, q = async () => {
    const $ = te(), A = l().trim() || (a() === "anthropic" ? "claude-3-5-sonnet-20241022" : "gpt-4o-mini"), W = await $.request.setSettings({
      patch: {
        ui: {
          workflowPanel: {
            isOpen: r(),
            width: o()
          }
        },
        agent: {
          provider: a(),
          model: A,
          temperature: h(),
          maxTokens: b(),
          systemPrompt: m()
        },
        smithers: {
          allowNetwork: S()
        }
      }
    });
    g().trim() && await $.request.setSecret({
      key: "openai.apiKey",
      value: g().trim()
    }), x().trim() && await $.request.setSecret({
      key: "anthropic.apiKey",
      value: x().trim()
    });
    const F = await $.request.getSecretStatus({});
    M({
      settings: W,
      secretStatus: F,
      inspectorOpen: W.ui.workflowPanel.isOpen
    }), se("info", "Settings saved."), N();
  }, y = async () => {
    await te().request.clearSecret({
      key: "openai.apiKey"
    });
    const $ = await te().request.getSecretStatus({});
    M("secretStatus", $), se("info", "OpenAI API key cleared.");
  }, k = async () => {
    await te().request.clearSecret({
      key: "anthropic.apiKey"
    });
    const $ = await te().request.getSecretStatus({});
    M("secretStatus", $), se("info", "Anthropic API key cleared.");
  }, O = (() => {
    var $ = Qo(), A = $.firstChild, W = A.nextSibling, F = W.nextSibling, L = F.nextSibling, ee = L.nextSibling, R = ee.nextSibling, B = R.nextSibling, H = B.nextSibling, Q = H.nextSibling, J = Q.nextSibling, ge = J.nextSibling, Qe = ge.nextSibling, ve = Qe.nextSibling, ze = ve.nextSibling, lt = ze.nextSibling, Dr = lt.nextSibling, ct = Dr.nextSibling, Fr = ct.nextSibling, Nr = Fr.nextSibling, Ot = Nr.nextSibling, Be = Ot.firstChild, Lr = Be.nextSibling, jr = Ot.nextSibling, Tt = jr.nextSibling, He = Tt.firstChild, Wr = He.nextSibling, Qr = Tt.nextSibling, zr = Qr.nextSibling, ut = zr.nextSibling, Br = ut.nextSibling, Et = Br.firstChild, Hr = Et.nextSibling;
    return L.addEventListener("change", (K) => n(K.currentTarget.value === "true")), R.$$input = (K) => s(Number(K.currentTarget.value)), Q.addEventListener("change", (K) => i(K.currentTarget.value)), ge.$$input = (K) => c(K.currentTarget.value), ve.$$input = (K) => f(Number(K.currentTarget.value)), lt.$$input = (K) => d(Number(K.currentTarget.value)), ct.$$input = (K) => p(K.currentTarget.value), Be.$$input = (K) => I(K.currentTarget.value), Lr.$$click = y, He.$$input = (K) => C(K.currentTarget.value), Wr.$$click = k, ut.addEventListener("change", (K) => T(K.currentTarget.value === "true")), Et.$$click = N, Hr.$$click = q, E((K) => {
      var Pt = _.secretStatus.openai ? "Configured" : "Not set", Mt = _.secretStatus.anthropic ? "Configured" : "Not set";
      return Pt !== K.e && Z(Be, "placeholder", K.e = Pt), Mt !== K.t && Z(He, "placeholder", K.t = Mt), K;
    }, {
      e: void 0,
      t: void 0
    }), E(() => L.value = r() ? "true" : "false"), E(() => R.value = o()), E(() => Q.value = a()), E(() => ge.value = l()), E(() => ve.value = h()), E(() => lt.value = b()), E(() => ct.value = m()), E(() => Be.value = g()), E(() => He.value = x()), E(() => ut.value = S() ? "true" : "false"), $;
  })();
  return e.modal ? w(P, {
    get when() {
      return e.open;
    },
    get children() {
      var $ = zo(), A = $.firstChild;
      return $.$$click = () => N(), A.$$click = (W) => W.stopPropagation(), u(A, O), $;
    }
  }) : O;
};
pe(["input", "click"]);
var Bo = /* @__PURE__ */ v('<div class="menubar flex items-center bg-[#07080A] border-b border-border h-7 px-2 gap-0 text-xs shrink-0 relative z-30"><div class=flex-1></div><button id=run-workflow class="px-2 py-0.5 text-[10px] text-muted hover:text-foreground bg-transparent border border-border rounded cursor-pointer">Run'), Ho = /* @__PURE__ */ v('<div class=relative><button class="menu-item px-2 py-1 text-muted hover:text-foreground bg-transparent border-none cursor-pointer text-xs"></button><div class="menu-dropdown absolute top-full left-0 bg-panel border border-border rounded shadow-lg min-w-[160px] py-1 z-40">'), Ko = /* @__PURE__ */ v('<button class="menu-row w-full text-left px-3 py-1.5 text-xs text-foreground hover:bg-panel-2 bg-transparent border-none cursor-pointer">');
const Uo = (e) => {
  const [t, r] = j(null), n = [{
    key: "file",
    label: "File",
    items: [{
      label: "Open Workspace",
      action: () => {
        o(), e.onOpenWorkspace();
      }
    }, {
      label: "Close Workspace",
      action: () => {
        o(), e.onCloseWorkspace();
      }
    }]
  }, {
    key: "workflow",
    label: "Workflow",
    items: [{
      label: "Run Workflow",
      action: () => {
        o(), e.onRunWorkflow();
      }
    }]
  }, {
    key: "view",
    label: "View",
    items: [{
      label: "Zoom In",
      action: () => {
        o(), e.onZoomIn();
      }
    }]
  }, {
    key: "settings",
    label: "Settings",
    items: [{
      label: "Preferences",
      action: () => {
        o(), e.onPreferences();
      }
    }]
  }, {
    key: "help",
    label: "Help",
    items: [{
      label: "Docs",
      action: () => {
        o(), e.onDocs();
      }
    }]
  }], o = () => r(null), s = (a) => {
    a.target.closest(".menubar") || o();
  };
  return _t(() => document.addEventListener("click", s)), Ne(() => document.removeEventListener("click", s)), (() => {
    var a = Bo(), i = a.firstChild, l = i.nextSibling;
    return u(a, w(G, {
      each: n,
      children: (c) => (() => {
        var h = Ho(), f = h.firstChild, b = f.nextSibling;
        return f.$$click = (d) => {
          d.stopPropagation(), r((m) => m === c.key ? null : c.key);
        }, u(f, () => c.label), u(b, w(G, {
          get each() {
            return c.items;
          },
          children: (d) => (() => {
            var m = Ko();
            return m.$$click = (p) => {
              p.stopPropagation(), d.action();
            }, u(m, () => d.label), m;
          })()
        })), E((d) => {
          var m = c.key, p = t() !== c.key;
          return m !== d.e && Z(f, "data-menu", d.e = m), p !== d.t && b.classList.toggle("hidden", d.t = p), d;
        }, {
          e: void 0,
          t: void 0
        }), h;
      })()
    }), i), l.$$click = () => e.onRunWorkflow(), a;
  })();
};
pe(["click"]);
var Go = /* @__PURE__ */ v('<button class="px-3 py-1.5 rounded border border-border bg-transparent text-muted text-[11px] uppercase tracking-wide cursor-pointer hover:text-foreground whitespace-nowrap">Browse…'), Vo = /* @__PURE__ */ v('<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"><div class="bg-panel border border-border rounded-xl p-4 w-[420px] flex flex-col gap-3"><h2 class="text-xs font-semibold uppercase tracking-wide">Open Workspace</h2><div class="flex gap-1.5"><input id=workspace-path class="flex-1 bg-background border border-border text-foreground text-xs rounded-lg px-2 py-1.5 focus:border-accent focus:outline-none"placeholder="Enter workspace path…"></div><div class="flex justify-end gap-1.5"><button id=workspace-cancel class="px-3 py-1.5 rounded border border-border bg-transparent text-muted text-[11px] uppercase tracking-wide cursor-pointer hover:text-foreground">Cancel</button><button id=workspace-open class="px-3 py-1.5 rounded bg-accent text-white text-[11px] font-semibold uppercase tracking-wide cursor-pointer">Open');
const Jo = (e) => {
  const [t, r] = j("");
  Se(() => {
    e.open && r("");
  });
  const n = async () => {
    if (!e.browseDirectory) return;
    const s = await e.browseDirectory();
    s && r(s);
  }, o = async () => {
    const s = t().trim();
    if (s)
      try {
        await te().request.openWorkspace({
          path: s
        });
        const a = await te().request.getWorkspaceState({});
        M({
          workspaceRoot: a.root,
          workflows: a.workflows
        }), await ce(), e.onClose();
      } catch (a) {
        se("error", `Failed to open workspace: ${a?.message ?? a}`);
      }
  };
  return w(P, {
    get when() {
      return e.open;
    },
    get children() {
      var s = Vo(), a = s.firstChild, i = a.firstChild, l = i.nextSibling, c = l.firstChild, h = l.nextSibling, f = h.firstChild, b = f.nextSibling;
      return s.$$click = () => e.onClose(), a.$$click = (d) => d.stopPropagation(), c.$$keydown = (d) => {
        d.key === "Enter" && o();
      }, c.$$input = (d) => r(d.currentTarget.value), u(l, w(P, {
        get when() {
          return e.browseDirectory;
        },
        get children() {
          var d = Go();
          return d.$$click = n, d;
        }
      }), null), f.$$click = () => e.onClose(), b.$$click = o, E(() => c.value = t()), s;
    }
  });
};
pe(["click", "input", "keydown"]);
var Zo = /* @__PURE__ */ v('<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"><div class="bg-panel border border-border rounded-xl p-4 w-[420px] flex flex-col gap-2 max-h-[80vh] overflow-y-auto"><h2 class="text-xs font-semibold uppercase tracking-wide">Run Workflow</h2><label class="text-[10px] text-muted uppercase tracking-wide">Workflow</label><select id=workflow-select class="bg-background border border-border text-foreground text-xs rounded-lg px-2 py-1.5 focus:border-accent focus:outline-none"></select><label class="text-[10px] text-muted uppercase tracking-wide">Input (JSON)</label><textarea id=workflow-input class="bg-background border border-border text-foreground text-xs rounded-lg px-2 py-1.5 font-mono min-h-[90px] resize-y focus:border-accent focus:outline-none"></textarea><div class="flex justify-end gap-1.5 mt-2"><button id=modal-cancel class="px-3 py-1.5 rounded border border-border bg-transparent text-muted text-[11px] uppercase tracking-wide cursor-pointer hover:text-foreground">Cancel</button><button id=modal-run class="px-3 py-1.5 rounded bg-accent text-white text-[11px] font-semibold uppercase tracking-wide cursor-pointer">Run'), Xo = /* @__PURE__ */ v("<option>");
const Yo = (e) => {
  const [t, r] = j(""), [n, o] = j("{}");
  Se(() => {
    if (e.open) {
      const a = e.preselect ?? _.workflows[0]?.path ?? "";
      r(a), o("{}");
    }
  });
  const s = async () => {
    const a = t();
    if (!a) {
      se("warning", "No workflow selected.");
      return;
    }
    let i = {};
    try {
      i = JSON.parse(n());
    } catch {
      i = {};
    }
    const l = await te().request.runWorkflow({
      workflowPath: a,
      input: i,
      attachToSessionId: _.sessionId || void 0
    });
    e.onClose(), await ce(), await ue(l.runId);
  };
  return w(P, {
    get when() {
      return e.open;
    },
    get children() {
      var a = Zo(), i = a.firstChild, l = i.firstChild, c = l.nextSibling, h = c.nextSibling, f = h.nextSibling, b = f.nextSibling, d = b.nextSibling, m = d.firstChild, p = m.nextSibling;
      return a.$$click = () => e.onClose(), i.$$click = (g) => g.stopPropagation(), h.addEventListener("change", (g) => r(g.currentTarget.value)), u(h, w(G, {
        get each() {
          return _.workflows;
        },
        children: (g) => (() => {
          var I = Xo();
          return u(I, () => g.name ?? g.path), E(() => I.value = g.path), I;
        })()
      })), b.$$input = (g) => o(g.currentTarget.value), m.$$click = () => e.onClose(), p.$$click = s, E(() => h.value = t()), E(() => b.value = n()), a;
    }
  });
};
pe(["click", "input"]);
var ei = /* @__PURE__ */ v('<div class="app flex flex-col h-screen overflow-hidden"><div class="flex flex-1 min-h-0 overflow-hidden transition-all duration-300"><main class="flex flex-col min-w-0 overflow-hidden flex-1"><div class="flex flex-col flex-1 min-h-0 overflow-hidden"></div><div class="flex flex-col flex-1 min-h-0 overflow-hidden"></div><div class="flex flex-col flex-1 min-h-0 overflow-hidden">'), ti = /* @__PURE__ */ v('<div class="flex flex-col flex-1 min-h-0 overflow-hidden">');
const ri = () => {
  const [e, t] = j(!1), [r, n] = j(!1), [o, s] = j(!1), [a, i] = j(void 0), l = (h) => {
    i(h), n(!0);
  }, c = (h) => {
    (h.ctrlKey || h.metaKey) && h.key === "\\" && (h.shiftKey ? document.body.classList.toggle("artifacts-hidden") : M({
      inspectorOpen: !_.inspectorOpen,
      inspectorExpanded: !1
    }), h.preventDefault()), (h.ctrlKey || h.metaKey) && h.key.toLowerCase() === "r" && !h.shiftKey && (h.preventDefault(), n(!0)), h.key === "Escape" && (e() ? t(!1) : r() ? n(!1) : o() ? s(!1) : _.inspectorExpanded ? M("inspectorExpanded", !1) : _.inspectorOpen && M("inspectorOpen", !1));
  };
  return _t(() => {
    document.addEventListener("keydown", c);
  }), Ne(() => {
    document.removeEventListener("keydown", c);
  }), (() => {
    var h = ei(), f = h.firstChild, b = f.firstChild, d = b.firstChild, m = d.nextSibling, p = m.nextSibling;
    return u(h, w(Uo, {
      onOpenWorkspace: () => t(!0),
      onCloseWorkspace: () => {
        Promise.resolve().then(() => Xt).then(({
          getRpc: g
        }) => {
          g().request.openWorkspace({
            path: ""
          }).then(async () => {
            const I = await g().request.getWorkspaceState({});
            M({
              workspaceRoot: I.root,
              workflows: I.workflows
            });
          });
        });
      },
      onRunWorkflow: () => l(),
      onPreferences: () => s(!0),
      onDocs: () => se("info", "smithers.sh"),
      onZoomIn: () => M("graphZoom", (g) => g * 1.2)
    }), f), u(f, w(Bs, {}), b), u(d, w(Ss, {
      onRunWorkflow: l
    })), u(m, w(Ms, {})), u(p, w(Ns, {
      onRunWorkflow: l
    })), u(b, (() => {
      var g = je(() => _.currentView === "settings");
      return () => g() && (() => {
        var I = ti();
        return u(I, w(zt, {
          onClose: () => M("currentView", "chat")
        })), I;
      })();
    })(), null), u(f, w(Eo, {}), null), u(h, w(Jo, {
      get open() {
        return e();
      },
      onClose: () => t(!1),
      browseDirectory: async () => {
        const {
          getRpc: g
        } = await Promise.resolve().then(() => Xt);
        return (await g().request.browseDirectory({})).path;
      }
    }), null), u(h, w(Yo, {
      get open() {
        return r();
      },
      onClose: () => n(!1),
      get preselect() {
        return a();
      }
    }), null), u(h, w(zt, {
      modal: !0,
      get open() {
        return o();
      },
      onClose: () => s(!1)
    }), null), u(h, w(Wo, {}), null), E((g) => {
      var I = _.currentView === "chat" ? void 0 : "none", x = _.currentView === "runs" ? void 0 : "none", C = _.currentView === "workflows" ? void 0 : "none";
      return I !== g.e && Ee(d, "display", g.e = I), x !== g.t && Ee(m, "display", g.t = x), C !== g.a && Ee(p, "display", g.a = C), g;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), h;
  })();
}, ni = ir();
function si(e) {
  return w(ni.Provider, {
    get value() {
      return e.client;
    },
    get children() {
      return e.children;
    }
  });
}
var it = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Set(), this.subscribe = this.subscribe.bind(this);
  }
  subscribe(e) {
    return this.listeners.add(e), this.onSubscribe(), () => {
      this.listeners.delete(e), this.onUnsubscribe();
    };
  }
  hasListeners() {
    return this.listeners.size > 0;
  }
  onSubscribe() {
  }
  onUnsubscribe() {
  }
}, oi = {
  // We need the wrapper function syntax below instead of direct references to
  // global setTimeout etc.
  //
  // BAD: `setTimeout: setTimeout`
  // GOOD: `setTimeout: (cb, delay) => setTimeout(cb, delay)`
  //
  // If we use direct references here, then anything that wants to spy on or
  // replace the global setTimeout (like tests) won't work since we'll already
  // have a hard reference to the original implementation at the time when this
  // file was imported.
  setTimeout: (e, t) => setTimeout(e, t),
  clearTimeout: (e) => clearTimeout(e),
  setInterval: (e, t) => setInterval(e, t),
  clearInterval: (e) => clearInterval(e)
}, ii = class {
  // We cannot have TimeoutManager<T> as we must instantiate it with a concrete
  // type at app boot; and if we leave that type, then any new timer provider
  // would need to support ReturnType<typeof setTimeout>, which is infeasible.
  //
  // We settle for type safety for the TimeoutProvider type, and accept that
  // this class is unsafe internally to allow for extension.
  #e = oi;
  #t = !1;
  setTimeoutProvider(e) {
    process.env.NODE_ENV !== "production" && this.#t && e !== this.#e && console.error(
      "[timeoutManager]: Switching provider after calls to previous provider might result in unexpected behavior.",
      { previous: this.#e, provider: e }
    ), this.#e = e, process.env.NODE_ENV !== "production" && (this.#t = !1);
  }
  setTimeout(e, t) {
    return process.env.NODE_ENV !== "production" && (this.#t = !0), this.#e.setTimeout(e, t);
  }
  clearTimeout(e) {
    this.#e.clearTimeout(e);
  }
  setInterval(e, t) {
    return process.env.NODE_ENV !== "production" && (this.#t = !0), this.#e.setInterval(e, t);
  }
  clearInterval(e) {
    this.#e.clearInterval(e);
  }
}, xt = new ii();
function ai(e) {
  setTimeout(e, 0);
}
var at = typeof window > "u" || "Deno" in globalThis;
function le() {
}
function li(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function ci(e) {
  return typeof e == "number" && e >= 0 && e !== 1 / 0;
}
function ui(e, t) {
  return Math.max(e + (t || 0) - Date.now(), 0);
}
function vt(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function di(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function Bt(e, t) {
  const {
    type: r = "all",
    exact: n,
    fetchStatus: o,
    predicate: s,
    queryKey: a,
    stale: i
  } = e;
  if (a) {
    if (n) {
      if (t.queryHash !== At(a, t.options))
        return !1;
    } else if (!Fe(t.queryKey, a))
      return !1;
  }
  if (r !== "all") {
    const l = t.isActive();
    if (r === "active" && !l || r === "inactive" && l)
      return !1;
  }
  return !(typeof i == "boolean" && t.isStale() !== i || o && o !== t.state.fetchStatus || s && !s(t));
}
function Ht(e, t) {
  const { exact: r, status: n, predicate: o, mutationKey: s } = e;
  if (s) {
    if (!t.options.mutationKey)
      return !1;
    if (r) {
      if (De(t.options.mutationKey) !== De(s))
        return !1;
    } else if (!Fe(t.options.mutationKey, s))
      return !1;
  }
  return !(n && t.state.status !== n || o && !o(t));
}
function At(e, t) {
  return (t?.queryKeyHashFn || De)(e);
}
function De(e) {
  return JSON.stringify(
    e,
    (t, r) => $t(r) ? Object.keys(r).sort().reduce((n, o) => (n[o] = r[o], n), {}) : r
  );
}
function Fe(e, t) {
  return e === t ? !0 : typeof e != typeof t ? !1 : e && t && typeof e == "object" && typeof t == "object" ? Object.keys(t).every((r) => Fe(e[r], t[r])) : !1;
}
var fi = Object.prototype.hasOwnProperty;
function yt(e, t, r = 0) {
  if (e === t)
    return e;
  if (r > 500) return t;
  const n = Kt(e) && Kt(t);
  if (!n && !($t(e) && $t(t))) return t;
  const s = (n ? e : Object.keys(e)).length, a = n ? t : Object.keys(t), i = a.length, l = n ? new Array(i) : {};
  let c = 0;
  for (let h = 0; h < i; h++) {
    const f = n ? h : a[h], b = e[f], d = t[f];
    if (b === d) {
      l[f] = b, (n ? h < s : fi.call(e, f)) && c++;
      continue;
    }
    if (b === null || d === null || typeof b != "object" || typeof d != "object") {
      l[f] = d;
      continue;
    }
    const m = yt(b, d, r + 1);
    l[f] = m, m === b && c++;
  }
  return s === i && c === s ? e : l;
}
function Kt(e) {
  return Array.isArray(e) && e.length === Object.keys(e).length;
}
function $t(e) {
  if (!Ut(e))
    return !1;
  const t = e.constructor;
  if (t === void 0)
    return !0;
  const r = t.prototype;
  return !(!Ut(r) || !r.hasOwnProperty("isPrototypeOf") || Object.getPrototypeOf(e) !== Object.prototype);
}
function Ut(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
function hi(e) {
  return new Promise((t) => {
    xt.setTimeout(t, e);
  });
}
function pi(e, t, r) {
  if (typeof r.structuralSharing == "function")
    return r.structuralSharing(e, t);
  if (r.structuralSharing !== !1) {
    if (process.env.NODE_ENV !== "production")
      try {
        return yt(e, t);
      } catch (n) {
        throw console.error(
          `Structural sharing requires data to be JSON serializable. To fix this, turn off structuralSharing or return JSON-serializable data from your queryFn. [${r.queryHash}]: ${n}`
        ), n;
      }
    return yt(e, t);
  }
  return t;
}
function gi(e, t, r = 0) {
  const n = [...e, t];
  return r && n.length > r ? n.slice(1) : n;
}
function bi(e, t, r = 0) {
  const n = [t, ...e];
  return r && n.length > r ? n.slice(0, -1) : n;
}
var nt = /* @__PURE__ */ Symbol();
function Ir(e, t) {
  return process.env.NODE_ENV !== "production" && e.queryFn === nt && console.error(
    `Attempted to invoke queryFn when set to skipToken. This is likely a configuration error. Query hash: '${e.queryHash}'`
  ), !e.queryFn && t?.initialPromise ? () => t.initialPromise : !e.queryFn || e.queryFn === nt ? () => Promise.reject(new Error(`Missing queryFn: '${e.queryHash}'`)) : e.queryFn;
}
function mi(e, t, r) {
  let n = !1, o;
  return Object.defineProperty(e, "signal", {
    enumerable: !0,
    get: () => (o ??= t(), n || (n = !0, o.aborted ? r() : o.addEventListener("abort", r, { once: !0 })), o)
  }), e;
}
var wi = class extends it {
  #e;
  #t;
  #r;
  constructor() {
    super(), this.#r = (e) => {
      if (!at && window.addEventListener) {
        const t = () => e();
        return window.addEventListener("visibilitychange", t, !1), () => {
          window.removeEventListener("visibilitychange", t);
        };
      }
    };
  }
  onSubscribe() {
    this.#t || this.setEventListener(this.#r);
  }
  onUnsubscribe() {
    this.hasListeners() || (this.#t?.(), this.#t = void 0);
  }
  setEventListener(e) {
    this.#r = e, this.#t?.(), this.#t = e((t) => {
      typeof t == "boolean" ? this.setFocused(t) : this.onFocus();
    });
  }
  setFocused(e) {
    this.#e !== e && (this.#e = e, this.onFocus());
  }
  onFocus() {
    const e = this.isFocused();
    this.listeners.forEach((t) => {
      t(e);
    });
  }
  isFocused() {
    return typeof this.#e == "boolean" ? this.#e : globalThis.document?.visibilityState !== "hidden";
  }
}, Ar = new wi();
function xi() {
  let e, t;
  const r = new Promise((o, s) => {
    e = o, t = s;
  });
  r.status = "pending", r.catch(() => {
  });
  function n(o) {
    Object.assign(r, o), delete r.resolve, delete r.reject;
  }
  return r.resolve = (o) => {
    n({
      status: "fulfilled",
      value: o
    }), e(o);
  }, r.reject = (o) => {
    n({
      status: "rejected",
      reason: o
    }), t(o);
  }, r;
}
var vi = ai;
function yi() {
  let e = [], t = 0, r = (i) => {
    i();
  }, n = (i) => {
    i();
  }, o = vi;
  const s = (i) => {
    t ? e.push(i) : o(() => {
      r(i);
    });
  }, a = () => {
    const i = e;
    e = [], i.length && o(() => {
      n(() => {
        i.forEach((l) => {
          r(l);
        });
      });
    });
  };
  return {
    batch: (i) => {
      let l;
      t++;
      try {
        l = i();
      } finally {
        t--, t || a();
      }
      return l;
    },
    /**
     * All calls to the wrapped function will be batched.
     */
    batchCalls: (i) => (...l) => {
      s(() => {
        i(...l);
      });
    },
    schedule: s,
    /**
     * Use this method to set a custom notify function.
     * This can be used to for example wrap notifications with `React.act` while running tests.
     */
    setNotifyFunction: (i) => {
      r = i;
    },
    /**
     * Use this method to set a custom function to batch notifications together into a single tick.
     * By default React Query will use the batch function provided by ReactDOM or React Native.
     */
    setBatchNotifyFunction: (i) => {
      n = i;
    },
    setScheduler: (i) => {
      o = i;
    }
  };
}
var ne = yi(), $i = class extends it {
  #e = !0;
  #t;
  #r;
  constructor() {
    super(), this.#r = (e) => {
      if (!at && window.addEventListener) {
        const t = () => e(!0), r = () => e(!1);
        return window.addEventListener("online", t, !1), window.addEventListener("offline", r, !1), () => {
          window.removeEventListener("online", t), window.removeEventListener("offline", r);
        };
      }
    };
  }
  onSubscribe() {
    this.#t || this.setEventListener(this.#r);
  }
  onUnsubscribe() {
    this.hasListeners() || (this.#t?.(), this.#t = void 0);
  }
  setEventListener(e) {
    this.#r = e, this.#t?.(), this.#t = e(this.setOnline.bind(this));
  }
  setOnline(e) {
    this.#e !== e && (this.#e = e, this.listeners.forEach((r) => {
      r(e);
    }));
  }
  isOnline() {
    return this.#e;
  }
}, st = new $i();
function ki(e) {
  return Math.min(1e3 * 2 ** e, 3e4);
}
function Rr(e) {
  return (e ?? "online") === "online" ? st.isOnline() : !0;
}
var kt = class extends Error {
  constructor(e) {
    super("CancelledError"), this.revert = e?.revert, this.silent = e?.silent;
  }
};
function Or(e) {
  let t = !1, r = 0, n;
  const o = xi(), s = () => o.status !== "pending", a = (p) => {
    if (!s()) {
      const g = new kt(p);
      b(g), e.onCancel?.(g);
    }
  }, i = () => {
    t = !0;
  }, l = () => {
    t = !1;
  }, c = () => Ar.isFocused() && (e.networkMode === "always" || st.isOnline()) && e.canRun(), h = () => Rr(e.networkMode) && e.canRun(), f = (p) => {
    s() || (n?.(), o.resolve(p));
  }, b = (p) => {
    s() || (n?.(), o.reject(p));
  }, d = () => new Promise((p) => {
    n = (g) => {
      (s() || c()) && p(g);
    }, e.onPause?.();
  }).then(() => {
    n = void 0, s() || e.onContinue?.();
  }), m = () => {
    if (s())
      return;
    let p;
    const g = r === 0 ? e.initialPromise : void 0;
    try {
      p = g ?? e.fn();
    } catch (I) {
      p = Promise.reject(I);
    }
    Promise.resolve(p).then(f).catch((I) => {
      if (s())
        return;
      const x = e.retry ?? (at ? 0 : 3), C = e.retryDelay ?? ki, S = typeof C == "function" ? C(r, I) : C, T = x === !0 || typeof x == "number" && r < x || typeof x == "function" && x(r, I);
      if (t || !T) {
        b(I);
        return;
      }
      r++, e.onFail?.(r, I), hi(S).then(() => c() ? void 0 : d()).then(() => {
        t ? b(I) : m();
      });
    });
  };
  return {
    promise: o,
    status: () => o.status,
    cancel: a,
    continue: () => (n?.(), o),
    cancelRetry: i,
    continueRetry: l,
    canStart: h,
    start: () => (h() ? m() : d().then(m), o)
  };
}
var Tr = class {
  #e;
  destroy() {
    this.clearGcTimeout();
  }
  scheduleGc() {
    this.clearGcTimeout(), ci(this.gcTime) && (this.#e = xt.setTimeout(() => {
      this.optionalRemove();
    }, this.gcTime));
  }
  updateGcTime(e) {
    this.gcTime = Math.max(
      this.gcTime || 0,
      e ?? (at ? 1 / 0 : 300 * 1e3)
    );
  }
  clearGcTimeout() {
    this.#e && (xt.clearTimeout(this.#e), this.#e = void 0);
  }
}, _i = class extends Tr {
  #e;
  #t;
  #r;
  #s;
  #n;
  #i;
  #a;
  constructor(e) {
    super(), this.#a = !1, this.#i = e.defaultOptions, this.setOptions(e.options), this.observers = [], this.#s = e.client, this.#r = this.#s.getQueryCache(), this.queryKey = e.queryKey, this.queryHash = e.queryHash, this.#e = Vt(this.options), this.state = e.state ?? this.#e, this.scheduleGc();
  }
  get meta() {
    return this.options.meta;
  }
  get promise() {
    return this.#n?.promise;
  }
  setOptions(e) {
    if (this.options = { ...this.#i, ...e }, this.updateGcTime(this.options.gcTime), this.state && this.state.data === void 0) {
      const t = Vt(this.options);
      t.data !== void 0 && (this.setState(
        Gt(t.data, t.dataUpdatedAt)
      ), this.#e = t);
    }
  }
  optionalRemove() {
    !this.observers.length && this.state.fetchStatus === "idle" && this.#r.remove(this);
  }
  setData(e, t) {
    const r = pi(this.state.data, e, this.options);
    return this.#o({
      data: r,
      type: "success",
      dataUpdatedAt: t?.updatedAt,
      manual: t?.manual
    }), r;
  }
  setState(e, t) {
    this.#o({ type: "setState", state: e, setStateOptions: t });
  }
  cancel(e) {
    const t = this.#n?.promise;
    return this.#n?.cancel(e), t ? t.then(le).catch(le) : Promise.resolve();
  }
  destroy() {
    super.destroy(), this.cancel({ silent: !0 });
  }
  reset() {
    this.destroy(), this.setState(this.#e);
  }
  isActive() {
    return this.observers.some(
      (e) => di(e.options.enabled, this) !== !1
    );
  }
  isDisabled() {
    return this.getObserversCount() > 0 ? !this.isActive() : this.options.queryFn === nt || this.state.dataUpdateCount + this.state.errorUpdateCount === 0;
  }
  isStatic() {
    return this.getObserversCount() > 0 ? this.observers.some(
      (e) => vt(e.options.staleTime, this) === "static"
    ) : !1;
  }
  isStale() {
    return this.getObserversCount() > 0 ? this.observers.some(
      (e) => e.getCurrentResult().isStale
    ) : this.state.data === void 0 || this.state.isInvalidated;
  }
  isStaleByTime(e = 0) {
    return this.state.data === void 0 ? !0 : e === "static" ? !1 : this.state.isInvalidated ? !0 : !ui(this.state.dataUpdatedAt, e);
  }
  onFocus() {
    this.observers.find((t) => t.shouldFetchOnWindowFocus())?.refetch({ cancelRefetch: !1 }), this.#n?.continue();
  }
  onOnline() {
    this.observers.find((t) => t.shouldFetchOnReconnect())?.refetch({ cancelRefetch: !1 }), this.#n?.continue();
  }
  addObserver(e) {
    this.observers.includes(e) || (this.observers.push(e), this.clearGcTimeout(), this.#r.notify({ type: "observerAdded", query: this, observer: e }));
  }
  removeObserver(e) {
    this.observers.includes(e) && (this.observers = this.observers.filter((t) => t !== e), this.observers.length || (this.#n && (this.#a ? this.#n.cancel({ revert: !0 }) : this.#n.cancelRetry()), this.scheduleGc()), this.#r.notify({ type: "observerRemoved", query: this, observer: e }));
  }
  getObserversCount() {
    return this.observers.length;
  }
  invalidate() {
    this.state.isInvalidated || this.#o({ type: "invalidate" });
  }
  async fetch(e, t) {
    if (this.state.fetchStatus !== "idle" && // If the promise in the retryer is already rejected, we have to definitely
    // re-start the fetch; there is a chance that the query is still in a
    // pending state when that happens
    this.#n?.status() !== "rejected") {
      if (this.state.data !== void 0 && t?.cancelRefetch)
        this.cancel({ silent: !0 });
      else if (this.#n)
        return this.#n.continueRetry(), this.#n.promise;
    }
    if (e && this.setOptions(e), !this.options.queryFn) {
      const i = this.observers.find((l) => l.options.queryFn);
      i && this.setOptions(i.options);
    }
    process.env.NODE_ENV !== "production" && (Array.isArray(this.options.queryKey) || console.error(
      "As of v4, queryKey needs to be an Array. If you are using a string like 'repoData', please change it to an Array, e.g. ['repoData']"
    ));
    const r = new AbortController(), n = (i) => {
      Object.defineProperty(i, "signal", {
        enumerable: !0,
        get: () => (this.#a = !0, r.signal)
      });
    }, o = () => {
      const i = Ir(this.options, t), c = (() => {
        const h = {
          client: this.#s,
          queryKey: this.queryKey,
          meta: this.meta
        };
        return n(h), h;
      })();
      return this.#a = !1, this.options.persister ? this.options.persister(
        i,
        c,
        this
      ) : i(c);
    }, a = (() => {
      const i = {
        fetchOptions: t,
        options: this.options,
        queryKey: this.queryKey,
        client: this.#s,
        state: this.state,
        fetchFn: o
      };
      return n(i), i;
    })();
    this.options.behavior?.onFetch(a, this), this.#t = this.state, (this.state.fetchStatus === "idle" || this.state.fetchMeta !== a.fetchOptions?.meta) && this.#o({ type: "fetch", meta: a.fetchOptions?.meta }), this.#n = Or({
      initialPromise: t?.initialPromise,
      fn: a.fetchFn,
      onCancel: (i) => {
        i instanceof kt && i.revert && this.setState({
          ...this.#t,
          fetchStatus: "idle"
        }), r.abort();
      },
      onFail: (i, l) => {
        this.#o({ type: "failed", failureCount: i, error: l });
      },
      onPause: () => {
        this.#o({ type: "pause" });
      },
      onContinue: () => {
        this.#o({ type: "continue" });
      },
      retry: a.options.retry,
      retryDelay: a.options.retryDelay,
      networkMode: a.options.networkMode,
      canRun: () => !0
    });
    try {
      const i = await this.#n.start();
      if (i === void 0)
        throw process.env.NODE_ENV !== "production" && console.error(
          `Query data cannot be undefined. Please make sure to return a value other than undefined from your query function. Affected query key: ${this.queryHash}`
        ), new Error(`${this.queryHash} data is undefined`);
      return this.setData(i), this.#r.config.onSuccess?.(i, this), this.#r.config.onSettled?.(
        i,
        this.state.error,
        this
      ), i;
    } catch (i) {
      if (i instanceof kt) {
        if (i.silent)
          return this.#n.promise;
        if (i.revert) {
          if (this.state.data === void 0)
            throw i;
          return this.state.data;
        }
      }
      throw this.#o({
        type: "error",
        error: i
      }), this.#r.config.onError?.(
        i,
        this
      ), this.#r.config.onSettled?.(
        this.state.data,
        i,
        this
      ), i;
    } finally {
      this.scheduleGc();
    }
  }
  #o(e) {
    const t = (r) => {
      switch (e.type) {
        case "failed":
          return {
            ...r,
            fetchFailureCount: e.failureCount,
            fetchFailureReason: e.error
          };
        case "pause":
          return {
            ...r,
            fetchStatus: "paused"
          };
        case "continue":
          return {
            ...r,
            fetchStatus: "fetching"
          };
        case "fetch":
          return {
            ...r,
            ...Si(r.data, this.options),
            fetchMeta: e.meta ?? null
          };
        case "success":
          const n = {
            ...r,
            ...Gt(e.data, e.dataUpdatedAt),
            dataUpdateCount: r.dataUpdateCount + 1,
            ...!e.manual && {
              fetchStatus: "idle",
              fetchFailureCount: 0,
              fetchFailureReason: null
            }
          };
          return this.#t = e.manual ? n : void 0, n;
        case "error":
          const o = e.error;
          return {
            ...r,
            error: o,
            errorUpdateCount: r.errorUpdateCount + 1,
            errorUpdatedAt: Date.now(),
            fetchFailureCount: r.fetchFailureCount + 1,
            fetchFailureReason: o,
            fetchStatus: "idle",
            status: "error",
            // flag existing data as invalidated if we get a background error
            // note that "no data" always means stale so we can set unconditionally here
            isInvalidated: !0
          };
        case "invalidate":
          return {
            ...r,
            isInvalidated: !0
          };
        case "setState":
          return {
            ...r,
            ...e.state
          };
      }
    };
    this.state = t(this.state), ne.batch(() => {
      this.observers.forEach((r) => {
        r.onQueryUpdate();
      }), this.#r.notify({ query: this, type: "updated", action: e });
    });
  }
};
function Si(e, t) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: Rr(t.networkMode) ? "fetching" : "paused",
    ...e === void 0 && {
      error: null,
      status: "pending"
    }
  };
}
function Gt(e, t) {
  return {
    data: e,
    dataUpdatedAt: t ?? Date.now(),
    error: null,
    isInvalidated: !1,
    status: "success"
  };
}
function Vt(e) {
  const t = typeof e.initialData == "function" ? e.initialData() : e.initialData, r = t !== void 0, n = r ? typeof e.initialDataUpdatedAt == "function" ? e.initialDataUpdatedAt() : e.initialDataUpdatedAt : 0;
  return {
    data: t,
    dataUpdateCount: 0,
    dataUpdatedAt: r ? n ?? Date.now() : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: !1,
    status: r ? "success" : "pending",
    fetchStatus: "idle"
  };
}
function Jt(e) {
  return {
    onFetch: (t, r) => {
      const n = t.options, o = t.fetchOptions?.meta?.fetchMore?.direction, s = t.state.data?.pages || [], a = t.state.data?.pageParams || [];
      let i = { pages: [], pageParams: [] }, l = 0;
      const c = async () => {
        let h = !1;
        const f = (m) => {
          mi(
            m,
            () => t.signal,
            () => h = !0
          );
        }, b = Ir(t.options, t.fetchOptions), d = async (m, p, g) => {
          if (h)
            return Promise.reject();
          if (p == null && m.pages.length)
            return Promise.resolve(m);
          const x = (() => {
            const N = {
              client: t.client,
              queryKey: t.queryKey,
              pageParam: p,
              direction: g ? "backward" : "forward",
              meta: t.options.meta
            };
            return f(N), N;
          })(), C = await b(x), { maxPages: S } = t.options, T = g ? bi : gi;
          return {
            pages: T(m.pages, C, S),
            pageParams: T(m.pageParams, p, S)
          };
        };
        if (o && s.length) {
          const m = o === "backward", p = m ? Ci : Zt, g = {
            pages: s,
            pageParams: a
          }, I = p(n, g);
          i = await d(g, I, m);
        } else {
          const m = e ?? s.length;
          do {
            const p = l === 0 ? a[0] ?? n.initialPageParam : Zt(n, i);
            if (l > 0 && p == null)
              break;
            i = await d(i, p), l++;
          } while (l < m);
        }
        return i;
      };
      t.options.persister ? t.fetchFn = () => t.options.persister?.(
        c,
        {
          client: t.client,
          queryKey: t.queryKey,
          meta: t.options.meta,
          signal: t.signal
        },
        r
      ) : t.fetchFn = c;
    }
  };
}
function Zt(e, { pages: t, pageParams: r }) {
  const n = t.length - 1;
  return t.length > 0 ? e.getNextPageParam(
    t[n],
    t,
    r[n],
    r
  ) : void 0;
}
function Ci(e, { pages: t, pageParams: r }) {
  return t.length > 0 ? e.getPreviousPageParam?.(t[0], t, r[0], r) : void 0;
}
var Ii = class extends Tr {
  #e;
  #t;
  #r;
  #s;
  constructor(e) {
    super(), this.#e = e.client, this.mutationId = e.mutationId, this.#r = e.mutationCache, this.#t = [], this.state = e.state || Ai(), this.setOptions(e.options), this.scheduleGc();
  }
  setOptions(e) {
    this.options = e, this.updateGcTime(this.options.gcTime);
  }
  get meta() {
    return this.options.meta;
  }
  addObserver(e) {
    this.#t.includes(e) || (this.#t.push(e), this.clearGcTimeout(), this.#r.notify({
      type: "observerAdded",
      mutation: this,
      observer: e
    }));
  }
  removeObserver(e) {
    this.#t = this.#t.filter((t) => t !== e), this.scheduleGc(), this.#r.notify({
      type: "observerRemoved",
      mutation: this,
      observer: e
    });
  }
  optionalRemove() {
    this.#t.length || (this.state.status === "pending" ? this.scheduleGc() : this.#r.remove(this));
  }
  continue() {
    return this.#s?.continue() ?? // continuing a mutation assumes that variables are set, mutation must have been dehydrated before
    this.execute(this.state.variables);
  }
  async execute(e) {
    const t = () => {
      this.#n({ type: "continue" });
    }, r = {
      client: this.#e,
      meta: this.options.meta,
      mutationKey: this.options.mutationKey
    };
    this.#s = Or({
      fn: () => this.options.mutationFn ? this.options.mutationFn(e, r) : Promise.reject(new Error("No mutationFn found")),
      onFail: (s, a) => {
        this.#n({ type: "failed", failureCount: s, error: a });
      },
      onPause: () => {
        this.#n({ type: "pause" });
      },
      onContinue: t,
      retry: this.options.retry ?? 0,
      retryDelay: this.options.retryDelay,
      networkMode: this.options.networkMode,
      canRun: () => this.#r.canRun(this)
    });
    const n = this.state.status === "pending", o = !this.#s.canStart();
    try {
      if (n)
        t();
      else {
        this.#n({ type: "pending", variables: e, isPaused: o }), this.#r.config.onMutate && await this.#r.config.onMutate(
          e,
          this,
          r
        );
        const a = await this.options.onMutate?.(
          e,
          r
        );
        a !== this.state.context && this.#n({
          type: "pending",
          context: a,
          variables: e,
          isPaused: o
        });
      }
      const s = await this.#s.start();
      return await this.#r.config.onSuccess?.(
        s,
        e,
        this.state.context,
        this,
        r
      ), await this.options.onSuccess?.(
        s,
        e,
        this.state.context,
        r
      ), await this.#r.config.onSettled?.(
        s,
        null,
        this.state.variables,
        this.state.context,
        this,
        r
      ), await this.options.onSettled?.(
        s,
        null,
        e,
        this.state.context,
        r
      ), this.#n({ type: "success", data: s }), s;
    } catch (s) {
      try {
        await this.#r.config.onError?.(
          s,
          e,
          this.state.context,
          this,
          r
        );
      } catch (a) {
        Promise.reject(a);
      }
      try {
        await this.options.onError?.(
          s,
          e,
          this.state.context,
          r
        );
      } catch (a) {
        Promise.reject(a);
      }
      try {
        await this.#r.config.onSettled?.(
          void 0,
          s,
          this.state.variables,
          this.state.context,
          this,
          r
        );
      } catch (a) {
        Promise.reject(a);
      }
      try {
        await this.options.onSettled?.(
          void 0,
          s,
          e,
          this.state.context,
          r
        );
      } catch (a) {
        Promise.reject(a);
      }
      throw this.#n({ type: "error", error: s }), s;
    } finally {
      this.#r.runNext(this);
    }
  }
  #n(e) {
    const t = (r) => {
      switch (e.type) {
        case "failed":
          return {
            ...r,
            failureCount: e.failureCount,
            failureReason: e.error
          };
        case "pause":
          return {
            ...r,
            isPaused: !0
          };
        case "continue":
          return {
            ...r,
            isPaused: !1
          };
        case "pending":
          return {
            ...r,
            context: e.context,
            data: void 0,
            failureCount: 0,
            failureReason: null,
            error: null,
            isPaused: e.isPaused,
            status: "pending",
            variables: e.variables,
            submittedAt: Date.now()
          };
        case "success":
          return {
            ...r,
            data: e.data,
            failureCount: 0,
            failureReason: null,
            error: null,
            status: "success",
            isPaused: !1
          };
        case "error":
          return {
            ...r,
            data: void 0,
            error: e.error,
            failureCount: r.failureCount + 1,
            failureReason: e.error,
            isPaused: !1,
            status: "error"
          };
      }
    };
    this.state = t(this.state), ne.batch(() => {
      this.#t.forEach((r) => {
        r.onMutationUpdate(e);
      }), this.#r.notify({
        mutation: this,
        type: "updated",
        action: e
      });
    });
  }
};
function Ai() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: !1,
    status: "idle",
    variables: void 0,
    submittedAt: 0
  };
}
var Ri = class extends it {
  constructor(e = {}) {
    super(), this.config = e, this.#e = /* @__PURE__ */ new Set(), this.#t = /* @__PURE__ */ new Map(), this.#r = 0;
  }
  #e;
  #t;
  #r;
  build(e, t, r) {
    const n = new Ii({
      client: e,
      mutationCache: this,
      mutationId: ++this.#r,
      options: e.defaultMutationOptions(t),
      state: r
    });
    return this.add(n), n;
  }
  add(e) {
    this.#e.add(e);
    const t = Ke(e);
    if (typeof t == "string") {
      const r = this.#t.get(t);
      r ? r.push(e) : this.#t.set(t, [e]);
    }
    this.notify({ type: "added", mutation: e });
  }
  remove(e) {
    if (this.#e.delete(e)) {
      const t = Ke(e);
      if (typeof t == "string") {
        const r = this.#t.get(t);
        if (r)
          if (r.length > 1) {
            const n = r.indexOf(e);
            n !== -1 && r.splice(n, 1);
          } else r[0] === e && this.#t.delete(t);
      }
    }
    this.notify({ type: "removed", mutation: e });
  }
  canRun(e) {
    const t = Ke(e);
    if (typeof t == "string") {
      const n = this.#t.get(t)?.find(
        (o) => o.state.status === "pending"
      );
      return !n || n === e;
    } else
      return !0;
  }
  runNext(e) {
    const t = Ke(e);
    return typeof t == "string" ? this.#t.get(t)?.find((n) => n !== e && n.state.isPaused)?.continue() ?? Promise.resolve() : Promise.resolve();
  }
  clear() {
    ne.batch(() => {
      this.#e.forEach((e) => {
        this.notify({ type: "removed", mutation: e });
      }), this.#e.clear(), this.#t.clear();
    });
  }
  getAll() {
    return Array.from(this.#e);
  }
  find(e) {
    const t = { exact: !0, ...e };
    return this.getAll().find(
      (r) => Ht(t, r)
    );
  }
  findAll(e = {}) {
    return this.getAll().filter((t) => Ht(e, t));
  }
  notify(e) {
    ne.batch(() => {
      this.listeners.forEach((t) => {
        t(e);
      });
    });
  }
  resumePausedMutations() {
    const e = this.getAll().filter((t) => t.state.isPaused);
    return ne.batch(
      () => Promise.all(
        e.map((t) => t.continue().catch(le))
      )
    );
  }
};
function Ke(e) {
  return e.options.scope?.id;
}
var Oi = class extends it {
  constructor(e = {}) {
    super(), this.config = e, this.#e = /* @__PURE__ */ new Map();
  }
  #e;
  build(e, t, r) {
    const n = t.queryKey, o = t.queryHash ?? At(n, t);
    let s = this.get(o);
    return s || (s = new _i({
      client: e,
      queryKey: n,
      queryHash: o,
      options: e.defaultQueryOptions(t),
      state: r,
      defaultOptions: e.getQueryDefaults(n)
    }), this.add(s)), s;
  }
  add(e) {
    this.#e.has(e.queryHash) || (this.#e.set(e.queryHash, e), this.notify({
      type: "added",
      query: e
    }));
  }
  remove(e) {
    const t = this.#e.get(e.queryHash);
    t && (e.destroy(), t === e && this.#e.delete(e.queryHash), this.notify({ type: "removed", query: e }));
  }
  clear() {
    ne.batch(() => {
      this.getAll().forEach((e) => {
        this.remove(e);
      });
    });
  }
  get(e) {
    return this.#e.get(e);
  }
  getAll() {
    return [...this.#e.values()];
  }
  find(e) {
    const t = { exact: !0, ...e };
    return this.getAll().find(
      (r) => Bt(t, r)
    );
  }
  findAll(e = {}) {
    const t = this.getAll();
    return Object.keys(e).length > 0 ? t.filter((r) => Bt(e, r)) : t;
  }
  notify(e) {
    ne.batch(() => {
      this.listeners.forEach((t) => {
        t(e);
      });
    });
  }
  onFocus() {
    ne.batch(() => {
      this.getAll().forEach((e) => {
        e.onFocus();
      });
    });
  }
  onOnline() {
    ne.batch(() => {
      this.getAll().forEach((e) => {
        e.onOnline();
      });
    });
  }
}, Ti = class {
  #e;
  #t;
  #r;
  #s;
  #n;
  #i;
  #a;
  #o;
  constructor(t = {}) {
    this.#e = t.queryCache || new Oi(), this.#t = t.mutationCache || new Ri(), this.#r = t.defaultOptions || {}, this.#s = /* @__PURE__ */ new Map(), this.#n = /* @__PURE__ */ new Map(), this.#i = 0;
  }
  mount() {
    this.#i++, this.#i === 1 && (this.#a = Ar.subscribe(async (t) => {
      t && (await this.resumePausedMutations(), this.#e.onFocus());
    }), this.#o = st.subscribe(async (t) => {
      t && (await this.resumePausedMutations(), this.#e.onOnline());
    }));
  }
  unmount() {
    this.#i--, this.#i === 0 && (this.#a?.(), this.#a = void 0, this.#o?.(), this.#o = void 0);
  }
  isFetching(t) {
    return this.#e.findAll({ ...t, fetchStatus: "fetching" }).length;
  }
  isMutating(t) {
    return this.#t.findAll({ ...t, status: "pending" }).length;
  }
  /**
   * Imperative (non-reactive) way to retrieve data for a QueryKey.
   * Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
   *
   * Hint: Do not use this function inside a component, because it won't receive updates.
   * Use `useQuery` to create a `QueryObserver` that subscribes to changes.
   */
  getQueryData(t) {
    const r = this.defaultQueryOptions({ queryKey: t });
    return this.#e.get(r.queryHash)?.state.data;
  }
  ensureQueryData(t) {
    const r = this.defaultQueryOptions(t), n = this.#e.build(this, r), o = n.state.data;
    return o === void 0 ? this.fetchQuery(t) : (t.revalidateIfStale && n.isStaleByTime(vt(r.staleTime, n)) && this.prefetchQuery(r), Promise.resolve(o));
  }
  getQueriesData(t) {
    return this.#e.findAll(t).map(({ queryKey: r, state: n }) => {
      const o = n.data;
      return [r, o];
    });
  }
  setQueryData(t, r, n) {
    const o = this.defaultQueryOptions({ queryKey: t }), a = this.#e.get(
      o.queryHash
    )?.state.data, i = li(r, a);
    if (i !== void 0)
      return this.#e.build(this, o).setData(i, { ...n, manual: !0 });
  }
  setQueriesData(t, r, n) {
    return ne.batch(
      () => this.#e.findAll(t).map(({ queryKey: o }) => [
        o,
        this.setQueryData(o, r, n)
      ])
    );
  }
  getQueryState(t) {
    const r = this.defaultQueryOptions({ queryKey: t });
    return this.#e.get(
      r.queryHash
    )?.state;
  }
  removeQueries(t) {
    const r = this.#e;
    ne.batch(() => {
      r.findAll(t).forEach((n) => {
        r.remove(n);
      });
    });
  }
  resetQueries(t, r) {
    const n = this.#e;
    return ne.batch(() => (n.findAll(t).forEach((o) => {
      o.reset();
    }), this.refetchQueries(
      {
        type: "active",
        ...t
      },
      r
    )));
  }
  cancelQueries(t, r = {}) {
    const n = { revert: !0, ...r }, o = ne.batch(
      () => this.#e.findAll(t).map((s) => s.cancel(n))
    );
    return Promise.all(o).then(le).catch(le);
  }
  invalidateQueries(t, r = {}) {
    return ne.batch(() => (this.#e.findAll(t).forEach((n) => {
      n.invalidate();
    }), t?.refetchType === "none" ? Promise.resolve() : this.refetchQueries(
      {
        ...t,
        type: t?.refetchType ?? t?.type ?? "active"
      },
      r
    )));
  }
  refetchQueries(t, r = {}) {
    const n = {
      ...r,
      cancelRefetch: r.cancelRefetch ?? !0
    }, o = ne.batch(
      () => this.#e.findAll(t).filter((s) => !s.isDisabled() && !s.isStatic()).map((s) => {
        let a = s.fetch(void 0, n);
        return n.throwOnError || (a = a.catch(le)), s.state.fetchStatus === "paused" ? Promise.resolve() : a;
      })
    );
    return Promise.all(o).then(le);
  }
  fetchQuery(t) {
    const r = this.defaultQueryOptions(t);
    r.retry === void 0 && (r.retry = !1);
    const n = this.#e.build(this, r);
    return n.isStaleByTime(
      vt(r.staleTime, n)
    ) ? n.fetch(r) : Promise.resolve(n.state.data);
  }
  prefetchQuery(t) {
    return this.fetchQuery(t).then(le).catch(le);
  }
  fetchInfiniteQuery(t) {
    return t.behavior = Jt(t.pages), this.fetchQuery(t);
  }
  prefetchInfiniteQuery(t) {
    return this.fetchInfiniteQuery(t).then(le).catch(le);
  }
  ensureInfiniteQueryData(t) {
    return t.behavior = Jt(t.pages), this.ensureQueryData(t);
  }
  resumePausedMutations() {
    return st.isOnline() ? this.#t.resumePausedMutations() : Promise.resolve();
  }
  getQueryCache() {
    return this.#e;
  }
  getMutationCache() {
    return this.#t;
  }
  getDefaultOptions() {
    return this.#r;
  }
  setDefaultOptions(t) {
    this.#r = t;
  }
  setQueryDefaults(t, r) {
    this.#s.set(De(t), {
      queryKey: t,
      defaultOptions: r
    });
  }
  getQueryDefaults(t) {
    const r = [...this.#s.values()], n = {};
    return r.forEach((o) => {
      Fe(t, o.queryKey) && Object.assign(n, o.defaultOptions);
    }), n;
  }
  setMutationDefaults(t, r) {
    this.#n.set(De(t), {
      mutationKey: t,
      defaultOptions: r
    });
  }
  getMutationDefaults(t) {
    const r = [...this.#n.values()], n = {};
    return r.forEach((o) => {
      Fe(t, o.mutationKey) && Object.assign(n, o.defaultOptions);
    }), n;
  }
  defaultQueryOptions(t) {
    if (t._defaulted)
      return t;
    const r = {
      ...this.#r.queries,
      ...this.getQueryDefaults(t.queryKey),
      ...t,
      _defaulted: !0
    };
    return r.queryHash || (r.queryHash = At(
      r.queryKey,
      r
    )), r.refetchOnReconnect === void 0 && (r.refetchOnReconnect = r.networkMode !== "always"), r.throwOnError === void 0 && (r.throwOnError = !!r.suspense), !r.networkMode && r.persister && (r.networkMode = "offlineFirst"), r.queryFn === nt && (r.enabled = !1), r;
  }
  defaultMutationOptions(t) {
    return t?._defaulted ? t : {
      ...this.#r.mutations,
      ...t?.mutationKey && this.getMutationDefaults(t.mutationKey),
      ...t,
      _defaulted: !0
    };
  }
  clear() {
    this.#e.clear(), this.#t.clear();
  }
}, Ei = ir(void 0), Pi = (e) => (E((t) => (t?.(), e.client.mount(), e.client.unmount.bind(e.client))), Ne(() => e.client.unmount()), w(Ei.Provider, {
  value: () => e.client,
  get children() {
    return e.children;
  }
})), Mi = class extends Ti {
  constructor(e = {}) {
    super(e);
  }
};
const qi = new Mi({
  defaultOptions: {
    queries: {
      staleTime: 5e3,
      refetchOnWindowFocus: !1
    }
  }
});
function Di(e) {
  return w(Pi, {
    client: qi,
    get children() {
      return e.children;
    }
  });
}
class Fi {
  _state;
  listeners = /* @__PURE__ */ new Set();
  transport;
  abortController;
  constructor(t) {
    this._state = {
      messages: [],
      isStreaming: !1,
      streamingMessage: null,
      ...t.initialState
    }, this.transport = t.transport;
  }
  get state() {
    return this._state;
  }
  subscribe(t) {
    return this.listeners.add(t), t(this._state), () => this.listeners.delete(t);
  }
  appendMessage(t) {
    this.patch({ messages: [...this._state.messages, t] });
  }
  replaceMessages(t) {
    this.patch({ messages: [...t] });
  }
  clearMessages() {
    this.patch({ messages: [] });
  }
  abort() {
    this.abortController?.abort();
  }
  async send(t, r) {
    console.log("[ChatAgent] send() called with text:", t);
    const n = {
      role: "user",
      content: t,
      attachments: r,
      timestamp: Date.now()
    };
    this.appendMessage(n), console.log("[ChatAgent] User message appended, total messages:", this._state.messages.length), this.abortController = new AbortController(), this.patch({ isStreaming: !0, streamingMessage: null, error: void 0 });
    try {
      for await (const o of this.transport.run(
        this._state.messages,
        n,
        {},
        this.abortController.signal
      ))
        if (this.handleEvent(o), o.type === "agent_end") break;
    } catch (o) {
      this.patch({ error: o instanceof Error ? o.message : String(o) });
    } finally {
      this.patch({ isStreaming: !1, streamingMessage: null }), this.abortController = void 0;
    }
  }
  handleEvent(t) {
    switch (t.type) {
      case "message_start":
      case "message_update":
        this.patch({ streamingMessage: t.message });
        break;
      case "message_end":
        t.message.role !== "user" && this.appendMessage(t.message), this.patch({ streamingMessage: null });
        break;
    }
  }
  patch(t) {
    this._state = { ...this._state, ...t };
    for (const r of this.listeners)
      r(this._state);
  }
}
class Ni {
  queue = [];
  resolvers = [];
  closed = !1;
  push(t) {
    if (this.closed) return;
    const r = this.resolvers.shift();
    r ? r({
      value: t,
      done: !1
    }) : this.queue.push(t);
  }
  close() {
    for (this.closed = !0; this.resolvers.length; ) {
      const t = this.resolvers.shift();
      t && t({
        value: void 0,
        done: !0
      });
    }
  }
  get length() {
    return this.queue.length;
  }
  get isClosed() {
    return this.closed;
  }
  async *iterator(t) {
    for (; ; ) {
      if (t?.aborted) return;
      if (this.queue.length > 0) {
        yield this.queue.shift();
        continue;
      }
      if (this.closed) return;
      const r = await new Promise((n) => {
        this.resolvers.push(n);
      });
      if (r.done) return;
      yield r.value;
    }
  }
}
class Li {
  queues = /* @__PURE__ */ new Map();
  get(t) {
    const r = this.queues.get(t);
    if (r) return r;
    const n = new Ni();
    return this.queues.set(t, n), n;
  }
  push(t, r) {
    const n = this.get(t);
    n.push(r), r.type === "agent_end" && n.close();
  }
  async *consume(t, r) {
    const n = this.get(t);
    try {
      for await (const o of n.iterator(r))
        yield o;
    } finally {
      n.isClosed && n.length === 0 && this.queues.delete(t);
    }
  }
}
let V;
const Te = new Li();
function te() {
  return V;
}
class Er {
  sessionId;
  constructor(t) {
    this.sessionId = t;
  }
  async *run(t, r, n, o) {
    const s = typeof r.content == "string" ? r.content : Array.isArray(r.content) ? r.content.filter((c) => c.type === "text").map((c) => c.text).join("") : "", a = r.attachments, {
      runId: i
    } = await V.request.sendChatMessage({
      sessionId: this.sessionId,
      text: s,
      attachments: a
    }), l = Te.get(i);
    o && o.addEventListener("abort", () => {
      V.request.abortChatRun({
        sessionId: this.sessionId,
        runId: i
      }).catch(() => {
      }), l.close();
    });
    for await (const c of Te.consume(i, o))
      if (yield c, c.type === "agent_end") break;
  }
  async *continue(t, r, n) {
    const {
      runId: o
    } = await V.request.sendChatMessage({
      sessionId: this.sessionId,
      text: ""
    }), s = Te.get(o);
    n && n.addEventListener("abort", () => {
      V.request.abortChatRun({
        sessionId: this.sessionId,
        runId: o
      }).catch(() => {
      }), s.close();
    });
    for await (const a of Te.consume(o, n))
      if (yield a, a.type === "agent_end") break;
  }
}
async function ji() {
  const [e, t] = await Promise.all([V.request.getSettings({}), V.request.getSecretStatus({})]);
  M({
    settings: e,
    secretStatus: t,
    inspectorOpen: e.ui.workflowPanel.isOpen
  });
  const r = await V.request.listChatSessions({});
  M("sessions", r);
  let n;
  if (r.length > 0)
    n = r[0].sessionId;
  else {
    n = (await V.request.createChatSession({
      title: "New Session"
    })).sessionId;
    const i = await V.request.listChatSessions({});
    M("sessions", i);
  }
  await Rt(n);
  const o = await V.request.getWorkspaceState({});
  M({
    workspaceRoot: o.root,
    workflows: o.workflows
  });
  const s = await V.request.listRuns({
    status: "all"
  });
  M("runs", o.root ? s.filter((a) => a.workspaceRoot === o.root) : s);
}
async function Rt(e) {
  M("sessionId", e);
  const t = await V.request.getChatSession({
    sessionId: e
  }), r = new Er(e), n = new Fi({
    transport: r,
    initialState: {
      messages: t.messages ?? []
    }
  });
  M("agent", n);
}
async function Pr(e) {
  await Rt(e);
}
async function Mr() {
  const e = await V.request.createChatSession({
    title: "New Session"
  }), t = await V.request.listChatSessions({});
  M("sessions", t), await Rt(e.sessionId);
}
async function ce() {
  const e = await V.request.listRuns({
    status: "all"
  }), t = _.workspaceRoot;
  M("runs", t ? e.filter((r) => r.workspaceRoot === t) : e);
}
async function ue(e) {
  M({
    selectedRunId: e,
    contextRunId: e,
    inspectorOpen: !0
  });
  const t = await V.request.getRun({
    runId: e
  });
  M("runDetails", e, t);
  const r = await V.request.getRunEvents({
    runId: e,
    afterSeq: -1
  });
  M("runEvents", e, r.events), M("runEventSeq", e, r.lastSeq);
  try {
    const n = await V.request.getFrame({
      runId: e
    });
    M("frames", e, n);
  } catch {
  }
  try {
    const n = await V.request.getRunOutputs({
      runId: e
    });
    M("outputs", e, n);
  } catch {
  }
  try {
    const n = await V.request.getRunAttempts({
      runId: e
    });
    M("attempts", e, n);
  } catch {
  }
}
function qr(e) {
  V = e({
    requests: {},
    messages: {
      agentEvent: (r) => {
        Te.push(r.runId, r.event);
      },
      chatMessage: ({
        sessionId: r,
        message: n
      }) => {
        r === _.sessionId && _.agent && _.agent.appendMessage(n);
      },
      workflowEvent: (r) => {
        const n = r.runId;
        M("runEvents", n, (o) => [...o ?? [], r]), M("runEventSeq", n, r.seq), ce();
      },
      workflowFrame: (r) => {
        M("frames", r.runId, r);
      },
      workspaceState: (r) => {
        M({
          workspaceRoot: r.root,
          workflows: r.workflows
        }), ce();
      },
      toast: (r) => {
        se(r.level, r.message);
      }
    }
  });
  const t = document.getElementById("app") ?? document.body;
  sn(() => w(si, {
    client: V,
    get children() {
      return w(Di, {
        get children() {
          return w(ri, {});
        }
      });
    }
  }), t), ji().catch((r) => {
    console.error("Bootstrap failed:", r), se("error", `Bootstrap failed: ${r?.message ?? r}`);
  });
}
const Xt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BunAgentTransport: Er,
  createNewSession: Mr,
  focusRun: ue,
  getRpc: te,
  refreshRuns: ce,
  startApp: qr,
  switchSession: Pr
}, Symbol.toStringTag, { value: "Module" })), Wi = 1e10, Qi = 1e3;
function Ue(e, t) {
  const r = e.map((n) => `"${n}"`).join(", ");
  return new Error(`This RPC instance cannot ${t} because the transport did not provide one or more of these methods: ${r}`);
}
function zi(e = {}) {
  let t = {};
  function r(y) {
    t = y;
  }
  let n = {};
  function o(y) {
    n.unregisterHandler && n.unregisterHandler(), n = y, n.registerHandler?.(N);
  }
  let s;
  function a(y) {
    if (typeof y == "function") {
      s = y;
      return;
    }
    s = (k, O) => {
      const $ = y[k];
      if ($)
        return $(O);
      const A = y._;
      if (!A)
        throw new Error(`The requested method has no handler: ${k}`);
      return A(k, O);
    };
  }
  const { maxRequestTime: i = Qi } = e;
  e.transport && o(e.transport), e.requestHandler && a(e.requestHandler), e._debugHooks && r(e._debugHooks);
  let l = 0;
  function c() {
    return l <= Wi ? ++l : l = 0;
  }
  const h = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map();
  function b(y, ...k) {
    const O = k[0];
    return new Promise(($, A) => {
      if (!n.send)
        throw Ue(["send"], "make requests");
      const W = c(), F = {
        type: "request",
        id: W,
        method: y,
        params: O
      };
      h.set(W, { resolve: $, reject: A }), i !== 1 / 0 && f.set(W, setTimeout(() => {
        f.delete(W), A(new Error("RPC request timed out."));
      }, i)), t.onSend?.(F), n.send(F);
    });
  }
  const d = new Proxy(b, {
    get: (y, k, O) => k in y ? Reflect.get(y, k, O) : ($) => b(k, $)
  }), m = d;
  function p(y, ...k) {
    const O = k[0];
    if (!n.send)
      throw Ue(["send"], "send messages");
    const $ = {
      type: "message",
      id: y,
      payload: O
    };
    t.onSend?.($), n.send($);
  }
  const g = new Proxy(p, {
    get: (y, k, O) => k in y ? Reflect.get(y, k, O) : ($) => p(k, $)
  }), I = g, x = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Set();
  function S(y, k) {
    if (!n.registerHandler)
      throw Ue(["registerHandler"], "register message listeners");
    if (y === "*") {
      C.add(k);
      return;
    }
    x.has(y) || x.set(y, /* @__PURE__ */ new Set()), x.get(y)?.add(k);
  }
  function T(y, k) {
    if (y === "*") {
      C.delete(k);
      return;
    }
    x.get(y)?.delete(k), x.get(y)?.size === 0 && x.delete(y);
  }
  async function N(y) {
    if (t.onReceive?.(y), !("type" in y))
      throw new Error("Message does not contain a type.");
    if (y.type === "request") {
      if (!n.send || !s)
        throw Ue(["send", "requestHandler"], "handle requests");
      const { id: k, method: O, params: $ } = y;
      let A;
      try {
        A = {
          type: "response",
          id: k,
          success: !0,
          payload: await s(O, $)
        };
      } catch (W) {
        if (!(W instanceof Error))
          throw W;
        A = {
          type: "response",
          id: k,
          success: !1,
          error: W.message
        };
      }
      t.onSend?.(A), n.send(A);
      return;
    }
    if (y.type === "response") {
      const k = f.get(y.id);
      k != null && clearTimeout(k);
      const { resolve: O, reject: $ } = h.get(y.id) ?? {};
      y.success ? O?.(y.payload) : $?.(new Error(y.error));
      return;
    }
    if (y.type === "message") {
      for (const O of C)
        O(y.id, y.payload);
      const k = x.get(y.id);
      if (!k)
        return;
      for (const O of k)
        O(y.payload);
      return;
    }
    throw new Error(`Unexpected RPC message type: ${y.type}`);
  }
  return {
    setTransport: o,
    setRequestHandler: a,
    request: d,
    requestProxy: m,
    send: g,
    sendProxy: I,
    addMessageListener: S,
    removeMessageListener: T,
    proxy: { send: I, request: m },
    _setDebugHooks: r
  };
}
function Yt(e) {
  return zi(e);
}
const Bi = (e, t, r) => {
  class n extends HTMLElement {
    constructor() {
      super(), this.maskSelectors = /* @__PURE__ */ new Set(), this.lastRect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }, this.lastMasksJSON = "", this.lastMasks = [], this.transparent = !1, this.passthroughEnabled = !1, this.hidden = !1, this.hiddenMirrorMode = !1, this.wasZeroRect = !1, this.isMirroring = !1, this.masks = "", this.partition = null, this.asyncResolvers = {}, this.boundSyncDimensions = () => this.syncDimensions(), this.boundForceSyncDimensions = () => this.syncDimensions(!0), this.internalRpc = t, this.bunRpc = r, requestAnimationFrame(() => {
        this.initWebview();
      });
    }
    addMaskSelector(s) {
      this.maskSelectors.add(s), this.syncDimensions();
    }
    removeMaskSelector(s) {
      this.maskSelectors.delete(s), this.syncDimensions();
    }
    async initWebview() {
      const s = this.getBoundingClientRect();
      this.lastRect = s;
      const a = this.src || this.getAttribute("src"), i = this.html || this.getAttribute("html"), l = this.masks || this.getAttribute("masks");
      l && l.split(",").forEach((h) => {
        this.maskSelectors.add(h);
      });
      const c = await this.internalRpc.request.webviewTagInit({
        hostWebviewId: window.__electrobunWebviewId,
        windowId: window.__electrobunWindowId,
        renderer: this.renderer,
        url: a,
        html: i,
        preload: this.preload || this.getAttribute("preload") || null,
        partition: this.partition || this.getAttribute("partition") || null,
        frame: {
          width: s.width,
          height: s.height,
          x: s.x,
          y: s.y
        },
        // todo: wire up to a param and a method to update them
        navigationRules: null
      });
      console.log("electrobun webviewid: ", c), this.webviewId = c, this.id = `electrobun-webview-${c}`, this.setAttribute("id", this.id);
    }
    callAsyncJavaScript({ script: s }) {
      return new Promise((a, i) => {
        const l = "" + Date.now() + Math.random();
        this.asyncResolvers[l] = {
          resolve: a,
          reject: i
        }, this.internalRpc.request.webviewTagCallAsyncJavaScript({
          messageId: l,
          webviewId: this.webviewId,
          hostWebviewId: window.__electrobunWebviewId,
          script: s
        });
      });
    }
    setCallAsyncJavaScriptResponse(s, a) {
      const i = this.asyncResolvers[s];
      delete this.asyncResolvers[s];
      try {
        a = JSON.parse(a), a.result ? i.resolve(a.result) : i.reject(a.error);
      } catch (l) {
        i.reject(l.message);
      }
    }
    async canGoBack() {
      return this.internalRpc.request.webviewTagCanGoBack({ id: this.webviewId });
    }
    async canGoForward() {
      return this.internalRpc.request.webviewTagCanGoForward({
        id: this.webviewId
      });
    }
    // propertie setters/getters. keeps them in sync with dom attributes
    updateAttr(s, a) {
      a ? this.setAttribute(s, a) : this.removeAttribute(s);
    }
    get src() {
      return this.getAttribute("src");
    }
    set src(s) {
      this.updateAttr("src", s);
    }
    get html() {
      return this.getAttribute("html");
    }
    set html(s) {
      this.updateAttr("html", s);
    }
    get preload() {
      return this.getAttribute("preload");
    }
    set preload(s) {
      this.updateAttr("preload", s);
    }
    get renderer() {
      return this.getAttribute("renderer") === "cef" ? "cef" : "native";
    }
    set renderer(s) {
      const a = s === "cef" ? "cef" : "native";
      this.updateAttr("renderer", a);
    }
    // Note: since <electrobun-webview> is an anchor for a native webview
    // on osx even if we hide it, enable mouse passthrough etc. There
    // are still events like drag events which are natively handled deep in the window manager
    // and will be handled incorrectly. To get around this for now we need to
    // move the webview off screen during delegate mode.
    adjustDimensionsForHiddenMirrorMode(s) {
      return this.hiddenMirrorMode && (s.x = 0 - s.width), s;
    }
    // Note: in the brwoser-context we can ride on the dom element's uilt in event emitter for managing custom events
    on(s, a) {
      this.addEventListener(s, a);
    }
    off(s, a) {
      this.removeEventListener(s, a);
    }
    // This is typically called by injected js from bun
    emit(s, a) {
      this.dispatchEvent(new CustomEvent(s, { detail: a }));
    }
    // Call this via document.querySelector('electrobun-webview').syncDimensions();
    // That way the host can trigger an alignment with the nested webview when they
    // know that they're chaning something in order to eliminate the lag that the
    // catch all loop will catch
    syncDimensions(s = !1) {
      if (!this.webviewId || !s && this.hidden)
        return;
      const a = this.getBoundingClientRect(), { x: i, y: l, width: c, height: h } = this.adjustDimensionsForHiddenMirrorMode(a), f = this.lastRect;
      if (c === 0 && h === 0) {
        this.wasZeroRect === !1 && (console.log("WAS NOT ZERO RECT", this.webviewId), this.wasZeroRect = !0, this.toggleTransparent(!0, !0), this.togglePassthrough(!0, !0));
        return;
      }
      const b = [];
      this.maskSelectors.forEach((m) => {
        const p = document.querySelectorAll(m);
        for (let g = 0; g < p.length; g++) {
          const I = p[g];
          if (I) {
            const x = I.getBoundingClientRect();
            b.push({
              // reposition the bounding rect to be relative to the webview rect
              // so objc can apply the mask correctly and handle the actual overlap
              x: x.x - i,
              y: x.y - l,
              width: x.width,
              height: x.height
            });
          }
        }
      });
      const d = b.length ? JSON.stringify(b) : "";
      (s || f.x !== i || f.y !== l || f.width !== c || f.height !== h || this.lastMasksJSON !== d) && (this.setPositionCheckLoop(!0), this.lastRect = a, this.lastMasks = b, this.lastMasksJSON = d, this.internalRpc.send.webviewTagResize({
        id: this.webviewId,
        frame: {
          width: c,
          height: h,
          x: i,
          y: l
        },
        masks: d
      })), this.wasZeroRect && (this.wasZeroRect = !1, console.log("WAS ZERO RECT", this.webviewId), this.toggleTransparent(!1, !0), this.togglePassthrough(!1, !0));
    }
    setPositionCheckLoop(s = !1) {
      this.positionCheckLoop && (clearInterval(this.positionCheckLoop), this.positionCheckLoop = void 0), this.positionCheckLoopReset && (clearTimeout(this.positionCheckLoopReset), this.positionCheckLoopReset = void 0);
      const a = s ? 0 : 300;
      s && (this.positionCheckLoopReset = setTimeout(() => {
        this.setPositionCheckLoop(!1);
      }, 2e3)), this.positionCheckLoop = setInterval(() => this.syncDimensions(), a);
    }
    connectedCallback() {
      this.setPositionCheckLoop(), this.resizeObserver = new ResizeObserver(() => {
        this.syncDimensions();
      }), window.addEventListener("resize", this.boundForceSyncDimensions), window.addEventListener("scroll", this.boundSyncDimensions);
    }
    disconnectedCallback() {
      clearInterval(this.positionCheckLoop), this.resizeObserver?.disconnect(), window.removeEventListener("resize", this.boundForceSyncDimensions), window.removeEventListener("scroll", this.boundSyncDimensions), this.webviewId && (this.internalRpc.send.webviewTagRemove({ id: this.webviewId }), this.webviewId = void 0);
    }
    static get observedAttributes() {
      return ["src", "html", "preload", "class", "style"];
    }
    attributeChangedCallback(s, a, i) {
      s === "src" && a !== i ? this.updateIFrameSrc(i) : s === "html" && a !== i ? this.updateIFrameHtml(i) : s === "preload" && a !== i ? this.updateIFramePreload(i) : this.syncDimensions();
    }
    updateIFrameSrc(s) {
      if (!this.webviewId) {
        console.warn("updateIFrameSrc called on removed webview");
        return;
      }
      this.internalRpc.send.webviewTagUpdateSrc({
        id: this.webviewId,
        url: s
      });
    }
    updateIFrameHtml(s) {
      if (!this.webviewId) {
        console.warn("updateIFrameHtml called on removed webview");
        return;
      }
      this.internalRpc.send.webviewTagUpdateHtml({
        id: this.webviewId,
        html: s
      });
    }
    updateIFramePreload(s) {
      if (!this.webviewId) {
        console.warn("updateIFramePreload called on removed webview");
        return;
      }
      this.internalRpc.send.webviewTagUpdatePreload({
        id: this.webviewId,
        preload: s
      });
    }
    goBack() {
      if (!this.webviewId) {
        console.warn("goBack called on removed webview");
        return;
      }
      this.internalRpc.send.webviewTagGoBack({ id: this.webviewId });
    }
    goForward() {
      if (!this.webviewId) {
        console.warn("goForward called on removed webview");
        return;
      }
      this.internalRpc.send.webviewTagGoForward({ id: this.webviewId });
    }
    reload() {
      if (!this.webviewId) {
        console.warn("reload called on removed webview");
        return;
      }
      this.internalRpc.send.webviewTagReload({ id: this.webviewId });
    }
    loadURL(s) {
      if (!this.webviewId) {
        console.warn("loadURL called on removed webview");
        return;
      }
      this.setAttribute("src", s), this.internalRpc.send.webviewTagUpdateSrc({
        id: this.webviewId,
        url: s
      });
    }
    loadHTML(s) {
      if (!this.webviewId) {
        console.warn("loadHTML called on removed webview");
        return;
      }
      this.setAttribute("html", s), this.internalRpc.send.webviewTagUpdateHtml({
        id: this.webviewId,
        html: s
      });
    }
    // This sets the native webview hovering over the dom to be transparent
    toggleTransparent(s, a) {
      if (!this.webviewId) {
        console.warn("toggleTransparent called on removed webview");
        return;
      }
      let i;
      typeof s > "u" ? i = !this.transparent : i = !!s, a || (this.transparent = i), this.internalRpc.send.webviewTagSetTransparent({
        id: this.webviewId,
        transparent: i
      });
    }
    togglePassthrough(s, a) {
      if (!this.webviewId) {
        console.warn("togglePassthrough called on removed webview");
        return;
      }
      let i;
      typeof s > "u" ? i = !this.passthroughEnabled : i = !!s, a || (this.passthroughEnabled = i), this.internalRpc.send.webviewTagSetPassthrough({
        id: this.webviewId,
        enablePassthrough: this.passthroughEnabled || !!s
      });
    }
    toggleHidden(s, a) {
      if (!this.webviewId) {
        console.warn("toggleHidden called on removed webview");
        return;
      }
      let i;
      typeof s > "u" ? i = !this.hidden : i = !!s, a || (this.hidden = i), console.trace("electrobun toggle hidden: ", this.hidden, this.webviewId), this.internalRpc.send.webviewTagSetHidden({
        id: this.webviewId,
        hidden: this.hidden || !!s
      });
    }
  }
  customElements.define("electrobun-webview", n), Hi();
}, Hi = () => {
  var e = document.createElement("style");
  e.type = "text/css";
  var t = `
electrobun-webview {
    display: block;
    width: 800px;
    height: 300px;
    background: #fff;
    background-repeat: no-repeat!important;   
    overflow: hidden; 
}
`;
  e.appendChild(document.createTextNode(t));
  var r = document.getElementsByTagName("head")[0];
  r && (r.firstChild ? r.insertBefore(e, r.firstChild) : r.appendChild(e));
}, er = (e) => e.target?.classList.contains("electrobun-webkit-app-region-drag"), tr = window.__electrobunWebviewId, rr = window.__electrobunWindowId, Ki = window.__electrobunRpcSocketPort;
class nr {
  constructor(t) {
    this.isProcessingQueue = !1, this.sendToInternalQueue = [], this.rpc = t.rpc, this.init();
  }
  init() {
    this.initInternalRpc(), this.initSocketToBun(), Bi(!0, this.internalRpc, this.rpc), this.initElectrobunListeners(), window.__electrobun = {
      receiveMessageFromBun: this.receiveMessageFromBun.bind(this),
      receiveInternalMessageFromBun: this.receiveInternalMessageFromBun.bind(this)
    }, this.rpc && this.rpc.setTransport(this.createTransport());
  }
  initInternalRpc() {
    this.internalRpc = Yt({
      transport: this.createInternalTransport(),
      // requestHandler: {
      // },
      maxRequestTime: 1e3
    });
  }
  initSocketToBun() {
    const t = new WebSocket(
      `ws://localhost:${Ki}/socket?webviewId=${tr}`
    );
    this.bunSocket = t, t.addEventListener("open", () => {
    }), t.addEventListener("message", async (r) => {
      const n = r.data;
      if (typeof n == "string")
        try {
          const o = JSON.parse(n), s = await window.__electrobun_decrypt(
            o.encryptedData,
            o.iv,
            o.tag
          );
          this.rpcHandler?.(JSON.parse(s));
        } catch (o) {
          console.error("Error parsing bun message:", o);
        }
      else n instanceof Blob || console.error("UNKNOWN DATA TYPE RECEIVED:", r.data);
    }), t.addEventListener("error", (r) => {
      console.error("Socket error:", r);
    }), t.addEventListener("close", (r) => {
    });
  }
  // This will be attached to the global object, bun can rpc reply by executingJavascript
  // of that global reference to the function
  receiveInternalMessageFromBun(t) {
    this.internalRpcHandler && this.internalRpcHandler(t);
  }
  sendToBunInternal(t) {
    try {
      const r = JSON.stringify(t);
      this.sendToInternalQueue.push(r), this.processQueue();
    } catch (r) {
      console.error("failed to send to bun internal", r);
    }
  }
  processQueue() {
    const t = this;
    if (t.isProcessingQueue) {
      setTimeout(() => {
        t.processQueue();
      });
      return;
    }
    if (t.sendToInternalQueue.length === 0)
      return;
    t.isProcessingQueue = !0;
    const r = JSON.stringify(t.sendToInternalQueue);
    t.sendToInternalQueue = [], window.__electrobunInternalBridge?.postMessage(r), setTimeout(() => {
      t.isProcessingQueue = !1;
    }, 2);
  }
  initElectrobunListeners() {
    document.addEventListener("mousedown", (t) => {
      er(t) && this.internalRpc?.send.startWindowMove({ id: rr });
    }), document.addEventListener("mouseup", (t) => {
      er(t) && this.internalRpc?.send.stopWindowMove({ id: rr });
    });
  }
  createTransport() {
    const t = this;
    return {
      send(r) {
        try {
          const n = JSON.stringify(r);
          t.bunBridge(n);
        } catch (n) {
          console.error("bun: failed to serialize message to webview", n);
        }
      },
      registerHandler(r) {
        t.rpcHandler = r;
      }
    };
  }
  createInternalTransport() {
    const t = this;
    return {
      send(r) {
        r.hostWebviewId = tr, t.sendToBunInternal(r);
      },
      registerHandler(r) {
        t.internalRpcHandler = r;
      }
    };
  }
  async bunBridge(t) {
    if (this.bunSocket?.readyState === WebSocket.OPEN)
      try {
        const { encryptedData: r, iv: n, tag: o } = await window.__electrobun_encrypt(
          t
        ), a = JSON.stringify({
          encryptedData: r,
          iv: n,
          tag: o
        });
        this.bunSocket.send(a);
        return;
      } catch (r) {
        console.error("Error sending message to bun via socket:", r);
      }
    window.__electrobunBunBridge?.postMessage(t);
  }
  receiveMessageFromBun(t) {
    this.rpcHandler && this.rpcHandler(t);
  }
  // todo (yoav): This is mostly just the reverse of the one in BrowserView.ts on the bun side. Should DRY this up.
  static defineRPC(t) {
    const r = {
      requests: {
        evaluateJavascriptWithResponse: ({ script: a }) => new Promise((i) => {
          try {
            const c = new Function(a)();
            c instanceof Promise ? c.then((h) => {
              i(h);
            }).catch((h) => {
              console.error("bun: async script execution failed", h), i(String(h));
            }) : i(c);
          } catch (l) {
            console.error("bun: failed to eval script", l), i(String(l));
          }
        })
      }
    }, n = {
      maxRequestTime: t.maxRequestTime,
      requestHandler: {
        ...t.handlers.requests,
        ...r.requests
      },
      transport: {
        // Note: RPC Anywhere will throw if you try add a message listener if transport.registerHandler is falsey
        registerHandler: () => {
        }
      }
    }, o = Yt(n), s = t.handlers.messages;
    return s && o.addMessageListener(
      "*",
      (a, i) => {
        const l = s["*"];
        l && l(a, i);
        const c = s[a];
        c && c(i);
      }
    ), o;
  }
}
const Ui = (e) => {
  const t = nr.defineRPC({ handlers: e, maxRequestTime: 3e5 });
  return new nr({ rpc: t }), t;
};
qr(Ui);
