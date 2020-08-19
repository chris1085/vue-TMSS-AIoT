<template>
  <!-- <h1>{{ msg }}</h1> -->
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
            <span class="pl-2" v-if="userName != ''"> XXX，你好</span>
          </div>
          <form class="form-inline my-2 my-lg-0">
            <!-- <button
              class="btn btn-outline-primary my-2 my-sm-0 mr-1"
              type="submit"
              data-toggle="modal"
              data-target="#loginModal"
            >
              登入
            </button> -->

            <!-- <span>{{ childValue }}</span>
            <input type="button" value="點選觸發" @click="childClick" /> -->
            <!-- <GoogleLogin
              class="btn btn-outline-primary my-2 my-sm-0 mr-1"
              type="submit"
              data-toggle="modal"
              data-target="#loginModal"
              :params="params"
              :onSuccess="onSuccess"
              :onFailure="onFailure"
              v-if="userName == ''"
              @click="childClick"
              >Login</GoogleLogin
            >
           
            <GoogleLogin
              class="btn btn-outline-primary my-2 my-sm-0 mr-1 hide"
              type="submit"
              data-toggle="modal"
              data-target="#loginModal"
              :params="params"
              :logoutButton="true"
              v-if="userName != ''"
              >Logout</GoogleLogin
            > -->
          </form>
        </div>
      </div>
    </nav>
    <div class="rainbow-box"></div>
  </div>
</template>

<script>
// import GoogleLogin from 'vue-google-login';
export default {
  name: "Nav",
  data() {
    return {
      text: "test",
      userName: "",
      childValue: "我是子元件的資料",
      // client_id is the only required property but you can add several more params, full list down bellow on the Auth api section
      params: {
        client_id:
          "685519562273-1g8u1nu7slt7gc50b12i0nfn3hv7obci.apps.googleusercontent.com"
      }
      // only needed if you want to render the button with the google ui
      // renderParams: {
      //   // width: 250,
      //   // height: 50,
      //   longtitle: true
      // }
    };
  },
  props: {
    msg: String
  },
  components: {
    // GoogleLogin
  },
  methods: {
    // onSuccess(googleUser) {
    //   console.log(googleUser);

    //   // This only gets the user information: id, name, imageUrl and email
    //   console.log(googleUser.getBasicProfile());
    // },
    childClick() {
      // childByValue是在父元件on監聽的方法
      // 第二個引數this.childValue是需要傳的值
      this.$emit("childByValue", this.childValue);
    }
  }
};
</script>
