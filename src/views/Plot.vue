<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <Nav />

    <div class="container">
      <div class="banner pt-4 pb-4 text-left font-weight-bold">
        <!-- <h1>{{ userName }}</h1> -->
        <h1>人工智慧即時溫度監控簽核系統</h1>
        <h2>TMSS-AIoT</h2>
        <div
          class="d-flex justify-content-between h-100 banner-time-content pt-1"
        >
          <h2 class="pt-2 sub-title">慧智基因醫學實驗室</h2>
          <!-- <span
            class="nips-updatedTime"
            style="display: inline-flex;align-items:flex-end ;"
            >Last Updated:
          </span> -->
        </div>
      </div>
    </div>

    <div class="container justify-content-between d-flex">
      <div>
        <span class="mr-3">日期：{{ tempDate }}</span>
        <date-picker
          v-model="dateChoosed"
          type="date"
          :disabled-date="notAfterToday"
          placeholder="Select Day"
          class=""
          value-type="format"
          format="YYYY-MM-DD"
          @change="selectDate"
        ></date-picker>
      </div>
      <div>
        <a href="" @click.prevent="getData()">刷新</a>
      </div>
    </div>

    <div class="d-flex flex-wrap px-3  pb-5">
      <!-- {{ tempNodeCat }} -->
      <div
        class="col-12 col-md-12 col-lg-6 col-xl-4 mt-5 px-5"
        v-for="(item, index) in chartOptions"
        :key="index"
      >
        <div class="d-flex justify-content-between mb-2">
          <span>樓層：</span>
          <span>負責人：</span>
          <span>冰箱溫度： ℃</span>
        </div>
        <highcharts
          :options="chartOptions[index]"
          :callback="myCallback"
          class=""
        ></highcharts>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import { Chart } from "highcharts-vue";
import Footer from "@/components/Footer.vue";
import Nav from "@/components/Nav.vue";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

import axios from "axios";
axios.defaults.withCredentials = false;
import "vue-loading-overlay/dist/vue-loading.css";

const today = new Date();
today.setHours(0, 0, 0, 0);
// import Highcharts from "highcharts";
// import exportingInit from "highcharts/modules/exporting";
export default {
  components: {
    highcharts: Chart,
    loading: Loading,
    Footer,
    Nav,
    DatePicker
  },
  data() {
    return {
      isLoading: false,
      fullPage: true,
      posts: false,
      tempData: [],
      tempNodes: [],
      uniqueNodes: [],
      dateChoosed: null,
      tempDate: "",
      timer: "",
      colorSet: {
        maxColor: "#FF0000",
        aveColor: "#00CC66",
        minColor: "#0066CC"
      },
      tempNodeCat: [],
      tempNodeTemp: {
        max: [],
        min: [],
        ave: []
      },

      chartOptions: []
    };
  },
  methods: {
    myCallback() {
      // console.log("this is callback function");
    },
    getData(date = new Date().toISOString().slice(0, 10)) {
      const url = "http://192.168.116.232/tms_rest/halfHrsTemperature.php";
      // console.log("123");
      this.isLoading = true;

      this.tempDate = date;

      axios
        .get(`${url}`, { params: { Date: date } })
        .then(res => {
          this.tempData = res.data;
          console.log(res.data);
          let tempNodesName = [];
          this.tempData.forEach(el => {
            tempNodesName.push(el.NodeName);
          });

          if (this.uniqueNodes.length === 0) {
            this.uniqueNodes = [...new Set(tempNodesName)];
          }
          // console.log(this.uniqueNodes);

          this.uniqueNodes.forEach(el => {
            const filterNodes = this.tempData.filter(function(item) {
              return item.NodeName === el;
            });

            filterNodes.sort(function(a, b) {
              return a.MidTime - b.MidTime;
            });

            filterNodes.forEach(el => {
              const xLabelArr = el.MidTime.split(" ");
              this.tempNodeCat.push(xLabelArr[1]);
              this.tempNodeTemp.max.push(el.MaxTemp);
              this.tempNodeTemp.min.push(el.MinTemp);
              this.tempNodeTemp.ave.push(el.AvgTemp);
            });

            this.tempNodeTemp.max = this.tempNodeTemp.max.map(function(x) {
              return parseFloat(x, 10);
            });
            this.tempNodeTemp.min = this.tempNodeTemp.min.map(function(x) {
              return parseFloat(x, 10);
            });
            this.tempNodeTemp.ave = this.tempNodeTemp.ave.map(function(x) {
              return parseFloat(x, 10);
            });

            this.tempNodes.push({
              nodeName: el,
              maxTemp: this.tempNodeTemp.max,
              minTemp: this.tempNodeTemp.min,
              aveTemp: this.tempNodeTemp.ave,
              tempNodeCat: this.tempNodeCat
            });

            this.tempNodeCat = [];
            this.tempNodeTemp = {
              max: [],
              min: [],
              ave: []
            };
            // console.log(filterNodes);
          });

          this.posts = true;
          this.isLoading = false;

          this.tempNodes.forEach(el => {
            // console.log(el.maxTemp);
            // el.maxTemp.push(null);
            while (el.maxTemp.length < 49) {
              el.maxTemp.push(null);
              el.minTemp.push(null);
              el.aveTemp.push(null);
            }
          });

          console.log(this.tempNodes);

          this.render();
        })
        .catch(err => {
          console.log(err);
        });
    },
    render() {
      const vm = this;
      this.tempNodes.forEach(function(item, index) {
        // console.log(item);
        // console.log(vm.chartOptions);
        vm.chartOptions[index] = {
          credits: {
            enabled: false
          },
          chart: {
            type: "spline",
            style: {
              fontFamily: [
                "-apple-system",
                "BlinkMacSystemFont",
                "Segoe UI",
                "Microsoft JhengHei",
                "Roboto",
                "Helvetica Neue",
                "Arial",
                "sans-serif"
              ]
            }
          },
          title: {
            text: item.nodeName,
            style: { fontSize: "24px", fontWeight: "bold" },
            margin: 30
          },
          subtitle: {
            text: ""
          },
          yAxis: {
            title: {
              text: "溫度( ℃ )",
              style: { fontSize: "16px" },
              margin: 25
            },
            labels: { style: { fontSize: "16px" } },
            margin: 10
          },
          xAxis: {
            categories: item.tempNodeCat,
            labels: {
              enabled: false
            }
          },
          legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "middle",
            itemStyle: {
              fontSize: "16px"
            },
            itemMarginTop: 5,
            itemMarginBottom: 5
          },
          tooltip: {
            shared: true,
            crosshairs: true,
            headerFormat:
              '<span style="font-size: 14px;">{point.key}</span><br/>',
            style: { fontSize: "14px" },
            borderColor: "#808080",
            borderRadius: 0
          },
          plotOptions: {
            series: {
              label: {
                connectorAllowed: false
              },
              // pointStart: 2011,
              marker: {
                enabled: false
              },
              cursor: "pointer"
            }
          },
          series: [
            {
              name: "最高溫度",
              data: item.maxTemp,
              color: "#FF0000",
              visible: false
            },
            {
              name: "平均均溫",
              data: item.aveTemp,
              color: "#00CC66"
            },
            {
              name: "最低溫度",
              data: item.minTemp,
              color: "#0066CC",
              visible: false
            }
          ],
          responsive: {
            rules: [
              {
                condition: {
                  maxWidth: 500
                },
                chartOptions: {
                  legend: {
                    layout: "horizontal",
                    align: "center",
                    verticalAlign: "bottom"
                  }
                }
              }
            ]
          }
        };
      });
      this.tempNodes = [];
      this.tempData = [];
    },
    notAfterToday(date) {
      return date > today;
    },
    selectDate() {
      console.log(this.dateChoosed);
      this.getData(this.dateChoosed);
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
    }
  },
  mounted() {
    const curDate = new Date().toISOString().slice(0, 10);

    this.getData(curDate);
    this.timer = setInterval(this.getData, 1800000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style>
.highcharts-container {
  width: 600px;
  height: 400px;
  border: 1px solid #ddd;
  margin: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Microsoft JhengHei", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 1rem;
}
.test {
  border: 1px solid red;
}
</style>
