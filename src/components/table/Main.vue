<template>
  <div>
    <loading :active.sync="isLoading"></loading>

    <div class="container">
      <div class="banner pt-4 pb-4 text-left font-weight-bold">
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

      <div class="table-responsive mt-5 mb-2">
        <table class="table table-bordered text-center table-hover table-fixed">
          <!-- <caption>
            {{
              dateChoosed
            }}
          </caption> -->
          <thead>
            <tr style="font-weight:bold; font-size:24px;">
              <th width="100%" scope="col" :colspan="10">
                人工智慧即時溫度監控簽核表單 {{ dateChoosed }}
              </th>
            </tr>
          </thead>
          <thead>
            <tr style="font-weight:bold" class="text-center">
              <th scope="col" rowspan="2" class="align-middle">Ref ID</th>
              <th scope="col" rowspan="2" class="align-middle">Floor</th>
              <th scope="col" rowspan="2" class="align-middle">Owner</th>
              <th scope="col" rowspan="2" class="align-middle">Ref Type</th>
              <th scope="col" rowspan="2" class="align-middle">AVG Temp</th>
              <th scope="col" rowspan="2" class="align-middle">Status</th>
              <th scope="col" rowspan="2" class="align-middle">Note</th>
              <th scope="col" rowspan="2" class="align-middle">
                All
                <input
                  type="checkbox"
                  name="checkAll"
                  id="checkAll"
                  @click="toggleCheck"
                  :disabled="userName === ''"
                />
              </th>
              <th scope="col" rowspan="2" class="align-middle">
                Email Alarm
              </th>
            </tr>
          </thead>
          <tbody v-for="(node, index) in uniqueNodes" :key="index">
            <tr>
              <td class="align-middle node">{{ node.RefID }}</td>
              <td class="align-middle">{{ node.Floor }}</td>
              <td class="align-middle nodeOwner">{{ node.Owner }}</td>
              <td class="align-middle">{{ node.RefType }} °C</td>
              <td
                class="align-middle"
                :class="{
                  'over-temp':
                    parseFloat(node.AvgTemp) > parseFloat(node.Accept_hi) ||
                    parseFloat(node.AvgTemp) < parseFloat(node.Accept_lo)
                }"
              >
                {{ node.AvgTemp }} °C
              </td>
              <td class="align-middle status">{{ node.Status }}</td>
              <td class="align-middle">
                {{ node.Note }}
                <input
                  type="email"
                  class="form-control"
                  :id="'noteInput_' + node.RefID"
                  aria-describedby="noteInput"
                  placeholder="Ex: 故障、除霜、維修中"
                  v-if="
                    node.Note == null &&
                      userName !== '' &&
                      (node.Status == null || node.Status == '')
                  "
                  @keydown.enter.13="addNote(node.RefID, $event.target.value)"
                />
              </td>
              <td class="align-middle">
                <input
                  type="checkbox"
                  name="checkbox[]"
                  :value="index"
                  :checked="node.Status !== null && node.Status !== ''"
                  :disabled="
                    userName === '' ||
                      (node.Status !== null && node.Status !== '')
                  "
                />
              </td>
              <td class="align-middle">
                <toggle-button
                  :value="node.Switch"
                  :labels="{ checked: 'On', unchecked: 'Off' }"
                  :color="{ checked: '#17A4BA' }"
                  @change="emailToggleChange(node.RefID, $event.value)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex pb-5 w-100">
        <div class="download ml-auto pt-4 mr-3">
          <button
            type="button"
            class="btn btn-info"
            @click.prevent="addNoteAll"
          >
            Save Note
          </button>
        </div>
        <div class="download pt-4">
          <button
            type="button"
            class="btn btn-info"
            data-toggle="modal"
            data-target="#signAlert"
            @click.prevent="checkOwner()"
          >
            Sign
          </button>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="signAlert"
      tabindex="-1"
      aria-labelledby="signAlertLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="signAlertLabel">溫馨提示</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>當前登入使用者: {{ userName }}</p>
            <p>已勾選冰箱保管人: {{ tempSignOwnerStr }}</p>
            <p style="color:red">
              注意:
              請確認已勾選冰箱「保管人」及當前登入「使用者」是否正確，如果簽核錯誤，小心系統會爆炸喔喔喔!!
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-info"
              @click.prevent="signSelect"
            >
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
// import Footer from "@/components/Footer.vue";
// import Nav from "@/components/Nav.vue";
import DatePicker from "vue2-datepicker";
// import { mdbSwitch } from "mdbvue";
import "vue2-datepicker/index.css";
import $ from "jquery";
import axios from "axios";
axios.defaults.withCredentials = false;
import "vue-loading-overlay/dist/vue-loading.css";
import { ToggleButton } from "vue-js-toggle-button";

const today = new Date();
today.setHours(0, 0, 0, 0);

export default {
  props: {
    userName: String
  },
  components: { loading: Loading, DatePicker, ToggleButton },
  data() {
    return {
      userInfo: {
        name: ""
      },
      checked: true,
      tempNote: "",
      isCheckFloorAll: true,
      isCheckTempAll: true,
      isCheckOwnerAll: true,
      isLoading: false,
      fullPage: true,
      posts: false,
      refInfo: [],
      tempData: [],
      tempNodes: [],
      tempSignOwner: [],
      tempSignOwnerStr: "",
      uniqueNodes: [],
      dateChoosed: new Date(Date.now() - 864e5).toISOString().slice(0, 10),
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
      }
    };
  },
  methods: {
    notAfterToday(date) {
      return date > today - 1;
    },
    getData(date = new Date(Date.now() - 864e5).toISOString().slice(0, 10)) {
      const url = "http://192.168.116.232/tms_rest/dailyTemperature.php";
      this.isLoading = true;
      this.tempDate = date;
      this.uniqueNodes = [];
      this.tempNodes = [];
      this.tempData = [];

      axios
        .get(`${url}`, { params: { Date: date } })
        .then(res => {
          this.tempData = res.data;
          this.tempNodes = res.data;
          this.uniqueNodes = this.tempNodes;
          this.tempNodes = this.tempNodes.sort(function(a, b) {
            return a.Status > b.Status ? 1 : -1;
          });

          // console.log(res.data);

          this.tempData.forEach(el => {
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

          // console.log(this.filterInfo);
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    render(dataRender) {
      console.log(this.userName);
      this.uniqueNodes = dataRender;

      console.log(this.uniqueNodes);
    },
    checkAll(filterCat) {
      let data = this.tempData;
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
        this.filterInfo.tempTemp.includes(el.RefType);
        return this.filterInfo.tempTemp.includes(el.RefType);
      });

      tempData = tempData.filter(el => {
        return this.filterInfo.tempOwner.includes(el.Owner);
      });

      tempData = tempData.filter(el => {
        return this.filterInfo.tempFloor.includes(el.Floor);
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

      // console.log(tempData);
      this.render(tempData);
    },
    selectDate() {
      // console.log(this.dateChoosed);
      this.getData(this.dateChoosed);
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
        return (
          nodes.queryResult[0].statusOwner +
          " " +
          nodes.queryResult[0].statusDate.slice(-5)
        );
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
    putData: function() {
      const dataStringify = JSON.stringify(this.tempNodes);
      // console.log(dataStringify);
      axios
        .put("http://192.168.116.232/tms_rest/sign.php", dataStringify)
        .then(res => {
          console.table(res.data);
        })
        .catch(error => {
          console.error(error);
        });
    },
    signSelect: function() {
      const vm = this;
      const signDate = new Date(Date.now()).toISOString().slice(0, 10);

      // vm.tempData.sort((a, b) => parseInt(a.node) - parseInt(b.node));
      $("input[name='checkbox[]']").each(function(index, el) {
        if (!el.disabled && el.checked) {
          const nodeName = $(this)
            .parent()
            .siblings(".node")
            .text();
          // console.log(nodeName);

          $(this).prop("disabled", true);

          $(this)
            .parent()
            .siblings(".status")
            .text(vm.userName + " " + signDate);

          vm.tempNodes.forEach(el => {
            if (el.RefID === nodeName) {
              el.Status = vm.userName + " " + signDate;
            }
          });
        }
      });

      $("#signAlert").modal("hide");

      this.putData();
    },
    addNote(id, tempNote) {
      this.isLoading = true;
      console.log(id, tempNote);
      const signDate = new Date(Date.now()).toISOString().slice(0, 10);
      this.tempNodes.forEach(el => {
        if (el.RefID === id && tempNote != "") {
          el.Note = tempNote + ", " + this.userName + " " + signDate;
          console.log(el);
        }
      });

      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
      this.putData();
    },
    addNoteAll() {
      this.isLoading = true;

      const signDate = new Date(Date.now()).toISOString().slice(0, 10);

      this.tempNodes.forEach(node => {
        if ($("#noteInput_" + node.RefID).val() !== undefined) {
          if ($("#noteInput_" + node.RefID).val() !== "") {
            console.log(node.RefID, $("#noteInput_" + node.RefID).val());
            node.Note =
              $("#noteInput_" + node.RefID).val() +
              ", " +
              this.userName +
              " " +
              signDate;
          }
        }
      });

      setTimeout(() => {
        this.isLoading = false;
      }, 1000);

      this.putData();
    },
    emailToggleChange(id, toggleValue) {
      this.isLoading = true;

      this.tempNodes.forEach(el => {
        if (el.RefID === id) {
          el["Switch"] = toggleValue;
          console.log(el, el.Switch, toggleValue);
        }
      });

      setTimeout(() => {
        this.isLoading = false;
        console.log(id);
      }, 3000);
      this.putData();
    },
    checkOwner() {
      this.tempSignOwner = [];
      this.tempSignOwnerStr = "";
      let tempOwner = [];
      $("input[name='checkbox[]']").each(function(index, el) {
        if (!el.disabled && el.checked) {
          let nodeName = $(this)
            .parent()
            .siblings(".nodeOwner")
            .text();

          if (nodeName !== undefined) {
            tempOwner.push(nodeName);
          }
        }
      });
      this.tempSignOwner = [...new Set(tempOwner)];
      this.tempSignOwner.forEach((el, i) => {
        if (i == 0) {
          this.tempSignOwnerStr += el;
        } else {
          this.tempSignOwnerStr += ", " + el;
        }
      });

      this.tempSignOwnerStr =
        this.tempSignOwner.length == 0 ? "尚無勾選" : this.tempSignOwnerStr;

      console.log(this.tempSignOwnerStr);
    }
  },
  computed: {},

  created() {},
  mounted() {
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    this.getData(yesterday);
  }
};
</script>
