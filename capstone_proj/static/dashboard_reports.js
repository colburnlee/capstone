var app = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
      parentCompanyData: '',
      refreshToken: '',
      invoiceData: "",
      listCustomerData: "",
      listBillData: [],
      lookupCompany: [],
      companyTest: '',
    },

    created () {
        axios
            .get("/qbo_request/")
            .then(response => (this.parentCompanyData = response))
    },

    methods: {
      refreshCurrentToken: function() {
        this.refreshToken = "loading..."
        axios
          .get("/refresh/")
          .then(response => {(this.refreshToken = `New session token created: ${JSON.stringify(response.data)}`)})
      },

      parseText: function() {

      },

      invoiceRequest: function() {
        this.invoiceData = "loading..."
        axios
          .get("/invoice/")
          .then(response => {
            this.invoiceData = response.data
            this.invoiceData = JSON.stringify(this.invoiceData)
            this.invoiceData = JSON.parse(this.invoiceData)
            console.log(typeof this.invoiceData)
          }
          
          )
        .catch(error => {console.log(error)})
      },    

      listCustomers: function() {
        this.listCustomerData = "loading..."
        axios
          .get("/list_customers/")
          .then(response => (this.listCustomerData = JSON.stringify(response.data)))
          .then(JSON.parse(this.listCustomerData))
      },

      listBills: function() {
        this.listBillData = "loading..."
        axios
          .get("/list_bills/")
          .then(response => (this.listBillData = JSON.stringify(response)))
      },

      lookupCompanyById: function() {
        this.lookupCompany = "loading..."
        axios
          .get("/company_lookup/")
          .then(response => (this.lookupCompany = JSON.stringify(response)))
      },

      manualCompanyLookup: function() {
        this.companyTest = "loading..."
        axios
          .get("/manual_company_info/")
          .then(response => this.companyTest = JSON.stringify(response))
      },

      }
    

    

})
  
  console.log(app)