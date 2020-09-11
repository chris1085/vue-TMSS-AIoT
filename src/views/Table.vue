<template>
  <div>
    <nav class="navbar navbar-expand-sm navbar-light bg-white">
      <div class="container">
        <a class="navbar-brand" href="./index.html"
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
    }
  },
  mounted() {
    const userCookie = this.getCookie("UserName");
    console.log("usercookie:" + userCookie);
    this.userName = userCookie;
  }
};
</script>
