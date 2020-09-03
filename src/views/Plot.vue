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
          </span>-->
        </div>
      </div>
    </div>

    <div class="container justify-content-between d-flex flex-wrap">
      <div class="d-flex pt-4 pl-3 mb-3 flex-column menu">
        <div class="d-flex align-items-center mb-3">
          <span style="font-size: 18px" class="mr-3">溫度： </span>
          <div class="btn-group btn-group-toggle mr-2" data-toggle="buttons">
            <label
              class="btn btn-outline-info mr-1"
              id="tempAll"
              :class="{ active: isCheckTempAll }"
            >
              <input
                type="checkbox"
                name="options"
                @click="checkAll('temp')"
                v-model="isCheckTempAll"
              />
              All
            </label>
            <label
              class="btn btn-outline-info active"
              v-for="(item, index) in filterInfo.temp"
              :key="index"
              :id="item"
            >
              <input
                type="checkbox"
                name="options"
                :value="item"
                @change="updateFilter('temp')"
                v-model="filterInfo.tempTemp"
              />
              {{ item }}
            </label>
          </div>
        </div>

        <div class="d-flex align-items-center mb-3">
          <span style="font-size: 18px" class="mr-3">樓層： </span>
          <div class="btn-group btn-group-toggle mr-4" data-toggle="buttons">
            <label
              class="btn btn-outline-info mr-1"
              id="floorAll"
              :class="{ active: isCheckFloorAll }"
            >
              <input
                type="checkbox"
                name="options"
                @click="checkAll('floor')"
                v-model="isCheckFloorAll"
              />All
            </label>
            <label
              class="btn btn-outline-info active"
              v-for="(item, index) in filterInfo.floor"
              :key="index"
              :id="item"
            >
              <input
                type="checkbox"
                name="options"
                :value="item"
                @change="updateFilter('floor')"
                v-model="filterInfo.tempFloor"
              />
              <!-- <input type="checkbox" name="options" v-if="index !== 0" /> -->
              {{ item }}
            </label>
          </div>
        </div>

        <div class="d-flex align-items-center mb-3">
          <span style="font-size: 18px">負責人：</span>
          <div class="btn-group btn-group-toggle mr-2" data-toggle="buttons">
            <label
              class="btn btn-outline-info mr-1"
              id="ownerAll"
              :class="{ active: isCheckOwnerAll }"
            >
              <input
                type="checkbox"
                name="options"
                @click="checkAll('owner')"
                v-model="isCheckOwnerAll"
              />
              All
            </label>
            <label
              class="btn btn-outline-info active"
              v-for="(item, index) in filterInfo.owner"
              :key="index"
              :id="item"
            >
              <input
                type="checkbox"
                name="options"
                :value="item"
                @change="updateFilter('owner')"
                v-model="filterInfo.tempOwner"
              />
              {{ item }}
            </label>
          </div>
        </div>

        <div class="menu-title">
          <span>Selector</span>
        </div>
      </div>

      <div>
        <span class="mr-3">日期：{{ tempDate }}</span>
        <date-picker
          v-model="dateChoosed"
          type="date"
          :disabled-date="notAfterToday"
          placeholder="Select Day"
          class
          value-type="format"
          format="YYYY-MM-DD"
          @change="selectDate"
        ></date-picker>
      </div>
      <div>
        <a href @click.prevent="getData()">刷新</a>
      </div>
    </div>

    <div class="d-flex flex-wrap px-3 pb-5">
      <div
        class="col-12 col-md-12 col-lg-6 col-xl-4 mt-5 px-5"
        v-for="(item, index) in chartOptions"
        :key="index"
      >
        <div class="d-flex justify-content-between mb-2 flex-wrap">
          <span class="col-4">樓層：{{ refInfo[index].floor }}</span>
          <span class="col-4">負責人：{{ refInfo[index].owner }}</span>
          <span class="col-4">溫度：{{ refInfo[index].refType }} ℃</span>
        </div>
        <highcharts
          :options="chartOptions[index]"
          :callback="myCallback"
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
import $ from "jquery";
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
      isCheckTempAll: true,
      isCheckOwnerAll: true,
      isCheckFloorAll: true,
      tempData: [],
      refInfo: [],
      tempNodes: [],
      uniqueNodes: [],
      dateChoosed: null,
      tempDate: "",
      timer: "",
      filterInfo: {
        floor: [],
        owner: [],
        temp: [],
        tempFloor: [],
        tempOwner: [],
        tempTemp: []
      },
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
      this.isLoading = true;
      this.tempDate = date;

      axios
        .get(`${url}`, { params: { Date: date } })
        .then(res => {
          this.tempData = res.data;
          // console.log(res.data);
          let tempNodesName = [];
          this.tempNodes = [];

          this.tempData.forEach(el => {
            tempNodesName.push(el.NodeName);
            this.filterInfo.owner.push(el.Owner);
            this.filterInfo.floor.push(el.Floor);
            this.filterInfo.temp.push(el.RefType);
          });
          this.filterInfo.owner = [...new Set(this.filterInfo.owner)];
          this.filterInfo.floor = [...new Set(this.filterInfo.floor)];
          this.filterInfo.temp = [...new Set(this.filterInfo.temp)];
          this.filterInfo.floor = this.filterInfo.floor.sort((a, b) =>
            a < b ? -1 : 1
          );
          this.filterInfo.temp = this.filterInfo.temp.sort((a, b) =>
            a < b ? -1 : 1
          );
          this.filterInfo.tempOwner = this.filterInfo.owner;
          this.filterInfo.tempFloor = this.filterInfo.floor;
          this.filterInfo.tempTemp = this.filterInfo.temp;

          if (this.uniqueNodes.length === 0) {
            this.uniqueNodes = [...new Set(tempNodesName)];
          }

          this.uniqueNodes.forEach(el => {
            // let acceptHi = 0;
            // let acceptLow = 0;
            let max = -10000;
            let min = 10000;

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

              max =
                max < parseFloat(el.MaxTemp, 10)
                  ? parseFloat(el.MaxTemp, 10)
                  : max;

              min =
                min > parseFloat(el.MinTemp, 10)
                  ? parseFloat(el.MinTemp, 10)
                  : min;
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

            if (max > parseFloat(filterNodes[0].Accept_hi, 10)) {
              max = max + 0.5;
            } else {
              max = parseFloat(filterNodes[0].Accept_hi, 10) + 0.5;
            }

            if (parseFloat(filterNodes[0].Accept_lo, 10) > min) {
              min = min - 0.5;
            } else {
              min = parseFloat(filterNodes[0].Accept_lo, 10) - 0.5;
            }

            this.tempNodes.push({
              nodeName: el,
              maxTemp: this.tempNodeTemp.max,
              minTemp: this.tempNodeTemp.min,
              aveTemp: this.tempNodeTemp.ave,
              tempNodeCat: this.tempNodeCat,
              owner: filterNodes[0].Owner,
              id: filterNodes[0].RefID,
              refType: filterNodes[0].RefType,
              floor: filterNodes[0].Floor,
              acceptHi: parseFloat(filterNodes[0].Accept_hi, 10),
              acceptLow: parseFloat(filterNodes[0].Accept_lo, 10),
              ymax: max,
              ymin: min
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
            while (el.maxTemp.length < 49) {
              el.maxTemp.push(null);
              el.minTemp.push(null);
              el.aveTemp.push(null);
            }
          });

          this.refInfo = this.tempNodes.sort((a, b) => (a.id < b.id ? -1 : 1));

          this.isCheckTempAll = true;
          this.isCheckOwnerAll = true;
          this.isCheckFloorAll = true;

          this.filterInfo.temp.forEach(el => {
            $("#" + el).addClass("active");
          });
          this.filterInfo.owner.forEach(el => {
            $("#" + el).addClass("active");
          });
          this.filterInfo.floor.forEach(el => {
            $("#" + el).addClass("active");
          });

          this.render(this.tempNodes);
        })
        .catch(err => {
          console.log(err);
        });
    },
    render(data) {
      this.chartOptions = [];

      const vm = this;
      // console.log(data);
      if (data.length === 0) {
        vm.chartOptions = [];
      }

      data.forEach(function(item, index) {
        console.log(item.id, item.ymax, item.ymin);
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
            text: item.id,
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
            margin: 10,
            plotLines: [
              {
                color: "#FF66B2",
                width: 1.5,
                value: item.acceptHi,
                zIndex: 5,
                label: {
                  text: "允收上界",
                  align: "right"
                }
              },
              {
                color: "#FF66B2",
                width: 1.5,
                value: item.acceptLow,
                zIndex: 5,
                label: {
                  text: "允收下界",
                  align: "right",
                  y: 15
                }
              }
            ],
            min: item.ymin,
            max: item.ymax
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
    },
    checkAll(filterCat) {
      let data = this.tempNodes;
      if (filterCat === "temp") {
        this.isCheckTempAll = !this.isCheckTempAll;
        this.filterInfo.tempTemp = this.isCheckTempAll
          ? this.filterInfo.temp
          : [];
        this.filterInfo.temp.forEach(el => {
          if (this.isCheckTempAll) {
            $("#" + el).addClass("active");
          } else {
            $("#" + el).removeClass("active");
            data = [];
          }
        });
      } else if (filterCat === "owner") {
        this.isCheckOwnerAll = !this.isCheckOwnerAll;
        this.filterInfo.tempOwner = this.isCheckOwnerAll
          ? this.filterInfo.owner
          : [];
        this.filterInfo.owner.forEach(el => {
          if (this.isCheckOwnerAll) {
            $("#" + el).addClass("active");
          } else {
            $("#" + el).removeClass("active");
            data = [];
          }
        });
      } else if (filterCat === "floor") {
        this.isCheckFloorAll = !this.isCheckFloorAll;
        this.filterInfo.tempFloor = this.isCheckFloorAll
          ? this.filterInfo.floor
          : [];
        this.filterInfo.floor.forEach(el => {
          if (this.isCheckFloorAll) {
            $("#" + el).addClass("active");
          } else {
            $("#" + el).removeClass("active");
            data = [];
          }
        });
      }

      if (this.isCheckTempAll && this.isCheckFloorAll && this.isCheckOwnerAll) {
        data = this.tempNodes;
        this.refInfo = [];
        data.forEach(item => {
          this.refInfo.push({
            floor: item.floor,
            owner: item.owner,
            refType: item.refType
          });
          // console.log(item, index, this.refInfo);
        });
      } else {
        data = [];
      }

      this.render(data);
    },
    updateFilter(filterCat) {
      let data = this.tempNodes;
      if (filterCat === "temp") {
        if (this.filterInfo.tempTemp.length === this.filterInfo.temp.length) {
          $("#tempAll").addClass("active");
          this.isCheckTempAll = true;
        } else {
          $("#tempAll").removeClass("active");
          this.isCheckTempAll = false;
        }
      } else if (filterCat === "owner") {
        if (this.filterInfo.tempOwner.length === this.filterInfo.owner.length) {
          $("#ownerAll").addClass("active");
          this.isCheckOwnerAll = true;
        } else {
          $("#ownerAll").removeClass("active");
          this.isCheckOwnerAll = false;
        }
      } else if (filterCat === "floor") {
        if (this.filterInfo.tempFloor.length === this.filterInfo.floor.length) {
          $("#floorAll").addClass("active");
          this.isCheckFloorAll = true;
        } else {
          $("#floorAll").removeClass("active");
          this.isCheckFloorAll = false;
        }
      }
      let tempData = data.filter(el => {
        this.filterInfo.tempTemp.includes(el.refType);
        return this.filterInfo.tempTemp.includes(el.refType);
      });

      tempData = tempData.filter(el => {
        return this.filterInfo.tempOwner.includes(el.owner);
      });

      tempData = tempData.filter(el => {
        return this.filterInfo.tempFloor.includes(el.floor);
      });

      this.refInfo = [];
      tempData.forEach(item => {
        this.refInfo.push({
          floor: item.floor,
          owner: item.owner,
          refType: item.refType
        });
        // console.log(item, index, this.refInfo);
      });

      console.log(tempData);
      this.render(tempData);
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
div,
span,
h1,
h2,
h3,
h4,
h5 {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Microsoft JhengHei", Roboto, "Helvetica Neue", Arial, sans-serif;
}
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
