// Imports
import { d3, mksvg, mkconfig, mkcolor, options, type d3arg, type d3data } from "./_graph.ts"
import { pick } from "@std/collections"

/**
 * Renders a pie chart.
 *
 * ```ts
 * pie({
 *   A: { data: 0.6 },
 *   B: { data: 0.2 },
 *   C: { data: 0.1 },
 * }, { legend: true })
 * ```ts
 */
export function pie(datalist: Record<PropertyKey, { color?: string; data: number }>, options: Pick<options, "width" | "height" | "legend"> = {}): string {
  // Create SVG
  const config = mkconfig(pick(options, ["width", "height"]))
  const { margin, width, height } = config
  const radius = Math.min(width, height) / 2
  const svg = mksvg({ width, height })

  // Prepare data
  const K = Object.keys(datalist)
  const V = Object.values(datalist)
  const I = d3.range(K.length).filter((i: number) => !Number.isNaN(V[i].data))
  const D = d3.pie().padAngle(1 / radius).sort(null).value((i: number) => V[+i].data)(I)
  const labels = d3.arc().innerRadius(radius / 2).outerRadius(radius / 2)

  // Render graph areas
  svg.append("g")
    .attr("transform", `translate(${(width - (options.legend ? config.legend.width : 0)) / 2},${height / 2})`)
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .selectAll("path")
    .data(D)
    .join("path")
    .attr("fill", (d: d3data) => V[+d.data].color ?? mkcolor(K[+d.data]))
    .attr("d", d3.arc().innerRadius(0).outerRadius(radius) as d3arg)
    .append("title")
    .text((d: d3data) => `${K[+d.data]}\n${V[+d.data].data}`)

  // Render graph texts
  svg.append("g")
    .attr("transform", `translate(${(width - (options.legend ? config.legend.width : 0)) / 2},${height / 2})`)
    .attr("font-family", "sans-serif")
    .attr("font-size", `${config.texts.fontsize}px`)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("stroke", "rbga(0,0,0,.9)")
    .attr("paint-order", "stroke fill")
    .selectAll("text")
    .data(D)
    .join("text")
    .attr("transform", (d: d3data) => `translate(${labels.centroid(d)})`)
    .selectAll("tspan")
    .data((d: d3data) => {
      const lines = `${K[+d.data]}\n${V[+d.data].data}`.split(/\n/)
      return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1)
    })
    .join("tspan")
    .attr("x", 0)
    .attr("y", (_: unknown, i: number) => `${i * 1.1}em`)
    .attr("font-weight", (_: unknown, i: number) => i ? null : "bold")
    .text((d: d3data) => d)

  // Set legend
  if (options.legend) {
    svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - margin.right - config.legend.width},${margin.top})`)
      .selectAll("g")
      .data(Object.keys(datalist).map(([name]) => ({ name, value: datalist[name].data, color: datalist[name].color ?? mkcolor(name) })))
      .enter()
      .each(function (this: d3arg, d: d3data, i: number) {
        d3.select(this)
          .append("rect")
          .attr("x", 0)
          .attr("y", i * (config.legend.fontsize + config.legend.margin) + (config.legend.fontsize - config.legend.rect[1]) / 2)
          .attr("width", config.legend.rect[0])
          .attr("height", config.legend.rect[1])
          .attr("fill", d.color)
        d3.select(this)
          .append("text")
          .attr("x", config.legend.rect[0] + 5)
          .attr("y", i * (config.legend.fontsize + config.legend.margin))
          .attr("text-anchor", "start")
          .attr("dominant-baseline", "hanging")
          .attr("fill", d.color)
          .style("font-size", `${config.legend.fontsize}px`)
          .text(`${d.name} (${d.value})`)
      })
  }

  // Render SVG
  return svg.node()!.outerHTML
}
