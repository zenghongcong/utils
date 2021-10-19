class Ruler {
  constructor(options = {}) {
    this.version = "1.0.0";
    this.canvas = null;
    this.options = {
      canvasId: "",
      value: 0, // 当前指向的值
      min: 0, // 最小值
      max: 10000, // 最大值
      scale: 10, // 每个刻度所代表实际的值
      unit: 10, // 两个刻度之间的间隔，默认值10(px)
      width: 0, // 画布宽度
      height: 0, // 画布高度
      fontFamily: "Courier New", // 刻度值字体
      fontColor: "#f00", // 刻度值字体颜色
      fontSize: 12, // 刻度值字体大小
      scaleWidth: 1, // 刻度线宽度
      scaleColor: "#f00", // 刻度线颜色
      background: "#fff", // 画布背景色，默认白色
      lineColor: "#000", // 中心线颜色，默认黑色
      ...options,
    };
    this.init();
  }
  init() {
    this.render();
    this.addEvent();
  }
  render() {
    const {
      canvasId,
      value,
      min,
      max,
      scale,
      unit,
      width,
      height,
      scaleWidth,
      scaleColor,
      background,
      lineColor,
    } = this.options;
    const canvas = document.querySelector(`#${canvasId}`);
    const ctx = canvas.getContext("2d");
    let curValue = value;
    let position = 0;

    canvas.width = width;
    canvas.height = height;
    this.canvas = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = scaleWidth;

    //绘制右侧刻度
    for (position = width / 2; curValue <= max; position += unit) {
      // 绘制一屏
      if (position >= width) break;
      this.drawScale({ ctx, position, curValue });
      curValue = curValue + scale;
    }

    //绘制左侧刻度
    curValue = value - scale;
    for (position = width / 2 - unit; curValue >= min; position -= unit) {
      // 绘制一屏
      if (position <= -width) break;
      this.drawScale({ ctx, position, curValue });
      curValue = curValue - scale;
    }

    //绘制中心线
    ctx.fillStyle = background;
    ctx.fillRect = (0, 0, width, height);
    ctx.lineWidth = scaleWidth;
    ctx.moveTo(Math.floor(width / 2), 0);
    ctx.lineTo(Math.floor(width / 2), height);
    ctx.strokeStyle = lineColor;
    ctx.stroke();
    ctx.closePath();

    //标尺底部线
    ctx.moveTo(0, height);
    ctx.lineTo(width, height);
    ctx.strokeStyle = scaleColor;
    ctx.stroke();
    ctx.closePath();
  }

  drawScale({ ctx, position, curValue }) {
    const {
      height,
      unit,
      scale,
      fontSize,
      fontColor,
      fontFamily,
      scaleColor,
    } = this.options;
    const lineHeight = Math.ceil((height * 3) / 4);
    const middleLineHeight = Math.ceil((height * 5) / 6);
    const normalLineHeight = Math.ceil((height * 8) / 9);
    ctx.beginPath();
    ctx.moveTo(position, lineHeight, middleLineHeight, normalLineHeight);
    ctx.fillStyle = fontColor;
    if (curValue % (scale * unit) == 0) {
      //第1或10格刻度
      ctx.moveTo(position, lineHeight);
      ctx.font = fontSize + "px " + fontFamily; //设置文本的字体大小和字体样式
      ctx.fillStyle = fontColor;
      ctx.fillText(
        curValue,
        position - ctx.measureText(`${curValue}`).width / 2,
        lineHeight - 4
      );
    } else if (curValue % ((scale * unit) / 2) === 0) {
      //第5格刻度
      ctx.moveTo(position, middleLineHeight);
    } else {
      //其他刻度
      ctx.moveTo(position, normalLineHeight);
    }
    ctx.lineTo(position, height);
    ctx.strokeStyle = scaleColor;
    ctx.stroke(); //实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径
    ctx.closePath(); //关闭当前的绘制路径
  }

  addEvent() {
    let touchstartX;
    const { unit, min, max, scale, callback } = this.options;
    const { canvas } = this;
    //添加手指触碰屏幕时的touchstart事件
    canvas.addEventListener(
      "touchstart",
      (e) => {
        e.stopPropagation();
        e.preventDefault();
        // 手指第一次触摸时x坐标
        touchstartX = e.touches[0].clientX;
      },
      false
    );
    //添加手指滑动屏幕时的touchmove事件
    canvas.addEventListener(
      "touchmove",
      (e) => {
        e.stopPropagation();
        e.preventDefault();
        // 当前手指所在x坐标
        const currentX = e.touches[0].clientX;
        if (Math.abs(currentX - touchstartX) > unit) {
          // 手指横向移动的距离
          const distance = currentX - touchstartX;
          let { value } = this.options;
          touchstartX = currentX;
          value -= Math.ceil(distance / unit) * scale;
          value = value < min ? min : value > max ? max : value;
          this.options.value = value;
          this.render();
          callback && callback(value);
        }
      },
      false
    );
  }
  reset(options = {}) {
    this.options = { ...this.options, ...options };
    this.init();
  }
}
