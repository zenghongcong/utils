# `canvas-ruler`

> TODO: description

## Usage

```
import Ruler from 'mobile-ruler'
const ruler = new Ruler({
        canvasId: "ruler",
        width: document.getElementById("ruler").offsetWidth, //画布宽
        height: 50, //画布高
        min: 0, //最小值
        max: 10000, //最大值
        scale: 100, //每个刻度代表值
        value: 0, //当前值
        unit: 10, //刻度距离
        lineColor: "#f00", //线颜色
        callback: function (val) {
          //刻度值改变时回调
          document.querySelector(".value").innerHTML = val;
        },
      });
```
