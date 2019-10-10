export const BlockType = {
  circle: "Circle",
};

export class Block {
  constructor({
    column,
    row,
    width,
    height,
    color,
    ctx,
    type,
  }) {
    switch(type) {
      case BlockType.circle: {
        this.x = column * width;
        this.y = row * width;
        break;
      }
      default:
        this.x = column * width;
        this.y = row * height;
    }

    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;

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

    switch(this.type) {
      case BlockType.circle: {
        this.drawCircle();
        break;
      }
      default:
        this.drawRectangle();
    }
  }

  drawCircle() {
    this.ctx.beginPath();
    this.ctx.arc(
      this.x + (this.width / 2),
      this.y + (this.width / 2),
      this.width / 2,
      0,
      2 * Math.PI,
    );
    this.ctx.fill();
    this.ctx.closePath();
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


