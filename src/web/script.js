const utils = {
  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },
  createObserver() {
    class Observer {
      constructor() {
        this.observers = []
      }


      subscribe(...f) {
        this.observers.push(...f)
      }

      unsubscribe(f) {
        this.observers = this.observers.filter(subscribe =>
          subscribe !== f
        )
      }

      notify(data) {
        this.observers.forEach(observer => observer(data))
      }
    }

    return new Observer()
  }
}

const game = {
  context: null,
  width: null,
  height: null,
  player: null,
  fruit: null,
  velocity: 160,
  moveObserver: utils.createObserver(),
  init(container, width, height, scoreId) {
    const canvas = document.getElementById(container)
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");
    this.context = ctx
    this.width = width;
    this.height = height;
  },
  create_player(color, x, y) {
    this.player = {
      pos: { x, y },
      tail: [],
      color: color === 'green' ? 'red' : color,
    }
  },
  create_fruit(x, y) {
    this.fruit = {
      pos: { x, y },
      color: 'green'
    }
  },
  create_events() {
    addEventListener('keyup', e => this.moveObserver.notify(e.code))
  },
  moves_functions() {
    this.moveObserver.subscribe(
      (move) => {
        if (move === 'ArrowUp' && this.player.direction !== 'ArrowDown') {
          this.player.direction = move
        }
      },
      (move) => {
        if (move === 'ArrowDown' && this.player.direction !== 'ArrowUp') {
          this.player.direction = move
        }
      },
      (move) => {
        if (move === 'ArrowLeft' && this.player.direction !== 'ArrowRight') {
          this.player.direction = move
        }
      },
      (move) => {
        if (move === 'ArrowRight' && this.player.direction !== 'ArrowLeft') {
          this.player.direction = move
        }
      },
    )
  },
  draw_player() {
    this.context.fillStyle = this.player.color
    this.context.fillRect(this.player.pos.x, this.player.pos.y, 1, 1)
    this.player.tail.forEach(element =>
      this.context.fillRect(element.x, element.y, 1, 1)
    )
  },
  draw_fruit() {
    this.context.fillStyle = this.fruit.color
    this.context.fillRect(this.fruit.pos.x, this.fruit.pos.y, 1, 1)
  },
  draw_game() {
    this.draw_fruit()
    this.draw_player()
  },
  move_player() {
    if (this.player.direction === 'ArrowUp') this.player.pos.y -= 1
    if (this.player.direction === 'ArrowDown') this.player.pos.y += 1
    if (this.player.direction === 'ArrowLeft') this.player.pos.x -= 1
    if (this.player.direction === 'ArrowRight') this.player.pos.x += 1
  },
  verify_border() {

    if (this.player.pos.x >= this.width) this.player.pos.x = 0
    if (this.player.pos.x < 0) this.player.pos.x = this.width
    if (this.player.pos.y >= this.height) this.player.pos.y = 0
    if (this.player.pos.y < 0) this.player.pos.y = this.height

  },
  verify_colision() {
    this.player.tail.forEach(element => {
      if (this.player.pos.x === element.x && this.player.pos.y === element.y) {
        this.restart_game()
      }
    })
  },
  add_in_tail() {
    if (!this.player.tail.length) {
      return this.player.tail.push({
        x: this.player.pos.x,
        y: this.player.pos.y
      })
    }
    return this.player.tail.push({
      x: this.player.tail[this.player.tail.length - 1].x,
      y: this.player.tail[this.player.tail.length - 1].y
    })
  },
  update_tail() {
    for (let i = this.player.tail.length - 1; i > 0; i--) {
      this.player.tail[i].x = this.player.tail[i - 1].x
      this.player.tail[i].y = this.player.tail[i - 1].y
    }
  },
  render() {
    this.context.clearRect(0, 0, this.width, this.height)
    if (this.player.tail.length) {
      this.update_tail()
      this.player.tail[0].x = this.player.pos.x
      this.player.tail[0].y = this.player.pos.y
    }
    this.move_player()
    this.verify_colision()
    if (this.player.pos.x === this.fruit.pos.x &&
      this.player.pos.y === this.fruit.pos.y
    ) {
      this.add_in_tail()
      document.getElementById('score').textContent =
        `Pontuação: ${this.player.tail.length}`
      this.create_fruit(
        utils.getRndInteger(1, this.width - 1),
        utils.getRndInteger(1, this.height - 1)
      )
      this.velocity = 0.96 * this.velocity
    }
    this.verify_border()
    this.draw_game()


    setTimeout(() => this.render(), this.velocity)
  },
  restart_game() {
    this.create_player(
      'purple', utils.getRndInteger(1, this.width),
      utils.getRndInteger(1, this.height)
    )
    this.create_fruit(
      utils.getRndInteger(1, this.width),
      utils.getRndInteger(1, this.height)
    )
    document.getElementById('score').textContent =
      `Pontuação: ${this.player.tail.length}`
    this.velocity = 160
  },
  start_game() {
    this.create_player(
      'purple', utils.getRndInteger(1, this.width),
      utils.getRndInteger(1, this.height)
    )
    this.create_fruit(
      utils.getRndInteger(1, this.width),
      utils.getRndInteger(1, this.height)
    )
    this.create_events()
    this.moves_functions()
    return setTimeout(() => this.render(), this.velocity)
  },
}



