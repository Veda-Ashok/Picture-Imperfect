;(this['webpackJsonpdrawing-react-canvas'] = this['webpackJsonpdrawing-react-canvas'] || []).push([
  [0],
  {
    168(e, t, n) {
      n.r(t)
      const a = n(2)
      const r = n(0)
      const o = n.n(r)
      const c = n(10)
      const i = n.n(c)
      const s = n(60)
      const l = n(11)
      const d = n(219)
      const u = n(220)
      const j = n(16)
      const h = n.n(j)
      const b = n(38)
      const m = n(14)
      const f = n(215)
      const O = n(216)
      const x = n(223)
      const p = n(221)
      const g = n(44)
      const v = n(210)
      const y = n(103)
      const w = n.n(y)
      const C = n(209)
      const k = n(217)
      const E = n(224)
      const N = n(203)
      const R = o.a.createContext()
      const S = Object(N.a)(function (e) {
        return {
          root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          },
          canvas: {
            height: '100px',
            width: '100px',
            borderRadius: '100px',
            border: '3px solid',
            borderColor: 'black',
          },
          text: { marginBottom: e.spacing(1) },
        }
      })
      function T(e) {
        const t = e.setIcon
        const n = S()
        const o = Object(r.useRef)(null)
        return (
          Object(r.useEffect)(function () {
            const e = o.current
            const n = e.getContext('2d')
            const a = { color: 'black' }
            let r = !1
            const c = function (a, r, o, c) {
              const i = e.getBoundingClientRect()
              let s = a
              let l = o
              let d = r
              let u = c
              ;(s -= i.left),
                (l -= i.left),
                (d -= i.top),
                (u -= i.top),
                (s /= i.width),
                (l /= i.width),
                (d /= i.height),
                (u /= i.height),
                (s *= e.width),
                (l *= e.width),
                (d *= e.height),
                (u *= e.height),
                n.beginPath(),
                n.moveTo(s, d),
                n.lineTo(l, u),
                (n.lineWidth = 30),
                n.stroke(),
                n.closePath()
              const j = e.toDataURL('image/png')
              t(j)
            }
            const i = function (e) {
              ;(r = !0),
                (a.x = e.clientX || e.touches[0].clientX),
                (a.y = e.clientY || e.touches[0].clientY)
            }
            const s = function (e) {
              console.log('on mouse move'),
                r &&
                  (c(
                    a.x,
                    a.y,
                    e.clientX || e.touches[0].clientX,
                    e.clientY || e.touches[0].clientY,
                  ),
                  (a.x = e.clientX || e.touches[0].clientX),
                  (a.y = e.clientY || e.touches[0].clientY))
            }
            const l = function (e) {
              console.log('on mouse up'),
                r &&
                  ((r = !1),
                  c(
                    a.x,
                    a.y,
                    e.clientX || e.changedTouches[0].clientX,
                    e.clientY || e.changedTouches[0].clientY,
                  ))
            }
            const d = function (e, t) {
              let n = new Date().getTime()
              return function () {
                const a = new Date().getTime()
                a - n >= t && ((n = a), e.apply(null, arguments))
              }
            }
            e.addEventListener('mousedown', i, !1),
              e.addEventListener('mouseup', l, !1),
              e.addEventListener('mouseout', l, !1),
              e.addEventListener('mousemove', d(s, 10), !1),
              e.addEventListener('touchstart', i, !1),
              e.addEventListener('touchend', l, !1),
              e.addEventListener('touchcancel', l, !1),
              e.addEventListener('touchmove', d(s, 10), !1)
            const u = function () {
              ;(e.width = window.innerWidth),
                (e.height = window.innerHeight),
                (e.style.width = '100%'),
                (e.style.height = '100%')
            }
            window.addEventListener('resize', u, !1), u()
          }, []),
          Object(a.jsxs)('div', {
            className: n.root,
            children: [
              Object(a.jsx)(g.a, { className: n.text, children: 'Please draw your icon : )' }),
              Object(a.jsx)('div', {
                className: n.canvas,
                children: Object(a.jsx)('canvas', { ref: o, 'aria-label': 'canvas' }),
              }),
            ],
          })
        )
      }
      const D = n(108)
      const I = n.n(D)
      const L = n(211)
      const F = n(207)
      const W = n(109)
      const P = n.n(W)
      const U = n(212)
      const Y = n(213)
      const M = n(214)
      const _ = Object(N.a)(function (e) {
        return {
          rules: { position: 'absolute', top: 10, right: 10 },
          closeButton: {
            position: 'absolute',
            right: e.spacing(1),
            top: e.spacing(1),
            color: 'black',
          },
          helpButton: { color: 'black' },
          dialog: {
            margin: e.spacing(1),
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          },
        }
      })
      function B() {
        const e = _()
        const t = Object(r.useState)(!1)
        const n = Object(m.a)(t, 2)
        const o = n[0]
        const c = n[1]
        const i = function () {
          c(!1)
        }
        const s = Object(r.useRef)(null)
        return (
          Object(r.useEffect)(
            function () {
              if (o) {
                const e = s.current
                e !== null && e.focus()
              }
            },
            [o],
          ),
          Object(a.jsxs)('div', {
            children: [
              Object(a.jsx)(F.a, {
                'aria-label': 'rules',
                className: e.rules,
                onClick() {
                  c(!0)
                },
                children: Object(a.jsx)(I.a, { className: e.helpButton, fontSize: 'large' }),
              }),
              Object(a.jsxs)(E.a, {
                open: o,
                onClose: i,
                scroll: 'paper',
                'aria-labelledby': 'scroll-dialog-title',
                'aria-describedby': 'scroll-dialog-description',
                children: [
                  Object(a.jsxs)(C.a, {
                    id: 'scroll-dialog-title',
                    children: [
                      'Rules',
                      o
                        ? Object(a.jsx)(F.a, {
                            'aria-label': 'close',
                            className: e.closeButton,
                            onClick: i,
                            children: Object(a.jsx)(P.a, {}),
                          })
                        : null,
                    ],
                  }),
                  Object(a.jsx)(v.a, {
                    dividers: !0,
                    children: Object(a.jsx)(L.a, {
                      id: 'scroll-dialog-description',
                      ref: s,
                      tabIndex: -1,
                      children: Object(a.jsxs)(U.a, {
                        'aria-label': 'rule-list',
                        children: [
                          Object(a.jsx)(Y.a, {
                            children: Object(a.jsx)(M.a, {
                              primary:
                                '1. At the beginning of each round, the players are split into two teams and one judge. In\r the case of a game having an even number of players, there will be two judges.',
                            }),
                          }),
                          Object(a.jsx)(Y.a, {
                            children: Object(a.jsx)(M.a, {
                              primary:
                                '2. For games with 5 people and less, each draw-er in a round is given a number. For games with\r more than 5 people, members of each team are given numbers both beginning at 1. ',
                            }),
                          }),
                          Object(a.jsx)(Y.a, {
                            children: Object(a.jsx)(M.a, {
                              primary:
                                '3. Each team will receive a word that is different from the other team\u2019s word. The judge(s) do not\r know the words.',
                            }),
                          }),
                          Object(a.jsx)(Y.a, {
                            children: Object(a.jsx)(M.a, {
                              primary:
                                '4. When the timer begins, both teams have 60 seconds to draw a picture of\r their word on a canvas that the other team shares. Members in the game draw when their\r number is called. ',
                            }),
                          }),
                          Object(a.jsx)(Y.a, {
                            children: Object(a.jsx)(M.a, {
                              primary:
                                ' 5. The judges have infinite guesses and can keep guessing within the\r time limit until they get it right. ',
                            }),
                          }),
                          Object(a.jsx)(Y.a, {
                            children: Object(a.jsx)(M.a, {
                              primary:
                                ' 6.If a judge guesses a team\u2019s word, the members of the\r team that had the word and the judge who guessed the word all receive a point.',
                            }),
                          }),
                          Object(a.jsx)(Y.a, {
                            children: Object(a.jsx)(M.a, {
                              primary:
                                '7.Each round the teams change as the judges are rotated in to be players',
                            }),
                          }),
                          Object(a.jsx)(Y.a, {
                            children: Object(a.jsx)(M.a, {
                              primary:
                                '8.The first player to reach the number of points that is chosen at the beginning of the game first wins the game.',
                            }),
                          }),
                        ],
                      }),
                    }),
                  }),
                ],
              }),
            ],
          })
        )
      }
      const X = Object(N.a)(function (e) {
        return {
          body: {
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100vh',
          },
          dialog: {
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          },
          img: { maxWidth: '192px' },
          buttons: { margin: e.spacing(5) },
          button: { margin: e.spacing(2) },
          textfields: { margin: e.spacing(2) },
        }
      })
      function A() {
        const e = X()
        const t = Object(r.useContext)(R)
        const n = Object(l.f)()
        const o = Object(r.useState)(void 0)
        const c = Object(m.a)(o, 2)
        const i = c[0]
        const s = c[1]
        const d = Object(r.useState)(void 0)
        const u = Object(m.a)(d, 2)
        const j = u[0]
        const y = u[1]
        const N = Object(r.useState)(void 0)
        const S = Object(m.a)(N, 2)
        const D = S[0]
        const I = S[1]
        const L = Object(r.useState)('')
        const F = Object(m.a)(L, 2)
        const W = F[0]
        const P = F[1]
        const U = Object(r.useState)(!1)
        const Y = Object(m.a)(U, 2)
        const M = Y[0]
        const _ = Y[1]
        const A = Object(r.useState)(!1)
        const G = Object(m.a)(A, 2)
        const H = G[0]
        const z = G[1]
        const J = Object(r.useState)(!1)
        const K = Object(m.a)(J, 2)
        const $ = K[0]
        const V = K[1]
        const q = Object(r.useState)(!1)
        const Q = Object(m.a)(q, 2)
        const Z = Q[0]
        const ee = Q[1]
        const te = Object(r.useState)('')
        const ne = Object(m.a)(te, 2)
        const ae = ne[0]
        const re = ne[1]
        Object(r.useEffect)(function () {
          t.roomCode &&
            (t.socket.emit('disconnect'), t.addRoomCode(void 0, t), t.addSocket(void 0, t))
        }, [])
        const oe = function (e) {
          y(e.target.value)
        }
        const ce = function () {
          ee(!0)
        }
        const ie = (function () {
          const e = Object(b.a)(
            h.a.mark(function e(a) {
              let r
              let o
              let c
              let s
              let l
              return h.a.wrap(
                function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if (
                          (a.preventDefault(), !(void 0 === i || i.length < 1) || D !== 'joinRoom')
                        ) {
                          e.next = 6
                          break
                        }
                        P('Please input a room code!'), ce(), (e.next = 24)
                        break
                      case 6:
                        if (!(void 0 === j || j.length < 1)) {
                          e.next = 11
                          break
                        }
                        P('Please enter a username!'), ce(), (e.next = 24)
                        break
                      case 11:
                        return (
                          (e.prev = 11),
                          (s = !1),
                          (l = !1),
                          t.socket
                            ? (o = t.socket)
                            : ((o = w.a.connect(
                                'ws://localhost:'.concat(
                                  Object({
                                    NODE_ENV: 'production',
                                    PUBLIC_URL: '',
                                    WDS_SOCKET_HOST: void 0,
                                    WDS_SOCKET_PATH: void 0,
                                    WDS_SOCKET_PORT: void 0,
                                    FAST_REFRESH: !0,
                                  }).PORT || 8080,
                                ),
                              )),
                              console.log('HEREEEEE'),
                              t.addSocket(o, t)),
                          D === 'createRoom'
                            ? o.emit(D, { username: j, customWords: M, icon: ae })
                            : D === 'joinRoom' &&
                              o.emit('joinRoom', { username: j, room: i, icon: ae }),
                          (e.next = 18),
                          new Promise(function (e) {
                            o.once(
                              'invalidRoomCode',
                              (function () {
                                const t = Object(b.a)(
                                  h.a.mark(function t(n) {
                                    return h.a.wrap(function (t) {
                                      for (;;)
                                        switch ((t.prev = t.next)) {
                                          case 0:
                                            ;(l = !0), P(n), ce(), e(n)
                                          case 4:
                                          case 'end':
                                            return t.stop()
                                        }
                                    }, t)
                                  }),
                                )
                                return function (e) {
                                  return t.apply(this, arguments)
                                }
                              })(),
                            ),
                              o.once(
                                'invalidUsername',
                                (function () {
                                  const t = Object(b.a)(
                                    h.a.mark(function t(n) {
                                      return h.a.wrap(function (t) {
                                        for (;;)
                                          switch ((t.prev = t.next)) {
                                            case 0:
                                              ;(s = !0), P(n), ce(), e(n)
                                            case 4:
                                            case 'end':
                                              return t.stop()
                                          }
                                      }, t)
                                    }),
                                  )
                                  return function (e) {
                                    return t.apply(this, arguments)
                                  }
                                })(),
                              ),
                              o.once(
                                'roomUsers',
                                (function () {
                                  const t = Object(b.a)(
                                    h.a.mark(function t(n) {
                                      return h.a.wrap(function (t) {
                                        for (;;)
                                          switch ((t.prev = t.next)) {
                                            case 0:
                                              ;(r = n.room), (c = n.users), e(n)
                                            case 3:
                                            case 'end':
                                              return t.stop()
                                          }
                                      }, t)
                                    }),
                                  )
                                  return function (e) {
                                    return t.apply(this, arguments)
                                  }
                                })(),
                              )
                          })
                        )
                      case 18:
                        s ||
                          l ||
                          (t.updateMyInfo({ username: j, icon: ae }, t),
                          t.updateUsers(c, t),
                          t.addRoomCode(r, t),
                          n.push('/lobby')),
                          (e.next = 24)
                        break
                      case 21:
                        ;(e.prev = 21), (e.t0 = e.catch(11)), console.error(e.t0)
                      case 24:
                      case 'end':
                        return e.stop()
                    }
                },
                e,
                null,
                [[11, 21]],
              )
            }),
          )
          return function (t) {
            return e.apply(this, arguments)
          }
        })()
        return Object(a.jsxs)('div', {
          className: e.body,
          children: [
            Object(a.jsx)(B, {}),
            Object(a.jsx)(g.a, { variant: 'h1', children: 'Picture' }),
            Object(a.jsx)('img', { className: e.img, src: '/logo192.png', alt: 'logo' }),
            Object(a.jsx)(g.a, { variant: 'h1', children: 'Imperfect' }),
            Object(a.jsxs)('span', {
              className: e.buttons,
              children: [
                Object(a.jsx)(f.a, {
                  className: e.button,
                  variant: 'contained',
                  color: 'secondary',
                  size: 'large',
                  onClick() {
                    I('createRoom'), z(!0)
                  },
                  children: 'Create Game',
                }),
                Object(a.jsx)(f.a, {
                  className: e.button,
                  variant: 'contained',
                  color: 'secondary',
                  size: 'large',
                  onClick() {
                    I('joinRoom'), V(!0)
                  },
                  children: 'Join Game',
                }),
              ],
            }),
            Object(a.jsx)(E.a, {
              onClose() {
                ee(!1)
              },
              'aria-labelledby': 'error',
              open: Z,
              className: e.dialog,
              children: Object(a.jsx)(C.a, { children: W }),
            }),
            Object(a.jsx)(E.a, {
              onClose() {
                I(''), z(!1)
              },
              'aria-labelledby': 'create-game',
              open: H,
              children: Object(a.jsxs)('form', {
                onSubmit: ie,
                children: [
                  Object(a.jsx)(C.a, { id: 'create-game-title', children: 'Create Game' }),
                  Object(a.jsxs)(v.a, {
                    dividers: !0,
                    className: e.dialog,
                    children: [
                      Object(a.jsx)('div', {
                        className: e.textfields,
                        children: Object(a.jsx)(T, { setIcon: re }),
                      }),
                      Object(a.jsx)(p.a, {
                        label: 'Enter username',
                        variant: 'outlined',
                        onChange(e) {
                          return oe(e)
                        },
                        className: e.textfields,
                      }),
                      Object(a.jsx)(O.a, {
                        control: Object(a.jsx)(x.a, {
                          checked: M,
                          onChange(e) {
                            _(e.target.checked)
                          },
                          color: 'primary',
                          name: 'custom-words-checkbox',
                        }),
                        label: 'Add your own custom words?',
                      }),
                    ],
                  }),
                  Object(a.jsx)(k.a, {
                    children: Object(a.jsx)(f.a, {
                      variant: 'contained',
                      color: 'primary',
                      type: 'submit',
                      children: 'Create Game',
                    }),
                  }),
                ],
              }),
            }),
            Object(a.jsx)(E.a, {
              onClose() {
                I(''), V(!1)
              },
              'aria-labelledby': 'join-game',
              open: $,
              children: Object(a.jsxs)('form', {
                onSubmit: ie,
                children: [
                  Object(a.jsx)(C.a, { id: 'create-game-title', children: 'Join Game' }),
                  Object(a.jsxs)(v.a, {
                    dividers: !0,
                    className: e.dialog,
                    children: [
                      Object(a.jsx)('div', {
                        className: e.textfields,
                        children: Object(a.jsx)(T, { setIcon: re }),
                      }),
                      Object(a.jsx)(p.a, {
                        label: 'Enter room code',
                        variant: 'outlined',
                        className: e.textfields,
                        onChange(e) {
                          return (function (e) {
                            s(e.target.value)
                          })(e)
                        },
                      }),
                      Object(a.jsx)(p.a, {
                        label: 'Enter nickname',
                        variant: 'outlined',
                        className: e.textfields,
                        onChange(e) {
                          return oe(e)
                        },
                      }),
                    ],
                  }),
                  Object(a.jsx)(k.a, {
                    children: Object(a.jsx)(f.a, {
                      variant: 'contained',
                      color: 'primary',
                      type: 'submit',
                      children: 'Join Game',
                    }),
                  }),
                ],
              }),
            }),
          ],
        })
      }
      const G = n(225)
      const H = Object(N.a)(function (e) {
        return {
          avatars: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: e.spacing(5),
          },
          format: {
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            height: '100%',
          },
        }
      })
      function z() {
        const e = H()
        const t = Object(r.useContext)(R)
        const n = t.socket
        const o = function (e) {
          const n = e.users
          t.updateUsers(n, t)
        }
        return (
          Object(r.useEffect)(
            function () {
              return (
                n.on('roomUsers', o),
                function () {
                  n.off('roomUsers', o)
                }
              )
            },
            [n, o],
          ),
          Object(a.jsx)('div', {
            className: e.format,
            children: Object.values(t.users).map(function (t) {
              return Object(a.jsxs)('div', {
                className: e.avatars,
                children: [
                  Object(a.jsx)(G.a, { src: t.icon ? t.icon : '/logo192.png', alt: t.username }),
                  Object(a.jsx)(g.a, { variant: 'subtitle1', children: t.username }),
                  Object(a.jsx)(g.a, {
                    variant: 'subtitle1',
                    children: t.ready ? 'LET ME INNNNNNNNNN' : 'HOLD THE F*CKING PHONE!!',
                  }),
                ],
              })
            }),
          })
        )
      }
      const J = Object(N.a)(function (e) {
        return {
          margin: { margin: e.spacing(2), textAlign: 'center' },
          textfields: { margin: e.spacing(2), background: '#B2DAFF', borderRadius: '5px' },
          textContent: {
            float: 'left',
            width: '30%',
            background: 'white',
            height: '100vh',
            overflow: 'auto',
            display: 'flex',
            flexFlow: 'column nowrap',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          },
          roomCode: {
            position: 'absolute',
            top: 0,
            left: 0,
            background: '#B2DAFF',
            border: '3px solid black',
            borderRadius: '5px',
            margin: e.spacing(2),
            padding: e.spacing(1),
          },
          users: {
            float: 'right',
            width: '70%',
            height: '80vh',
            overflow: 'auto',
            marginTop: e.spacing(15),
          },
        }
      })
      function K() {
        const e = J()
        const t = Object(l.f)()
        const n = Object(r.useContext)(R)
        const o = Object(r.useState)(!1)
        const c = Object(m.a)(o, 2)
        const i = c[0]
        const s = c[1]
        const d = Object(r.useState)('')
        const u = Object(m.a)(d, 2)
        const j = u[0]
        const O = u[1]
        const x = function (e) {
          Object.keys(e.users).length < 3 ? O('You need at least 3 players to start!') : O('')
        }
        Object(r.useEffect)(function () {
          return (
            (n.roomCode && n.socket) || t.push('/'),
            n.socket.once('everyoneReady', function () {
              console.log('starting game'), t.push('/game')
            }),
            n.socket.on('roomUsers', x),
            function () {
              n.socket.off('roomUsers', x)
            }
          )
        }, [])
        const v = (function () {
          const e = Object(b.a)(
            h.a.mark(function e(t) {
              return h.a.wrap(
                function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          t.preventDefault(),
                          (e.prev = 1),
                          console.log('socket id', n.socket.id),
                          i
                            ? n.socket.emit('notReady', n.socket.id)
                            : n.socket.emit('ready', n.socket.id),
                          (e.next = 6),
                          new Promise(function (e) {
                            n.socket.once(
                              'roomUsers',
                              (function () {
                                const t = Object(b.a)(
                                  h.a.mark(function t(n) {
                                    return h.a.wrap(function (t) {
                                      for (;;)
                                        switch ((t.prev = t.next)) {
                                          case 0:
                                            e(n)
                                          case 1:
                                          case 'end':
                                            return t.stop()
                                        }
                                    }, t)
                                  }),
                                )
                                return function (e) {
                                  return t.apply(this, arguments)
                                }
                              })(),
                            )
                          })
                        )
                      case 6:
                        s(!i), (e.next = 12)
                        break
                      case 9:
                        ;(e.prev = 9), (e.t0 = e.catch(1)), console.error(e.t0)
                      case 12:
                      case 'end':
                        return e.stop()
                    }
                },
                e,
                null,
                [[1, 9]],
              )
            }),
          )
          return function (t) {
            return e.apply(this, arguments)
          }
        })()
        return Object(a.jsxs)('div', {
          className: e.root,
          children: [
            Object(a.jsx)(B, {}),
            Object(a.jsxs)('div', {
              className: e.textContent,
              children: [
                Object(a.jsx)(g.a, { children: j }),
                Object(a.jsxs)(g.a, {
                  variant: 'h4',
                  className: e.roomCode,
                  children: ['Roomcode:', '  ', n.roomCode],
                }),
                n.customWords &&
                  Object(a.jsx)(p.a, {
                    label: 'Enter custom words',
                    variant: 'outlined',
                    onChange() {
                      return alert('add Custom Words')
                    },
                    className: e.textfields,
                  }),
                Object(a.jsx)(g.a, {
                  variant: 'h5',
                  className: e.margin,
                  children: 'Game starts when everyone is ready',
                }),
                Object(a.jsx)(f.a, {
                  className: e.margin,
                  variant: 'contained',
                  color: 'primary',
                  size: 'large',
                  onClick: v,
                  children: i ? "I'm no longer ready :(" : "I'm ready",
                }),
                Object(a.jsxs)(g.a, {
                  variant: 'h6',
                  className: e.margin,
                  children: [Object.values(n.users).length, '    ', 'Players'],
                }),
              ],
            }),
            Object(a.jsx)('div', {
              className: e.users,
              children: n.socket && Object(a.jsx)(z, {}),
            }),
          ],
        })
      }
      const $ = function () {
        const e = Object(r.useContext)(R)
        const t = Object(r.useRef)(null)
        const n = Object(r.useRef)()
        return (
          Object(r.useEffect)(function () {
            const a = t.current
            const r = a.getContext('2d')
            const o = { color: 'black' }
            let c = !1
            const i = function (e, t, o, c, i) {
              if (
                (r.beginPath(),
                r.moveTo(e, t),
                r.lineTo(o, c),
                (r.lineWidth = 3),
                r.stroke(),
                r.closePath(),
                i)
              ) {
                const s = a.width
                const l = a.height
                n.current.emit('drawing', { x0: e / s, y0: t / l, x1: o / s, y1: c / l })
              }
            }
            const s = function (e) {
              ;(c = !0),
                (o.x = e.clientX || e.touches[0].clientX),
                (o.y = e.clientY || e.touches[0].clientY)
            }
            const l = function (e) {
              c &&
                (i(
                  o.x,
                  o.y,
                  e.clientX || e.touches[0].clientX,
                  e.clientY || e.touches[0].clientY,
                  !0,
                ),
                (o.x = e.clientX || e.touches[0].clientX),
                (o.y = e.clientY || e.touches[0].clientY))
            }
            const d = function (e) {
              c &&
                ((c = !1),
                i(
                  o.x,
                  o.y,
                  e.clientX || e.changedTouches[0].clientX,
                  e.clientY || e.changedTouches[0].clientY,
                  !0,
                ))
            }
            const u = function (e, t) {
              let n = new Date().getTime()
              return function () {
                const a = new Date().getTime()
                a - n >= t && ((n = a), e.apply(null, arguments))
              }
            }
            a.addEventListener('mousedown', s, !1),
              a.addEventListener('mouseup', d, !1),
              a.addEventListener('mouseout', d, !1),
              a.addEventListener('mousemove', u(l, 10), !1),
              a.addEventListener('touchstart', s, !1),
              a.addEventListener('touchend', d, !1),
              a.addEventListener('touchcancel', d, !1),
              a.addEventListener('touchmove', u(l, 10), !1)
            const j = function () {
              ;(a.width = window.innerWidth), (a.height = window.innerHeight)
            }
            window.addEventListener('resize', j, !1), j()
            ;(n.current = e.socket),
              n.current.on('drawing', function (e) {
                const t = a.width
                const n = a.height
                i(e.x0 * t, e.y0 * n, e.x1 * t, e.y1 * n, e.color)
              })
          }, []),
          Object(a.jsx)('div', {
            children: Object(a.jsx)('canvas', { ref: t, 'aria-label': 'canvas' }),
          })
        )
      }
      const V = n(110)
      const q = n(218)
      const Q = n(69)
      const Z = Object(V.a)({
        palette: {
          primary: { main: q.a[200] },
          secondary: { main: '#FFFFFF' },
          error: { main: '#BF211E' },
        },
        text: { primary: '#000' },
        typography: {
          fontFamily: ['Raleway', 'sans-serif'].join(','),
          h1: { fontFamily: ['Ribeye', 'cursive'].join(',') },
          subtitle1: { fontWeight: 500 },
        },
      })
      ;(Z.props = { MuiButton: { disableElevation: !0 } }),
        (Z.overrides = {
          MuiButton: {
            root: { textTransform: 'none', border: '3px solid', borderColor: '#000' },
            containedPrimary: { '&:hover': { backgroundColor: q.a[400] } },
            containedSecondary: { '&:hover': { backgroundColor: Q.a[200] } },
          },
          MuiCssBaseline: { '@global': { body: { backgroundColor: '#B2DAFF' } } },
          MuiDialog: {
            paper: { borderWidth: 3, borderRadius: 3, borderColor: '#000', borderStyle: 'solid' },
          },
          MuiDialogContent: {
            dividers: { borderTop: '3px solid', borderBottom: '3px solid', borderColor: '#000' },
          },
          MuiOutlinedInput: {
            root: {
              '& $notchedOutline': { borderColor: '#000' },
              '&:hover $notchedOutline': { border: '3px solid', borderColor: '#000' },
              '&$focused $notchedOutline': { borderColor: '#000' },
            },
          },
          MuiInputLabel: { root: { color: 'black', '&$focused': { color: '#000' } } },
          MuiCheckbox: { root: { color: 'black' } },
          MuiAvatar: {
            root: { width: '80px', height: '80px', border: '3px solid black', background: 'white' },
          },
        })
      const ee = Z
      const te = n(24)
      const ne = 'ADD_SOCKET'
      const ae = 'ADD_ROOM_CODE'
      const re = 'UPDATE_USERS'
      const oe = 'UPDATE_MY_INFO'
      const ce = 'UPDATE_CUSTOM_WORDS'
      const ie = function (e, t) {
        switch (t.type) {
          case ne:
            return (function (e, t) {
              return Object(te.a)(Object(te.a)({}, t), {}, { socket: e })
            })(t.socket, e)
          case ae:
            return (function (e, t) {
              return Object(te.a)(Object(te.a)({}, t), {}, { roomCode: e })
            })(t.roomCode, e)
          case re:
            return (function (e, t) {
              return Object(te.a)(Object(te.a)({}, t), {}, { users: e })
            })(t.users, e)
          case oe:
            return (function (e, t) {
              return Object(te.a)(Object(te.a)({}, t), {}, { myInfo: e })
            })(t.myInfo, e)
          case ce:
            return (function (e, t) {
              return Object(te.a)(Object(te.a)({}, t), {}, { customWords: e })
            })(t.customWords, e)
          default:
            return e
        }
      }
      const se = function (e) {
        const t = e.children
        const n = Object(r.useReducer)(ie, {
          socket: void 0,
          roomCode: void 0,
          users: {},
          customWords: !0,
          myInfo: {},
        })
        const o = Object(m.a)(n, 2)
        const c = o[0]
        const i = o[1]
        return Object(a.jsx)(R.Provider, {
          value: {
            socket: c.socket,
            addSocket(e) {
              i({ type: ne, socket: e })
            },
            roomCode: c.roomCode,
            addRoomCode(e) {
              i({ type: ae, roomCode: e })
            },
            users: c.users,
            updateUsers(e) {
              i({ type: re, users: e })
            },
            customWords: c.customWords,
            updateCustomWords(e) {
              i({ type: ce, customWords: e })
            },
            myInfo: c.myInfo,
            updateMyInfo(e) {
              i({ type: oe, myInfo: e })
            },
          },
          children: t,
        })
      }
      function le() {
        return Object(a.jsx)(se, {
          children: Object(a.jsxs)(d.a, {
            theme: ee,
            children: [
              Object(a.jsx)(u.a, {}),
              Object(a.jsx)(s.a, {
                children: Object(a.jsxs)(l.c, {
                  children: [
                    Object(a.jsx)(l.a, {
                      exact: !0,
                      path: '/gameOver',
                      children: Object(a.jsx)('h1', { children: 'GameOver' }),
                    }),
                    Object(a.jsx)(l.a, {
                      exact: !0,
                      path: '/lobby',
                      children: Object(a.jsx)(K, {}),
                    }),
                    Object(a.jsx)(l.a, {
                      exact: !0,
                      path: '/create',
                      children: Object(a.jsx)('h1', { children: 'Create Game' }),
                    }),
                    Object(a.jsx)(l.a, {
                      exact: !0,
                      path: '/join',
                      children: Object(a.jsx)('h1', { children: 'Join Game' }),
                    }),
                    Object(a.jsx)(l.a, {
                      exact: !0,
                      path: '/game',
                      children: Object(a.jsx)($, {}),
                    }),
                    Object(a.jsx)(l.a, { exact: !0, path: '/', children: Object(a.jsx)(A, {}) }),
                  ],
                }),
              }),
            ],
          }),
        })
      }
      i.a.render(
        Object(a.jsx)(o.a.StrictMode, { children: Object(a.jsx)(le, {}) }),
        document.getElementById('root'),
      )
    },
  },
  [[168, 1, 2]],
])
// # sourceMappingURL=main.44dc77c4.chunk.js.map
