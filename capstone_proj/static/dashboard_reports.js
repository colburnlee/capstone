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
      manualInvoice: [],
      manualInvoiceCompany: "",
      transactionNumber: "",
      manualInvoiceLineItems: "",
    },

    created () {
        axios
            .get("/qbo_request/")
            .then(response => {
              this.parentCompanyData = response
              // console.log(this.parentCompanyData)
            })
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

      manualCompanyInvoice: function(transactionNumber) {
        this.manualInvoice = "loading..."
        this.manualInvoiceCompany = "loading..."
        console.log(transactionNumber)
        axios
          .get(`/manual_invoice/${transactionNumber}`)
          .then(response => {
            this.manualInvoice= response
            this.manualInvoiceCompany = this.manualInvoice.data.Invoice.CustomerRef.name
            this.manualInvoiceLineItems = this.manualInvoice.data.Invoice.Line
          })
          .catch(error => {console.log(error)})
      },
      }
})