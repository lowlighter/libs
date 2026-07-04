// Imports
import { d3, type d3arg, mkconfig, mksvg, type options } from "./_graph.ts"
import { pick } from "@std/collections"
export type { options }

/**
 * Generates a diff graph.
 *
 * ```ts
 * diff({
 *   A: { data: [{ date: new Date("2019"), added: 100, deleted: 20, changed: 12 }] },
 *   B: { data: [{ date: new Date("2020"), added: 40, deleted: 23, changed: 20 }, { date: new Date("2021"), added: 54, deleted: 12, changed: 30 }] },
 *   C: { data: [{ date: new Date("2021"), added: 0, deleted: 30, changed: 10 }] },
 * }, { title: "foobar" })
 * ```
 */
export function diff(datalist: Record<PropertyKey, { data: { date: Date; added: number; deleted: number; changed: number }[] }>, options: Pick<options, "title" | "width" | "height"> & { opacity?: number } = {}): string {
  // Create SVG
  const margin = 5
  const offset = 34
  const config = mkconfig(pick(options, ["width", "height"]))
  const { width, height, title } = config
  const opacity = options.opacity ?? config.areas.opacity
  const svg = mksvg({ width, height })

  // Prepare data
  const K = Object.keys(datalist)
  const V = Object.values(datalist).flatMap(({ data }) => data)
  const start = new Date(Math.min(...V.map(({ date }) => Number(date))))
  const end = new Date(Math.max(...V.map(({ date }) => Number(date))))
  const extremum = Math.max(...V.flatMap(({ added, deleted, changed }) => [added + changed, deleted + changed]))

  // Configure X axis
  const x = d3.scaleTime()
    .domain([start, end])
    .range([margin + offset, width - (offset + margin)])
  svg.append("g")
    .attr("transform", `translate(0,${height - (offset + margin)})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-5,5) rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", `${config.axis.fontsize}px`)

  // Configure Y axis
  const y = d3.scaleLinear()
    .domain([extremum, -extremum])
    .range([margin, height - (offset + margin)])
  svg.append("g")
    .attr("transform", `translate(${margin + offset},0)`)
    .call(d3.axisLeft(y).tickFormat(d3.format(".2s")))
    .selectAll("text")
    .style("font-size", `${config.axis.fontsize}px`)

  // Render graph areas
  for (const { type, sign, fill } of [{ type: "added", sign: +1, fill: "var(--diff-addition)" }, { type: "deleted", sign: -1, fill: "var(--diff-deletion)" }] as const) {
    const values = Object.entries(datalist).flatMap(([name, { data }]) => data.flatMap(({ date, ...diff }) => ({ date, [name]: sign * (diff[type] + diff.changed) })))
    svg
      .append("g")
      .selectAll("g")
      .data(d3.stack().keys(K)(values as d3arg))
      .join("path")
      .attr("d", d3.area().x((d: d3arg) => x(d.data.date)).y0((d: number[]) => y(d[0] || 0)).y1((d: number[]) => y(d[1] || 0)) as d3arg)
      .attr("fill", fill)
      .attr("fill-opacity", opacity)
  }

  // Set title
  if (title) {
    svg.append("text")
      .attr("class", "title")
      .attr("x", width / 2)
      .attr("y", config.title.fontsize)
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("stroke", "rgba(88, 166, 255, .05)")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 4)
      .attr("paint-order", "stroke fill")
      .style("font-size", `${config.title.fontsize}px`)
      .attr("fill", config.title.color)
      .text(title)
  }

  // Render SVG
  return svg.node()!.outerHTML
}
