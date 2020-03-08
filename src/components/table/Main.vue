<template>
  <div class>
    <div class="container">
      <div class="banner pt-4 pb-4 text-left font-weight-bold">
        <h1>{{ userName }}</h1>
        <h1>人工智慧即時溫度監控簽核系統</h1>
        <h2>TMSS-AIoT</h2>
        <div class="d-flex justify-content-between h-100 banner-time-content pt-1">
          <h2 class="pt-2 sub-title">慧智臨床基因醫學實驗室</h2>
          <span class="nips-updatedTime" style="display: inline-flex;align-items:flex-end ;">Last Updated:</span>
        </div>
      </div>

      <div class="d-flex pt-4 pl-3 flex-column menu">
        <div class="d-flex align-items-center pb-4">
          <span style="font-size: 18px">樓層：</span>
          <div class="btn-group btn-group-toggle mr-4" data-toggle="buttons">
            <label class="btn btn-outline-info active" id="floorAll">
              <input type="checkbox" name="options" @click="checkFloorAll()" v-model="isCheckFloorAll" />All
            </label>
            <label
              class="btn btn-outline-info active"
              v-for="(item, index) in floor"
              :key="index"
              :id="item"
              @change="updateCheckFloorAll()"
            >
              <input type="checkbox" name="options" :value="item" v-model="floorArray" />
              <!-- <input type="checkbox" name="options" v-if="index !== 0" /> -->
              {{ item }}
            </label>
          </div>

          <span style="font-size: 18px">溫度：</span>
          <div class="btn-group btn-group-toggle mr-2" data-toggle="buttons">
            <label class="btn btn-outline-info active" id="tempAll">
              <input type="checkbox" name="options" @click="checkTempAll()" v-model="isCheckTempAll" />
              All
            </label>
            <label
              class="btn btn-outline-info active"
              v-for="(item, index) in temperature"
              :key="index"
              :id="item"
              @change="updateCheckTempAll()"
            >
              <input type="checkbox" name="options" :value="item" v-model="tempArray" />
              <!-- <input type="checkbox" name="options" v-else /> -->
              {{ item }}
            </label>
          </div>
        </div>

        <div class="d-flex align-items-center pb-4">
          <span style="font-size: 18px">負責人：</span>
          <div class="btn-group btn-group-toggle mr-2" data-toggle="buttons">
            <label class="btn btn-outline-info active" id="ownerAll">
              <input type="checkbox" name="options" @click="checkOwnerAll()" v-model="isCheckOwnerAll" />
              All
            </label>
            <label class="btn btn-outline-info active" v-for="(item, index) in owner" :key="index" :id="item">
              <input
                type="checkbox"
                name="options"
                :value="item"
                v-model="ownerArray"
                @change="updateCheckOwnerAll()"
              />
              <!-- <input type="checkbox" name="options" v-else /> -->
              {{ item }}
            </label>
          </div>
        </div>
        <!-- <span>Checked floor: {{ floorArray }}</span>
        <span>Checked temp: {{ tempArray }}</span>
        <span>Checked owner: {{ ownerArray }}</span>-->

        <div class="menu-title">
          <span>Selector</span>
        </div>
      </div>

      <div class="d-flex pt-4 pb-4 align-items-center text-center">
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
          <label
            class="btn btn-outline-info timeChoosed"
            v-for="(item, index) in timeFormat"
            :key="index"
            :class="{ active: index === 0 }"
            @click.prevent="chooseTimeFormat"
          >
            <input type="radio" name="options" :checked="index === 0" />
            <!-- <input type="radio" name="options" v-else /> -->
            {{ item }}
          </label>
        </div>
        <div class>
          <!-- <date-picker v-model="time1" valueType="format"></date-picker>
          <date-picker v-model="time2" type="datetime"></date-picker>-->
          <!-- <date-picker v-model="value2" :disabled-date="notAfterToday"></date-picker> -->
          <date-picker
            v-model="value3"
            :type="datepickerType"
            :disabled-date="notAfterToday"
            :placeholder="datepickerPlaceholder"
            class="px-3"
            value-type="format"
            :format="datapickerFormatOutput"
            @change="selectDate"
          ></date-picker>

          <!-- <date-picker v-model="value2" type="month" placeholder="Select month"></date-picker> -->

          <!-- <date-picker
            v-model="value3"
            type="week"
            :disabled-date="notAfterToday"
            placeholder="Select week"
            class="px-3"
          ></date-picker>-->

          <!-- <date-picker
            v-model="value2"
            type="date"
            range
            :disabled-date="notAfterToday"
            class="pr-3 col-10"
          ></date-picker>-->
          <!-- <span>{{ value3 }}</span> -->
        </div>
        <div class="d-flex align-items-center">
          <nav aria-label="Page navigation example d-flex align-items-center">
            <ul class="pagination">
              <li class="page-item">
                <a class="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true" class="text-info">&laquo; Previous</span>
                </a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true" class="text-info">Next &raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div class="d-flex align-middle ml-auto text-center justify-content-center">
          <div class="download">
            <button type="button" class="btn btn-info">Download</button>
          </div>
        </div>
        <!-- <div v-for="(n,index) in tempData[0].queryResult" :key="n">{{index}}</div> -->
      </div>
      <div class="py-3" v-if="queryMessage !== ''">
        <h3>{{ queryMessage }}</h3>
      </div>
      <div class="table-responsive pb-1">
        <table class="table table-bordered text-center table-hover">
          <caption>
            {{
              chooseTime
            }}
          </caption>
          <thead>
            <tr style="font-weight:bold; font-size:24px;">
              <th width="100%" scope="col" :colspan="tempData[0].queryResult.length * calcResult(resultForamt) + 7">
                人工智慧即時溫度監控簽核表單
              </th>
            </tr>
          </thead>
          <thead>
            <tr style="font-weight:bold" class="text-center">
              <th scope="col" rowspan="2" class="align-middle">Node</th>
              <th scope="col" rowspan="2" class="align-middle">Floor</th>
              <th scope="col" rowspan="2" class="align-middle">Owner</th>
              <th scope="col" rowspan="2" class="align-middle">Temp</th>
              <th
                scope="col"
                :colspan="calcResult(resultForamt)"
                v-for="(n, index) in tempData[0].queryResult"
                :key="index"
              >
                {{ n.date }}
              </th>
              <th scope="col" rowspan="2" class="align-middle">Status</th>
              <th scope="col" rowspan="2" class="align-middle">Note</th>
              <th scope="col" rowspan="2" class="align-middle">
                All
                <input type="checkbox" name="checkAll" id="checkAll" @click="toggleCheck" />
              </th>
            </tr>
            <tr>
              <th
                scope="col"
                v-for="(n, index) in tempData[0].queryResult.length * calcResult(resultForamt)"
                :key="index"
              >
                <span v-if="index % 3 == 1 || calcResult(resultForamt) == 1">Ave</span>
                <span v-if="index % 3 == 2 && calcResult(resultForamt) == 3">Min</span>
                <span v-if="index % 3 == 0 && calcResult(resultForamt) == 3">Max</span>
              </th>
            </tr>
          </thead>
          <tbody v-for="(nodes, index) in filterArray" :key="index">
            <tr :class="{ 'over-date': overTime(nodes.queryResult) === true }">
              <td class="align-middle">{{ nodes.node }}</td>
              <td class="align-middle">{{ nodes.floor }}</td>
              <td class="align-middle">{{ nodes.owner }}</td>
              <td class="align-middle">{{ nodes.temp }}</td>
              <template v-for="(qrs, index) in nodes.queryResult">
                <td
                  :key="'max' + index"
                  :class="{ 'over-temp': qrs.max > 6 }"
                  class="align-middle"
                  v-if="qrs.max != '' && calcResult(resultForamt) == 3"
                >
                  {{ qrs.max }}
                </td>
                <td
                  :key="'ave' + index"
                  :class="{
                    'over-ave-temp': (qrs.ave > 5 || qrs.ave < 3) && qrs.ave != ''
                  }"
                  class="align-middle"
                  v-if="qrs.ave != ''"
                >
                  {{ qrs.ave }}
                </td>
                <td
                  :key="'min' + index"
                  :class="{ 'over-temp': qrs.min < 2 && qrs.min != '' }"
                  class="align-middle"
                  v-if="qrs.min != '' && calcResult(resultForamt) == 3"
                >
                  {{ qrs.min }}
                </td>

                <td
                  :key="'max' + index"
                  :class="{ 'over-temp': qrs.max > 6 }"
                  class="align-middle"
                  v-if="qrs.max === '' && calcResult(resultForamt) == 3"
                >
                  -
                </td>
                <td
                  :key="'ave' + index"
                  :class="{
                    'over-ave-temp': (qrs.ave > 5 || qrs.ave < 3) && qrs.ave != ''
                  }"
                  class="align-middle"
                  v-if="qrs.ave === ''"
                >
                  {{ qrs.note }}
                </td>
                <td
                  :key="'min' + index"
                  :class="{ 'over-temp': qrs.min < 2 && qrs.min != '' }"
                  class="align-middle"
                  v-if="qrs.min === '' && calcResult(resultForamt) == 3"
                >
                  -
                </td>
              </template>
              <td class="align-middle status">{{ statusCheck(nodes) }}</td>
              <td class="align-middle">{{ noteCheck(nodes) }}</td>
              <td scope="row" class="align-middle">
                <input
                  type="checkbox"
                  :disabled="nodes.queryResult[0].status != ''"
                  :checked="nodes.queryResult[0].status != ''"
                  name="checkbox[]"
                  :value="index"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex pb-5">
        <div class="download ml-auto pt-4">
          <button type="button" class="btn btn-info" @click.prevent="signSelect">Sign</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import axios from "axios";
import $ from "jquery";

// $(function() {
//   $('input[name="daterange"]').daterangepicker(
//     {
//       opens: 'left'
//     },
//     function(start, end, label) {
//       console.log('A new date selection was made: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
//     }
//   );
// });

// $('.input-daterange input').each(function() {
//   $(this).datepicker('clearDates');
// });
const today = new Date();
today.setHours(0, 0, 0, 0);

export default {
  props: {
    userName: String
  },
  components: { DatePicker },
  created() {
    let currDate = new Date();
    console.log(currDate);
    let day = currDate.getDay(),
      diff = currDate.getDate() - day + (day == 0 ? -6 : 0);

    let currDateFormat = new Date(currDate).toISOString().slice(0, 10);
    let lastDate = new Date(
      currDateFormat.split("-")[0] + "-" + currDateFormat.split("-")[1] + "-" + ("0" + (diff + 6)).slice(-2)
    )
      .toISOString()
      .slice(0, 10);

    if (currDateFormat < lastDate) {
      lastDate = currDateFormat;
    }

    // console.log(currDateFormat, day, diff, lastDate);

    let firstDay = new Date(currDate.setDate(diff)).toISOString().slice(0, 10);
    // this.dateQuery = { begin: firstDay, end: lastDate };

    // axios
    //   .get("ajaxfile.php", {
    //     params: {
    //       fromdate: firstDay,
    //       todate: lastDate
    //     }
    //   })
    //   .then(function(response) {
    //     this.tempData = response.data;

    //     if (this.tempData.length == 0) {
    //       this.queryMessage = "目前沒有 " + firstDay + " 至 " +lastDate + " 的資料，請重新搜尋！";
    //     }
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //   });
    console.log(firstDay, lastDate, currDateFormat);
  },
  methods: {
    notAfterToday(date) {
      return date > today;
    },
    chooseTimeFormat(e) {
      this.chooseTime = $.trim($(e.target).text()) + "報表";
      // console.log($.trim($(e.target).text()));

      if ($.trim($(e.target).text()) === "週") {
        this.datepickerPlaceholder = "Select week";
        this.datepickerType = "week";
        this.datapickerFormatOutput = "YYYY-MM-DD 第ww週";
        // this.value3 = "1";
      } else {
        this.datepickerPlaceholder = "Select month";
        this.datepickerType = "month";
        this.datapickerFormatOutput = "YYYY-MM-DD MM月";

        // this.value3 = "2020-02";
        // console.log(this.datepickerPlaceholder, this.datepickerType);
      }

      return this.chooseTime;
    },
    calcResult(result) {
      // console.log(result, this.chooseTime);
      if (this.chooseTime === "週報表") {
        result = 3;
      } else {
        result = 1;
      }

      return result;
    },
    statusCheck: function(nodes) {
      let dateNmuber = nodes.queryResult.length;
      let signedNumber = 0;
      // console.log(dateNmuber);

      nodes.queryResult.forEach(el => {
        // console.log(el.queryResult.statusDate, el.owner);

        if (el.statusDate != "") {
          signedNumber++;
        }
      });
      // console.log(dateNmuber, signedNumber);
      if (dateNmuber === signedNumber) {
        return nodes.queryResult[0].statusOwner + " " + nodes.queryResult[0].statusDate.slice(-5);
      } else {
        return "Unsigned";
      }
    },
    noteCheck: function(nodes) {
      let noteContent = "";
      nodes.queryResult.forEach(el => {
        if (el.note != "") {
          noteContent += el.date.slice(-5) + " " + el.note + " ";
        }
      });
      return noteContent;
    },
    toggleCheck: function() {
      if ($("#checkAll").prop("checked")) {
        // console.log("checked", $("input[name='checkbox[]']"));
        //如果全選按鈕有被選擇的話（被選擇是true）
        $("input[name='checkbox[]']").each(function(index, val) {
          if (val.disabled === false) {
            $(this).prop("checked", true);
          }
          //把所有的核取方框的property都變成勾選
        });
      } else {
        // console.log("cancelled");

        $("input[name='checkbox[]']").each(function(index, val) {
          if (val.disabled === false) {
            $(this).prop("checked", false);
          }
          //把所有的核方框的property都取消勾選
        });
      }
    },
    checkFloorAll: function() {
      this.isCheckFloorAll = !this.isCheckFloorAll;
      this.floorArray = [];
      if (this.isCheckFloorAll) {
        // Check all
        for (let key in this.floor) {
          this.floorArray.push(this.floor[key]);
          $("#" + this.floor[key]).addClass("active");
        }
      } else {
        for (let key in this.floor) {
          $("#" + this.floor[key]).removeClass("active");
        }
      }
    },
    updateCheckFloorAll: function() {
      if (this.floorArray.length == this.floor.length) {
        $("#floorAll").addClass("active");
        this.isCheckFloorAll = true;
      } else {
        $("#floorAll").removeClass("active");
        this.isCheckFloorAll = false;
      }
    },
    checkTempAll: function() {
      this.isCheckTempAll = !this.isCheckTempAll;
      this.tempArray = [];
      if (this.isCheckTempAll) {
        // Check all
        for (let key in this.temperature) {
          this.tempArray.push(this.temperature[key]);
          $("#" + this.temperature[key]).addClass("active");
        }
      } else {
        for (let key in this.temperature) {
          $("#" + this.temperature[key]).removeClass("active");
        }
      }
    },
    updateCheckTempAll: function() {
      if (this.tempArray.length == this.temperature.length) {
        $("#tempAll").addClass("active");
        this.isCheckTempAll = true;
      } else {
        $("#tempAll").removeClass("active");
        this.isCheckTempAll = false;
      }
    },
    checkOwnerAll: function() {
      this.isCheckOwnerAll = !this.isCheckOwnerAll;
      this.ownerArray = [];
      if (this.isCheckOwnerAll) {
        // Check all
        for (let key in this.owner) {
          this.ownerArray.push(this.owner[key]);
          $("#" + this.owner[key]).addClass("active");
        }
      } else {
        for (let key in this.owner) {
          $("#" + this.owner[key]).removeClass("active");
        }
      }
    },
    updateCheckOwnerAll: function() {
      if (this.ownerArray.length == this.owner.length) {
        $("#ownerAll").addClass("active");
        this.isCheckOwnerAll = true;
      } else {
        $("#ownerAll").removeClass("active");
        this.isCheckOwnerAll = false;
      }
    },
    overTime: function(queryResult) {
      let queryData = queryResult[0];
      let dateArray = queryData.date.split("/");
      let queryDateEpoche = new Date(dateArray[0] + "-" + dateArray[1] + "-" + dateArray[2]).getTime() / 1000;
      const now = Date.now() / 1000; // Unix timestamp in seconds
      let interval = now - queryDateEpoche;
      // console.log(now, queryDateEpoche, interval, dateArray);
      if (queryData.status === "" && interval > 2592000) {
        return true;
      } else {
        return false;
      }
      // return false;
    },
    selectDate: function() {
      if (this.value3 !== null) {
        let dateChoosed = this.value3.split(" ")[0];
        let d = new Date(dateChoosed);

        if (this.datepickerType === "week") {
          let day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 0);
          let endDate = new Date(
            dateChoosed.split("-")[0] + "-" + dateChoosed.split("-")[1] + "-" + ("0" + (diff + 6)).slice(-2)
          )
            .toISOString()
            .slice(0, 10);
          let curDate = new Date().toISOString().slice(0, 10);
          if (curDate < endDate) {
            endDate = curDate;
          }
          let firstDay = new Date(d.setDate(diff)).toISOString().slice(0, 10);
          this.dateQuery = { begin: firstDay, end: endDate };
          console.log(dateChoosed, firstDay, endDate, curDate);
        } else if (this.datepickerType === "month") {
          let firstDay = new Date(d.getFullYear(), d.getMonth(), 2).toISOString().slice(0, 10);
          let lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString().slice(0, 10);
          let curDate = new Date().toISOString().slice(0, 10);

          if (curDate < lastDay) {
            lastDay = curDate;
          }
          this.dateQuery = { begin: firstDay, end: lastDay };

          console.log(firstDay, lastDay);
        }
      }
    },
    postData: function(data) {
      let dataStringify = JSON.stringify(data);
      axios
        .post("url/users", dataStringify)
        .then(res => {
          console.table(res.data);
        })
        .catch(error => {
          console.error(error);
        });
    },
    signSelect: function() {
      let vm = this;
      let currDate = new Date();
      let year = currDate.getUTCFullYear();
      let month = ("0" + (currDate.getMonth() + 1)).slice(-2);
      let day = ("0" + currDate.getDate()).slice(-2);
      let signDate = year + "/" + month + "/" + day;
      $("input[name='checkbox[]']").each(function(index, el) {
        if (!el.disabled && el.checked) {
          $(this).prop("disabled", true);
          $(this)
            .parent()
            .siblings(".status")
            .text(vm.userInfo.name + " " + month + "/" + day);

          for (let i = 0; i < vm.tempData[$(el).val()].queryResult.length; i++) {
            vm.tempData[$(el).val()].queryResult[i].status = "signed";
            vm.tempData[$(el).val()].queryResult[i].statusOwner = vm.userInfo.name;
            vm.tempData[$(el).val()].queryResult[i].statusDate = signDate;
          }
          // vm.tempData[$(el).val()].queryResult.status = "signed";
          // vm.tempData[$(el).val()].queryResult.statusOwner = vm.userInfo.name;
          // vm.tempData[$(el).val()].queryResult.statusDate = signDate;

          vm.newTempData.push(vm.tempData[$(el).val()]);
          // console.log($(el).val());
        }
      });
      console.log(vm.newTempData);
      this.postData(vm.newTempData);
    }
  },
  computed: {
    filterArray: function() {
      let vm = this;
      // let filterTempArray = [];
      let newTempArray = [];
      let newOwnerArray = [];
      let finalArray = [];
      // console.log(vm.floorArray, vm.tempArray, vm.ownerArray);

      for (let i = 0; i < vm.floorArray.length; i++) {
        // let newTempArray = filterTempArray;
        let result = vm.tempData.filter(function(item) {
          return item.floor.match(vm.floorArray[i]);
        });

        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            newTempArray.push(result[i]);
          }
        }
      }
      console.log("newTempArray:", newTempArray);

      for (let i = 0; i < vm.tempArray.length; i++) {
        // let newTempArray = filterTempArray;
        let result = newTempArray.filter(function(item) {
          let tempSymbol = item.temp + "°C";
          return tempSymbol.match(vm.tempArray[i]);
        });
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            newOwnerArray.push(result[i]);
          }
        }
      }

      console.log("newOwnerArray:", newOwnerArray);

      for (let i = 0; i < vm.ownerArray.length; i++) {
        let result = newOwnerArray.filter(function(item) {
          return item.owner.match(vm.ownerArray[i]);
        });
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            finalArray.push(result[i]);
          }
        }
      }

      console.log("finalArray:", finalArray);

      finalArray.sort((a, b) => parseInt(a.node) - parseInt(b.node));
      return finalArray;
    }
  },
  data() {
    return {
      userInfo: {
        name: "TK"
      },
      isCheckFloorAll: true,
      isCheckTempAll: true,
      isCheckOwnerAll: true,
      queryMessage: "",
      resultForamt: 3,
      datepickerType: "week",
      datepickerPlaceholder: "Select week",
      datapickerFormatOutput: "YYYY-MM-DD 第ww週",
      dateQuery: {
        begin: "2020/02/10",
        end: "2020/02/17"
      },
      ownerArray: ["TK", "YCC", "TL", "YL", "Wang", "Mer", "Ke", "QH", "CC"],
      floorArray: ["2F", "5F", "6F", "7F", "8F", "群智"],
      tempArray: ["4°C", "-20°C", "-80°C"],
      checkedNames: [],
      value1: [new Date(2019, 9, 8), new Date(2019, 9, 19)],
      value2: new Date(),
      value3: null,
      time1: null,
      time2: null,
      time3: null,
      text: "test",
      floor: ["2F", "5F", "6F", "7F", "8F", "群智"],
      temperature: ["4°C", "-20°C", "-80°C"],
      owner: ["TK", "YCC", "TL", "YL", "Wang", "Mer", "Ke", "QH", "CC"],
      timeFormat: ["週", "月"],
      chooseTime: "週報表",
      newTempData: [],
      tempData: [
        {
          node: "00105001",
          floor: "2F",
          owner: "Ke",
          temp: "4",
          queryResult: [
            {
              date: "2020/02/10",
              max: 12,
              ave: 8,
              min: 4,
              status: "signed",
              statusOwner: "QH",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/11",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "QH",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/12",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "QH",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/13",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "QH",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/14",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "QH",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/15",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "QH",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/16",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "QH",
              statusDate: "2020/02/17",
              note: ""
            }
          ]
        },
        {
          node: "00105023",
          floor: "5F",
          owner: "TK",
          temp: "4",
          queryResult: [
            {
              date: "2020/02/10",
              max: 7,
              ave: 4,
              min: 1,
              status: "signed",
              statusOwner: "TK",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/11",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "TK",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/12",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "TK",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/13",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "TK",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/14",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "TK",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/15",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "TK",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/16",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "TK",
              statusDate: "2020/02/17",
              note: ""
            }
          ]
        },
        {
          node: "00105027",
          floor: "6F",
          owner: "Wang",
          temp: "-20",
          queryResult: [
            {
              date: "2020/02/10",
              max: 7,
              ave: 4,
              min: 1,
              status: "signed",
              statusOwner: "Wang",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/11",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "Wang",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/12",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "Wang",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/13",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "Wang",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/14",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "Wang",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/15",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "Wang",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/16",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "Wang",
              statusDate: "2020/02/17",
              note: ""
            }
          ]
        },
        {
          node: "00105108",
          floor: "群智",
          owner: "CC",
          temp: "-80",
          queryResult: [
            {
              date: "2020/02/10",
              max: 7,
              ave: 4,
              min: 1,
              status: "",
              statusOwner: "CC",
              statusDate: "",
              note: ""
            },
            {
              date: "2020/02/11",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "",
              statusOwner: "CC",
              statusDate: "",
              note: ""
            },
            {
              date: "2020/02/12",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "",
              statusOwner: "CC",
              statusDate: "",
              note: ""
            },
            {
              date: "2020/02/13",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "",
              statusOwner: "CC",
              statusDate: "",
              note: ""
            },
            {
              date: "2020/02/14",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "",
              statusOwner: "CC",
              statusDate: "",
              note: ""
            },
            {
              date: "2020/02/15",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "",
              statusOwner: "CC",
              statusDate: "",
              note: ""
            },
            {
              date: "2020/02/16",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "",
              statusOwner: "CC",
              statusDate: "",
              note: ""
            }
          ]
        },
        {
          node: "00105044",
          floor: "7F",
          owner: "QH",
          temp: "-20",
          queryResult: [
            {
              date: "2020/02/10",
              max: "",
              ave: "",
              min: "",
              status: "signed",
              statusOwner: "QH",
              statusDate: "2020/02/17",
              note: "除霜"
            },
            {
              date: "2020/02/11",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "QH",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/12",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "QH",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/13",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "QH",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/14",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "QH",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/15",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "QH",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/16",
              max: "",
              ave: "",
              min: "",
              status: "signed",
              statusOwner: "QH",
              statusDate: "2020/02/17",
              note: "故障"
            }
          ]
        },
        {
          node: "00105025",
          floor: "2F",
          owner: "TL",
          temp: "-80",
          queryResult: [
            {
              date: "2020/02/10",
              max: "",
              ave: "",
              min: "",
              status: "signed",
              statusOwner: "TL",
              statusDate: "2020/02/17",
              note: "除霜"
            },
            {
              date: "2020/02/11",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "TL",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/12",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/13",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/14",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/15",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/16",
              max: "",
              ave: "",
              min: "",
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: "故障"
            }
          ]
        },
        {
          node: "00105025",
          floor: "2F",
          owner: "TL",
          temp: "-80",
          queryResult: [
            {
              date: "2020/02/10",
              max: "",
              ave: "",
              min: "",
              status: "signed",
              statusOwner: "TL",
              statusDate: "2020/02/17",
              note: "除霜"
            },
            {
              date: "2020/02/11",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "TL",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/12",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/13",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/14",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/15",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/16",
              max: "",
              ave: "",
              min: "",
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: "故障"
            }
          ]
        },
        {
          node: "00105025",
          floor: "2F",
          owner: "TL",
          temp: "-80",
          queryResult: [
            {
              date: "2020/02/10",
              max: "",
              ave: "",
              min: "",
              status: "signed",
              statusOwner: "TL",
              statusDate: "2020/02/17",
              note: "除霜"
            },
            {
              date: "2020/02/11",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "TL",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/12",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/13",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/14",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/15",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/16",
              max: "",
              ave: "",
              min: "",
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: "故障"
            }
          ]
        },
        {
          node: "00105025",
          floor: "2F",
          owner: "TL",
          temp: "-80",
          queryResult: [
            {
              date: "2020/02/10",
              max: "",
              ave: "",
              min: "",
              status: "signed",
              statusOwner: "TL",
              statusDate: "2020/02/17",
              note: "除霜"
            },
            {
              date: "2020/02/11",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "TL",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/12",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/13",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/14",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/15",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/16",
              max: "",
              ave: "",
              min: "",
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: "故障"
            }
          ]
        },
        {
          node: "00105025",
          floor: "2F",
          owner: "TL",
          temp: "-80",
          queryResult: [
            {
              date: "2020/02/10",
              max: "",
              ave: "",
              min: "",
              status: "signed",
              statusOwner: "TL",
              statusDate: "2020/02/17",
              note: "除霜"
            },
            {
              date: "2020/02/11",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "TL",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/12",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/13",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/14",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/15",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/16",
              max: "",
              ave: "",
              min: "",
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: "故障"
            }
          ]
        },
        {
          node: "00105025",
          floor: "2F",
          owner: "TL",
          temp: "-80",
          queryResult: [
            {
              date: "2020/02/10",
              max: "",
              ave: "",
              min: "",
              status: "signed",
              statusOwner: "TL",
              statusDate: "2020/02/17",
              note: "除霜"
            },
            {
              date: "2020/02/11",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "TL",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/12",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/13",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/14",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/15",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/16",
              max: "",
              ave: "",
              min: "",
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: "故障"
            }
          ]
        },
        {
          node: "00105025",
          floor: "2F",
          owner: "TL",
          temp: "-80",
          queryResult: [
            {
              date: "2020/02/10",
              max: "",
              ave: "",
              min: "",
              status: "signed",
              statusOwner: "TL",
              statusDate: "2020/02/17",
              note: "除霜"
            },
            {
              date: "2020/02/11",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              status: "signed",
              statusOwner: "TL",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/12",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/13",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/14",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/15",
              max: 5.2,
              ave: 3.9,
              min: 2.6,
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: ""
            },
            {
              date: "2020/02/16",
              max: "",
              ave: "",
              min: "",
              statusOwner: "TL",
              status: "signed",
              statusDate: "2020/02/17",
              note: "故障"
            }
          ]
        }
      ]

      // {
      //   Node: "1",
      //   Floor: "4F",
      //   Owner: "TK",
      //   Max: "6",
      //   Ave: "4",
      //   Min: "2",
      //   Temp: "4",
      //   time: "2020/2/10",
      //   Status: "Unsigned",
      //   Note: ""
      // },
    };
  }
};
</script>
