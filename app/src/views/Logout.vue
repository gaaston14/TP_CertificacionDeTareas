<script>
  import Vue from 'vue'
  export default {
    mounted() {
      this.logout()
    },
    methods: {
      logout() {
        try {
          localStorage.removeItem('token')
          Vue.prototype.$isLogged = false
          Vue.prototype.$isAdmin = false
          this.$router.push('/login')
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
</script>
