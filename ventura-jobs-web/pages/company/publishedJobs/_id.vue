<template>
  <div class="container">
    <div class="flex">
      <div class="flex-none w-14">
        <Nuxt-Link to="/company/publishedJobs" class="arrow__utils">
          <v-btn icon height="50" width="50">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </Nuxt-Link>
      </div>
      <div class="flex-initial m-auto">
        <h1 class="text-2xl font-medium">{{ job.name }}</h1>
        <h5 class="text-base font-normal">Descrição da vaga</h5>
        <p class="font-light" v-html="job.description"></p>
        <div class="flex">
          <p class="font-bold">Salário:</p>
          <p class="font-light ml-2">
            R$ {{ formatPrice(job.salary.value) }}
          </p>
          <br>
          <p class="font-light ml-2">
          <p class="font-bold">Média da vaga:</p>
             {{job.profileAverage}}
          </p>
        </div>
        <p>
          <v-icon icon style="font-size: 21px !important">
            mdi-calendar-clock
          </v-icon>
          {{ job.deadLine | moment }}
        </p>
        <div class="ma-10">
          <div id="chartDiv"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4lang_pt_BR from "@amcharts/amcharts4/lang/pt_BR";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export default {
  name: "companyJob",
  head() {
    return {
      title: `Vaga: ${this.job.name}`,
    };
  },
  middleware: 'auth-jobs',
  async asyncData({$httpClient, params}) {
    const job = await $httpClient.$get(`/v1/jobs/${params.id}`);
    const jobReport = await $httpClient.$get(`/v1/jobs/${params.id}/job-report`);
    return {job, jobReport};
  },
  mounted() {
    this.createReport(this.jobReport);
  },
  methods: {
    resetChart: function () {
      document.getElementById("chart").remove();
      document.getElementById("chartDiv").append('<div style="height: 400px" id="chart"></div>')
    },
    createReport(report) {
      const chartDiv = document.getElementById("chartDiv");

      am4core.ready(() => {
        let chart = am4core.create(chartDiv, am4charts.PieChart);
        chart.scrollbarX = new am4core.Scrollbar();
        chart.language.locale = am4lang_pt_BR;
        chart.numberFormatter.language = new am4core.Language();
        chart.numberFormatter.language.locale = am4lang_pt_BR;

        chart.data = report.userValueList;

        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "average";
        pieSeries.dataFields.category = "name";

        chart.innerRadius = am4core.percent(40);

        pieSeries.slices.template.stroke = am4core.color("#4a2abb");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;

        chart.legend = new am4charts.Legend();
      })

    },
    formatPrice(value) {
      if (value != null && value != undefined) {
        let val = (value / 1).toFixed(2).replace(".", ",");
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
      return 0;
    },
  },
  filters: {
    moment: (date) => {
      if (date != null) {
        moment.locale("pt-br");
        return moment(date).fromNow();
      } else {
        return "";
      }
    },
  },
}
</script>

<style scoped>
#chartDiv {
  width: 100%;
  height: 400px;
}
</style>
