<template>
  <div>
    <nav class="navbar navbar-expand-sm navbar-light bg-white">
      <div class="container">
        <a
          class="navbar-brand"
          href="http://192.168.116.232.xip.io/TMSS2/?#/table"
          ><img src="../assets/sofiva_logo.jpg" width="240" height="80" alt=""
        /></a>

        <button
          class="navbar-toggler d-lg-none"
          type="button"
          data-toggle="collapse"
          data-target="#collapsibleNavId"
          aria-controls="collapsibleNavId"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="collapsibleNavId">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item active mr-2">
              <router-link class="nav-link active" :to="{ name: 'Table' }"
                >報表</router-link
              >
            </li>
            <li class="nav-item active mr-2">
              <router-link class="nav-link" :to="{ name: 'Plot' }"
                >圖表</router-link
              >
            </li>
          </ul>
          <div class="user-icon pr-3">
            <span style="font-size: 24px; color:gray;">
              <i class="far fa-user"></i>
            </span>
            <span class="pl-2" v-if="userName != ''"> {{ userName }}</span>
          </div>
          <form class="form-inline my-2 my-lg-0">
            <GoogleLogin
              class="btn btn-outline-primary my-2 my-sm-0 mr-1"
              type="submit"
              data-toggle="modal"
              data-target="#loginModal"
              :params="params"
              :onSuccess="onSuccess"
              :onFailure="onFailure"
              v-if="userName == ''"
              >Login</GoogleLogin
            >

            <button
              class="btn btn-outline-primary my-2 my-sm-0 mr-1"
              v-if="userName != ''"
              @click.prevent="logout()"
            >
              SignOut
            </button>
          </form>
        </div>
      </div>
    </nav>
    <div class="rainbow-box"></div>
    <MainTable :userName="userName" />
    <Footer />

    <div
      class="modal fade"
      id="loginAlert"
      tabindex="-1"
      aria-labelledby="loginAlertLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="loginAlertLabel">尚未登入</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              @click.prevent="returnLogin"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            目前尚未登入，請至登入頁面重新登入
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click.prevent="returnLogin"
            >
              返回登入頁面
            </button>
          </div>
        </div>
      </div>
    </div>

    <div id="modalBackdrop" class="modal-backdrop fade"></div>
  </div>
</template>

<script src="https://apis.google.com/js/platform.js" async defer></script>
<script src="vueAuth.js"></script>
<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
// import Nav from '@/components/Nav.vue';
import MainTable from "@/components/table/Main.vue";
import Footer from "@/components/Footer.vue";
import GoogleLogin from "vue-google-login";
import $ from "jquery";

// import Vue from "vue";
// Vue.GoogleAuth.then(auth2 => {
//   console.log(auth2.isSignedIn.get());
//   console.log(auth2.currentUser.get());

//   auth2.signOut().then(function() {
//     console.log("User signed out.");
//   });
// });
export default {
  name: "Table",
  components: {
    // Nav,
    MainTable,
    Footer,
    GoogleLogin
  },
  data() {
    return {
      name: "",
      userName: "",
      params: {
        client_id:
          "941225549147-7ug8m79mq97mki24g0jb304u8ehctu24.apps.googleusercontent.com"
      }
    };
  },
  methods: {
    onSuccess(googleUser) {
      console.log(googleUser);

      // This only gets the user information: id, name, imageUrl and email
      console.log(googleUser.getBasicProfile());
      this.userName = googleUser.getBasicProfile().Ad;
      const expire_days = 1; // 過期日期(天)
      const d = new Date();
      d.setTime(d.getTime() + expire_days * 24 * 60 * 60 * 1000);
      const expires = "expires=" + d.toGMTString();
      document.cookie = `UserName=${this.userName};${expires};path=/`;
    },
    onFailure(googleUser) {
      console.log(googleUser);

      // This only gets the user information: id, name, imageUrl and email
      console.log(googleUser.getBasicProfile());
      this.userName = "";
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts
          .pop()
          .split(";")
          .shift();
      } else {
        return "";
      }
    },
    logout() {
      const userCookie = this.getCookie("UserName");
      document.cookie = `UserName=${userCookie};expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      console.log(userCookie + "logout");
      this.userName = userCookie;

      const auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function() {
        console.log("User signed out.");
      });
      auth2.disconnect();
      this.$router.push("login");
      location.reload();
    },
    removeCookies() {
      var res = document.cookie;
      var multiple = res.split(";");
      for (var i = 0; i < multiple.length; i++) {
        var key = multiple[i].split("=");
        document.cookie =
          key[0] + " =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
      }
    },
    returnLogin() {
      this.$router.push("login");
    }
  },
  created() {
    const userCookie = this.getCookie("UserName");
    console.log("usercookie:" + userCookie);
    this.userName = userCookie;
    if (this.userName == "") {
      $("body").addClass("modal-open");
      $("body").css({ "padding-right": "17px" });
    } else {
      $("body").removeClass("modal-open");
    }
  },
  mounted() {
    const userCookie = this.getCookie("UserName");
    console.log("usercookie:" + userCookie);
    this.userName = userCookie;
    if (this.userName == "") {
      $("#loginAlert").addClass("show");
      $("#loginAlert").css({ display: "block", "padding-right": "17px" });
      $("#loginAlert").removeAttr("aria-hidden");
      $("#loginAlert").attr("aria-modal", "true");
      $("#loginAlert").attr("role", "dialog");
      $("#modalBackdrop").addClass("show");
    } else {
      $("#modalBackdrop").removeClass("modal-backdrop");
      $("body").removeClass("modal-open");
    }
  }
};
</script>
