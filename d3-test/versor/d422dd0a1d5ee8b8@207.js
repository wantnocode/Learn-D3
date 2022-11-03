// https://observablehq.com/@d3/versor-dragging@207
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["land-110m.json",new URL("./files/eec657afeffb70691657f56f78ce546cc20861c628c4272d902fb7ff94d07a73737fd5356d255cef2a092de8322c56bbbc4f0f6a3c0c12864101f37ec6da9321",import.meta.url)],["land-50m.json",new URL("./files/efcaaf9f0b260e09b6afeaee6dbc1b91ad45f3328561cd67eb16a1754096c1095f70d284acdc4b004910e89265b60eba2706334e0dc84ded38fd9209083d4cef",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Versor Dragging

See also Jason Davies’ [Rotate the World](https://www.jasondavies.com/maps/rotate/).`
)});
  main.variable(observer("viewof projectionName")).define("viewof projectionName", ["html"], function(html){return(
html`<select>
  <option value="geoOrthographic">Orthographic</option>
  <option value="geoMercator">Mercator</option>
  <option value="geoNaturalEarth1">Natural Earth</option>
</select>`
)});
  main.variable(observer("projectionName")).define("projectionName", ["Generators", "viewof projectionName"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["DOM","width","height","d3","projection","sphere","drag","land110","land50"], function(DOM,width,height,d3,projection,sphere,drag,land110,land50)
{
  const context = DOM.context2d(width, height);
  const path = d3.geoPath(projection, context);

  function render(land) {
    context.clearRect(0, 0, width, height);
    context.beginPath(), path(sphere), context.fillStyle = "#fff", context.fill();
    context.beginPath(), path(land), context.fillStyle = "#000", context.fill();
    context.beginPath(), path(sphere), context.stroke();
  }

  return d3.select(context.canvas)
    .call(drag(projection)
        .on("drag.render", () => render(land110))
        .on("end.render", () => render(land50)))
    .call(() => render(land50))
    .node();
}
);
  main.variable(observer("drag")).define("drag", ["d3","versor"], function(d3,versor){return(
function drag(projection) {
  let v0, q0, r0, a0, l;

  function pointer(event, that) {
    const t = d3.pointers(event, that);

    if (t.length !== l) {
      l = t.length;
      if (l > 1) a0 = Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]);
      dragstarted.apply(that, [event, that]);
    }

    // For multitouch, average positions and compute rotation.
    if (l > 1) {
      const x = d3.mean(t, p => p[0]);
      const y = d3.mean(t, p => p[1]);
      const a = Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]);
      return [x, y, a];
    }

    return t[0];
  }

  function dragstarted(event) {
    v0 = versor.cartesian(projection.invert(pointer(event, this)));
    q0 = versor(r0 = projection.rotate());
  }

  function dragged(event) {
    const p = pointer(event, this);
    const v1 = versor.cartesian(projection.rotate(r0).invert(p));
    const delta = versor.delta(v0, v1);
    let q1 = versor.multiply(q0, delta);

    // For multitouch, compose with a rotation around the axis.
    if (p[2]) {
      const d = (p[2] - a0) / 2;
      const s = -Math.sin(d);
      const c = Math.sign(Math.cos(d));
      q1 = versor.multiply([Math.sqrt(1 - s * s), 0, 0, c * s], q1);
    }

    projection.rotate(versor.rotation(q1));

    // In vicinity of the antipode (unstable) of q0, restart.
    if (delta[0] < 0.7) dragstarted.apply(this, [event, this]);
  }

  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged);
}
)});
  main.variable(observer("projection")).define("projection", ["d3","projectionName"], function(d3,projectionName){return(
d3[projectionName]().precision(0.1)
)});
  main.variable(observer("height")).define("height", ["d3","projection","width","sphere"], function(d3,projection,width,sphere)
{
  const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, sphere)).bounds(sphere);
  const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
  projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
  return dy;
}
);
  main.variable(observer("sphere")).define("sphere", function(){return(
{type: "Sphere"}
)});
  main.variable(observer("land50")).define("land50", ["FileAttachment","topojson"], function(FileAttachment,topojson){return(
FileAttachment("land-50m.json").json().then(world => topojson.feature(world, world.objects.land))
)});
  main.variable(observer("land110")).define("land110", ["FileAttachment","topojson"], function(FileAttachment,topojson){return(
FileAttachment("land-110m.json").json().then(world => topojson.feature(world, world.objects.land))
)});
  main.variable(observer("versor")).define("versor", ["require"], function(require){return(
require("versor@0.0.3")
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  main.variable(observer("note")).define("note", ["md"], function(md){return(
md`---
_Note:_ to understand the code it might be easier to start with this [earlier version](https://observablehq.com/d/569d101dd5bd332b) that did not have to account for multitouch.`
)});
  return main;
}
