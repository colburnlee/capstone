var app = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
      message: 'Hello Vue!',
      parentCompanyData: '',
      refreshToken: '',
      invoiceData: '',
      listCustomerData: '',
    },

    created () {
        axios
            .get("/qbo_request/")
            .then(response => (this.parentCompanyData = response))
    },

    methods: {
      refreshToken: function() {
        this.refreshToken = "loading..."
        axios
          .get("/refresh/")
          .then(response => (this.refreshToken = `Refreshed token: ${response}`))
      },

      invoiceRequest: function() {
        this.invoiceData = "loading..."
        axios
          .get("/invoice/")
          .then(response => (this.invoiceData = response))
      },    

      listCustomers: function() {
        this.listCustomerData = "loading..."
        axios
          .get("/list_customers/")
          .then(response => (this.listCustomerData = response))
      }

      }
    

    

})
  
  console.log(app)