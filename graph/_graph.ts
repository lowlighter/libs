// Imports
import type { DeepPartial } from "@libs/typing"
import { deepMerge, pick } from "@std/collections"
import { DOMParser } from "linkedom"
import * as d3 from "d3"
export { d3 }

/** Creates a generic graph. */
export function graph(type: string, datalist: datalist, options: options = {}): string {
  // Create SVG
  const config = mkconfig(pick(options, ["width", "height"]))
  const { margin, width, height } = config
  const svg = mksvg({ width, height })

  // Prepare data
  const V = Object.values(datalist).flatMap(({ data }) => data.map(({ x, y }) => ({ x, y })))
  const start = Math.min(...V.map(({ x }) => Number(x)))
  const end = Math.max(...V.map(({ x }) => Number(x)))
  const extremum = Math.max(...V.map(({ y }) => y))
  const max = !Number.isNaN(Number(options.max)) ? options.max! : extremum
  const min = !Number.isNaN(Number(options.min)) ? options.min! : 0

  // Configure X axis
  const x = ((type === "time" ? d3.scaleTime().domain([new Date(start), new Date(end)]) : d3.scaleLinear().domain([start, end])) as ReturnType<typeof d3.scaleLinear<number, number>>)
    .range([margin.top, width - margin.left - margin.right])
  let ticks = d3.axisBottom(x)
  if (options.ticks)
    ticks = ticks.ticks(options.ticks)
  if (options.labels)
    ticks = ticks.tickFormat((_: unknown, i: number) => `${options.labels?.[i] ?? ""}`)
  svg.append("g")
    .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
    .call(ticks)
    .call((g: d3select) => g.select(".domain").attr("stroke", config.axis.color))
    .call((g: d3select) => g.selectAll(".tick line").attr("stroke-opacity", config.axis.opacity))
    .selectAll("text")
    .attr("transform", "translate(-5,5) rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", `${config.axis.fontsize}px`)
    .attr("fill", config.axis.color)

  // Configure Y axis
  const y = d3.scaleLinear()
    .domain([max, min])
    .range([margin.left, height - margin.top - margin.bottom])
  svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .call(d3.axisRight(y).ticks(Math.round(height / 50)).tickSize(width - margin.left - margin.right))
    .call((g: d3select) => g.select(".domain").remove())
    .call((g: d3select) => g.selectAll(".tick line").attr("stroke-opacity", config.axis.opacity).attr("stroke-dasharray", "2,2"))
    .call((g: d3select) => g.selectAll(".tick text").attr("x", 0).attr("dy", -4))
    .selectAll("text")
    .style("font-size", `${config.axis.fontsize}px`)
    .attr("fill", config.axis.color)

  // Set title
  if (options.title) {
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
      .text(options.title)
  }

  // Set legend
  if (options.legend) {
    svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - margin.right - config.legend.width},${margin.top})`)
      .selectAll("g")
      .data(Object.entries(datalist).map(([name, { color = mkcolor(name) }]) => ({ name, color })))
      .enter()
      .each(function (this: d3arg, d: d3data, i: number) {
        d3.select(this)
          .append("rect")
          .attr("x", 0)
          .attr("y", i * (config.legend.fontsize + config.legend.margin) + (config.legend.fontsize - config.legend.rect[1]) / 2)
          .attr("width", config.legend.rect[0])
          .attr("height", config.legend.rect[1])
          .attr("stroke", d.color)
          .attr("fill", d.color)
          .attr("fill-opacity", config.areas.opacity)
        d3.select(this)
          .append("text")
          .attr("x", config.legend.rect[0] + 5)
          .attr("y", i * (config.legend.fontsize + config.legend.margin))
          .attr("text-anchor", "start")
          .attr("dominant-baseline", "hanging")
          .attr("fill", d.color)
          .style("font-size", `${config.legend.fontsize}px`)
          .text(d.name)
      })
  }

  // Render series
  for (const [name, { color = mkcolor(name), lines = true, areas = true, points = true, texts = true, data }] of Object.entries(datalist)) {
    const X = data.map(({ x }) => x)
    const Y = data.map(({ y }) => y)
    const T = data.map(({ text }, i) => text ?? Y[i])
    const D = Y.map((y, i) => [X[i], y])
    const DT = Y.map((y, i) => [X[i], y, T[i]])

    // Render graph lines
    if (lines) {
      svg.append("path")
        .datum(D)
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .attr("d", d3.line().curve(d3.curveLinear).x((d: number[]) => x(d[0])).y((d: number[]) => y(d[1])) as d3arg)
        .attr("fill", "transparent")
        .attr("stroke", color)
        .attr("stroke-width", config.lines.width)
    }

    // Render graph areas
    if (areas) {
      svg.append("path")
        .datum(D)
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .attr("d", d3.area().curve(d3.curveLinear).x((d: number[]) => x(d[0])).y0((d: number[]) => y(d[1])).y1(() => y(min)) as d3arg)
        .attr("fill", color)
        .attr("fill-opacity", config.areas.opacity)
    }

    // Render graph points
    if (points) {
      svg.append("g")
        .selectAll("circle")
        .data(DT)
        .join("circle")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .attr("cx", (d: d3data) => x(+d[0]))
        .attr("cy", (d: d3data) => y(+d[1]))
        .attr("r", config.points.radius)
        .attr("fill", color)
    }

    // Render graph texts
    if (texts) {
      svg.append("g")
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", `${config.texts.fontsize}px`)
        .attr("stroke", "rgba(88, 166, 255, .05)")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 4)
        .attr("paint-order", "stroke fill")
        .selectAll("text")
        .data(DT)
        .join("text")
        .attr("transform", `translate(${margin.left},${margin.top - 4})`)
        .attr("x", (d: d3data) => x(+d[0]))
        .attr("y", (d: d3data) => y(+Number(d[1])))
        .text((d: d3data) => d[2])
        .attr("fill", config.axis.color)
    }
  }

  // Render SVG
  return svg.node()!.outerHTML
}

/** Generates a random color based on the provided seed. */
export function mkcolor(seed: string): string {
  let hex = 9
  for (let i = 0; i < seed.length;)
    hex = Math.imul(hex ^ seed.charCodeAt(i++), 9 ** 9)
  hex = hex ^ hex >>> 9
  const r = (hex & 0xff0000) >> 8 * 2
  const g = (hex & 0x00ff00) >> 8 * 1
  const b = (hex & 0x0000ff) >> 8 * 0
  return `rgb(${r}, ${g}, ${b})`
}

/** Generates a graph configuration. */
export function mkconfig(config: DeepPartial<GraphConfig> = {}): GraphConfig {
  return deepMerge({
    width: 480,
    height: 315,
    title: {
      color: "var(--color-title)",
      fontsize: 14,
    },
    axis: {
      color: "rgba(127, 127, 127, .8)",
      fontsize: 12,
      opacity: 0.5,
    },
    legend: {
      width: 80,
      rect: [20, 10],
      fontsize: 12,
      margin: 2,
    },
    lines: {
      width: 2,
    },
    areas: {
      opacity: 0.1,
    },
    points: {
      radius: 2,
    },
    texts: {
      fontsize: 10,
    },
    margin: { top: 10, left: 10, right: 10, bottom: 45 },
  }, config) as GraphConfig
}

/** Generates an SVG element. */
export function mksvg({ width, height }: { width: number; height: number }): d3data {
  const body = d3.select(new DOMParser().parseFromString(`<!DOCTYPE html><html><body></body></html>`, "text/html")!.body)
  const svg = body.append("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", `${width}`)
    .attr("height", `${height}`)
    .attr("class", "graph")
  return svg
}

/** Argument for D3 functions. */
// deno-lint-ignore no-explicit-any
export type d3arg = any

/** Data used by D3. */
// deno-lint-ignore no-explicit-any
export type d3data = any

/** D3 selection. */
export type d3select = ReturnType<typeof d3.select>

/** Data list. */
export type datalist<T = number> = Record<PropertyKey, {
  color?: string
  /** Data points for the graph. */
  data: data<T>[]
  /** Enable graph lines rendering. */
  lines?: boolean
  /** Enable graph areas rendering. */
  areas?: boolean
  /** Enable graph data points rendering. */
  points?: boolean
  /** Enable graph data texts rendering. */
  texts?: boolean
}>

/** Data point. */
export type data<T = number> = {
  /** X-axis value. */
  x: number | Date
  /** Y-axis value. */
  y: T
  /** Optional text label for the point. */
  text?: string
}

/** Graph configuration options. */
export type options = {
  /** Width of the graph. */
  width?: number
  /** Height of the graph. */
  height?: number
  /** Minimum value for the Y-axis (defaults to 0). */
  min?: number
  /** Maximum value for the Y-axis (defaults to the extremum value in the data). */
  max?: number
  /** Title of the graph. */
  title?: string
  /** Whether to show the legend. */
  legend?: boolean
  /** Number of ticks to display on the graph axis. */
  ticks?: number
  /** Labels for the ticks on the graph axis. */
  labels?: Record<PropertyKey, number | string>
}

/** Default graph configuration. */
export type GraphConfig = {
  /** Default width. */
  width: number
  /** Default height. */
  height: number
  /** Default title configuration. */
  title: GraphTitleConfig
  /** Default axis configuration. */
  axis: GraphAxisConfig
  /** Default legend configuration. */
  legend: GraphLegendConfig
  /** Default lines configuration. */
  lines: GraphLinesConfig
  /** Default areas configuration. */
  areas: GraphAreasConfig
  /** Default points configuration. */
  points: GraphPointsConfig
  /** Default texts configuration. */
  texts: GraphTextsConfig
  /** Default margin configuration. */
  margin: GraphMarginConfig
}

/** Graph title configuration. */
export type GraphTitleConfig = {
  /** Color of the title text. */
  color: string
  /** Font size of the title text. */
  fontsize: number
}

/** Graph axis configuration. */
export type GraphAxisConfig = {
  /** Color of the axis lines and labels. */
  color: string
  /** Font size of the axis labels. */
  fontsize: number
  /** Opacity of the axis lines. */
  opacity: number
}

/** Graph legend configuration. */
export type GraphLegendConfig = {
  /** Width of the legend. */
  width: number
  /** Rectangle size for legend items. */
  rect: [number, number]
  /** Font size of the legend text. */
  fontsize: number
  /** Margin between legend items. */
  margin: number
}

/** Graph lines configuration. */
export type GraphLinesConfig = {
  /** Width of the lines in the graph. */
  width: number
}

/** Graph areas configuration. */
export type GraphAreasConfig = {
  /** Opacity of the areas in the graph. */
  opacity: number
}

/** Graph points configuration. */
export type GraphPointsConfig = {
  /** Radius of the points in the graph. */
  radius: number
}

/** Graph texts configuration. */
export type GraphTextsConfig = {
  /** Font size of the texts in the graph. */
  fontsize: number
}

/** Graph margin configuration. */
export type GraphMarginConfig = {
  /** Top margin of the graph. */
  top: number
  /** Left margin of the graph. */
  left: number
  /** Right margin of the graph. */
  right: number
  /** Bottom margin of the graph. */
  bottom: number
}
