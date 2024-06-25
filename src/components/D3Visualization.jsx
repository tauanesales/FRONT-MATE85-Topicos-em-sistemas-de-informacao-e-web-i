import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const D3Visualization = ({ dataDeInicio, dataFinal, dataAtual, tarefas }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Dimensões container
    const margin = { top: 0, right: 40, bottom: 60, left: 40 };
    const width = 1200 - margin.left - margin.right;
    const height = 150 - margin.top - margin.bottom;

    // Construção da escala horizontal e preparação para zoom
    let currentScale = "mes";
    let timeInterval = d3.timeMonth.every(1);
    let timeFormat = "%b %Y";

    const timeScale = d3.scaleTime()
      .domain([dataDeInicio, dataFinal])
      .range([0, width]);

    function updateTimeScale(scale) {
      switch (scale) {
        case "ano":
          timeInterval = d3.timeYear.every(1);
          timeFormat = "%Y";
          break;
        case "mes":
          timeInterval = d3.timeMonth.every(1);
          timeFormat = "%b %Y";
          break;
        case "semana":
          timeInterval = d3.timeWeek.every(1);
          timeFormat = "%b %d, %Y";
          break;
        default:
          break;
      }
      const ticks = timeScale.ticks(timeInterval);

      svg.selectAll(".date-mark").remove();
      svg.selectAll(".date-text").remove();

      // Ticks e legenda escala horizontal
      svg.selectAll(".date-mark")
        .data(ticks)
        .enter().append("line")
        .attr("class", "date-mark")
        .attr("x1", d => timeScale(d))
        .attr("y1", height)
        .attr("x2", d => timeScale(d))
        .attr("y2", height + 7)
        .style("stroke", "grey")
        .style("stroke-width", 1);

      svg.selectAll(".date-text")
        .data(ticks)
        .enter().append("text")
        .attr("class", "date-text")
        .attr("x", d => timeScale(d))
        .attr("y", height + 20)
        .attr("transform", d => `rotate(-30, ${timeScale(d)}, ${height + 20})`)
        .text(d3.timeFormat(timeFormat))
        .style("fill", "grey")
        .style("font-size", "10px")
        .style("text-anchor", "middle");
    }

    // Zoom e pan escala horizontal
    const zoom = d3.zoom()
      .scaleExtent([1, 100])
      .translateExtent([[0, 0], [width, height]])
      .extent([[0, 0], [width, height]])
      .on("zoom", zoomed);

    function zoomed(event) {
      const transform = event.transform;
      const newXScale = transform.rescaleX(timeScale);

      svg.selectAll(".date-mark")
        .attr("x1", d => newXScale(d))
        .attr("x2", d => newXScale(d));
      svg.selectAll(".date-text")
        .attr("x", d => newXScale(d))
        .attr("transform", d => `rotate(-30, ${newXScale(d)}, ${height + 20})`);
      svg.selectAll(".tarefa-a-fazer")
        .attr("x", (tarefa, index) => {
          const prazo = new Date(dataDeInicio.getFullYear(), dataDeInicio.getMonth() + tarefa.prazoMeses, dataDeInicio.getDate());
          return newXScale(prazo) - 10 + (index * 5);
        });

      svg.selectAll(".barra-progresso")
        .attr("width", width * transform.k)
        .attr("transform", `translate(${transform.x},0)`);

      svg.selectAll(".progresso")
        .attr("width", progressoWidth * transform.k)
        .attr("transform", `translate(${transform.x},0)`);
    }

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("cursor", "ew-resize")
      .call(zoom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Linha escala horizontal
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", height)
      .attr("x2", width)
      .attr("y2", height)
      .style("stroke", "grey")
      .style("stroke-width", 1);

    updateTimeScale(currentScale);

        // Adicionar o texto de fundo
      svg.append("text")
      .attr("x", width  / 6)
      .attr("y", height /2)
      .attr("text-anchor", "middle")
      .style("fill", "lightgrey")
      .style("font-size", "20px")
      .style("font-weight", "bold")
        .text("Zoom e Arrastar");

    // Adiciona ícones de tarefa conforme a escala
    svg.selectAll(".tarefa-a-fazer")
      .data(tarefas)
      .enter().append("image")
      .attr("class", "tarefa-a-fazer")
      .attr("cursor", "pointer")
      .attr("x", (tarefa, index) => {
        const prazo = new Date(dataDeInicio.getFullYear(), dataDeInicio.getMonth() + tarefa.prazoMeses, dataDeInicio.getDate());
        return timeScale(prazo) - 10 + (index * 5);
      })
      .attr("y", height - 60)
      .attr("width", 30)
      .attr("height", 30)
      .attr("xlink:href", (tarefa) => {
        const prazo = new Date(dataDeInicio.getFullYear(), dataDeInicio.getMonth() + tarefa.prazoMeses, dataDeInicio.getDate());
        return tarefa.feita ? "/assets/flagGreen.png" : (prazo < dataAtual ? "/assets/flagRed.png" : "/assets/flagBlack.png");
      })
      .on("mouseover", function (event, d) {
        const prazo = new Date(dataDeInicio.getFullYear(), dataDeInicio.getMonth() + d.prazoMeses, dataDeInicio.getDate());
        const tooltip = d3.select("#tooltip");
        tooltip
          .style("display", "block")
          .html(`<strong>${d.nome}</strong><br>Data Limite: ${prazo.toLocaleDateString()}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 60) + "px")
          .style("position", "absolute");
      })
      .on("mouseout", function () {
        d3.select("#tooltip").style("display", "none");
      });

    // Barra temporal curso
    svg.append("rect")
      .attr("class", "barra-progresso")
      .attr("x", 0)
      .attr("y", height - 25)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("width", width)
      .attr("height", 12)
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", 0.3);

    // Barra de progresso
    const progresso = svg.append("rect")
      .attr("class", "progresso")
      .attr("x", 0)
      .attr("y", height - 25)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("width", 0)
      .attr("height", 12)
      .style("fill", "#84bf68");



    const tempoDecorrido = dataAtual - dataDeInicio;
    const progressoPorcentagem = (tempoDecorrido / (dataFinal - dataDeInicio));
    const progressoWidth = progressoPorcentagem * width;
    progresso.attr("width", progressoWidth);

    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, [dataAtual, tarefas]);

  return <svg ref={svgRef}></svg>;
};

export default D3Visualization;