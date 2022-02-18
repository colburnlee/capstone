var app = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
      parentCompanyData: [],
      parentCompanyAddressLine1: "",
      parentCompanyAddressCity: "",
      parentCompanyAddressCountrySubdivisionCode: "", 
      parentCompanyAddressPostalCode: "",
      parentCompanyAddressEmailAddress: "",
      refreshToken: "",
      invoiceData: "",
      listCustomerData: "",
      listBillData: [],
      lookupCompany: [],
      manualInvoice: [],
      manualInvoiceCompany: "",
      manualInvoiceLink: "",
      transactionNumber: "",
      manualInvoiceLineItems: "",
      value: "",
      manualInvoiceTransactionDate: "",
      manualInvoiceTotalAmt: "",
      manualInvoiceDueDate: "",
      manualInvoiceItemsSold: [],
      manualInvoiceAddress: [],
      manualCustomerLookup: "",
      manualInvoiceAddressLine1: "",
      manualInvoiceAddressCity: "",
      manualInvoiceAddressCountrySubDivisionCode: "",
      manualInvoiceAddressPostalCode: "",
      manualInvoiceAddressLine2: "",
      manualInvoiceAddressLine3: "",
      manualInvoiceAddressLine4: "", 
      manualCustomerLookupDisplayName: "",
      manualCustomerLookupGivenName: "",
      manualCustomerLookupFamilyName: "",
      manualCustomerLookupActive: "", 
      manualCustomerLookupPrimaryEmailAddr: "",
      manualCustomerLookupPrimaryPhone: "",
      manualCustomerLookupBillAddr: [],
      manualCustomerLookupId: "",
      manualCustomerLookupSyncToken: "",
      manualCustomerLookupBillAddrStreet: "",
      manualCustomerLookupBillAddrCity: "",
      manualCustomerLookupBillAddrCountrySubDivisionCode: "",
      manualCustomerLookupBillAddrPostalCode: "",
      manualCustomerLookupBillAddrID: "",
      manualCustomerLookupEntryID: "",
      manualCustomerLookupView: true,
      manualCustomerLookupEdit: false,
      manualCustomerLookupEditSuccess: false,
      manualCustomerLookupEditButton: false,
      newFullyQualifiedName: "",
      newPrimaryEmailAddr: "", 
      newDisplayName: "", 
      newSuffix: "", 
      newTitle: "", 
      newMiddleName: "", 
      newNotes: "", 
      newFamilyName: "", 
      newFreeFormNumber: "", 
      newCompanyName: "", 
      newCountrySubDivisionCode: "", 
      newCity: "", 
      newPostalCode: "", 
      newLine1: "", 
      newCountry: "", 
      newGivenName: "",
      newCustomerEditModal: true,
      newCustomerSubmitted: "",
      newCustomerSuccess: "",
      newInvoiceAmount: 0,
      newInvoiceCustomerId: "",
      newInvoiceSubmitted: "",
      newInvoiceSuccess: "",
      newInvoiceView: true,
      SendExistingInvoiceEmail: "",
      SendExistingInvoiceOption: false,
      SendExistingInvoiceResponse: "",
    },

    const: csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value,

    methods: {
      getParentCompanyData: function() { // Gets info on Parent Company (the owner of the Intuit Account)
        
        this.parentCompanyAddressLine1 = "loading..."
        this.parentCompanyAddressCity = ""
        this.parentCompanyAddressCountrySubdivisionCode = ""
        this.parentCompanyAddressPostalCode = ""
        this.parentCompanyAddressEmailAddress = "loading..."

        axios
            .get("/qbo_request/")
            .then((response) => {
              this.parentCompanyData = response
              this.parentCompanyAddressLine1 = this.parentCompanyData.data.CompanyInfo.CompanyAddr.Line1
              this.parentCompanyAddressCity = this.parentCompanyData.data.CompanyInfo.CompanyAddr.City
              this.parentCompanyAddressCountrySubdivisionCode = this.parentCompanyData.data.CompanyInfo.CompanyAddr.CountrySubDivisionCode
              this.parentCompanyAddressPostalCode = this.parentCompanyData.data.CompanyInfo.CompanyAddr.PostalCode
              this.parentCompanyAddressEmailAddress = this.parentCompanyData.data.CompanyInfo.Email.Address  
            })
            .catch(error => {console.log(error)})
      },

      refreshCurrentToken: function() { // Refreshes current security token
        
        this.refreshToken = "loading..."
        axios
          .get("/refresh/")
          .then(response => {(this.refreshToken = `New session token created: ${JSON.stringify(response.data)}`)})
      },

      clearInvoiceRequest: function() { // Clears fields related to a invoice lookup
        
        this.manualInvoiceCompany = ""
        this.manualInvoiceAddress = ""
        this.manualInvoiceAddressLine1 = "" 
        this.manualInvoiceAddressLine2 = ""
        this.manualInvoiceAddressLine3 = ""
        this.manualInvoiceAddressLine4 = ""
        this.manualInvoiceAddressCity = ""
        this.manualInvoiceAddressCountrySubDivisionCode = ""
        this.manualInvoiceAddressPostalCode = ""
        this.manualInvoiceLink = ""
        this.manualInvoiceLineItems = ""
        this.manualInvoiceTransactionDate = ""
        this.manualInvoiceTotalAmt = ""
        this.manualInvoiceDueDate = ""
      },

      invoiceRequest: function() { // Calls all invoices from intuit. Intuit added in an offset for JSON, though, so this returns a string
        
        this.invoiceData = "loading..."
        axios
          .get("/invoice/")
          .then(response => {
            this.invoiceData = response.data
            // this.invoiceData = JSON.stringify(this.invoiceData)
            // this.invoiceData = JSON.parse(this.invoiceData)
            // console.log(typeof this.invoiceData)
          }
          
          )
        .catch(error => {console.log(error)})
      },    


      lookupCompanyById: function() { // Looks up an existing company by the Intuit ID
        
        this.lookupCompany = "loading..."
        axios
          .get("/company_lookup/")
          .then(response => (this.lookupCompany = JSON.stringify(response)))
      },

      manualCompanyInvoice: function(transactionNumber) { // Takes in a transaction number to return the associated invoice
        
        this.manualInvoice = "loading..."
        this.manualInvoiceCompany = "loading..."
        this.manualInvoiceLineItems = "loading..."
        

        axios
          .get(`/manual_invoice/${transactionNumber}`)
          .then(response => {
            this.manualInvoice= response.data
            this.manualInvoiceCompany = this.manualInvoice.Invoice.CustomerRef.name
            this.manualInvoiceAddress = this.manualInvoice.Invoice.BillAddr
            this.manualInvoiceAddressLine1 = this.manualInvoiceAddress.Line1
            this.manualInvoiceAddressLine2 = this.manualInvoiceAddress.Line2
            this.manualInvoiceAddressLine3 = this.manualInvoiceAddress.Line3
            this.manualInvoiceAddressLine4 = this.manualInvoiceAddress.Line4
            this.manualInvoiceAddressCity = this.manualInvoiceAddress.City
            this.manualInvoiceAddressCountrySubDivisionCode = this.manualInvoiceAddress.CountrySubDivisionCode
            this.manualInvoiceAddressPostalCode = this.manualInvoiceAddress.PostalCode
            this.manualInvoiceLink = this.manualInvoice.Invoice.InvoiceLink
            this.manualInvoiceLineItems = this.manualInvoice.Invoice.Line
            this.manualInvoiceTransactionDate = this.manualInvoice.Invoice.TxnDate
            this.manualInvoiceTotalAmt = this.manualInvoice.Invoice.TotalAmt
            this.manualInvoiceDueDate = this.manualInvoice.Invoice.DueDate

          })
          .catch(error => {console.log(error)})

      },

      lookupCustomerById: function(manualCustomerLookupId) { // Takes in Intuit Customer ID and returns Display name, address, and other info
        
        this.manualCustomerLookup= "loading..."
        this.manualCustomerLookupDisplayName= "loading..." 
        this.manualCustomerLookupGivenName= "" 
        this.manualCustomerLookupFamilyName= "loading..."
        this.manualCustomerLookupActive= "loading..." 
        this.manualCustomerLookupPrimaryEmailAddr= "loading..." 
        this.manualCustomerLookupPrimaryPhone = "loading..."
        this.manualCustomerLookupBillAddr = []
        this.manualCustomerLookupSyncToken = ""

        axios
          .get(`/read_customer/${manualCustomerLookupId}`)
          .then(response => {
            this.manualCustomerLookup = response.data
            this.manualCustomerLookupDisplayName = response.data.Customer.DisplayName
            this.manualCustomerLookupGivenName = response.data.Customer.GivenName
            this.manualCustomerLookupFamilyName = response.data.Customer.FamilyName
            this.manualCustomerLookupActive = response.data.Customer.Active
            this.manualCustomerLookupSyncToken = response.data.Customer.SyncToken
            this.manualCustomerLookupEntryID = response.data.Customer.Id
            
            // console.log(response.data)

            if (response.data.Customer.BillAddr) {
            this.manualCustomerLookupBillAddrID = response.data.Customer.BillAddr.Id
            } else {
              this.manualCustomerLookupBillAddrID = 0
            } 

            if (response.data.Customer.PrimaryEmailAddr) {
            this.manualCustomerLookupPrimaryEmailAddr = response.data.Customer.PrimaryEmailAddr.Address
            } else {
              this.manualCustomerLookupPrimaryEmailAddr = "N/A"
            }
            
            if (response.data.Customer.PrimaryPhone) {
              this.manualCustomerLookupPrimaryPhone = response.data.Customer.PrimaryPhone.FreeFormNumber
            } else {
              this.manualCustomerLookupPrimaryPhone = "N/A"
            }
            

            if (response.data.Customer.BillAddr){
            this.manualCustomerLookupBillAddrStreet = response.data.Customer.BillAddr.Line1
            this.manualCustomerLookupBillAddrCity = response.data.Customer.BillAddr.City
            this.manualCustomerLookupBillAddrCountrySubDivisionCode = response.data.Customer.BillAddr.CountrySubDivisionCode
            this.manualCustomerLookupBillAddrPostalCode = response.data.Customer.BillAddr.PostalCode
            } else {
              this.manualCustomerLookupBillAddrStreet = ""
              this.manualCustomerLookupBillAddrCity = ""
              this.manualCustomerLookupBillAddrCountrySubDivisionCode = "" 
              this.manualCustomerLookupBillAddrPostalCode = "" 
            }

            if (response.data.Customer.BillAddr) {
              this.manualCustomerLookupBillAddr = [
              this.manualCustomerLookupBillAddrStreet,
              this.manualCustomerLookupBillAddrCity,
              this.manualCustomerLookupBillAddrCountrySubDivisionCode,
              this.manualCustomerLookupBillAddrPostalCode
            ]} else {
              this.manualCustomerLookupBillAddr = false
            }
          })
          .catch(function (error) {
            console.log(error);
          })

      },   

      clearlookupCustomerById: function() {// Clears fields related customer Id Lookup
        this.manualCustomerLookup= ""
        this.manualCustomerLookupDisplayName= "" 
        this.manualCustomerLookupGivenName= "" 
        this.manualCustomerLookupFamilyName= ""
        this.manualCustomerLookupActive= "" 
        this.manualCustomerLookupPrimaryEmailAddr= "" 
        this.manualCustomerLookupPrimaryPhone = ""
        this.manualCustomerLookupBillAddr = []
        this.manualCustomerLookupSyncToken = ""
      },

      sparseUpdateCustomer: function() { // Update existing customer information
        
        let DisplayName = this.manualCustomerLookupDisplayName,
        GivenName = this.manualCustomerLookupGivenName,
        FamilyName = this.manualCustomerLookupFamilyName,
        Active = this.manualCustomerLookupActive,
        emailAddress = this.manualCustomerLookupPrimaryEmailAddr,
        PhoneNumber = this.manualCustomerLookupPrimaryPhone,
        Line1 = this.manualCustomerLookupBillAddrStreet,
        City = this.manualCustomerLookupBillAddrCity,
        CountrySubDivisionCode = this.manualCustomerLookupBillAddrCountrySubDivisionCode,
        PostalCode = this.manualCustomerLookupBillAddrPostalCode,
        BillAddrId = this.manualCustomerLookupBillAddrID,
        EntryId = this.manualCustomerLookupEntryID,
        SyncToken = this.manualCustomerLookupSyncToken;
        

        let instance = axios.create({
          'headers': {'X-CSRFToken': csrftoken}
        })
        
        let Customer = JSON.stringify({
            "PrimaryEmailAddr": {
              "Address": emailAddress
            }, 
            "DisplayName": DisplayName, 
            "GivenName": GivenName, 

            "PrimaryPhone": {
              "FreeFormNumber": PhoneNumber
            }, 
            "Active": Active, 

            "BillAddr": {
              "City": City, 
              "Line1": Line1, 
              "PostalCode": PostalCode, 
              "CountrySubDivisionCode": CountrySubDivisionCode, 
              "Id": BillAddrId
            }, 
            "SyncToken": SyncToken, 
            "CompanyName": DisplayName, 
            "FamilyName": FamilyName, 
            "sparse": true, 
            "Id": EntryId
          },
        );
        // console.log(Customer)

        axios
        instance.post('/sparse_update_customer/', Customer)
        .then(function (response) {
            // console.log(JSON.stringify(response.data));
            this.manualCustomerLookup = response.data
          })
        .catch(function (error) {
          console.log(error);
        })

      },

      clearNewCustomer: function() { // Clears fields related to creating a new customer
        
        this.newCustomerSubmitted = ""
        this.newCustomerSuccess = ""
        this.newFullyQualifiedName = ""
        this.newPrimaryEmailAddr = "" 
        this.newDisplayName = "" 
        this.newSuffix = "" 
        this.newTitle = "" 
        this.newMiddleName = "" 
        this.newNotes = "" 
        this.newFamilyName = "" 
        this.newFreeFormNumber = "" 
        this.newCompanyName = "" 
        this.newCountrySubDivisionCode = "" 
        this.newCity = "" 
        this.newPostalCode = "" 
        this.newLine1 = "" 
        this.newCountry = "" 
        this.newGivenName = ""
      },

      createNewCustomer: function(){ // Takes in new customer info from vue DOM. Submits to Intuit to create new customer entry
        
        let newCustomer = JSON.stringify({
          "FullyQualifiedName": this.newFullyQualifiedName, 
          "PrimaryEmailAddr": {
            "Address": this.newPrimaryEmailAddr
          }, 
          "DisplayName": this.newDisplayName, 
          "Suffix": this.newSuffix, 
          "Title": this.newTitle, 
          "MiddleName": this.newMiddleName, 
          "Notes": this.newNotes, 
          "FamilyName": this.newFamilyName, 
          "PrimaryPhone": {
            "FreeFormNumber": this.newFreeFormNumber
          }, 
          "CompanyName": this.newDisplayName, 
          "BillAddr": {
            "CountrySubDivisionCode": this.newCountrySubDivisionCode, 
            "City": this.newCity, 
            "PostalCode": this.newPostalCode, 
            "Line1": this.newLine1, 
            "Country": this.newCountry
          }, 
          "GivenName": this.newGivenName
        })

        // console.log(Customer)
        let instance = axios.create({
          'headers': {'X-CSRFToken': csrftoken}
        });

        axios
        instance.post('/create_new_customer/', newCustomer)
        .then(response => {
          try {
            this.newCustomerSubmitted = response.data

            if (this.newCustomerSubmitted.Customer.Id) {
            this.newCustomerSuccess = `Success! Customer '${this.newCustomerSubmitted.Customer.FullyQualifiedName}' created with Id ${this.newCustomerSubmitted.Customer.Id}`,
            this.newCustomerSubmitted = ""
            } else {
            this.newCustomerSubmitted = response.data
          }
          }
          finally {
          error => {
          this.newCustomerSubmitted = error
          console.log(error)
          }
          }        
        })
      },

      createNewInvoice: function(){ // Takes in transaction info from vue DOM. Submits to Intuit to create a new invoice to an existing customer
        

        let newInvoice = JSON.stringify({
          "Line": [
            {
              "DetailType": "SalesItemLineDetail", 
              "Amount": this.newInvoiceAmount, 
              "SalesItemLineDetail": {
                "ItemRef": {
                  "name": "Services", 
                  "value": "1"
                }
              }
            }
          ], 
          "CustomerRef": {
            "value": this.newInvoiceCustomerId
          }
        })



        let instance = axios.create({
          'headers': {'X-CSRFToken': csrftoken}
        });

        axios
        instance.post('/create_new_invoice/', newInvoice)
        .then(response => {
          try {
            this.newInvoiceSubmitted = response.data

            if (this.newInvoiceSubmitted.Invoice.domain) {
            this.newInvoiceSuccess = `Success! Customer '${this.newInvoiceSubmitted.Invoice.CustomerRef.value} - ${this.newInvoiceSubmitted.Invoice.CustomerRef.name}' invoice has been created for $${this.newInvoiceSubmitted.Invoice.TotalAmt}. Transaction Id: ${this.newInvoiceSubmitted.Invoice.Id}`,
            this.newInvoiceSubmitted = ""
            } else {
            this.newInvoiceSubmitted = response.data
          }
          }
          finally {
          error => {
          this.newInvoiceSubmitted = error
          console.log(error)
          }
          }        
        })

      },

      clearNewInvoice: function() { // Clears fields related to creating a new invoice
        
        this.newInvoiceAmount = 0
        this.newInvoiceCustomerId = ""
        this.newInvoiceSubmitted = ""
        this.newInvoiceSuccess = ""
        this.newInvoiceView = true
        this.SendExistingInvoiceEmail = ""
        this.SendExistingInvoiceOption = false
      },

      SendExistingInvoice: function() { // Sends an existing invoice to a specified email address
      
      let instance = axios.create({
        'headers': {'X-CSRFToken': csrftoken}
      });
      axios
          instance.post(`/email_invoice/${this.transactionNumber}/${this.SendExistingInvoiceEmail}`)
          .then(response => {
            this.SendExistingInvoiceResponse= response.data
            console.log(response.data)

          })
          .catch(error => {console.log(error)})
      
    },

  },
      })
