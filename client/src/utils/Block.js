export class Block {
  constructor({
    column,
    row,
    width,
    height,
    color,
    ctx,
  }) {
    this.x = column * width;
    this.y = row * height;
    this.width = width;
    this.height = height;
    this.color = color;

    this.originalColor = color;
    this.ctx = ctx;
    this.isHovered = false;
  }

  onMouseEnter() {
    if (this.isHovered) {
      return
    }

    this.clearBlock();

    this.color = "red";
    this.update();
    this.draw();

    this.isHovered = true;
  }

  onMouseExit() {
    this.color = this.originalColor;

    this.update();
    this.draw();

    this.isHovered = false;
  }

  update() {
    this.ctx.fillStyle = this.color;
  }

  draw() {
    this.clearBlock();
    this.drawRectangle();
  }

  drawRectangle() {
    this.ctx.fillRect(
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }

  clearBlock() {
    this.ctx.clearRect(
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }
}


