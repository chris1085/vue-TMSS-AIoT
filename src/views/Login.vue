<template>
  <div>
    <div
      class="container d-flex justify-content-center align-items-center my-5"
    >
      <form class="form-inline my-2 my-lg-0">
        <GoogleLogin
          class="btn btn-outline-primary my-2 my-sm-0 mr-1"
          type="submit"
          data-toggle="modal"
          data-target="#loginModal"
          :params="params"
          :onSuccess="onSuccess"
          :onFailure="onFailure"
          >Login</GoogleLogin
        >
      </form>
    </div>
  </div>
</template>

<script src="https://apis.google.com/js/platform.js" async defer></script>
<script src="vueAuth.js"></script>
<script>
import GoogleLogin from "vue-google-login";
export default {
  components: {
    GoogleLogin
  },
  data() {
    return {
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
      this.$router.push("table");
    },
    onFailure(googleUser) {
      console.log(googleUser);

      // This only gets the user information: id, name, imageUrl and email
      console.log(googleUser.getBasicProfile());
      this.userName = "";
    }
  }
};
</script>
