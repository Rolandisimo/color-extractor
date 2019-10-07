export class Block {
  constructor({
    x,
    y,
    width,
    height,
    color,
    ctx,
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.originalWidth = width;
    this.originalHeight = height;
    this.originalColor = color;
    this.color = color;
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
    // this.ctx.clearArc(
    //   this.x,
    //   this.y,
    //   (this.height + this.width) / 2,
    //   0,
    //   2 * Math.PI,
    // );

    // this.ctx.globalCompositeOperation = 'destination-out'

    this.ctx.clearRect(
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }
}


